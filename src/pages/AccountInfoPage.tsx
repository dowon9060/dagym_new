import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { StepNavigation } from '../components/StepNavigation';
import { AccountInfo } from '../types';
import { ROUTES, BANKS } from '../utils/constants';

export function AccountInfoPage() {
  const navigate = useNavigate();
  const { state, setAccountInfo, setCurrentStep } = useContract();
  
  const [paymentType, setPaymentType] = useState<'card' | 'account'>('card');

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<AccountInfo>({
    defaultValues: state.accountInfo,
    mode: 'onChange',
  });

  const onSubmit = (data: AccountInfo) => {
    const accountData: AccountInfo = {
      ...data,
      paymentType,
    };

    setAccountInfo(accountData);
    setCurrentStep(3);
    navigate(ROUTES.REPRESENTATIVE_INFO);
  };

  const handleStepClick = (step: number) => {
    const currentData = watch();
    setAccountInfo(currentData);
    setCurrentStep(step);

    switch (step) {
      case 1:
        navigate(ROUTES.BUSINESS_INFO);
        break;
      case 3:
        navigate(ROUTES.REPRESENTATIVE_INFO);
        break;
      case 4:
        navigate(ROUTES.PLAN_SELECTION);
        break;
      default:
        break;
    }
  };

  const handlePrevious = () => {
    const currentData = watch();
    setAccountInfo(currentData);
    setCurrentStep(1);
    navigate(ROUTES.BUSINESS_INFO);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };


  return (
    <div className="contract-form-page">
      <div className="form-container">
        <StepNavigation onStepClick={handleStepClick} />
        <div className="form-card">
          <h1 className="form-title">결제정보</h1>
          <p className="form-subtitle">
            서비스 이용료 결제를 위한 정보를 입력해주세요
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="payment-form">
            
            {/* 결제 방법 선택 */}
            <div className="form-section">
              <h2 className="section-title">결제 방법</h2>
              <div className="payment-type-selection">
                <div 
                  className={`payment-type-card ${paymentType === 'card' ? 'selected' : ''}`}
                  onClick={() => setPaymentType('card')}
                >
                  <div className="payment-type-icon">💳</div>
                  <div className="payment-type-label">신용카드</div>
                </div>
                <div 
                  className={`payment-type-card ${paymentType === 'account' ? 'selected' : ''}`}
                  onClick={() => setPaymentType('account')}
                >
                  <div className="payment-type-icon">🏦</div>
                  <div className="payment-type-label">계좌이체</div>
                </div>
              </div>
            </div>

            {/* 카드 결제 정보 */}
            {paymentType === 'card' && (
              <div className="form-section">
                <h2 className="section-title">카드 정보</h2>
                <div className="form-fields-vertical">
                  
                  {/* 카드번호 */}
                  <div className="form-group">
                    <label htmlFor="cardNumber" className="form-label">
                      카드번호 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      {...register('cardNumber', {
                        required: paymentType === 'card' ? '카드번호를 입력해주세요' : false,
                        pattern: {
                          value: /^[0-9\s]{13,19}$/,
                          message: '올바른 카드번호를 입력해주세요'
                        }
                      })}
                      className={`input-field ${errors.cardNumber ? 'error' : ''}`}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value);
                        e.target.value = formatted;
                      }}
                    />
                    {errors.cardNumber && (
                      <span className="error-message">{errors.cardNumber.message as string}</span>
                    )}
                  </div>

                  {/* 유효기간 */}
                  <div className="form-group">
                    <label htmlFor="expiryDate" className="form-label">
                      유효기간 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      {...register('expiryDate', {
                        required: paymentType === 'card' ? '유효기간을 입력해주세요' : false,
                        pattern: {
                          value: /^(0[1-9]|1[0-2])\/([0-9]{2})$/,
                          message: 'MM/YY 형식으로 입력해주세요'
                        }
                      })}
                      className={`input-field ${errors.expiryDate ? 'error' : ''}`}
                      placeholder="MM/YY"
                      maxLength={5}
                      onChange={(e) => {
                        const formatted = formatExpiryDate(e.target.value);
                        e.target.value = formatted;
                      }}
                    />
                    {errors.expiryDate && (
                      <span className="error-message">{errors.expiryDate.message as string}</span>
                    )}
                  </div>

                  {/* 비밀번호 앞 2자리 */}
                  <div className="form-group">
                    <label htmlFor="cardPassword" className="form-label">
                      비밀번호 앞 2자리 <span className="required">*</span>
                    </label>
                    <input
                      type="password"
                      id="cardPassword"
                      {...register('cardPassword', {
                        required: paymentType === 'card' ? '비밀번호 앞 2자리를 입력해주세요' : false,
                        pattern: {
                          value: /^[0-9]{2}$/,
                          message: '숫자 2자리를 입력해주세요'
                        }
                      })}
                      className={`input-field ${errors.cardPassword ? 'error' : ''}`}
                      placeholder="**"
                      maxLength={2}
                    />
                    {errors.cardPassword && (
                      <span className="error-message">{errors.cardPassword.message as string}</span>
                    )}
                  </div>

                  {/* 카드주 성함 */}
                  <div className="form-group">
                    <label htmlFor="cardHolderName" className="form-label">
                      카드주 성함 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="cardHolderName"
                      {...register('cardHolderName', {
                        required: paymentType === 'card' ? '카드주 성함을 입력해주세요' : false,
                        minLength: {
                          value: 2,
                          message: '성함은 2글자 이상이어야 합니다'
                        }
                      })}
                      className={`input-field ${errors.cardHolderName ? 'error' : ''}`}
                      placeholder="카드에 표시된 성함을 입력하세요"
                    />
                    {errors.cardHolderName && (
                      <span className="error-message">{errors.cardHolderName.message as string}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 계좌 결제 정보 */}
            {paymentType === 'account' && (
              <div className="form-section">
                <h2 className="section-title">계좌 정보</h2>
                <div className="form-fields-vertical">
                  
                  {/* 은행명 */}
                  <div className="form-group">
                    <label htmlFor="bankName" className="form-label">
                      은행명 <span className="required">*</span>
                    </label>
                    <select
                      id="bankName"
                      {...register('bankName', {
                        required: paymentType === 'account' ? '은행을 선택해주세요' : false
                      })}
                      className={`select-field ${errors.bankName ? 'error' : ''}`}
                    >
                      <option value="">은행을 선택하세요</option>
                      {BANKS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                    {errors.bankName && (
                      <span className="error-message">{errors.bankName.message as string}</span>
                    )}
                  </div>

                  {/* 예금주 */}
                  <div className="form-group">
                    <label htmlFor="accountHolder" className="form-label">
                      예금주 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="accountHolder"
                      {...register('accountHolder', {
                        required: paymentType === 'account' ? '예금주명을 입력해주세요' : false,
                        minLength: {
                          value: 2,
                          message: '예금주명은 2글자 이상이어야 합니다'
                        }
                      })}
                      className={`input-field ${errors.accountHolder ? 'error' : ''}`}
                      placeholder="예금주명을 입력하세요"
                    />
                    {errors.accountHolder && (
                      <span className="error-message">{errors.accountHolder.message as string}</span>
                    )}
                  </div>

                  {/* 계좌번호 */}
                  <div className="form-group">
                    <label htmlFor="accountNumber" className="form-label">
                      계좌번호 <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="accountNumber"
                      {...register('accountNumber', {
                        required: paymentType === 'account' ? '계좌번호를 입력해주세요' : false,
                        pattern: {
                          value: /^\d+$/,
                          message: '숫자만 입력 가능합니다'
                        },
                        minLength: {
                          value: 10,
                          message: '계좌번호는 최소 10자리 이상이어야 합니다'
                        }
                      })}
                      className={`input-field ${errors.accountNumber ? 'error' : ''}`}
                      placeholder="계좌번호를 입력하세요 (숫자만)"
                    />
                    {errors.accountNumber && (
                      <span className="error-message">{errors.accountNumber.message as string}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 결제 안내사항 */}
            <div className="info-section">
              <div className="info-card">
                <div className="info-icon">📅</div>
                <div className="info-content">
                  <h3>결제 안내사항</h3>
                  <ul>
                    <li><strong>정기결제일:</strong> 매월 25일</li>
                    <li><strong>서비스 기간:</strong> 익월 1일부터 말일까지</li>
                    <li>결제일이 주말 또는 공휴일인 경우 다음 영업일에 결제됩니다</li>
                    <li>결제 실패 시 3일간 재시도 후 서비스가 일시 중단될 수 있습니다</li>
                    <li>결제 정보는 안전하게 암호화되어 저장됩니다</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="form-actions">
              <button
                type="button"
                onClick={handlePrevious}
                className="btn-secondary"
              >
                이전 단계
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={!isValid}
              >
                다음 단계
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
