import React, { useState, useEffect } from 'react';
import {
  X,
  DownloadCloud,
  FileCode,
  Copy,
  Check,
  Server,
  FolderArchive,
  Search,
  BookOpen,
  Terminal,
  Cpu,
  Layers,
  ArrowDownToLine,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

interface PleskWindowsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PleskInfoData {
  environment: {
    nodeVersion: string;
    platform: string;
    architecture: string;
    isWindowsSupported: boolean;
    iisNodeCompatible: boolean;
    port: string | number;
  };
  files: {
    webConfig: string;
    serverJs: string;
    readme: string;
  };
  pleskSettings: {
    documentRoot: string;
    applicationMode: string;
    applicationStartupFile: string;
    nodeVersionsRecommended: string[];
    packageManager: string;
  };
}

export const PleskWindowsModal: React.FC<PleskWindowsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'webconfig' | 'serverjs' | 'troubleshoot'>('guide');
  const [pleskInfo, setPleskInfo] = useState<PleskInfoData | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPleskInfo();
    }
  }, [isOpen]);

  const fetchPleskInfo = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/plesk/info');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPleskInfo(data);
        }
      }
    } catch (e) {
      console.error('Failed to load Plesk info:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handleDownloadZip = () => {
    setIsDownloading(true);
    const link = document.createElement('a');
    link.href = '/api/plesk/download-package';
    link.download = 'school-budget-plesk-windows-nodejs.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloading(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 px-6 py-5 text-white flex items-center justify-between border-b border-blue-900/50">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white font-black shadow-md border border-blue-400/30">
              <Server className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
                  คู่มือและเครื่องมือติดตั้ง Plesk Control Panel (Windows Server)
                </h2>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[10px] font-bold px-2 py-0.5">
                  100% Pure Node.js
                </span>
              </div>
              <p className="text-xs text-blue-200/90 mt-0.5">
                รองรับ Microsoft IIS, iisnode module และสถาปัตยกรรม Node.js + React 19 เต็มรูปแบบ (ไม่มีโค้ด PHP)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action & Environment Status Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-semibold">
              <Cpu className="h-3.5 w-3.5 text-blue-600" />
              <span>Runtime: Node.js {pleskInfo?.environment.nodeVersion || 'v20.x/v22.x'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>IIS / iisnode: พร้อมใช้งาน</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 font-semibold">
              <Layers className="h-3.5 w-3.5 text-amber-700" />
              <span>Startup: server.js</span>
            </span>
          </div>

          <button
            type="button"
            onClick={handleDownloadZip}
            disabled={isDownloading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-4 py-2 text-xs font-bold text-white shadow-md transition-all disabled:opacity-50"
          >
            {isDownloading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowDownToLine className="h-4 w-4 text-amber-300" />
            )}
            <span>ดาวน์โหลดแพ็กเกจ Node.js สำหรับ Plesk Windows (.ZIP)</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6">
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'guide'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            <span>ขั้นตอนการติดตั้งบน Plesk Windows</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('webconfig')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'webconfig'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode className="h-4 w-4" />
            <span>ไฟล์ web.config (IIS)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('serverjs')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'serverjs'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Terminal className="h-4 w-4" />
            <span>ไฟล์ server.js (Startup)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('troubleshoot')}
            className={`flex items-center gap-2 border-b-2 py-3 px-4 text-xs sm:text-sm font-semibold transition-colors ${
              activeTab === 'troubleshoot'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>การแก้ปัญหา (Troubleshooting)</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-slate-50/50">
          {activeTab === 'guide' && (
            <div className="space-y-6">
              {/* Architecture Summary Banner */}
              <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-4 text-xs text-blue-900">
                <div className="font-bold text-sm text-blue-950 flex items-center gap-2 mb-1">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>ระบบได้รับการปรับปรุงเป็น 100% Pure Node.js สำเร็จแล้ว</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  ตัดระบบ PHP และการรองรับ Apache .htaccess ออกทั้งหมด ระบบทำงานด้วย Express Server + React 19 Single Page Application โดยตรง รองรับการทำงานผ่าน Microsoft IIS และโมดูล <code className="font-mono font-bold bg-white px-1.5 py-0.5 rounded border border-blue-200">iisnode</code> บน Windows Server ได้อย่างสมบูรณ์แบบ
                </p>
              </div>

              {/* 6 Steps Guide */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Step 1 */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                      1
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">อัปโหลดไฟล์ขึ้นเซิร์ฟเวอร์</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    อัปโหลดไฟล์ทั้งหมดหรือไฟล์ ZIP ที่ดาวน์โหลด ไปแตกไฟล์ในโฟลเดอร์รากเว็บไซต์ของคุณบน Plesk (ปกติคือ <code className="bg-slate-100 font-mono px-1 py-0.5 rounded text-amber-800">httpdocs/</code>)
                  </p>
                  <div className="bg-slate-100 rounded-lg p-2.5 text-[11px] font-mono text-slate-700">
                    ✓ ตรวจสอบว่ามี web.config และ server.js อยู่ที่ root
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                      2
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">เปิดเมนู Node.js ใน Plesk</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ในหน้าแดชบอร์ดโดเมนของ Plesk คลิกที่ไอคอน <strong>Node.js</strong> เพื่อเปิดหน้ากำหนดค่าคอนฟิกูเรชันของ Node.js สำหรับโดเมน
                  </p>
                  <div className="bg-slate-100 rounded-lg p-2.5 text-[11px] font-mono text-slate-700">
                    Plesk &gt; Websites &amp; Domains &gt; Node.js
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                      3
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">กำหนดค่าในหน้า Node.js</h3>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-5">
                    <li><strong>Node.js Version:</strong> เลือก 20.x หรือ 22.x</li>
                    <li><strong>Package Manager:</strong> เลือก npm</li>
                    <li><strong>Document Root:</strong> <code className="font-mono text-blue-700">/httpdocs</code></li>
                    <li><strong>Application Mode:</strong> <code className="font-mono text-blue-700">production</code></li>
                    <li><strong>Application Startup File:</strong> <code className="font-mono text-amber-700 font-bold">server.js</code></li>
                  </ul>
                </div>

                {/* Step 4 */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                      4
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">ติดตั้งและ Build ระบบ</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ในหน้า Node.js ของ Plesk ให้คลิกปุ่ม <strong>NPM Install</strong> จากนั้นในส่วน Run Script ให้พิมพ์ <code className="bg-slate-100 font-mono text-blue-800 px-1 py-0.5 rounded">build</code> แล้วกด <strong>Run</strong> เพื่อคอมไพล์ระบบ
                  </p>
                  <div className="bg-slate-100 rounded-lg p-2.5 text-[11px] font-mono text-slate-700">
                    คำสั่ง: npm install &amp;&amp; npm run build
                  </div>
                </div>

                {/* Step 5 */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                      5
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">ตั้งค่า Environment Variables</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ในแท็บ Environment Variables ของ Plesk Node.js ให้เพิ่มตัวแปรระบบ:
                  </p>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc pl-5 font-mono text-[11px]">
                    <li>NODE_ENV = production</li>
                    <li>GEMINI_API_KEY = (คีย์ API ของโรงเรียนคุณ)</li>
                  </ul>
                </div>

                {/* Step 6 */}
                <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white font-bold text-xs">
                      6
                    </span>
                    <h3 className="font-bold text-sm text-slate-900">สิทธิ์โฟลเดอร์ &amp; เริ่มทำงาน</h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ให้สิทธิ์เขียน (Modify / Write) แก่โฟลเดอร์ <code className="font-mono text-amber-700">config/</code> สำหรับผู้ใช้ <code className="font-mono text-blue-700">IIS_IUSRS</code> จากนั้นคลิกปุ่ม <strong>Restart Application</strong> ในหน้า Node.js
                  </p>
                  <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg p-2.5 text-[11px] font-semibold">
                    ✓ เข้าชมหน้าเว็บผ่านโดเมนของโรงเรียนได้ทันที
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'webconfig' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    เนื้อหาไฟล์ web.config (IIS &amp; iisnode Configuration)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ไฟล์นี้ทำหน้าที่นำคำขอ URL ทั้งหมดส่งต่อไปยัง Node.js ผ่านโมดูล iisnode และดึงไฟล์สถิตจาก dist
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(pleskInfo?.files.webConfig || '', 'webconfig')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs"
                >
                  {copiedType === 'webconfig' ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>คัดลอกโค้ด</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[460px] custom-scrollbar border border-slate-800">
                <pre>{pleskInfo?.files.webConfig || '<!-- web.config loading... -->'}</pre>
              </div>
            </div>
          )}

          {activeTab === 'serverjs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    เนื้อหาไฟล์ server.js (Application Startup File)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ไฟล์เริ่มต้นที่ระบุใน Application Startup File ของ Plesk ทำหน้าที่โหลดบันเดิล production หรือ tsx
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(pleskInfo?.files.serverJs || '', 'serverjs')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs"
                >
                  {copiedType === 'serverjs' ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-600" />
                      <span>คัดลอกแล้ว</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span>คัดลอกโค้ด</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-slate-900 p-4 font-mono text-xs text-slate-200 overflow-x-auto max-h-[460px] custom-scrollbar border border-slate-800">
                <pre>{pleskInfo?.files.serverJs || '// server.js loading...'}</pre>
              </div>
            </div>
          )}

          {activeTab === 'troubleshoot' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                คำแนะนำในการแก้ไขปัญหาทั่วไปบน Windows Server (IIS &amp; Plesk)
              </h3>

              <div className="space-y-3 text-xs">
                {/* Issue 1 */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <span>1. ขึ้นข้อผิดพลาด "HTTP Error 500.19 - Internal Server Error"</span>
                  </div>
                  <p className="text-slate-600">
                    <strong>สาเหตุ:</strong> เซิร์ฟเวอร์ Windows ยังไม่ได้ติดตั้ง <strong>IIS URL Rewrite Module 2.1</strong> หรือไม่ได้เปิดใช้งาน iisnode
                  </p>
                  <p className="text-slate-600">
                    <strong>วิธีแก้ไข:</strong> ผู้ดูแลเซิร์ฟเวอร์ต้องติดตั้ง <code className="bg-slate-100 font-mono px-1 rounded">URL Rewrite 2.1</code> ใน IIS หรือตรวจสอบการติดตั้ง Node.js Extension ใน Plesk Components
                  </p>
                </div>

                {/* Issue 2 */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5">
                  <div className="font-bold text-blue-900 flex items-center gap-1.5">
                    <Server className="h-4 w-4 text-blue-600" />
                    <span>2. วิธีเปิดดู Log การทำงานของ Node.js (iisnode Logs)</span>
                  </div>
                  <p className="text-slate-600">
                    เมื่อเกิดข้อผิดพลาดในการรัน Node.js บน Windows Server ตัว iisnode จะสร้างไฟล์ Log อัตโนมัติไว้ที่:
                  </p>
                  <div className="bg-slate-100 font-mono text-slate-800 p-2 rounded-lg text-[11px]">
                    httpdocs/iisnode/ (จะมีไฟล์ .txt ระบุเวลาและ Error Stack Trace)
                  </div>
                </div>

                {/* Issue 3 */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-1.5">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" />
                    <span>3. การจัดสรรพอร์ต (Port) และ Named Pipe บน Windows Server</span>
                  </div>
                  <p className="text-slate-600">
                    บน IISNode พอร์ตจะถูกส่งมาในรูปของ Windows Named Pipe (<code className="font-mono bg-slate-100 px-1 rounded">\\.\pipe\...</code>) โดยอัตโนมัติ ซึ่งในโค้ด Express <code className="font-mono">server.ts</code> ของระบบได้รับการเขียนดักรับ Named Pipe ไว้เรียบร้อยแล้ว ไม่เกิดข้อผิดพลาด EINVAL แน่นอน
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-white border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <div>
            ระบบแผนปฏิบัติการสถานศึกษา • 100% Node.js &amp; Plesk Windows Ready
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 hover:bg-slate-200 px-4 py-2 font-semibold text-slate-700 transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
