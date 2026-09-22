import {
  School,
  FiscalYear,
  User,
  StudentLevel,
  RevenueItem,
  BudgetAllocation,
  LearnerActivity,
  Project,
  BudgetTransaction,
  Strategy,
} from '../types';

export interface AppDatabaseState {
  school: School;
  fiscalYears: FiscalYear[];
  users: User[];
  students: StudentLevel[];
  revenues: RevenueItem[];
  allocations: BudgetAllocation[];
  activities: LearnerActivity[];
  projects: Project[];
  transactions: BudgetTransaction[];
  strategies: Strategy[];
}

const STORAGE_KEY = 'school_action_plan_db_v2';

// Clean initial data using generic example names (as requested by user)
export const cleanInitialSchool: School = {
  id: 1,
  schoolCode: '1000000001',
  name: 'โรงเรียนเด็กเรียนดี',
  address: 'เลขที่ 99 หมู่ที่ 1 ถนนตัวอย่าง',
  subdistrict: 'ตำบลตัวอย่าง',
  district: 'อำเภอตัวอย่าง',
  province: 'จังหวัดตัวอย่าง',
  zipcode: '10000',
  affiliation: 'สำนักงานคณะกรรมการการศึกษาขั้นพื้นฐาน (สพฐ.)',
  educationArea: 'สำนักงานเขตพื้นที่การศึกษาประถมศึกษาตัวอย่าง เขต 1',
  fiscalYear: 2568,
  directorName: 'ดร.พัฒนา ก้าวหน้า (ผู้อำนวยการโรงเรียน)',
  phone: '02-000-0000',
  email: 'dekreeandee_school@obec.mail.go.th',
  logoUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
};

export const cleanInitialFiscalYears: FiscalYear[] = [
  {
    id: 1,
    schoolId: 1,
    year: 2568,
    isActive: true,
    startDate: '2024-10-01',
    endDate: '2025-09-30',
    totalStudents: 180,
    teacherCount: 15,
    subsidyRateKindergarten: 1800,
    subsidyRatePrimary: 2050,
    subsidyRateSecondaryLower: 3500,
    subsidyRateSecondaryUpper: 3800,
    isProposalOpen: true,
    proposalOpenDate: '2024-10-01',
    proposalCloseDate: '2025-01-31',
    proposalNotice: 'เปิดรับการเสนอโครงการตามแผนปฏิบัติการประจำปีงบประมาณ พ.ศ. 2568 โดยคุณครูสามารถใช้เลขประจำตัวประชาชน 13 หลักในการเสนอของบประมาณ',
  },
];

export const cleanInitialUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    citizenId: '1100100123456',
    fullName: 'นายวางแผน รอบคอบ (หัวหน้างานแผนงานและงบประมาณ)',
    email: 'admin@school.ac.th',
    role: 'admin',
    department: 'ฝ่ายบริหารงานงบประมาณ',
    position: 'ครูชำนาญการพิเศษ / หัวหน้างานแผนงานและงบประมาณ',
    phone: '081-000-0001',
    schoolId: 1,
    isActive: true,
  },
  {
    id: 2,
    username: 'director',
    citizenId: '1200200234567',
    fullName: 'ดร.พัฒนา ก้าวหน้า (ผู้อำนวยการโรงเรียน)',
    email: 'director@school.ac.th',
    role: 'director',
    department: 'ฝ่ายบริหารทั่วไป',
    position: 'ผู้อำนวยการโรงเรียนเด็กเรียนดี',
    phone: '089-000-0002',
    schoolId: 1,
    isActive: true,
  },
  {
    id: 3,
    username: 'teacher1',
    citizenId: '3100600345678',
    fullName: 'ครูสอนดี เก่งมาก (ครูผู้รับผิดชอบโครงการ)',
    email: 'teacher1@school.ac.th',
    role: 'teacher',
    department: 'ฝ่ายบริหารงานวิชาการ',
    position: 'ครูชำนาญการ / ผู้รับผิดชอบโครงการ',
    phone: '086-000-0003',
    schoolId: 1,
    isActive: true,
  },
  {
    id: 4,
    username: 'teacher2',
    citizenId: '3100600987654',
    fullName: 'นางสาวใฝ่เรียน รักเด็ก (ครูผู้รับผิดชอบโครงการ)',
    email: 'teacher2@school.ac.th',
    role: 'teacher',
    department: 'ฝ่ายบริหารงานทั่วไป',
    position: 'ครู คศ.1 / ผู้รับผิดชอบกิจกรรมนักเรียน',
    phone: '086-000-0004',
    schoolId: 1,
    isActive: true,
  },
];

export const cleanInitialStudents: StudentLevel[] = [
  { id: 1, schoolId: 1, fiscalYearId: 1, gradeLevel: 'อนุบาล 1', stage: 'อนุบาล', maleCount: 10, femaleCount: 10, totalCount: 20 },
  { id: 2, schoolId: 1, fiscalYearId: 1, gradeLevel: 'อนุบาล 2', stage: 'อนุบาล', maleCount: 10, femaleCount: 10, totalCount: 20 },
  { id: 3, schoolId: 1, fiscalYearId: 1, gradeLevel: 'อนุบาล 3', stage: 'อนุบาล', maleCount: 10, femaleCount: 10, totalCount: 20 },
  { id: 4, schoolId: 1, fiscalYearId: 1, gradeLevel: 'ประถมศึกษาปีที่ 1', stage: 'ประถม', maleCount: 10, femaleCount: 10, totalCount: 20 },
  { id: 5, schoolId: 1, fiscalYearId: 1, gradeLevel: 'ประถมศึกษาปีที่ 2', stage: 'ประถม', maleCount: 10, femaleCount: 10, totalCount: 20 },
  { id: 6, schoolId: 1, fiscalYearId: 1, gradeLevel: 'ประถมศึกษาปีที่ 3', stage: 'ประถม', maleCount: 10, femaleCount: 10, totalCount: 20 },
  { id: 7, schoolId: 1, fiscalYearId: 1, gradeLevel: 'ประถมศึกษาปีที่ 4', stage: 'ประถม', maleCount: 10, femaleCount: 10, totalCount: 20 },
  { id: 8, schoolId: 1, fiscalYearId: 1, gradeLevel: 'ประถมศึกษาปีที่ 5', stage: 'ประถม', maleCount: 10, femaleCount: 10, totalCount: 20 },
  { id: 9, schoolId: 1, fiscalYearId: 1, gradeLevel: 'ประถมศึกษาปีที่ 6', stage: 'ประถม', maleCount: 10, femaleCount: 10, totalCount: 20 },
];

export const cleanInitialRevenues: RevenueItem[] = [
  {
    id: 1,
    schoolId: 1,
    fiscalYearId: 1,
    category: 'subsidy',
    itemName: '1. เงินอุดหนุนรายหัว (การจัดการศึกษาขั้นพื้นฐาน)',
    ratePerHead: 1980,
    eligibleCount: 180,
    calculatedAmount: 356400,
    isCustomRate: false,
    note: 'เงินอุดหนุนรายหัวตามเกณฑ์ สพฐ. ประจำปีงบประมาณ พ.ศ. 2568',
  },
  {
    id: 2,
    schoolId: 1,
    fiscalYearId: 1,
    category: 'activity',
    itemName: '2. เงินกิจกรรมพัฒนาผู้เรียน (4 กิจกรรมหลัก สพฐ.)',
    ratePerHead: 460,
    eligibleCount: 180,
    calculatedAmount: 82800,
    isCustomRate: false,
    note: 'วิชาการ, คุณธรรม, ทัศนศึกษา, เทคโนโลยี ICT',
  },
  {
    id: 3,
    schoolId: 1,
    fiscalYearId: 1,
    category: 'welfare',
    itemName: '3. ค่าหนังสือเรียน (โครงการเรียนฟรี 15 ปี)',
    ratePerHead: 650,
    eligibleCount: 180,
    calculatedAmount: 117000,
    isCustomRate: false,
    note: 'จัดสรรตามเกณฑ์ระดับการศึกษา สพฐ.',
  },
  {
    id: 4,
    schoolId: 1,
    fiscalYearId: 1,
    category: 'welfare',
    itemName: '4. ค่าเครื่องแบบนักเรียน (2 ชุด/คน/ปี)',
    ratePerHead: 380,
    eligibleCount: 180,
    calculatedAmount: 68400,
    isCustomRate: false,
    note: 'เงินอุดหนุนเครื่องแบบนักเรียน',
  },
  {
    id: 5,
    schoolId: 1,
    fiscalYearId: 1,
    category: 'welfare',
    itemName: '5. ค่าอุปกรณ์การเรียน',
    ratePerHead: 400,
    eligibleCount: 180,
    calculatedAmount: 72000,
    isCustomRate: false,
    note: 'สมุด ดินสอ ยางลบ สี ไม้บรรทัด',
  },
  {
    id: 6,
    schoolId: 1,
    fiscalYearId: 1,
    category: 'revenue',
    itemName: '6. เงินรายได้สถานศึกษา / เงินระดมทรัพยากร',
    ratePerHead: 0,
    eligibleCount: 1,
    calculatedAmount: 50000,
    isCustomRate: true,
    note: 'ดอกเบี้ยเงินฝากธนาคาร และเงินบำรุงสถานศึกษา',
  },
];

export const cleanInitialBudgetAllocations: BudgetAllocation[] = [
  {
    id: 1,
    schoolId: 1,
    fiscalYearId: 1,
    departmentName: 'ฝ่ายบริหารงานวิชาการ',
    percentage: 55,
    allocatedAmount: 410630,
    spentAmount: 0,
    remainingAmount: 410630,
    colorHex: '#2563eb',
    description: 'พัฒนาหลักสูตร การจัดการเรียนการสอน สื่อ นวัตกรรม และประกันคุณภาพ',
  },
  {
    id: 2,
    schoolId: 1,
    fiscalYearId: 1,
    departmentName: 'ฝ่ายบริหารงานงบประมาณ',
    percentage: 10,
    allocatedAmount: 74660,
    spentAmount: 0,
    remainingAmount: 74660,
    colorHex: '#0284c7',
    description: 'การเงิน บัญชี พัสดุ สินทรัพย์ และแผนงานงบประมาณโรงเรียน',
  },
  {
    id: 3,
    schoolId: 1,
    fiscalYearId: 1,
    departmentName: 'ฝ่ายบริหารงานบุคคล',
    percentage: 10,
    allocatedAmount: 74660,
    spentAmount: 0,
    remainingAmount: 74660,
    colorHex: '#059669',
    description: 'พัฒนาครู วินัย สวัสดิการ ทัศนศึกษาดูงาน และสรรหาบุคลากร',
  },
  {
    id: 4,
    schoolId: 1,
    fiscalYearId: 1,
    departmentName: 'ฝ่ายบริหารงานทั่วไป',
    percentage: 10,
    allocatedAmount: 74660,
    spentAmount: 0,
    remainingAmount: 74660,
    colorHex: '#d97706',
    description: 'อาคารสถานที่ สิ่งแวดล้อม ประชาสัมพันธ์ และชุมชนสัมพันธ์',
  },
  {
    id: 5,
    schoolId: 1,
    fiscalYearId: 1,
    departmentName: 'งบกลาง / สำรองจ่ายฉุกเฉิน',
    percentage: 15,
    allocatedAmount: 111990,
    spentAmount: 0,
    remainingAmount: 111990,
    colorHex: '#7c3aed',
    description: 'กันไว้สำหรับค่าสาธารณูปโภค (ไฟฟ้า/ประปา/โทรศัพท์) และสำรองจ่ายฉุกเฉิน',
    isContingency: true,
    contingencySubItems: [
      { id: 'c1', name: 'ค่ากระแสไฟฟ้า', allocatedAmount: 45000, spentAmount: 0, description: 'ค่าไฟฟ้าสถานศึกษา' },
      { id: 'c2', name: 'ค่าน้ำประปาและสาธารณูปโภค', allocatedAmount: 15000, spentAmount: 0, description: 'ค่าน้ำประปาและระบบสุขาภิบาล' },
      { id: 'c3', name: 'ค่าสัญญาณอินเทอร์เน็ต', allocatedAmount: 12000, spentAmount: 0, description: 'ระบบเครือข่ายและสื่อสาร' },
      { id: 'c4', name: 'งบสำรองจ่ายฉุกเฉินและซ่อมแซม', allocatedAmount: 39990, spentAmount: 0, description: 'ซ่อมบำรุงเร่งด่วน' },
    ],
  },
];

export const cleanInitialLearnerActivities: LearnerActivity[] = [
  {
    id: 1,
    schoolId: 1,
    fiscalYearId: 1,
    activityName: '1. กิจกรรมวิชาการ (ค่ายภาษาไทย, คณิตศาสตร์, วิทยาศาสตร์, ภาษาอังกฤษ)',
    percentage: 35,
    allocatedAmount: 28980,
    spentAmount: 0,
    remainingAmount: 28980,
    note: 'เน้นทักษะการคิดและการสื่อสารตามเกณฑ์ สพฐ.',
  },
  {
    id: 2,
    schoolId: 1,
    fiscalYearId: 1,
    activityName: '2. กิจกรรมคุณธรรม จริยธรรม ลูกเสือ เนตรนารี และค่ายคุณธรรม',
    percentage: 25,
    allocatedAmount: 20700,
    spentAmount: 0,
    remainingAmount: 20700,
    note: 'ค่ายพุทธบุตร และการอยู่ค่ายพักแรมลูกเสือ',
  },
  {
    id: 3,
    schoolId: 1,
    fiscalYearId: 1,
    activityName: '3. กิจกรรมทัศนศึกษา แหล่งเรียนรู้นอกสถานที่',
    percentage: 20,
    allocatedAmount: 16560,
    spentAmount: 0,
    remainingAmount: 16560,
    note: 'ศึกษาแหล่งเรียนรู้นอกสถานที่',
  },
  {
    id: 4,
    schoolId: 1,
    fiscalYearId: 1,
    activityName: '4. การให้บริการเทคโนโลยีสารสนเทศและการสื่อสาร (ICT/Coding)',
    percentage: 20,
    allocatedAmount: 16560,
    spentAmount: 0,
    remainingAmount: 16560,
    note: 'คอมพิวเตอร์และเทคโนโลยีดิจิทัล',
  },
];

export const cleanInitialStrategies: Strategy[] = [
  {
    id: 1,
    schoolId: 1,
    fiscalYearId: 1,
    code: 'ยุทธศาสตร์ที่ 1',
    name: 'พัฒนาคุณภาพผู้เรียนตามมาตรฐานการศึกษาขั้นพื้นฐานและศตวรรษที่ 21',
    description: 'ยกระดับผลสัมฤทธิ์ทางการเรียน RT, NT, O-NET และสมรรถนะผู้เรียน',
  },
  {
    id: 2,
    schoolId: 1,
    fiscalYearId: 1,
    code: 'ยุทธศาสตร์ที่ 2',
    name: 'ส่งเสริมคุณธรรม จริยธรรม วิถีประชาธิปไตย และค่านิยมไทย',
    description: 'สร้างจิตสำนึกความเป็นไทย ความรับผิดชอบต่อส่วนรวม และรักษ์สิ่งแวดล้อม',
  },
  {
    id: 3,
    schoolId: 1,
    fiscalYearId: 1,
    code: 'ยุทธศาสตร์ที่ 3',
    name: 'พัฒนาครูและบุคลากรทางการศึกษาสู่ความเป็นครูมืออาชีพ',
    description: 'ส่งเสริมการจัดการเรียนรู้ Active Learning และนวัตกรรมดิจิทัล',
  },
  {
    id: 4,
    schoolId: 1,
    fiscalYearId: 1,
    code: 'ยุทธศาสตร์ที่ 4',
    name: 'พัฒนาระบบบริหารจัดการด้วยเทคโนโลยีและการมีส่วนร่วมของทุกภาคส่วน',
    description: 'พัฒนาสภาพแวดล้อม อาคารสถานที่ สื่อเทคโนโลยี และประสานชุมชน',
  },
];

// Clean initial projects: proposals across departments ready for trimming & review
export const cleanInitialProjects: Project[] = [
  // ฝ่ายบริหารงานวิชาการ
  {
    id: 1,
    schoolId: 1,
    fiscalYearId: 1,
    projectCode: 'PROJ-68-01',
    projectName: 'โครงการยกระดับผลสัมฤทธิ์ทางการเรียนและพัฒนาศักยภาพผู้เรียนสู่ศตวรรษที่ 21',
    rationale: 'เพื่อพัฒนาทักษะการเรียนรู้ ความคิดสร้างสรรค์ และสมรรถนะสำคัญตามหลักสูตรแกนกลางการศึกษาขั้นพื้นฐาน',
    objectives: '1. เพื่อยกระดับผลสัมฤทธิ์ทางการเรียนของผู้เรียนทุกระดับชั้น\n2. เพื่อส่งเสริมกิจกรรมการเรียนรู้เชิงรุก (Active Learning)',
    quantitativeGoals: 'นักเรียนทุกคนจำนวน 180 คน ได้รับการพัฒนา',
    qualitativeGoals: 'ผู้เรียนมีคุณลักษณะอันพึงประสงค์และผลสัมฤทธิ์ผ่านเกณฑ์มาตรฐานสถานศึกษา',
    kpis: 'ร้อยละ 85 ของผู้เรียนมีพัฒนาการทางการเรียนดีขึ้น',
    procedures: '1. ประชุมวางแผนและแต่งตั้งคณะทำงาน\n2. ดำเนินกิจกรรมพัฒนาผู้เรียน\n3. ติดตามและประเมินผล',
    durationStart: '2024-11-01',
    durationEnd: '2025-03-31',
    location: 'โรงเรียนเด็กเรียนดี',
    targetGroup: 'นักเรียนชั้นอนุบาล 1 - ประถมศึกษาปีที่ 6',
    responsiblePerson: 'ครูสอนดี เก่งมาก',
    responsibleId: 3,
    proposerCitizenId: '3100600345678',
    proposerName: 'ครูสอนดี เก่งมาก (ครูผู้รับผิดชอบโครงการ)',
    department: 'ฝ่ายบริหารงานวิชาการ',
    budgetSource: 'เงินอุดหนุนรายหัว (ฝ่ายวิชาการ)',
    originalProposedBudget: 60000,
    allocatedBudget: 55000,
    spentBudget: 0,
    remainingBudget: 55000,
    status: 'not_started',
    approvalStatus: 'approved',
    strategyId: 1,
    sortOrder: 1,
    expenseItems: [
      { id: 1, projectId: 1, itemName: 'แบบฝึกทักษะและเอกสารใบงานการเรียนรู้', quantity: 180, unit: 'ชุด', unitPrice: 150, totalAmount: 27000, category: 'ค่าวัสดุ' },
      { id: 2, projectId: 1, itemName: 'ค่าตอบแทนวิทยากรให้ความรู้เชิงปฏิบัติการ', quantity: 20, unit: 'ชั่วโมง', unitPrice: 600, totalAmount: 12000, category: 'ค่าตอบแทน' },
      { id: 3, projectId: 1, itemName: 'ค่าอาหารว่างและเครื่องดื่มสำหรับผู้เข้าร่วม', quantity: 180, unit: 'ชุด', unitPrice: 50, totalAmount: 9000, category: 'ค่าใช้สอย' },
      { id: 4, projectId: 1, itemName: 'ป้ายไวนิลและสื่อประชาสัมพันธ์โครงการ', quantity: 4, unit: 'ผืน', unitPrice: 1750, totalAmount: 7000, category: 'ค่าวัสดุ' },
    ],
  },
  {
    id: 2,
    schoolId: 1,
    fiscalYearId: 1,
    projectCode: 'PROJ-68-02',
    projectName: 'โครงการพัฒนาทักษะวิทยาศาสตร์ เทคโนโลยี Coding และสะเต็มศึกษา (STEM Education)',
    rationale: 'เพื่อสร้างทักษะการคิดเชิงคำนวณและการแก้ปัญหาทางวิทยาศาสตร์สำหรับนักเรียนในยุคดิจิทัล',
    objectives: '1. เพื่อให้นักเรียนเข้าใจหลักการ Coding และหุ่นยนต์เบื้องต้น\n2. เพื่อส่งเสริมนวัตกรรมสิ่งประดิษฐ์วิทยาศาสตร์',
    quantitativeGoals: 'นักเรียนชั้น ป.1 - ป.6 จำนวน 120 คน',
    qualitativeGoals: 'นักเรียนสามารถสร้างชิ้นงานหรือโปรแกรมจำลองได้',
    kpis: 'ร้อยละ 80 ของนักเรียนสามารถปฏิบัติกิจกรรม Coding ได้อย่างถูกต้อง',
    procedures: '1. จัดซื้อชุดทดลอง Coding\n2. จัดค่ายอบรมเชิงปฏิบัติการ\n3. จัดนิทรรศการแสดงผลงาน',
    durationStart: '2024-12-01',
    durationEnd: '2025-05-31',
    location: 'ห้องปฏิบัติการคอมพิวเตอร์และวิทยาศาสตร์',
    targetGroup: 'นักเรียนชั้นประถมศึกษา',
    responsiblePerson: 'ครูสอนดี เก่งมาก',
    responsibleId: 3,
    proposerCitizenId: '3100600345678',
    proposerName: 'ครูสอนดี เก่งมาก (ครูผู้รับผิดชอบโครงการ)',
    department: 'ฝ่ายบริหารงานวิชาการ',
    budgetSource: 'เงินอุดหนุนรายหัว (ฝ่ายวิชาการ)',
    originalProposedBudget: 85000,
    allocatedBudget: 75000,
    spentBudget: 0,
    remainingBudget: 75000,
    status: 'not_started',
    approvalStatus: 'approved',
    strategyId: 1,
    sortOrder: 2,
    expenseItems: [
      { id: 5, projectId: 2, itemName: 'ชุดอุปกรณ์และบอร์ดไมโครคอนโทรลเลอร์ Micro:bit', quantity: 20, unit: 'ชุด', unitPrice: 2000, totalAmount: 40000, category: 'ค่าวัสดุ' },
      { id: 6, projectId: 2, itemName: 'ค่าวิทยากรเชี่ยวชาญด้านวิทยาการคำนวณ', quantity: 15, unit: 'ชั่วโมง', unitPrice: 800, totalAmount: 12000, category: 'ค่าตอบแทน' },
      { id: 7, projectId: 2, itemName: 'ค่าอาหารกลางวันและอาหารว่างในค่ายอบรม', quantity: 120, unit: 'คน', unitPrice: 150, totalAmount: 18000, category: 'ค่าใช้สอย' },
      { id: 8, projectId: 2, itemName: 'วัสดุการทดลองและเอกสารคู่มือสะเต็มศึกษา', quantity: 1, unit: 'ชุด', unitPrice: 5000, totalAmount: 5000, category: 'ค่าวัสดุ' },
    ],
  },
  {
    id: 3,
    schoolId: 1,
    fiscalYearId: 1,
    projectCode: 'PROJ-68-03',
    projectName: 'โครงการส่งเสริมนิสัยรักการอ่าน พัฒนาห้องสมุดมีชีวิต และทักษะภาษาไทย',
    rationale: 'เพื่อแก้ปัญหาและยกระดับความสามารถในการอ่านออกเขียนได้ คิดเลขเป็น ตามนโยบายเร่งด่วน สพฐ.',
    objectives: '1. เพื่อพัฒนาทักษะการอ่านออกเขียนได้ของนักเรียนระดับชั้นประถมต้น\n2. เพื่อจัดมุมเรียนรู้และหนังสือเสริมสร้างปัญญาในห้องสมุด',
    quantitativeGoals: 'นักเรียนทุกระดับชั้น 180 คน',
    qualitativeGoals: 'นักเรียนมีนิสัยรักการอ่านและผลการประเมินการอ่าน RT/NT สูงขึ้น',
    kpis: 'ร้อยละ 90 ของนักเรียนชั้น ป.1 อ่านออกเขียนได้ตามเกณฑ์',
    procedures: '1. คัดเลือกหนังสือใหม่เข้าห้องสมุด\n2. จัดกิจกรรมเสียงตามสายและบันทึกรักการอ่าน\n3. จัดสัปดาห์วันรักการอ่าน',
    durationStart: '2024-11-15',
    durationEnd: '2025-06-30',
    location: 'ห้องสมุดโรงเรียน',
    targetGroup: 'นักเรียนทุกคน',
    responsiblePerson: 'ครูสอนดี เก่งมาก',
    responsibleId: 3,
    proposerCitizenId: '3100600345678',
    proposerName: 'ครูสอนดี เก่งมาก (ครูผู้รับผิดชอบโครงการ)',
    department: 'ฝ่ายบริหารงานวิชาการ',
    budgetSource: 'เงินอุดหนุนรายหัว (ฝ่ายวิชาการ)',
    originalProposedBudget: 45000,
    allocatedBudget: 40000,
    spentBudget: 0,
    remainingBudget: 40000,
    status: 'not_started',
    approvalStatus: 'approved',
    strategyId: 1,
    sortOrder: 3,
    expenseItems: [
      { id: 9, projectId: 3, itemName: 'หนังสือส่งเสริมการอ่านและนิทานพัฒนาภาษา', quantity: 120, unit: 'เล่ม', unitPrice: 180, totalAmount: 21600, category: 'ค่าวัสดุ' },
      { id: 10, projectId: 3, itemName: 'สมุดบันทึกการอ่านและบัตรสะสมแต้มยอดนักอ่าน', quantity: 180, unit: 'เล่ม', unitPrice: 40, totalAmount: 7200, category: 'ค่าวัสดุ' },
      { id: 11, projectId: 3, itemName: 'เกียรติบัตรและรางวัลส่งเสริมนักเรียนยอดนักอ่าน', quantity: 50, unit: 'รางวัล', unitPrice: 150, totalAmount: 7500, category: 'ค่าใช้สอย' },
      { id: 12, projectId: 3, itemName: 'ค่าจัดมุมเรียนรู้บอร์ดนิทรรศการส่งเสริมการอ่าน', quantity: 1, unit: 'งาน', unitPrice: 3700, totalAmount: 3700, category: 'ค่าวัสดุ' },
    ],
  },

  // ฝ่ายบริหารงานงบประมาณ
  {
    id: 4,
    schoolId: 1,
    fiscalYearId: 1,
    projectCode: 'PROJ-68-04',
    projectName: 'โครงการพัฒนาระบบบริหารการเงิน บัญชี พัสดุ และควบคุมภายในด้วยเทคโนโลยีดิจิทัล',
    rationale: 'เพื่อเพิ่มประสิทธิภาพและความโปร่งใสในการบริหารงบประมาณสถานศึกษาตามระเบียบกระทรวงการคลัง',
    objectives: '1. เพื่อจัดวางระบบทะเบียนคุมทรัพย์สินและพัสดุให้เป็นปัจจุบัน\n2. เพื่อเสริมสร้างระบบตรวจสอบควบคุมภายใน',
    quantitativeGoals: 'บุคลากรฝ่ายการเงินและพัสดุ 5 คน และระบบฐานข้อมูลพัสดุ',
    qualitativeGoals: 'การเงิน บัญชี และพัสดุ ถูกต้องตามระเบียบ ไร้ข้อทักท้วง',
    kpis: 'รายงานการเงินและพัสดุส่งตรงเวลา ร้อยละ 100',
    procedures: '1. พัฒนาระบบทะเบียนคุมดิจิทัล\n2. ตรวจนับพัสดุประจำปี\n3. จัดทำรายงานสรุปงบการเงิน',
    durationStart: '2024-10-01',
    durationEnd: '2025-09-30',
    location: 'ห้องธุรการและการเงิน',
    targetGroup: 'ฝ่ายบริหารงบประมาณและครูผู้เกี่ยวข้อง',
    responsiblePerson: 'นางสาวใฝ่เรียน รักเด็ก',
    responsibleId: 4,
    proposerCitizenId: '3100600987654',
    proposerName: 'นางสาวใฝ่เรียน รักเด็ก (เจ้าหน้าที่การเงิน)',
    department: 'ฝ่ายบริหารงานงบประมาณ',
    budgetSource: 'เงินอุดหนุนรายหัว (ฝ่ายงบประมาณ)',
    originalProposedBudget: 35000,
    allocatedBudget: 30000,
    spentBudget: 0,
    remainingBudget: 30000,
    status: 'not_started',
    approvalStatus: 'approved',
    strategyId: 4,
    sortOrder: 4,
    expenseItems: [
      { id: 13, projectId: 4, itemName: 'สมุดทะเบียนคุมพัสดุและกระดาษพิมพ์แบบฟอร์มการเงิน', quantity: 20, unit: 'รีม/เล่ม', unitPrice: 350, totalAmount: 7000, category: 'ค่าวัสดุ' },
      { id: 14, projectId: 4, itemName: 'ตลับหมึกเลเซอร์สำหรับพิมพ์เอกสารงบประมาณและพัสดุ', quantity: 4, unit: 'กล่อง', unitPrice: 2800, totalAmount: 11200, category: 'ค่าวัสดุ' },
      { id: 15, projectId: 4, itemName: 'ค่าบำรุงรักษาและปรับปรุงระบบฐานข้อมูลบัญชีโรงเรียน', quantity: 1, unit: 'ระบบ', unitPrice: 11800, totalAmount: 11800, category: 'ค่าใช้สอย' },
    ],
  },
  {
    id: 5,
    schoolId: 1,
    fiscalYearId: 1,
    projectCode: 'PROJ-68-05',
    projectName: 'โครงการเสริมสร้างประสิทธิภาพการบริหารงานพัสดุและสินทรัพย์สถานศึกษา',
    rationale: 'เพื่อดูแล บำรุงรักษา และซ่อมแซมสินทรัพย์ครุภัณฑ์การศึกษาให้อยู่ในสภาพพร้อมใช้งาน',
    objectives: '1. เพื่อสำรวจและติดบาร์โค้ดครุภัณฑ์ทุกชิ้นในโรงเรียน\n2. เพื่อจัดทำคู่มือและระเบียบการยืม-คืนพัสดุ',
    quantitativeGoals: 'ครุภัณฑ์ในโรงเรียนทั้งหมดกว่า 300 รายการ',
    qualitativeGoals: 'ครุภัณฑ์ได้รับการดูแลและตรวจสอบสถานะได้ทันที',
    kpis: 'อัตราการสูญหายของพัสดุเป็น 0%',
    procedures: '1. พิมพ์สติ๊กเกอร์รหัสครุภัณฑ์\n2. สำรวจประจำห้องเรียน\n3. จัดระบบคลังพัสดุ',
    durationStart: '2024-11-01',
    durationEnd: '2025-04-30',
    location: 'ห้องพัสดุและอาคารเรียน',
    targetGroup: 'ครูและบุคลากรทุกฝ่าย',
    responsiblePerson: 'นางสาวใฝ่เรียน รักเด็ก',
    responsibleId: 4,
    proposerCitizenId: '3100600987654',
    proposerName: 'นางสาวใฝ่เรียน รักเด็ก (เจ้าหน้าที่พัสดุ)',
    department: 'ฝ่ายบริหารงานงบประมาณ',
    budgetSource: 'เงินอุดหนุนรายหัว (ฝ่ายงบประมาณ)',
    originalProposedBudget: 28000,
    allocatedBudget: 25000,
    spentBudget: 0,
    remainingBudget: 25000,
    status: 'not_started',
    approvalStatus: 'approved',
    strategyId: 4,
    sortOrder: 5,
    expenseItems: [
      { id: 16, projectId: 5, itemName: 'สติ๊กเกอร์กันน้ำพิมพ์รหัสทรัพย์สินและอุปกรณ์สำรวจ', quantity: 10, unit: 'ชุด', unitPrice: 800, totalAmount: 8000, category: 'ค่าวัสดุ' },
      { id: 17, projectId: 5, itemName: 'ตู้เหล็กเก็บเอกสารสำคัญทางพัสดุและการเงิน', quantity: 1, unit: 'หลัง', unitPrice: 12000, totalAmount: 12000, category: 'ค่าครุภัณฑ์' },
      { id: 18, projectId: 5, itemName: 'ค่าจัดทำแฟ้มทะเบียนประวัติทรัพย์สินประจำปี', quantity: 50, unit: 'แฟ้ม', unitPrice: 100, totalAmount: 5000, category: 'ค่าวัสดุ' },
    ],
  },

  // ฝ่ายบริหารงานบุคคล
  {
    id: 6,
    schoolId: 1,
    fiscalYearId: 1,
    projectCode: 'PROJ-68-06',
    projectName: 'โครงการพัฒนาสมรรถนะครูและบุคลากรทางการศึกษาสู่มาตรฐานสากลและชุมชนแห่งการเรียนรู้ (PLC)',
    rationale: 'เพื่อพัฒนาศักยภาพการจัดการเรียนรู้ของครูในการสร้างสื่อนวัตกรรมและการจัดกิจกรรมแบบ Active Learning',
    objectives: '1. เพื่อพัฒนาทักษะการสอนเชิงรุกและการใช้เทคโนโลยีดิจิทัลของครู\n2. เพื่อขับเคลื่อนกระบวนการ PLC ในโรงเรียนอย่างต่อเนื่อง',
    quantitativeGoals: 'ครูและบุคลากร 15 คน',
    qualitativeGoals: 'ครูมีแผนการจัดการเรียนรู้ Active Learning ครบทุกคน',
    kpis: 'ครูทุกคนได้รับการพัฒนาวิชาชีพไม่น้อยกว่า 20 ชั่วโมง/ปี',
    procedures: '1. อบรมเชิงปฏิบัติการผลิตสื่อการสอนดิจิทัล\n2. ดำเนินการนิเทศภายในและ PLC สัปดาห์ละ 1 ครั้ง\n3. สรุปและถอดบทเรียน',
    durationStart: '2024-10-15',
    durationEnd: '2025-08-31',
    location: 'ห้องประชุมโรงเรียน',
    targetGroup: 'ครูและบุคลากรทุกคน',
    responsiblePerson: 'ดร.พัฒนา ก้าวหน้า (ผู้อำนวยการโรงเรียน)',
    responsibleId: 2,
    proposerCitizenId: '1200200234567',
    proposerName: 'ดร.พัฒนา ก้าวหน้า (ผู้อำนวยการโรงเรียน)',
    department: 'ฝ่ายบริหารงานบุคคล',
    budgetSource: 'เงินอุดหนุนรายหัว (ฝ่ายบริหารงานบุคคล)',
    originalProposedBudget: 45000,
    allocatedBudget: 40000,
    spentBudget: 0,
    remainingBudget: 40000,
    status: 'not_started',
    approvalStatus: 'approved',
    strategyId: 3,
    sortOrder: 6,
    expenseItems: [
      { id: 19, projectId: 6, itemName: 'ค่าตอบแทนวิทยากรผู้เชี่ยวชาญด้าน Active Learning & AI เพื่อการศึกษา', quantity: 18, unit: 'ชั่วโมง', unitPrice: 800, totalAmount: 14400, category: 'ค่าตอบแทน' },
      { id: 20, projectId: 6, itemName: 'ค่าอาหารกลางวันและอาหารว่างการอบรมพัฒนาครู', quantity: 15, unit: 'คน', unitPrice: 600, totalAmount: 9000, category: 'ค่าใช้สอย' },
      { id: 21, projectId: 6, itemName: 'เอกสารและสื่อประกอบการประชุมเชิงปฏิบัติการ PLC', quantity: 15, unit: 'ชุด', unitPrice: 400, totalAmount: 6000, category: 'ค่าวัสดุ' },
      { id: 22, projectId: 6, itemName: 'ค่ารางวัลนวัตกรรมครูดีเด่นและการเผยแพร่ผลงาน', quantity: 3, unit: 'รางวัล', unitPrice: 3533, totalAmount: 10600, category: 'ค่าใช้สอย' },
    ],
  },
  {
    id: 7,
    schoolId: 1,
    fiscalYearId: 1,
    projectCode: 'PROJ-68-07',
    projectName: 'โครงการส่งเสริมวินัย คุณธรรม จริยธรรม จรรยาบรรณวิชาชีพ และสวัสดิการครู',
    rationale: 'เพื่อสร้างขวัญกำลังใจและเสริมสร้างคุณธรรมในการปฏิบัติหน้าที่ราชการของครูและบุคลากร',
    objectives: '1. เพื่อยกย่องเชิดชูเกียรติครูผู้มีผลงานดีเด่น\n2. เพื่อจัดสวัสดิการตรวจสุขภาพและการตรวจเช็คความพร้อมของบุคลากร',
    quantitativeGoals: 'ครูและบุคลากร 15 คน',
    qualitativeGoals: 'บุคลากรมีความสุขในการทำงานและมีขวัญกำลังใจที่ดี',
    kpis: 'ความพึงพอใจในการปฏิบัติงานของบุคลากรไม่น้อยกว่าร้อยละ 90',
    procedures: '1. จัดกิจกรรมวันครูและยกย่องเชิดชูเกียรติ\n2. ตรวจสุขภาพประจำปี\n3. จัดสวัสดิการส่งเสริมสุขภาพกายและใจ',
    durationStart: '2024-11-01',
    durationEnd: '2025-05-31',
    location: 'โรงเรียนและสถานพยาบาล',
    targetGroup: 'ครูและบุคลากร',
    responsiblePerson: 'ดร.พัฒนา ก้าวหน้า (ผู้อำนวยการโรงเรียน)',
    responsibleId: 2,
    proposerCitizenId: '1200200234567',
    proposerName: 'ดร.พัฒนา ก้าวหน้า (ผู้อำนวยการโรงเรียน)',
    department: 'ฝ่ายบริหารงานบุคคล',
    budgetSource: 'เงินอุดหนุนรายหัว (ฝ่ายบริหารงานบุคคล)',
    originalProposedBudget: 32000,
    allocatedBudget: 28000,
    spentBudget: 0,
    remainingBudget: 28000,
    status: 'not_started',
    approvalStatus: 'approved',
    strategyId: 3,
    sortOrder: 7,
    expenseItems: [
      { id: 23, projectId: 7, itemName: 'เกียรติบัตรและโล่เชิดชูเกียรติครูดีเด่นประจำปี', quantity: 5, unit: 'ชุด', unitPrice: 1200, totalAmount: 6000, category: 'ค่าวัสดุ' },
      { id: 24, projectId: 7, itemName: 'ค่าใช้จ่ายตรวจสุขภาพเบื้องต้นและเวชภัณฑ์ประจำห้องพยาบาลครู', quantity: 15, unit: 'คน', unitPrice: 800, totalAmount: 12000, category: 'ค่าใช้สอย' },
      { id: 25, projectId: 7, itemName: 'ค่าจัดกิจกรรมสานสัมพันธ์และพัฒนาจิตบริการ', quantity: 1, unit: 'งาน', unitPrice: 10000, totalAmount: 10000, category: 'ค่าใช้สอย' },
    ],
  },

  // ฝ่ายบริหารงานทั่วไป
  {
    id: 8,
    schoolId: 1,
    fiscalYearId: 1,
    projectCode: 'PROJ-68-08',
    projectName: 'โครงการพัฒนาสภาพแวดล้อม ปรับปรุงภูมิทัศน์ และสร้างแหล่งเรียนรู้ในโรงเรียน',
    rationale: 'เพื่อให้สถานศึกษามีสภาพแวดล้อมที่ร่มรื่น สวยงาม ปลอดภัย และเอื้อต่อการเรียนรู้ของผู้เรียน',
    objectives: '1. เพื่อปรับปรุงสวนหย่อมและแหล่งเรียนรู้ธรรมชาติในโรงเรียน\n2. เพื่อบำรุงรักษาอาคารสถานที่และระบบไฟฟ้าให้ปลอดภัย',
    quantitativeGoals: 'พื้นที่บริเวณโรงเรียน อาคารเรียน 2 หลัง และสวนพฤกษศาสตร์',
    qualitativeGoals: 'โรงเรียนมีความสะอาด ร่มรื่น และปลอดภัย',
    kpis: 'ระดับความพึงพอใจต่อสภาพแวดล้อมของโรงเรียนไม่น้อยกว่าร้อยละ 85',
    procedures: '1. สำรวจจุดที่ต้องปรับปรุงและซ่อมแซม\n2. ดำเนินการปรับปรุงภูมิทัศน์และปลูกต้นไม้\n3. ติดตั้งป้ายแหล่งเรียนรู้',
    durationStart: '2024-11-01',
    durationEnd: '2025-07-31',
    location: 'บริเวณโรงเรียนเด็กเรียนดี',
    targetGroup: 'นักเรียน ครู และผู้ปกครอง',
    responsiblePerson: 'นางสาวใฝ่เรียน รักเด็ก',
    responsibleId: 4,
    proposerCitizenId: '3100600987654',
    proposerName: 'นางสาวใฝ่เรียน รักเด็ก (ฝ่ายบริหารงานทั่วไป)',
    department: 'ฝ่ายบริหารงานทั่วไป',
    budgetSource: 'เงินอุดหนุนรายหัว (ฝ่ายบริหารงานทั่วไป)',
    originalProposedBudget: 50000,
    allocatedBudget: 42000,
    spentBudget: 0,
    remainingBudget: 42000,
    status: 'not_started',
    approvalStatus: 'approved',
    strategyId: 4,
    sortOrder: 8,
    expenseItems: [
      { id: 26, projectId: 8, itemName: 'พันธุ์ไม้ ดินปลูก ปุ๋ย และอุปกรณ์จัดสวนหย่อมแหล่งเรียนรู้', quantity: 1, unit: 'ชุด', unitPrice: 16000, totalAmount: 16000, category: 'ค่าวัสดุ' },
      { id: 27, projectId: 8, itemName: 'สีทาอาคารและอุปกรณ์ซ่อมบำรุงป้ายชื่ออาคารสถานที่', quantity: 1, unit: 'ชุด', unitPrice: 14000, totalAmount: 14000, category: 'ค่าวัสดุ' },
      { id: 28, projectId: 8, itemName: 'ค่าจ้างเหมาซ่อมแซมทางเดินและปรับปรุงระบบแสงสว่าง', quantity: 1, unit: 'งาน', unitPrice: 12000, totalAmount: 12000, category: 'ค่าใช้สอย' },
    ],
  },
  {
    id: 9,
    schoolId: 1,
    fiscalYearId: 1,
    projectCode: 'PROJ-68-09',
    projectName: 'โครงการเสริมสร้างระบบดูแลช่วยเหลือนักเรียน ความปลอดภัย และสุขอนามัยในโรงเรียน',
    rationale: 'เพื่อสร้างความปลอดภัยรอบด้านแก่นักเรียน ทั้งด้านสุขอนามัย สารเสพติด และอุบัติภัย',
    objectives: '1. เพื่อจัดระบบคัดกรองสุขภาพและเฝ้าระวังความปลอดภัยของนักเรียน\n2. เพื่อจัดหาเวชภัณฑ์และอุปกรณ์ปฐมพยาบาลเบื้องต้น',
    quantitativeGoals: 'นักเรียนทุกคน 180 คน',
    qualitativeGoals: 'นักเรียนทุกคนได้รับการดูแลช่วยเหลือด้านสุขภาพและความปลอดภัย',
    kpis: 'อัตราการเกิดอุบัติเหตุรุนแรงในโรงเรียนเป็น 0%',
    procedures: '1. ตรวจสุขภาพและชั่งน้ำหนักวัดส่วนสูง\n2. อบรมการปฐมพยาบาลเบื้องต้นและซ้อมแผนเผชิญเหตุ\n3. จัดระบบคัดกรองเยี่ยมบ้าน',
    durationStart: '2024-10-15',
    durationEnd: '2025-06-30',
    location: 'ห้องพยาบาลและอาคารเรียน',
    targetGroup: 'นักเรียนทุกคน',
    responsiblePerson: 'นางสาวใฝ่เรียน รักเด็ก',
    responsibleId: 4,
    proposerCitizenId: '3100600987654',
    proposerName: 'นางสาวใฝ่เรียน รักเด็ก (ฝ่ายบริหารงานทั่วไป)',
    department: 'ฝ่ายบริหารงานทั่วไป',
    budgetSource: 'เงินอุดหนุนรายหัว (ฝ่ายบริหารงานทั่วไป)',
    originalProposedBudget: 35000,
    allocatedBudget: 30000,
    spentBudget: 0,
    remainingBudget: 30000,
    status: 'not_started',
    approvalStatus: 'approved',
    strategyId: 4,
    sortOrder: 9,
    expenseItems: [
      { id: 29, projectId: 9, itemName: 'เวชภัณฑ์ ยาสามัญประจำบ้าน และอุปกรณ์ปฐมพยาบาลห้องพยาบาล', quantity: 1, unit: 'ชุด', unitPrice: 13000, totalAmount: 13000, category: 'ค่าวัสดุ' },
      { id: 30, projectId: 9, itemName: 'ค่าอุปกรณ์ตรวจสอบความปลอดภัยและถังดับเพลิงสำรอง', quantity: 2, unit: 'ถัง', unitPrice: 3500, totalAmount: 7000, category: 'ค่าวัสดุ' },
      { id: 31, projectId: 9, itemName: 'ค่าจัดทำแบบบันทึกการเยี่ยมบ้านและเอกสารระบบดูแลช่วยเหลือ', quantity: 180, unit: 'ชุด', unitPrice: 55, totalAmount: 10000, category: 'ค่าวัสดุ' },
    ],
  },
];

export const cleanInitialTransactions: BudgetTransaction[] = [];

// Get complete clean initial state
export function getCleanDatabaseState(): AppDatabaseState {
  return {
    school: { ...cleanInitialSchool },
    fiscalYears: [...cleanInitialFiscalYears],
    users: [...cleanInitialUsers],
    students: [...cleanInitialStudents],
    revenues: [...cleanInitialRevenues],
    allocations: [...cleanInitialBudgetAllocations],
    activities: [...cleanInitialLearnerActivities],
    projects: [...cleanInitialProjects],
    transactions: [...cleanInitialTransactions],
    strategies: [...cleanInitialStrategies],
  };
}

// Load database from localStorage or return clean initial state
export function loadDatabaseFromStorage(): AppDatabaseState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validate that essential keys exist
      if (parsed.school && parsed.fiscalYears && parsed.users) {
        // Upgrade legacy names to user's preferred teacher/director example names
        if (parsed.school.directorName?.includes('นายตัวอย่าง')) {
          parsed.school.directorName = 'ดร.พัฒนา ก้าวหน้า (ผู้อำนวยการโรงเรียน)';
        }
        if (Array.isArray(parsed.users)) {
          parsed.users = parsed.users.map((u: User) => {
            if (u.username === 'admin' && u.fullName.includes('ผู้ดูแล แผนงานพัสดุ')) {
              return { ...u, fullName: 'นายวางแผน รอบคอบ (หัวหน้างานแผนงานและงบประมาณ)' };
            }
            if (u.username === 'director' && u.fullName.includes('นายตัวอย่าง')) {
              return { ...u, fullName: 'ดร.พัฒนา ก้าวหน้า (ผู้อำนวยการโรงเรียน)' };
            }
            if (u.username === 'teacher1' && u.fullName.includes('ครูดี มีวิชา')) {
              return { ...u, fullName: 'ครูสอนดี เก่งมาก (ครูผู้รับผิดชอบโครงการ)', position: 'ครูชำนาญการ / ผู้รับผิดชอบโครงการ' };
            }
            return u;
          });
        }
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load database from localStorage:', e);
  }
  const cleanState = getCleanDatabaseState();
  saveDatabaseToStorage(cleanState);
  return cleanState;
}

// Save complete database state to localStorage and optionally sync to server
export function saveDatabaseToStorage(state: AppDatabaseState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Asynchronously sync to backend storage file for persistence verification
    fetch('/api/database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state),
    }).catch(() => {
      // Ignore background fetch error in offline or mock mode
    });
  } catch (e) {
    console.error('Failed to save database to localStorage:', e);
  }
}

// Reset database to clean starting state
export function resetDatabaseStorage(): AppDatabaseState {
  const cleanState = getCleanDatabaseState();
  saveDatabaseToStorage(cleanState);
  return cleanState;
}
