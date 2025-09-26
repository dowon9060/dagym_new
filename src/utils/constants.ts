import { Plan } from '../types';

// API 기본 URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// 라우트 경로
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  CONTRACT_NEW: '/contract/new',
  CONTRACT_LIST: '/contract/list',
  CONTRACT_DETAIL: '/contract/:id',
  BUSINESS_INFO: '/contract/new/business',
  ACCOUNT_INFO: '/contract/new/account',
  REPRESENTATIVE_INFO: '/contract/new/representative',
  PLAN_SELECTION: '/contract/new/plans',
  PAYMENT: '/contract/new/payment',
  STATISTICS: '/statistics',
  FACILITY_MANAGEMENT: '/facility',
  BUSINESS_MANAGEMENT: '/business',
} as const;

// 은행 목록
export const BANKS = [
  '국민은행',
  '신한은행',
  '우리은행',
  '하나은행',
  'KB국민은행',
  'SC제일은행',
  '씨티은행',
  '농협은행',
  '수협은행',
  '산업은행',
  '기업은행',
  '새마을금고',
  '신협',
  '우체국',
  '카카오뱅크',
  '토스뱅크',
  '케이뱅크',
  '기타',
] as const;

// 업태 목록
export const BUSINESS_TYPES = [
  '서비스업',
  '제조업',
  '도소매업',
  '건설업',
  '운수업',
  '숙박 및 음식점업',
  '교육서비스업',
  '보건업 및 사회복지서비스업',
  '예술, 스포츠 및 여가관련서비스업',
  '기타',
] as const;

// 플랜 정보
export const PLANS: Plan[] = [
  {
    id: 'free',
    name: '무료플랜',
    monthlyPrice: 0,
    yearlyPrice: 0,
    isRequired: false,
    category: 'main',
  },
  {
    id: 'light',
    name: '라이트플랜',
    monthlyPrice: 165000,
    yearlyPrice: 1188000,
    category: 'main',
  },
  {
    id: 'standard',
    name: '스탠다드플랜',
    monthlyPrice: 517000,
    yearlyPrice: 3828000,
    category: 'main',
  },
  {
    id: 'manager',
    name: '다짐매니저 (회원관리프로그램)',
    monthlyPrice: 53900,
    yearlyPrice: 646800,
    partnerPrice: 20900,
    nonPartnerPrice: 53900,
    category: 'addon',
  },
  {
    id: 'data-migration',
    name: '데이터이관 (필요시 선택)',
    monthlyPrice: 0,
    yearlyPrice: 770000,
    partnerPrice: 330000,
    nonPartnerPrice: 770000,
    category: 'addon',
  },
  {
    id: 'multi-branch',
    name: '다지점 관리',
    monthlyPrice: 33000,
    yearlyPrice: 396000,
    category: 'addon',
  },
  {
    id: 'unlimited-contract',
    name: '전자계약서 무제한',
    monthlyPrice: 22000,
    yearlyPrice: 264000,
    category: 'addon',
  },
  {
    id: 'kiosk-access',
    name: '키오스크와 출입제어',
    monthlyPrice: 32000,
    yearlyPrice: 264000,
    category: 'addon',
  },
];

// 발송 방법
export const SEND_METHODS = [
  { value: 'email', label: '이메일' },
  { value: 'sms', label: '문자메시지' },
  { value: 'kakao', label: '카카오톡' },
] as const;

// 결제 방법
export const PAYMENT_METHODS = [
  { value: 'card', label: '신용카드' },
  { value: 'bank', label: '계좌이체' },
  { value: 'virtual', label: '가상계좌' },
] as const;

// 계약서 상태
export const CONTRACT_STATUS = {
  DRAFT: 'draft',
  SENT: 'sent',
  SIGNED: 'signed',
  PAID: 'paid',
  COMPLETED: 'completed',
} as const;

// 계약서 상태 라벨
export const CONTRACT_STATUS_LABELS = {
  [CONTRACT_STATUS.DRAFT]: '작성중',
  [CONTRACT_STATUS.SENT]: '발송됨',
  [CONTRACT_STATUS.SIGNED]: '서명완료',
  [CONTRACT_STATUS.PAID]: '결제완료',
  [CONTRACT_STATUS.COMPLETED]: '완료',
} as const;

// 파일 업로드 설정
export const FILE_UPLOAD_CONFIG = {
  maxSize: 10 * 1024 * 1024, // 10MB
  acceptedTypes: {
    image: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
    document: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
  },
  maxFiles: 1,
} as const;

// 폼 단계
export const FORM_STEPS = [
  { id: 1, name: '사업자 정보', path: ROUTES.BUSINESS_INFO },
  { id: 2, name: '정산 계좌', path: ROUTES.ACCOUNT_INFO },
  { id: 3, name: '대표자 정보', path: ROUTES.REPRESENTATIVE_INFO },
  { id: 4, name: '플랜 선택', path: ROUTES.PLAN_SELECTION },
  { id: 5, name: '결제', path: ROUTES.PAYMENT },
] as const;