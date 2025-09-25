import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useContract } from '../context/ContractContext';
import { StepNavigation } from '../components/StepNavigation';
import { ROUTES, SEND_METHODS } from '../utils/constants';
// UUID 대체 함수
const generateContractId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

interface PaymentFormData {
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  sendMethod: 'email' | 'sms' | 'kakao';
  agreeTerms: boolean;
}

export function PaymentPage() {
  const navigate = useNavigate();
  const { state, setCurrentStep } = useContract();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'contact' | 'confirm' | 'complete'>('contact');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [contractId, setContractId] = useState<string>('');
  const [contractLink, setContractLink] = useState<string>('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<PaymentFormData>({
    defaultValues: {
      clientName: state.representativeInfo.name,
      clientPhone: state.representativeInfo.phoneNumber,
      clientEmail: '',
      sendMethod: 'email',
      agreeTerms: false,
    },
    mode: 'onChange',
  });

  const selectedSendMethod = watch('sendMethod');

  const getTotalAmount = () => {
    return state.selectedPlans.reduce((total, plan) => total + plan.price, 0);
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString() + '원';
  };

  const onSubmit = async (data: PaymentFormData) => {
    setIsSubmitting(true);
    
    try {
      // 계약서 고유 ID 생성
      const newContractId = generateContractId();
      const newContractLink = `${window.location.origin}/contract/${newContractId}`;
      
      setContractId(newContractId);
      setContractLink(newContractLink);

      // TODO: 실제 계약서 저장 API 호출
      console.log('계약서 생성:', {
        contractId: newContractId,
        contractLink: newContractLink,
        businessInfo: state.businessInfo,
        accountInfo: state.accountInfo,
        representativeInfo: state.representativeInfo,
        selectedPlans: state.selectedPlans,
        clientContact: {
          name: data.clientName,
          phone: data.clientPhone,
          email: data.clientEmail,
        },
        sendMethod: data.sendMethod,
        totalAmount: getTotalAmount(),
      });

      // 임시 딜레이 (API 호출 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 1500));

      setPaymentStep('confirm');
    } catch (error) {
      console.error('계약서 생성 실패:', error);
      alert('계약서 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendContract = async () => {
    setIsSubmitting(true);
    
    try {
      // TODO: 실제 발송 API 호출
      console.log('계약서 발송 중...');
      
      // 임시 딜레이 (발송 시뮬레이션)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPaymentStep('complete');
    } catch (error) {
      console.error('계약서 발송 실패:', error);
      alert('계약서 발송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStepClick = (step: number) => {
    setCurrentStep(step);
    switch (step) {
      case 1: navigate(ROUTES.BUSINESS_INFO); break;
      case 2: navigate(ROUTES.ACCOUNT_INFO); break;
      case 3: navigate(ROUTES.REPRESENTATIVE_INFO); break;
      case 4: navigate(ROUTES.PLAN_SELECTION); break;
      default: break;
    }
  };

  const handleGoToList = () => {
    navigate(ROUTES.CONTRACT_LIST);
  };

  const handleNewContract = () => {
    navigate(ROUTES.BUSINESS_INFO);
  };

  // 완료 화면
  if (paymentStep === 'complete') {
    return (
      <div className="page-container">
        <div className="payment-complete">
          <div className="complete-icon">✅</div>
          <h2 className="complete-title">계약서 발송 완료!</h2>
          <p className="complete-message">
            계약서가 성공적으로 발송되었습니다.<br />
            고객이 계약서를 확인하고 서명하면 자동으로 결제가 진행됩니다.
          </p>
          
          <div className="complete-actions">
            <button
              onClick={handleGoToList}
              className="btn-primary"
            >
              계약서 목록 보기
            </button>
            <button
              onClick={handleNewContract}
              className="btn-secondary"
            >
              새 계약서 작성
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 확인 화면
  if (paymentStep === 'confirm') {
    const formData = watch();
    
    return (
      <div className="page-container">
        <div className="payment-confirm">
          <h2 className="confirm-title">계약서 발송 확인</h2>
          
          <div className="confirm-details">
            <div className="detail-section">
              <h3>발송 정보</h3>
              <div className="detail-item">
                <span className="label">고객명:</span>
                <span className="value">{formData.clientName}</span>
              </div>
              <div className="detail-item">
                <span className="label">연락처:</span>
                <span className="value">{formData.clientPhone}</span>
              </div>
              {formData.clientEmail && (
                <div className="detail-item">
                  <span className="label">이메일:</span>
                  <span className="value">{formData.clientEmail}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="label">발송방법:</span>
                <span className="value">
                  {SEND_METHODS.find(method => method.value === formData.sendMethod)?.label}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h3>계약 내용</h3>
              <div className="detail-item">
                <span className="label">사업자명:</span>
                <span className="value">{state.businessInfo.businessName}</span>
              </div>
              <div className="detail-item">
                <span className="label">선택 플랜:</span>
                <div className="plans-list">
                  {state.selectedPlans.map((plan, index) => (
                    <div key={index} className="plan-item">
                      {plan.planName} ({plan.billingType === 'monthly' ? '월간' : '연간'}): {formatAmount(plan.price)}
                    </div>
                  ))}
                </div>
              </div>
              <div className="detail-item total">
                <span className="label">총 계약금액:</span>
                <span className="value">{formatAmount(getTotalAmount())}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>계약서 링크</h3>
              <div className="contract-link-section">
                <div className="contract-link-display">
                  <input 
                    type="text" 
                    value={contractLink} 
                    readOnly 
                    className="contract-link-input"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(contractLink);
                      alert('계약서 링크가 복사되었습니다!');
                    }}
                    className="copy-link-btn"
                  >
                    복사
                  </button>
                </div>
                <p className="link-description">
                  위 링크를 고객에게 발송하여 계약서 동의 및 서명을 받으세요.
                </p>
              </div>
            </div>
          </div>

          <div className="confirm-actions">
            <button
              onClick={() => setPaymentStep('contact')}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              이전
            </button>
            <button
              onClick={handleSendContract}
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? '발송 중...' : '계약서 발송하기'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 연락처 입력 화면
  return (
    <div className="contract-form-page">
      <div className="form-container">
        <StepNavigation onStepClick={handleStepClick} />
        
        <div className="form-card">
          <h1 className="form-title">계약서 발송</h1>
          <p className="form-subtitle">
            작성된 계약서를 고객에게 발송합니다
          </p>
        
        <div className="payment-summary">
          <h3>계약 요약</h3>
          <div className="summary-content">
            <div className="business-name">{state.businessInfo.businessName}</div>
            <div className="plans-summary">
              {state.selectedPlans.map((plan, index) => (
                <div key={index} className="plan-summary">
                  {plan.planName} ({plan.billingType === 'monthly' ? '월간' : '연간'}): {formatAmount(plan.price)}
                </div>
              ))}
            </div>
            <div className="total-amount">
              총 계약금액: <strong>{formatAmount(getTotalAmount())}</strong>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="payment-form">
          <div className="form-section">
            <h4>고객 연락처 정보</h4>
            
            <div className="form-group">
              <label htmlFor="clientName" className="form-label">
                고객명 <span className="required">*</span>
              </label>
              <input
                type="text"
                id="clientName"
                className="input-field"
                {...register('clientName', { 
                  required: '고객명은 필수입니다.' 
                })}
              />
              {errors.clientName && (
                <p className="error-message">{errors.clientName.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="clientPhone" className="form-label">
                휴대폰 번호 <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="clientPhone"
                className="input-field"
                placeholder="010-0000-0000"
                {...register('clientPhone', {
                  required: '휴대폰 번호는 필수입니다.',
                  pattern: {
                    value: /^010-\d{4}-\d{4}$/,
                    message: '올바른 휴대폰 번호 형식이 아닙니다. (010-0000-0000)',
                  },
                })}
              />
              {errors.clientPhone && (
                <p className="error-message">{errors.clientPhone.message}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="sendMethod" className="form-label">
                발송 방법 <span className="required">*</span>
              </label>
              <select
                id="sendMethod"
                className="select-field"
                {...register('sendMethod', { required: '발송 방법을 선택해주세요.' })}
              >
                {SEND_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors.sendMethod && (
                <p className="error-message">{errors.sendMethod.message}</p>
              )}
            </div>

            {(selectedSendMethod === 'email' || selectedSendMethod === 'kakao') && (
              <div className="form-group">
                <label htmlFor="clientEmail" className="form-label">
                  이메일 주소 {selectedSendMethod === 'email' && <span className="required">*</span>}
                </label>
                <input
                  type="email"
                  id="clientEmail"
                  className="input-field"
                  placeholder="example@example.com"
                  {...register('clientEmail', {
                    required: selectedSendMethod === 'email' ? '이메일 주소는 필수입니다.' : false,
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: '올바른 이메일 형식이 아닙니다.',
                    },
                  })}
                />
                {errors.clientEmail && (
                  <p className="error-message">{errors.clientEmail.message}</p>
                )}
              </div>
            )}
          </div>

          <div className="form-section">
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="agreeTerms"
                {...register('agreeTerms', { 
                  required: '이용약관에 동의해주세요.' 
                })}
              />
              <label htmlFor="agreeTerms">
                <strong>개인정보 처리방침 및 이용약관</strong>에 동의합니다.
              </label>
              {errors.agreeTerms && (
                <p className="error-message">{errors.agreeTerms.message}</p>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => handleStepClick(4)}
              className="prev-button"
              disabled={isSubmitting}
            >
              이전
            </button>
            <button
              type="submit"
              className="next-button"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? '생성 중...' : '계약서 생성'}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
