// 사업자 정보 타입
export interface BusinessInfo {
  businessName: string;
  businessNumber: string;
  representativeName: string;
  businessAddress: string;
  businessType: string;
  businessCategory: string;
  businessRegistrationCert?: File | string;
  sportsLicenseCert?: File | string;
}

// 정산 계좌 정보 타입
export interface AccountInfo {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  bankbookPhoto?: File | string;
}

// 대표자 정보 타입
export interface RepresentativeInfo {
  name: string;
  phoneNumber: string;
  address: string;
  agreeToPersonalInfo?: boolean;
}

// 플랜 타입
export interface Plan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  isRequired?: boolean;
  category: 'main' | 'addon' | 'partner';
  partnerPrice?: number;
  nonPartnerPrice?: number;
}

// 선택된 플랜 타입
export interface SelectedPlan {
  id?: string;
  planId?: string;
  planName: string;
  billingType: 'monthly' | 'yearly';
  price: number;
  category?: 'core' | 'addon';
  isPartner?: boolean;
}

// 계약서 정보 타입
export interface ContractInfo {
  id?: string;
  businessInfo: BusinessInfo;
  accountInfo: AccountInfo;
  representativeInfo: RepresentativeInfo;
  selectedPlans: SelectedPlan[];
  totalAmount: number;
  status: 'draft' | 'sent' | 'signed' | 'paid' | 'completed';
  clientContact?: {
    name: string;
    email?: string;
    phone?: string;
  };
  sendMethod?: 'email' | 'sms' | 'kakao';
  createdAt?: Date | string;
  updatedAt?: Date | string;
  signedAt?: Date;
  paidAt?: Date;
  completedAt?: Date;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// 사용자 인증 타입
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}

// 결제 정보 타입
export interface PaymentInfo {
  contractId: string;
  amount: number;
  method: 'card' | 'bank' | 'virtual';
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentKey?: string;
  orderId?: string;
  paidAt?: Date;
}

// 폼 상태 타입
export interface FormState {
  currentStep: number;
  businessInfo: Partial<BusinessInfo>;
  accountInfo: Partial<AccountInfo>;
  representativeInfo: Partial<RepresentativeInfo>;
  selectedPlans: SelectedPlan[];
}

// 인증 컨텍스트 타입
export interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user?: User;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}