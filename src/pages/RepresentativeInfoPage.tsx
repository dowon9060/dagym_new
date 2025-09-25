import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { StepNavigation } from '../components/StepNavigation';
import { RepresentativeInfo } from '../types';
import { ROUTES } from '../utils/constants';

interface RepresentativeFormData extends RepresentativeInfo {
  privacyAgreement?: boolean;
}

export function RepresentativeInfoPage() {
  const navigate = useNavigate();
  const { state, setRepresentativeInfo, setCurrentStep } = useContract();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<RepresentativeFormData>({
    defaultValues: state.representativeInfo,
    mode: 'onChange',
  });

  const onSubmit = (data: RepresentativeFormData) => {
    const { privacyAgreement, ...representativeData } = data;
    setRepresentativeInfo(representativeData);
    setCurrentStep(4);
    navigate(ROUTES.PLAN_SELECTION);
  };

  const handleStepClick = (step: number) => {
    const currentData = watch();
    setRepresentativeInfo(currentData);
    setCurrentStep(step);

    switch (step) {
      case 1:
        navigate(ROUTES.BUSINESS_INFO);
        break;
      case 2:
        navigate(ROUTES.ACCOUNT_INFO);
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
    setRepresentativeInfo(currentData);
    setCurrentStep(2);
    navigate(ROUTES.ACCOUNT_INFO);
  };

  // 휴대폰 번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  return (
    <div className="contract-form-page">
      <div className="form-container">
        {/* 단계 네비게이션 */}
        <StepNavigation onStepClick={handleStepClick} />

        {/* 폼 카드 */}
        <div className="form-card">
          <h1 className="form-title">대표자 정보</h1>
          <p className="form-subtitle">
            대표자의 개인정보를 입력해주세요
          </p>

          {/* 폼 */}
          <form onSubmit={handleSubmit(onSubmit)} className="representative-form">
          <div className="form-section">
            <h2 className="section-title">개인 정보</h2>
            
            <div className="form-grid">
              {/* 성함 */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  성함 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', {
                    required: '성함을 입력해주세요',
                    minLength: {
                      value: 2,
                      message: '성함은 2글자 이상이어야 합니다'
                    },
                    pattern: {
                      value: /^[가-힣a-zA-Z\s]+$/,
                      message: '한글 또는 영문만 입력 가능합니다'
                    }
                  })}
                  className={`form-input ${errors.name ? 'error' : ''}`}
                  placeholder="성함을 입력하세요"
                />
                {errors.name && (
                  <span className="error-text">{errors.name.message}</span>
                )}
              </div>

              {/* 휴대폰번호 */}
              <div className="form-group">
                <label htmlFor="phoneNumber" className="form-label">
                  휴대폰번호 <span className="required">*</span>
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  {...register('phoneNumber', {
                    required: '휴대폰번호를 입력해주세요',
                    pattern: {
                      value: /^010-\d{4}-\d{4}$/,
                      message: '올바른 휴대폰번호 형식이 아닙니다 (010-0000-0000)'
                    }
                  })}
                  className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                  placeholder="010-0000-0000"
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    e.target.value = formatted;
                  }}
                />
                {errors.phoneNumber && (
                  <span className="error-text">{errors.phoneNumber.message}</span>
                )}
              </div>
            </div>

            {/* 주소 */}
            <div className="form-group full-width">
              <label htmlFor="address" className="form-label">
                주소 <span className="required">*</span>
              </label>
              <div className="address-input-group">
                <textarea
                  id="address"
                  {...register('address', {
                    required: '주소를 입력해주세요',
                    minLength: {
                      value: 10,
                      message: '주소는 10글자 이상 입력해주세요'
                    }
                  })}
                  className={`form-textarea ${errors.address ? 'error' : ''}`}
                  placeholder="주소를 입력하세요"
                  rows={3}
                />
                <button
                  type="button"
                  className="address-search-btn"
                  onClick={() => {
                    // TODO: 주소 검색 API 연동 (다음 우편번호 서비스 등)
                    alert('주소 검색 기능은 추후 구현 예정입니다');
                  }}
                >
                  주소 검색
                </button>
              </div>
              {errors.address && (
                <span className="error-text">{errors.address.message}</span>
              )}
            </div>
          </div>

          {/* 개인정보 처리 동의 */}
          <div className="form-section">
            <h2 className="section-title">개인정보 처리 동의</h2>
            
            <div className="privacy-agreement">
              <div className="agreement-content">
                <h3>개인정보 수집 및 이용에 대한 동의</h3>
                <div className="agreement-text">
                  <p><strong>1. 수집하는 개인정보의 항목</strong></p>
                  <p>- 필수항목: 성명, 휴대폰번호, 주소</p>
                  
                  <p><strong>2. 개인정보의 수집 및 이용목적</strong></p>
                  <p>- 계약서 작성 및 관리</p>
                  <p>- 서비스 제공 및 고객 상담</p>
                  <p>- 법정 의무 이행</p>
                  
                  <p><strong>3. 개인정보의 보유 및 이용기간</strong></p>
                  <p>- 계약 종료 후 5년간 보관</p>
                  <p>- 관련 법령에 따른 보관기간 준수</p>
                  
                  <p><strong>4. 동의를 거부할 권리</strong></p>
                  <p>귀하께서는 개인정보 수집·이용에 동의하지 않으실 수 있습니다. 
                  다만, 동의하지 않으실 경우 서비스 이용이 제한될 수 있습니다.</p>
                </div>
              </div>
              
              <div className="agreement-checkbox">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    {...register('privacyAgreement', {
                      required: '개인정보 처리 동의는 필수입니다'
                    })}
                  />
                  <span className="checkmark"></span>
                  개인정보 수집 및 이용에 동의합니다 <span className="required">*</span>
                </label>
                {errors.privacyAgreement && (
                  <span className="error-text">{errors.privacyAgreement.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* 연락처 확인 안내 */}
          <div className="info-section">
            <div className="info-card">
              <div className="info-icon">📞</div>
              <div className="info-content">
                <h3>연락처 확인 안내</h3>
                <ul>
                  <li>입력하신 휴대폰번호로 계약서 발송 및 중요 안내사항을 전달합니다</li>
                  <li>번호가 정확하지 않을 경우 서비스 이용에 제한이 있을 수 있습니다</li>
                  <li>휴대폰번호 변경 시 즉시 업데이트해주시기 바랍니다</li>
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
