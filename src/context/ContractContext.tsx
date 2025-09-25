import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { FormState, BusinessInfo, AccountInfo, RepresentativeInfo, SelectedPlan } from '../types';

// 액션 타입 정의
type ContractAction =
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'SET_BUSINESS_INFO'; payload: Partial<BusinessInfo> }
  | { type: 'SET_ACCOUNT_INFO'; payload: Partial<AccountInfo> }
  | { type: 'SET_REPRESENTATIVE_INFO'; payload: Partial<RepresentativeInfo> }
  | { type: 'SET_SELECTED_PLANS'; payload: SelectedPlan[] }
  | { type: 'ADD_SELECTED_PLAN'; payload: SelectedPlan }
  | { type: 'REMOVE_SELECTED_PLAN'; payload: string }
  | { type: 'RESET_FORM' }
  | { type: 'LOAD_DRAFT'; payload: FormState };

// 초기 상태
const initialState: FormState = {
  currentStep: 1,
  businessInfo: {},
  accountInfo: {},
  representativeInfo: {},
  selectedPlans: [],
};

// 리듀서 함수
function contractReducer(state: FormState, action: ContractAction): FormState {
  switch (action.type) {
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'SET_BUSINESS_INFO':
      return {
        ...state,
        businessInfo: { ...state.businessInfo, ...action.payload },
      };
    
    case 'SET_ACCOUNT_INFO':
      return {
        ...state,
        accountInfo: { ...state.accountInfo, ...action.payload },
      };
    
    case 'SET_REPRESENTATIVE_INFO':
      return {
        ...state,
        representativeInfo: { ...state.representativeInfo, ...action.payload },
      };
    
    case 'SET_SELECTED_PLANS':
      return { ...state, selectedPlans: action.payload };
    
    case 'ADD_SELECTED_PLAN':
      return {
        ...state,
        selectedPlans: [...state.selectedPlans, action.payload],
      };
    
    case 'REMOVE_SELECTED_PLAN':
      return {
        ...state,
        selectedPlans: state.selectedPlans.filter(plan => plan.planId !== action.payload),
      };
    
    case 'RESET_FORM':
      return initialState;
    
    case 'LOAD_DRAFT':
      return action.payload;
    
    default:
      return state;
  }
}

// 컨텍스트 타입 정의
interface ContractContextType {
  state: FormState;
  dispatch: React.Dispatch<ContractAction>;
  
  // 헬퍼 함수들
  setCurrentStep: (step: number) => void;
  setBusinessInfo: (info: Partial<BusinessInfo>) => void;
  setAccountInfo: (info: Partial<AccountInfo>) => void;
  setRepresentativeInfo: (info: Partial<RepresentativeInfo>) => void;
  setSelectedPlans: (plans: SelectedPlan[]) => void;
  addSelectedPlan: (plan: SelectedPlan) => void;
  removeSelectedPlan: (planId: string) => void;
  resetForm: () => void;
  getTotalAmount: () => number;
  isStepCompleted: (step: number) => boolean;
  canProceedToStep: (step: number) => boolean;
}

// 컨텍스트 생성
const ContractContext = createContext<ContractContextType | undefined>(undefined);

// 프로바이더 컴포넌트
interface ContractProviderProps {
  children: ReactNode;
}

export function ContractProvider({ children }: ContractProviderProps) {
  const [state, dispatch] = useReducer(contractReducer, initialState);

  // 헬퍼 함수들
  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  };

  const setBusinessInfo = (info: Partial<BusinessInfo>) => {
    dispatch({ type: 'SET_BUSINESS_INFO', payload: info });
  };

  const setAccountInfo = (info: Partial<AccountInfo>) => {
    dispatch({ type: 'SET_ACCOUNT_INFO', payload: info });
  };

  const setRepresentativeInfo = (info: Partial<RepresentativeInfo>) => {
    dispatch({ type: 'SET_REPRESENTATIVE_INFO', payload: info });
  };

  const setSelectedPlans = (plans: SelectedPlan[]) => {
    dispatch({ type: 'SET_SELECTED_PLANS', payload: plans });
  };

  const addSelectedPlan = (plan: SelectedPlan) => {
    dispatch({ type: 'ADD_SELECTED_PLAN', payload: plan });
  };

  const removeSelectedPlan = (planId: string) => {
    dispatch({ type: 'REMOVE_SELECTED_PLAN', payload: planId });
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM' });
  };

  // 총 금액 계산
  const getTotalAmount = () => {
    return state.selectedPlans.reduce((total, plan) => total + plan.price, 0);
  };

  // 단계 완료 여부 확인
  const isStepCompleted = (step: number): boolean => {
    switch (step) {
      case 1: // 사업자 정보
        const { businessName, businessNumber, representativeName, businessAddress } = state.businessInfo;
        return !!(businessName && businessNumber && representativeName && businessAddress);
      
      case 2: // 정산 계좌
        const { bankName, accountNumber, accountHolder } = state.accountInfo;
        return !!(bankName && accountNumber && accountHolder);
      
      case 3: // 대표자 정보
        const { name, phoneNumber, address } = state.representativeInfo;
        return !!(name && phoneNumber && address);
      
      case 4: // 플랜 선택
        return state.selectedPlans.length > 0;
      
      default:
        return false;
    }
  };

  // 다음 단계로 진행 가능 여부
  const canProceedToStep = (step: number): boolean => {
    if (step <= 1) return true;
    
    for (let i = 1; i < step; i++) {
      if (!isStepCompleted(i)) return false;
    }
    return true;
  };

  const value: ContractContextType = {
    state,
    dispatch,
    setCurrentStep,
    setBusinessInfo,
    setAccountInfo,
    setRepresentativeInfo,
    setSelectedPlans,
    addSelectedPlan,
    removeSelectedPlan,
    resetForm,
    getTotalAmount,
    isStepCompleted,
    canProceedToStep,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
}

// 커스텀 훅
export function useContract() {
  const context = useContext(ContractContext);
  if (context === undefined) {
    throw new Error('useContract must be used within a ContractProvider');
  }
  return context;
}
