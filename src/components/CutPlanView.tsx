import React, { useState, useMemo } from 'react';
import {
  BudgetAllocation,
  Project,
  User,
  FiscalYear,
  School,
} from '../types';
import {
  Scissors,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Printer,
  Search,
  Check,
  TrendingDown,
  TrendingUp,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  FileSpreadsheet,
  Info,
  Calendar,
  Building,
  UserCheck,
  Edit3,
  Unlock,
  Eye,
  X
} from 'lucide-react';

interface CutPlanViewProps {
  allocations: BudgetAllocation[];
  projects: Project[];
  onUpdateProjects: (updated: Project[]) => void;
  currentUser: User;
  activeFiscalYear: FiscalYear;
  school: School;
  onOpenExpensesForProject?: (project: Project) => void;
  onNavigateToProjects?: () => void;
}

export const CutPlanView: React.FC<CutPlanViewProps> = ({
  allocations,
  projects,
  onUpdateProjects,
  currentUser,
  activeFiscalYear,
  school,
  onOpenExpensesForProject,
  onNavigateToProjects,
}) => {
  // Extract list of all available departments from allocations
  const departmentList = useMemo(() => {
    const list = allocations.map((a) => a.departmentName);
    // Also include any department from projects that might not be in allocations
    projects.forEach((p) => {
      if (p.department && !list.includes(p.department)) {
        list.push(p.department);
      }
    });
    return list;
  }, [allocations, projects]);

  // Selected department tab
  const [selectedDept, setSelectedDept] = useState<string>(
    departmentList[0] || 'ฝ่ายบริหารงานวิชาการ'
  );

  // Search filter inside current department
  const [searchTerm, setSearchTerm] = useState('');

  // Draft budgets for projects: { [projectId]: number }
  const [draftBudgets, setDraftBudgets] = useState<Record<number, number>>(() => {
    const initial: Record<number, number> = {};
    projects.forEach((p) => {
      initial[p.id] = p.allocatedBudget;
    });
    return initial;
  });

  // Draft notes for adjustments: { [projectId]: string }
  const [draftNotes, setDraftNotes] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    projects.forEach((p) => {
      if (p.budgetAdjustmentNote) {
        initial[p.id] = p.budgetAdjustmentNote;
      }
    });
    return initial;
  });

  // Track confirmation status per department
  const [confirmedDepts, setConfirmedDepts] = useState<
    Record<string, { confirmedAt: string; confirmedBy: string }>
  >({});

  // Flag to unlock editing even if confirmed
  const [isEditMode, setIsEditMode] = useState<boolean>(true);

  // Toast banner notification
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'warning' | 'info';
  } | null>(null);

  // Modal to inspect full school overview across all departments
  const [showAllDeptModal, setShowAllDeptModal] = useState(false);

  // Selected project to inspect details
  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  // Department Allocation info
  const currentDeptAlloc = useMemo(() => {
    return allocations.find((a) => a.departmentName === selectedDept);
  }, [allocations, selectedDept]);

  const allocatedAmount = currentDeptAlloc ? currentDeptAlloc.allocatedAmount : 0;

  // Projects belonging to the active department
  const deptProjects = useMemo(() => {
    return projects.filter((p) => p.department === selectedDept);
  }, [projects, selectedDept]);

  // Filtered projects by search
  const filteredProjects = useMemo(() => {
    if (!searchTerm.trim()) return deptProjects;
    const term = searchTerm.toLowerCase();
    return deptProjects.filter(
      (p) =>
        p.projectName.toLowerCase().includes(term) ||
        p.projectCode.toLowerCase().includes(term) ||
        p.responsiblePerson.toLowerCase().includes(term)
    );
  }, [deptProjects, searchTerm]);

  // Summary Metrics for the active department
  const deptStats = useMemo(() => {
    const projectCount = deptProjects.length;
    // Total original proposed budget
    const totalProposed = deptProjects.reduce(
      (sum, p) => sum + (p.originalProposedBudget ?? p.allocatedBudget),
      0
    );
    // Current trimmed/adjusted budget total
    const currentAdjustedTotal = deptProjects.reduce((sum, p) => {
      const val = draftBudgets[p.id];
      return sum + (val !== undefined ? val : p.allocatedBudget);
    }, 0);

    // Difference between adjusted total and allocated amount
    // If diff > 0 -> over allocated budget
    // If diff < 0 -> remaining / under allocated budget
    // If diff === 0 -> balanced
    const diffFromAllocation = currentAdjustedTotal - allocatedAmount;
    const remainingAmount = allocatedAmount - currentAdjustedTotal;

    // Total cut or added compared to proposed budget
    const netAdjustment = currentAdjustedTotal - totalProposed;

    return {
      projectCount,
      totalProposed,
      currentAdjustedTotal,
      diffFromAllocation,
      remainingAmount,
      netAdjustment,
      isOver: currentAdjustedTotal > allocatedAmount,
      isUnder: currentAdjustedTotal < allocatedAmount,
      isBalanced: currentAdjustedTotal === allocatedAmount,
      overAmount: currentAdjustedTotal > allocatedAmount ? currentAdjustedTotal - allocatedAmount : 0,
      underAmount: allocatedAmount > currentAdjustedTotal ? allocatedAmount - currentAdjustedTotal : 0,
    };
  }, [deptProjects, draftBudgets, allocatedAmount]);

  // All departments overview summary (for top stats / modal)
  const allDeptsOverview = useMemo(() => {
    return departmentList.map((deptName) => {
      const alloc = allocations.find((a) => a.departmentName === deptName);
      const allocAmt = alloc ? alloc.allocatedAmount : 0;
      const dProjects = projects.filter((p) => p.department === deptName);
      const pCount = dProjects.length;
      const proposedAmt = dProjects.reduce(
        (sum, p) => sum + (p.originalProposedBudget ?? p.allocatedBudget),
        0
      );
      const adjustedAmt = dProjects.reduce((sum, p) => {
        const val = draftBudgets[p.id];
        return sum + (val !== undefined ? val : p.allocatedBudget);
      }, 0);
      const balance = allocAmt - adjustedAmt;
      const isConfirmed = !!confirmedDepts[deptName];

      return {
        deptName,
        colorHex: alloc?.colorHex || '#3b82f6',
        allocAmt,
        pCount,
        proposedAmt,
        adjustedAmt,
        balance,
        isOver: adjustedAmt > allocAmt,
        isUnder: adjustedAmt < allocAmt,
        isBalanced: adjustedAmt === allocAmt,
        isConfirmed,
      };
    });
  }, [departmentList, allocations, projects, draftBudgets, confirmedDepts]);

  // Helper to trigger toast
  const triggerToast = (text: string, type: 'success' | 'warning' | 'info' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Change individual project budget
  const handleBudgetChange = (projectId: number, newAmount: number) => {
    const val = Math.max(0, isNaN(newAmount) ? 0 : Math.round(newAmount));
    setDraftBudgets((prev) => ({
      ...prev,
      [projectId]: val,
    }));
  };

  // Quick adjust: add or subtract amount
  const handleQuickDelta = (projectId: number, delta: number) => {
    const current = draftBudgets[projectId] ?? 0;
    const nextVal = Math.max(0, current + delta);
    setDraftBudgets((prev) => ({
      ...prev,
      [projectId]: nextVal,
    }));
  };

  // Reset a project to its original proposed budget
  const handleResetProject = (project: Project) => {
    const orig = project.originalProposedBudget ?? project.allocatedBudget;
    setDraftBudgets((prev) => ({
      ...prev,
      [project.id]: orig,
    }));
  };

  // Reset all projects in current department to original proposed budget
  const handleResetAllInDept = () => {
    const updated = { ...draftBudgets };
    deptProjects.forEach((p) => {
      updated[p.id] = p.originalProposedBudget ?? p.allocatedBudget;
    });
    setDraftBudgets(updated);
    triggerToast(`รีเซ็ตงบประมาณโครงการทั้งหมดใน ${selectedDept} กลับเป็นยอดเสนอเดิมแล้ว`, 'info');
  };

  // Auto-fit / Proportional Trim: adjusts all projects in this department so the sum equals allocatedAmount
  const handleAutoTrimToAllocation = () => {
    if (deptProjects.length === 0 || allocatedAmount <= 0) {
      triggerToast('ไม่มีโครงการหรืองบประมาณที่จัดสรรสำหรับตัดแผน', 'warning');
      return;
    }

    const currentTotal = deptProjects.reduce((sum, p) => {
      const val = draftBudgets[p.id];
      return sum + (val !== undefined ? val : p.allocatedBudget);
    }, 0);

    if (currentTotal <= 0) return;

    const ratio = allocatedAmount / currentTotal;
    const updated = { ...draftBudgets };
    let runningSum = 0;

    deptProjects.forEach((p, idx) => {
      const current = draftBudgets[p.id] ?? p.allocatedBudget;
      if (idx === deptProjects.length - 1) {
        // Last project takes the remainder to ensure exact zero difference
        const remainder = Math.max(0, allocatedAmount - runningSum);
        updated[p.id] = Math.round(remainder);
      } else {
        const adjusted = Math.round(current * ratio);
        updated[p.id] = adjusted;
        runningSum += adjusted;
      }
    });

    setDraftBudgets(updated);
    triggerToast(`คำนวณตัดลดงบประมาณตามสัดส่วนให้ตรงกับกรอบ ${allocatedAmount.toLocaleString()} บาท พอดีแล้ว`, 'success');
  };

  // Confirm and Apply Budget Trimming to Projects
  const handleConfirmTrim = () => {
    if (deptProjects.length === 0) {
      triggerToast('ไม่พบโครงการในกลุ่มงานนี้ที่จะบันทึกยืนยัน', 'warning');
      return;
    }

    const confirmedAtStr = new Date().toLocaleString('th-TH', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // Update projects state
    const updatedProjects = projects.map((p) => {
      if (p.department === selectedDept) {
        const newBudget = draftBudgets[p.id] !== undefined ? draftBudgets[p.id] : p.allocatedBudget;
        const origBudget = p.originalProposedBudget ?? p.allocatedBudget;
        const note = draftNotes[p.id] || p.budgetAdjustmentNote || '';
        const spent = p.spentBudget || 0;

        return {
          ...p,
          allocatedBudget: newBudget,
          remainingBudget: Math.max(0, newBudget - spent),
          originalProposedBudget: origBudget,
          budgetAdjustedBy: `${currentUser.fullName} (${currentUser.role})`,
          budgetAdjustedDate: new Date().toISOString(),
          budgetAdjustmentNote: note,
        };
      }
      return p;
    });

    // Save to parent state and persistent database
    onUpdateProjects(updatedProjects);

    // Record confirmed status for this department
    setConfirmedDepts((prev) => ({
      ...prev,
      [selectedDept]: {
        confirmedAt: confirmedAtStr,
        confirmedBy: currentUser.fullName,
      },
    }));

    // Lock edit mode until user clicks "แก้ไข/ปรับปรุง"
    setIsEditMode(false);

    triggerToast(
      `ยืนยันการตัดแผนงบประมาณ "${selectedDept}" เรียบร้อยแล้ว! ระบบได้ปรับยอดในโครงการที่เสนอมาทั้งหมดให้ตรงกันแล้ว`,
      'success'
    );
  };

  const isConfirmedForCurrentDept = !!confirmedDepts[selectedDept];

  return (
    <div className="space-y-6">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`flex items-center justify-between rounded-xl p-4 text-sm font-medium shadow-md transition-all ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
              : toastMessage.type === 'warning'
              ? 'bg-amber-50 border border-amber-300 text-amber-900'
              : 'bg-blue-50 border border-blue-300 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-3">
            {toastMessage.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header section with print & overview actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">
            <Scissors className="h-4 w-4 text-blue-600" />
            <span>กระบวนการพิจารณาตัดแผน & ปรับลด-เพิ่มงบประมาณโครงการ</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            ตัดแผนงบประมาณตามกลุ่มงาน
            <span className="rounded-lg bg-blue-100 text-blue-800 text-xs px-2.5 py-1 font-bold">
              ปีงบประมาณ พ.ศ. {activeFiscalYear.year}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl">
            นำยอดจัดสรรงบประมาณของแต่ละกลุ่มงานมาควบคุมและตัดแผนโครงการที่ครูเสนอมา
            ปรับลดหรือเพิ่มงบประมาณแต่ละโครงการให้ตรงกับกรอบวงเงินที่ได้รับจัดสรร
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            id="btn-show-all-overview"
            type="button"
            onClick={() => setShowAllDeptModal(true)}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <Layers className="h-4 w-4 text-blue-600" />
            <span>ภาพรวมทุกกลุ่มงาน</span>
          </button>

          <button
            id="btn-print-cut-plan"
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
            title="พิมพ์รายงานสรุปการตัดแผนงบประมาณ"
          >
            <Printer className="h-4 w-4 text-slate-600" />
            <span className="hidden sm:inline">พิมพ์รายงาน</span>
          </button>
        </div>
      </div>

      {/* DEPARTMENT TABS (แถบแต่ละกลุ่มงาน) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="border-b border-slate-200 bg-slate-50/70 p-3 sm:px-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            เลือกแถบกลุ่มงาน / ฝ่ายบริหารงานเพื่อตัดแผน:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
            {departmentList.map((deptName) => {
              const isActive = selectedDept === deptName;
              const alloc = allocations.find((a) => a.departmentName === deptName);
              const allocAmt = alloc ? alloc.allocatedAmount : 0;
              const dProjects = projects.filter((p) => p.department === deptName);
              const pCount = dProjects.length;

              // Check budget status for tab badge
              const currentTotal = dProjects.reduce((sum, p) => {
                const val = draftBudgets[p.id];
                return sum + (val !== undefined ? val : p.allocatedBudget);
              }, 0);
              const isOver = currentTotal > allocAmt;
              const isBalanced = currentTotal === allocAmt && pCount > 0;
              const isConfirmed = !!confirmedDepts[deptName];

              return (
                <button
                  key={deptName}
                  id={`tab-dept-${deptName.replace(/\s+/g, '-')}`}
                  type="button"
                  onClick={() => {
                    setSelectedDept(deptName);
                    setIsEditMode(true);
                    setSearchTerm('');
                  }}
                  className={`flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-blue-200 shadow-md ring-2 ring-blue-600 ring-offset-1'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: alloc?.colorHex || '#3b82f6' }}
                  />
                  <span>{deptName}</span>

                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {pCount} โครงการ
                  </span>

                  {isConfirmed && (
                    <span
                      className={`flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-emerald-400 text-blue-950' : 'bg-emerald-100 text-emerald-800'
                      }`}
                      title="ยืนยันการตัดแผนแล้ว"
                    >
                      <Check className="h-3 w-3 stroke-[3]" />
                      <span>ยืนยันแล้ว</span>
                    </span>
                  )}

                  {!isConfirmed && isOver && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-700'
                      }`}
                    >
                      เกิน
                    </span>
                  )}

                  {!isConfirmed && isBalanced && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        isActive ? 'bg-emerald-400 text-blue-950' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      พอดี
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ACTIVE DEPARTMENT DASHBOARD & STATS CARDS */}
        <div className="p-4 sm:p-6 bg-slate-50/40 space-y-6">
          {/* Header of Active Department */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-black shadow-xs"
                style={{ backgroundColor: currentDeptAlloc?.colorHex || '#2563eb' }}
              >
                <Scissors className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900">
                  {selectedDept}
                </h2>
                <p className="text-xs text-slate-500">
                  {currentDeptAlloc?.description || 'กลุ่มงานตามโครงสร้างการจัดสรรงบประมาณสถานศึกษา'}
                </p>
              </div>
            </div>

            {isConfirmedForCurrentDept && (
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3.5 py-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <div>
                  <div>ยืนยันการตัดแผนงบประมาณแล้ว</div>
                  <div className="text-[10px] text-emerald-600 font-normal">
                    เมื่อ {confirmedDepts[selectedDept].confirmedAt} โดย {confirmedDepts[selectedDept].confirmedBy}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4 CORE DASHBOARD / METRIC CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: ยอดงบประมาณที่กลุ่มงานได้รับการจัดสรร (ยอดเต็ม) */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>งบที่ได้รับจัดสรร (ยอดเต็ม)</span>
                  <span className="rounded bg-blue-50 text-blue-700 px-1.5 py-0.5 text-[10px]">
                    {currentDeptAlloc ? `${currentDeptAlloc.percentage}% ของงบรวม` : '-'}
                  </span>
                </div>
                <div className="text-2xl font-black text-blue-900 tracking-tight mt-1">
                  {allocatedAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  <span className="text-xs font-semibold text-slate-500 ml-1.5">บาท</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>กรอบวงเงินอนุมัติกลุ่มงาน</span>
                <span className="font-semibold text-slate-700">100%</span>
              </div>
            </div>

            {/* Card 2: จำนวนโครงการ & งบที่เสนอมาทั้งหมด */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>โครงการ & งบเสนอเดิม</span>
                  <span className="rounded bg-slate-100 text-slate-700 px-1.5 py-0.5 text-[10px]">
                    {deptStats.projectCount} โครงการ
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {deptStats.totalProposed.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  <span className="text-xs font-semibold text-slate-500 ml-1.5">บาท</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>เฉลี่ยต่อโครงการ</span>
                <span className="font-semibold text-slate-700">
                  {deptStats.projectCount > 0
                    ? (deptStats.totalProposed / deptStats.projectCount).toLocaleString('th-TH', {
                        maximumFractionDigits: 0,
                      })
                    : 0}{' '}
                  บาท
                </span>
              </div>
            </div>

            {/* Card 3: ยอดรวมหลังตัด/ปรับแผน & ผลต่างสุทธิ */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1">
                  <span>งบประมาณหลังตัด/ปรับแผน</span>
                  <span
                    className={`rounded px-1.5 py-0.5 text-[10px] font-bold ${
                      deptStats.netAdjustment < 0
                        ? 'bg-amber-50 text-amber-800'
                        : deptStats.netAdjustment > 0
                        ? 'bg-indigo-50 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {deptStats.netAdjustment < 0
                      ? `ลด ${Math.abs(deptStats.netAdjustment).toLocaleString()} บ.`
                      : deptStats.netAdjustment > 0
                      ? `เพิ่ม +${deptStats.netAdjustment.toLocaleString()} บ.`
                      : 'เท่าเดิม'}
                  </span>
                </div>
                <div className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                  {deptStats.currentAdjustedTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                  <span className="text-xs font-semibold text-slate-500 ml-1.5">บาท</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span>สัดส่วนเทียบงบจัดสรร</span>
                <span
                  className={`font-bold ${
                    allocatedAmount > 0 && deptStats.currentAdjustedTotal > allocatedAmount
                      ? 'text-rose-600'
                      : 'text-slate-700'
                  }`}
                >
                  {allocatedAmount > 0
                    ? ((deptStats.currentAdjustedTotal / allocatedAmount) * 100).toFixed(1)
                    : 0}
                  %
                </span>
              </div>
            </div>

            {/* Card 4 (HIGHLIGHT): การ์ดแจ้งผลต่างสถานะ: เกินสีแดง / คงเหลือสีเขียว / พอดี */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border shadow-xs flex flex-col justify-between transition-all ${
                deptStats.isOver
                  ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/20'
                  : deptStats.isUnder
                  ? 'bg-emerald-50/80 border-emerald-300'
                  : 'bg-blue-50/80 border-blue-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span
                    className={
                      deptStats.isOver
                        ? 'text-rose-800'
                        : deptStats.isUnder
                        ? 'text-emerald-800'
                        : 'text-blue-800'
                    }
                  >
                    สถานะการจัดสรรงบประมาณ
                  </span>
                  {deptStats.isOver && (
                    <span className="rounded bg-rose-600 text-white font-bold px-2 py-0.5 text-[10px] animate-pulse">
                      งบเกินกรอบ
                    </span>
                  )}
                  {deptStats.isUnder && (
                    <span className="rounded bg-emerald-600 text-white font-bold px-2 py-0.5 text-[10px]">
                      ยังมีงบเหลือ
                    </span>
                  )}
                  {deptStats.isBalanced && (
                    <span className="rounded bg-blue-700 text-white font-bold px-2 py-0.5 text-[10px]">
                      งบพอดีเป๊ะ
                    </span>
                  )}
                </div>

                {/* ถ้ายอดเกิน: แสดงข้อความเป็นสีแดง "เกิน ... บาท" */}
                {deptStats.isOver && (
                  <div className="mt-1">
                    <div className="text-xs font-bold text-rose-700">งบประมาณเกินกรอบจัดสรร</div>
                    <div className="text-2xl font-black text-rose-600 tracking-tight">
                      เกิน {deptStats.overAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      <span className="text-xs font-semibold text-rose-700 ml-1">บาท</span>
                    </div>
                  </div>
                )}

                {/* ถ้ายังไม่เพียงพอหรือมีงบเหลือ: แสดงคำว่า "คงเหลือ ... บาท" */}
                {deptStats.isUnder && (
                  <div className="mt-1">
                    <div className="text-xs font-bold text-emerald-700">วงเงินงบประมาณคงเหลือ</div>
                    <div className="text-2xl font-black text-emerald-700 tracking-tight">
                      คงเหลือ {deptStats.underAmount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                      <span className="text-xs font-semibold text-emerald-800 ml-1">บาท</span>
                    </div>
                  </div>
                )}

                {/* ถ้าพอดี 0 บาท */}
                {deptStats.isBalanced && (
                  <div className="mt-1">
                    <div className="text-xs font-bold text-blue-800">งบประมาณพอดีกับการจัดสรร</div>
                    <div className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight">
                      ตรงกรอบพอดี (0.00 บ.)
                    </div>
                  </div>
                )}
              </div>

              <div
                className={`text-[11px] mt-3 pt-3 border-t font-medium ${
                  deptStats.isOver
                    ? 'border-rose-200 text-rose-800'
                    : deptStats.isUnder
                    ? 'border-emerald-200 text-emerald-800'
                    : 'border-blue-200 text-blue-800'
                }`}
              >
                {deptStats.isOver && (
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-rose-600 shrink-0" />
                    <span>ต้องปรับลดงบประมาณในโครงการลงให้ไม่เกินกรอบ</span>
                  </div>
                )}
                {deptStats.isUnder && (
                  <div className="flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>สามารถเพิ่มงบโครงการหรือจัดทำโครงการใหม่ได้</span>
                  </div>
                )}
                {deptStats.isBalanced && (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-700 shrink-0" />
                    <span>งบประมาณสมดุล พร้อมกดปุ่มยืนยันตัดแผน</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* QUICK TOOLBAR & ACTION BAR */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
            {/* Search filter within current department */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                id="search-dept-projects"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ค้นหาชื่อโครงการ, รหัส, หรือผู้รับผิดชอบ..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Smart adjustment buttons & Reset */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-auto-trim-proportional"
                type="button"
                onClick={handleAutoTrimToAllocation}
                className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold text-blue-800 hover:bg-blue-100 transition-colors shadow-xs"
                title="ตัดลดงบประมาณทุกโครงการตามสัดส่วนให้ตรงกับกรอบที่จัดสรรพอดี"
              >
                <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                <span>ตัดลดอัตโนมัติตามสัดส่วน</span>
              </button>

              <button
                id="btn-reset-all-dept-projects"
                type="button"
                onClick={handleResetAllInDept}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
                title="คืนค่างบประมาณทุกโครงการเป็นยอดเสนอเดิม"
              >
                <RotateCcw className="h-3.5 w-3.5 text-slate-500" />
                <span>คืนค่ายอดเสนอเดิม</span>
              </button>
            </div>
          </div>
        </div>

        {/* PROJECT LIST & BUDGET TRIMMING TABLE */}
        <div className="overflow-x-auto">
          {filteredProjects.length === 0 ? (
            <div className="text-center py-16 px-4 bg-white">
              <Scissors className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <div className="text-base font-bold text-slate-700">
                ไม่พบโครงการใน{selectedDept}
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                ยังไม่มีการเสนอโครงการในกลุ่มงานนี้ หรือไม่ตรงกับคำค้นหา ท่านสามารถให้ครูเขียนโครงการด้วย AI หรือเสนอโครงการใหม่
              </p>
              {onNavigateToProjects && (
                <button
                  type="button"
                  onClick={onNavigateToProjects}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 shadow-sm"
                >
                  <ArrowRight className="h-4 w-4" />
                  <span>ไปที่หน้าแบบเสนอโครงการ</span>
                </button>
              )}
            </div>
          ) : (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100/90 text-slate-700 text-xs font-bold border-y border-slate-200">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 min-w-[200px]">โครงการ / ผู้รับผิดชอบ</th>
                  <th className="py-3.5 px-4 text-right min-w-[130px]">งบที่เสนอเดิม (บาท)</th>
                  <th className="py-3.5 px-4 text-center min-w-[240px]">ปรับลด/เพิ่มงบประมาณ</th>
                  <th className="py-3.5 px-4 text-right min-w-[130px]">ผลต่าง (บาท)</th>
                  <th className="py-3.5 px-4 text-center min-w-[100px]">% งบกลุ่มงาน</th>
                  <th className="py-3.5 px-4 min-w-[180px]">บันทึกเหตุผลการตัดงบ</th>
                  <th className="py-3.5 px-4 text-center w-28">รายละเอียด</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {filteredProjects.map((project, index) => {
                  const origProposed = project.originalProposedBudget ?? project.allocatedBudget;
                  const currentAdjusted =
                    draftBudgets[project.id] !== undefined
                      ? draftBudgets[project.id]
                      : project.allocatedBudget;
                  const diff = currentAdjusted - origProposed;
                  const percentOfDept =
                    allocatedAmount > 0 ? ((currentAdjusted / allocatedAmount) * 100).toFixed(1) : '0';

                  return (
                    <tr
                      key={project.id}
                      className={`hover:bg-blue-50/40 transition-colors ${
                        diff < 0
                          ? 'bg-amber-50/20'
                          : diff > 0
                          ? 'bg-emerald-50/20'
                          : ''
                      }`}
                    >
                      {/* 1. Index & Code */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-400">
                        {index + 1}
                      </td>

                      {/* 2. Project Name & Responsible Person */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                          {project.projectName}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 mt-1">
                          <span className="font-mono bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-semibold">
                            {project.projectCode}
                          </span>
                          <span>•</span>
                          <span>ผู้รับผิดชอบ: {project.responsiblePerson}</span>
                        </div>
                      </td>

                      {/* 3. Original Proposed Budget */}
                      <td className="py-3.5 px-4 text-right font-medium text-slate-700">
                        <span className="font-mono text-xs sm:text-sm">
                          {origProposed.toLocaleString('th-TH', { minimumFractionDigits: 2 })}
                        </span>
                        {project.originalProposedBudget && project.originalProposedBudget !== project.allocatedBudget && (
                          <div className="text-[10px] text-slate-400">
                            (งบปัจจุบัน: {project.allocatedBudget.toLocaleString()} บ.)
                          </div>
                        )}
                      </td>

                      {/* 4. Adjusted Budget Input & Quick delta buttons */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col items-center gap-1.5">
                          <div className="relative w-full max-w-[200px]">
                            <input
                              id={`input-budget-proj-${project.id}`}
                              type="number"
                              min="0"
                              step="500"
                              disabled={!isEditMode && isConfirmedForCurrentDept}
                              value={draftBudgets[project.id] !== undefined ? draftBudgets[project.id] : project.allocatedBudget}
                              onChange={(e) => handleBudgetChange(project.id, parseFloat(e.target.value))}
                              className={`w-full rounded-lg border px-3 py-1.5 text-right font-mono font-bold text-sm shadow-2xs focus:outline-none focus:ring-2 ${
                                diff < 0
                                  ? 'border-amber-300 bg-amber-50/50 text-amber-900 focus:ring-amber-500'
                                  : diff > 0
                                  ? 'border-emerald-300 bg-emerald-50/50 text-emerald-900 focus:ring-emerald-500'
                                  : 'border-slate-300 bg-white text-slate-900 focus:ring-blue-500'
                              } ${!isEditMode && isConfirmedForCurrentDept ? 'bg-slate-100 cursor-not-allowed opacity-80' : ''}`}
                            />
                            <span className="absolute right-2.5 top-2 text-[11px] text-slate-400 pointer-events-none">
                              ฿
                            </span>
                          </div>

                          {/* Quick Delta Buttons */}
                          {(isEditMode || !isConfirmedForCurrentDept) && (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleQuickDelta(project.id, -5000)}
                                className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                                title="ลดลง 5,000 บาท"
                              >
                                -5k
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickDelta(project.id, -1000)}
                                className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-700 transition-colors"
                                title="ลดลง 1,000 บาท"
                              >
                                -1k
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickDelta(project.id, 1000)}
                                className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                                title="เพิ่มขึ้น 1,000 บาท"
                              >
                                +1k
                              </button>
                              <button
                                type="button"
                                onClick={() => handleQuickDelta(project.id, 5000)}
                                className="rounded px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                                title="เพิ่มขึ้น 5,000 บาท"
                              >
                                +5k
                              </button>
                              <button
                                type="button"
                                onClick={() => handleResetProject(project)}
                                className="rounded px-1.5 py-0.5 text-[10px] font-bold text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors ml-1"
                                title="คืนค่ายอดเสนอเดิมของโครงการนี้"
                              >
                                คืนค่า
                              </button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 5. Variance / Difference Indicator */}
                      <td className="py-3.5 px-4 text-right">
                        {diff < 0 ? (
                          <div className="font-bold text-rose-600 flex items-center justify-end gap-1 font-mono">
                            <TrendingDown className="h-3.5 w-3.5 text-rose-500" />
                            <span>ลด {Math.abs(diff).toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                          </div>
                        ) : diff > 0 ? (
                          <div className="font-bold text-emerald-600 flex items-center justify-end gap-1 font-mono">
                            <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
                            <span>+{diff.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
                          </div>
                        ) : (
                          <div className="text-slate-400 font-mono text-xs">
                            เท่าเดิม (0.00)
                          </div>
                        )}
                      </td>

                      {/* 6. Percentage of Department */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-bold text-slate-700 font-mono">
                          {percentOfDept}%
                        </span>
                      </td>

                      {/* 7. Adjustment Note */}
                      <td className="py-3.5 px-4">
                        <input
                          id={`input-note-proj-${project.id}`}
                          type="text"
                          disabled={!isEditMode && isConfirmedForCurrentDept}
                          value={draftNotes[project.id] ?? ''}
                          onChange={(e) =>
                            setDraftNotes((prev) => ({
                              ...prev,
                              [project.id]: e.target.value,
                            }))
                          }
                          placeholder="บันทึกเหตุผลการตัดงบ (ถ้ามี)..."
                          className="w-full rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* 8. Details Action */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setViewingProject(project)}
                            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                            title="ดูรายละเอียดโครงการ"
                          >
                            <Eye className="h-4 w-4" />
                          </button>

                          {onOpenExpensesForProject && (
                            <button
                              type="button"
                              onClick={() => onOpenExpensesForProject(project)}
                              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-emerald-600 transition-colors"
                              title="เปิดหน้ารายละเอียดงบประมาณค่าใช้จ่าย"
                            >
                              <FileSpreadsheet className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              {/* Table Footer: Totals */}
              <tfoot className="bg-slate-100 font-bold text-slate-800 border-t-2 border-slate-300">
                <tr>
                  <td colSpan={2} className="py-3.5 px-4 text-right font-black">
                    รวมทั้งกลุ่มงาน ({filteredProjects.length} โครงการ):
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-sm font-black">
                    {deptStats.totalProposed.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บ.
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-sm font-black text-blue-900">
                    {deptStats.currentAdjustedTotal.toLocaleString('th-TH', { minimumFractionDigits: 2 })} บ.
                  </td>
                  <td
                    className={`py-3.5 px-4 text-right font-mono text-sm font-black ${
                      deptStats.netAdjustment < 0
                        ? 'text-rose-600'
                        : deptStats.netAdjustment > 0
                        ? 'text-emerald-600'
                        : 'text-slate-500'
                    }`}
                  >
                    {deptStats.netAdjustment < 0
                      ? `ลด ${Math.abs(deptStats.netAdjustment).toLocaleString()} บ.`
                      : deptStats.netAdjustment > 0
                      ? `+${deptStats.netAdjustment.toLocaleString()} บ.`
                      : '0.00 บ.'}
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-xs font-bold text-slate-600">
                    {allocatedAmount > 0
                      ? ((deptStats.currentAdjustedTotal / allocatedAmount) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                  <td colSpan={2} className="py-3.5 px-4 text-xs font-normal text-slate-500">
                    กรอบจัดสรร: {allocatedAmount.toLocaleString()} บาท
                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* BOTTOM CONFIRMATION & EDIT CONTROLS */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`h-3.5 w-3.5 rounded-full ${
                deptStats.isOver
                  ? 'bg-rose-500'
                  : deptStats.isUnder
                  ? 'bg-emerald-500'
                  : 'bg-blue-600'
              }`}
            />
            <div className="text-xs sm:text-sm text-slate-700">
              {deptStats.isOver ? (
                <span className="font-bold text-rose-700">
                  ⚠️ คำเตือน: ยอดรวมโครงการยังเกินกรอบงบประมาณกลุ่มงานอยู่ {deptStats.overAmount.toLocaleString()} บาท
                </span>
              ) : deptStats.isUnder ? (
                <span className="font-semibold text-emerald-800">
                  ✓ ยอดรวมยังไม่เกินกรอบงบประมาณ คงเหลือ {deptStats.underAmount.toLocaleString()} บาท
                </span>
              ) : (
                <span className="font-bold text-blue-800">
                  ✓ ยอดรวมโครงการตรงกับกรอบงบประมาณที่กลุ่มงานได้รับการจัดสรรพอดี
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {/* ปุ่มแก้ไขหรือปรับปรุง (Edit / Re-adjust) */}
            {isConfirmedForCurrentDept && !isEditMode ? (
              <button
                id="btn-enable-edit-dept-plan"
                type="button"
                onClick={() => setIsEditMode(true)}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-blue-700 hover:bg-blue-50 transition-colors shadow-xs"
              >
                <Edit3 className="h-4 w-4" />
                <span>แก้ไขหรือปรับปรุงงบประมาณ</span>
              </button>
            ) : (
              <button
                id="btn-revert-edit-mode"
                type="button"
                onClick={() => handleResetAllInDept()}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors shadow-xs"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>คืนค่ายอดเดิม</span>
              </button>
            )}

            {/* ปุ่มกดยืนยัน (Confirm Trim / Apply Allocation) */}
            <button
              id="btn-confirm-dept-plan"
              type="button"
              onClick={handleConfirmTrim}
              className={`flex items-center justify-center gap-2 rounded-xl px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-md transition-all ${
                deptStats.isOver
                  ? 'bg-rose-600 hover:bg-rose-700 shadow-rose-200'
                  : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>ยืนยันการตัดแผนงบประมาณกลุ่มงานนี้</span>
            </button>
          </div>
        </div>
      </div>

      {/* ALL DEPARTMENTS OVERVIEW MODAL */}
      {showAllDeptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-blue-600" />
                <h3 className="text-base sm:text-lg font-black text-slate-900">
                  ภาพรวมการตัดแผนงบประมาณทุกกลุ่มงาน
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAllDeptModal(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-xs sm:text-sm text-slate-600">
                ตารางสรุปสถานะการตัดแผนงบประมาณของแต่ละกลุ่มงาน เปรียบเทียบกับกรอบวงเงินที่โรงเรียนจัดสรร
              </p>

              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-100 font-bold text-slate-700 text-xs">
                    <tr>
                      <th className="p-3">กลุ่มงาน / ฝ่าย</th>
                      <th className="p-3 text-center">โครงการ</th>
                      <th className="p-3 text-right">งบจัดสรร (บาท)</th>
                      <th className="p-3 text-right">เสนอเดิม (บาท)</th>
                      <th className="p-3 text-right">ยอดตัดแผน (บาท)</th>
                      <th className="p-3 text-right">ผลต่าง (บาท)</th>
                      <th className="p-3 text-center">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {allDeptsOverview.map((item) => (
                      <tr key={item.deptName} className="hover:bg-slate-50 font-medium">
                        <td className="p-3">
                          <div className="flex items-center gap-2 font-bold text-slate-900">
                            <span
                              className="h-2.5 w-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: item.colorHex }}
                            />
                            <span>{item.deptName}</span>
                          </div>
                        </td>
                        <td className="p-3 text-center font-bold text-slate-600">
                          {item.pCount}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-blue-900">
                          {item.allocAmt.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono text-slate-600">
                          {item.proposedAmt.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono font-bold text-slate-900">
                          {item.adjustedAmt.toLocaleString()}
                        </td>
                        <td className="p-3 text-right font-mono font-bold">
                          {item.isOver ? (
                            <span className="text-rose-600">
                              เกิน {Math.abs(item.balance).toLocaleString()} บ.
                            </span>
                          ) : item.isUnder ? (
                            <span className="text-emerald-600">
                              เหลือ {item.balance.toLocaleString()} บ.
                            </span>
                          ) : (
                            <span className="text-blue-700">พอดี (0 บ.)</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {item.isConfirmed ? (
                            <span className="inline-flex items-center gap-1 rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[11px] font-bold">
                              <Check className="h-3 w-3" /> ยืนยันแล้ว
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedDept(item.deptName);
                                setShowAllDeptModal(false);
                              }}
                              className="rounded bg-blue-50 text-blue-700 hover:bg-blue-100 px-2 py-0.5 text-[11px] font-bold transition-colors"
                            >
                              ไปตัดแผน
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAllDeptModal(false)}
                className="rounded-xl bg-slate-800 text-white px-5 py-2 text-xs font-bold hover:bg-slate-900"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW PROJECT DETAILS MODAL */}
      {viewingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50">
              <div>
                <span className="rounded bg-blue-100 text-blue-800 font-mono text-xs px-2 py-0.5 font-bold">
                  {viewingProject.projectCode}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {viewingProject.projectName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingProject(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">กลุ่มงาน/ฝ่าย:</div>
                  <div className="font-bold text-slate-800">{viewingProject.department}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">ผู้รับผิดชอบ:</div>
                  <div className="font-bold text-slate-800">{viewingProject.responsiblePerson}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">งบประมาณเสนอเดิม:</div>
                  <div className="font-bold text-slate-900">
                    {(viewingProject.originalProposedBudget ?? viewingProject.allocatedBudget).toLocaleString()} บาท
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">งบประมาณที่ตัด/อนุมัติ:</div>
                  <div className="font-bold text-blue-700">
                    {viewingProject.allocatedBudget.toLocaleString()} บาท
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">หลักการและเหตุผล:</h4>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line text-xs">
                  {viewingProject.rationale || '-'}
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">วัตถุประสงค์:</h4>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-line text-xs">
                  {viewingProject.objectives || '-'}
                </p>
              </div>

              {viewingProject.expenseItems && viewingProject.expenseItems.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">
                    รายการค่าใช้จ่าย ({viewingProject.expenseItems.length} รายการ):
                  </h4>
                  <div className="rounded-lg border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-100 text-slate-700 font-bold">
                        <tr>
                          <th className="p-2">รายการ</th>
                          <th className="p-2 text-center">หมวด</th>
                          <th className="p-2 text-right">จำนวนเงิน (บาท)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {viewingProject.expenseItems.map((item, idx) => (
                          <tr key={idx}>
                            <td className="p-2 text-slate-800">{item.itemName}</td>
                            <td className="p-2 text-center text-slate-500">{item.category}</td>
                            <td className="p-2 text-right font-mono font-bold text-slate-900">
                              {item.totalAmount.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingProject(null)}
                className="rounded-xl bg-slate-800 text-white px-5 py-2 text-xs font-bold hover:bg-slate-900"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
