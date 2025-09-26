import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { FileUpload } from '../components/FileUpload';
import { StepNavigation } from '../components/StepNavigation';
import { BusinessInfo } from '../types';
import { ROUTES } from '../utils/constants';

// Daum Postcode API 타입 선언
declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          roadAddress: string;
          jibunAddress: string;
          zonecode: string;
        }) => void;
      }) => {
        open: () => void;
      };
    };
  }
}

export function BusinessInfoPage() {
  const navigate = useNavigate();
  const { state, setBusinessInfo, setCurrentStep } = useContract();
  
  const [businessRegistrationCert, setBusinessRegistrationCert] = useState<File | undefined>();
  const [sportsLicenseCert, setSportsLicenseCert] = useState<File | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm<BusinessInfo>({
    defaultValues: state.businessInfo,
    mode: 'onChange',
  });

  const onSubmit = (data: BusinessInfo) => {
    const businessData: BusinessInfo = {
      ...data,
      businessRegistrationCert,
      sportsLicenseCert,
    };

    setBusinessInfo(businessData);
    setCurrentStep(2);
    navigate(ROUTES.ACCOUNT_INFO);
  };

  const handleStepClick = (step: number) => {
    const currentData = watch();
    setBusinessInfo(currentData);
    setCurrentStep(step);

    switch (step) {
      case 2:
        navigate(ROUTES.ACCOUNT_INFO);
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

  return (
    <div className="contract-form-page">
      <div className="form-container">
        {/* 단계 네비게이션 */}
        <StepNavigation onStepClick={handleStepClick} />

        {/* 폼 카드 */}
        <div className="form-card">
          <h1 className="form-title">사업자 정보 등록</h1>
          <p className="form-subtitle">
            계약에 필요한 사업자 정보를 입력해주세요
          </p>

          {/* 폼 */}
          <form onSubmit={handleSubmit(onSubmit)} className="business-form">
          <div className="form-section">
            <h2 className="section-title">기본 정보</h2>
            
            <div className="form-fields-vertical">
              {/* 사업자명 */}
              <div className="form-group">
                <label htmlFor="businessName" className="form-label">
                  사업자명 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="businessName"
                  {...register('businessName', {
                    required: '사업자명을 입력해주세요',
                    minLength: {
                      value: 2,
                      message: '사업자명은 2글자 이상이어야 합니다'
                    }
                  })}
                  className={`input-field ${errors.businessName ? 'error' : ''}`}
                  placeholder="사업자명을 입력하세요"
                />
                {errors.businessName && (
                  <span className="error-message">{errors.businessName.message}</span>
                )}
              </div>

              {/* 사업자등록번호 */}
              <div className="form-group">
                <label htmlFor="businessNumber" className="form-label">
                  사업자등록번호 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="businessNumber"
                  {...register('businessNumber', {
                    required: '사업자등록번호를 입력해주세요',
                    pattern: {
                      value: /^\d{3}-\d{2}-\d{5}$|^\d{10}$/,
                      message: '올바른 사업자등록번호 형식이 아닙니다 (000-00-00000)'
                    }
                  })}
                  className={`input-field ${errors.businessNumber ? 'error' : ''}`}
                  placeholder="000-00-00000"
                />
                {errors.businessNumber && (
                  <span className="error-message">{errors.businessNumber.message}</span>
                )}
              </div>

              {/* 대표자명 */}
              <div className="form-group">
                <label htmlFor="representativeName" className="form-label">
                  대표자명 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="representativeName"
                  {...register('representativeName', {
                    required: '대표자명을 입력해주세요',
                    minLength: {
                      value: 2,
                      message: '대표자명은 2글자 이상이어야 합니다'
                    }
                  })}
                  className={`input-field ${errors.representativeName ? 'error' : ''}`}
                  placeholder="대표자명을 입력하세요"
                />
                {errors.representativeName && (
                  <span className="error-message">{errors.representativeName.message}</span>
                )}
              </div>

              {/* 업태 */}
              <div className="form-group">
                <label htmlFor="businessType" className="form-label">
                  업태 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="businessType"
                  {...register('businessType', {
                    required: '업태를 입력해주세요'
                  })}
                  className={`input-field ${errors.businessType ? 'error' : ''}`}
                  placeholder="예: 체육시설업, 서비스업, 도매업 등"
                />
                {errors.businessType && (
                  <span className="error-message">{errors.businessType.message}</span>
                )}
              </div>

              {/* 종목 */}
              <div className="form-group">
                <label htmlFor="businessCategory" className="form-label">
                  종목 <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="businessCategory"
                  {...register('businessCategory', {
                    required: '종목을 입력해주세요'
                  })}
                  className={`input-field ${errors.businessCategory ? 'error' : ''}`}
                  placeholder="예: 체육시설 운영업"
                />
                {errors.businessCategory && (
                  <span className="error-message">{errors.businessCategory.message}</span>
                )}
              </div>

              {/* 사업자 주소 */}
              <div className="form-group">
                <label htmlFor="businessAddress" className="form-label">
                  사업자 주소 <span className="required">*</span>
                </label>
                <div className="address-input-container">
                  <input
                    type="text"
                    id="businessAddress"
                    {...register('businessAddress', {
                      required: '사업자 주소를 입력해주세요'
                    })}
                    className={`input-field ${errors.businessAddress ? 'error' : ''}`}
                    placeholder="주소 검색 버튼을 클릭하세요"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => {
                      // Daum 우편번호 서비스 팝업 호출
                      new window.daum.Postcode({
                        oncomplete: function(data) {
                          // 선택된 주소 정보를 React Hook Form에 설정
                          const fullAddress = data.roadAddress || data.jibunAddress;
                          setValue('businessAddress', fullAddress, { shouldValidate: true });
                        }
                      }).open();
                    }}
                    className="address-search-btn"
                  >
                    🔍 주소 검색
                  </button>
                </div>
                {errors.businessAddress && (
                  <span className="error-message">{errors.businessAddress.message}</span>
                )}
              </div>

              {/* 상세주소 */}
              <div className="form-group">
                <label htmlFor="businessDetailAddress" className="form-label">
                  상세주소
                </label>
                <input
                  type="text"
                  id="businessDetailAddress"
                  {...register('businessDetailAddress')}
                  className="input-field"
                  placeholder="건물명, 동호수 등 상세주소를 입력하세요"
                />
              </div>
            </div>
          </div>

          {/* 첨부 서류 */}
          <div className="form-section">
            <h2 className="section-title">첨부 서류</h2>
            
            <div className="form-fields-vertical">
              {/* 사업자등록증 */}
              <div className="form-group">
                <FileUpload
                  label="사업자등록증"
                  onFileSelect={setBusinessRegistrationCert}
                  currentFile={businessRegistrationCert}
                  required
                />
              </div>

              {/* 체육시설업 신고증 */}
              <div className="form-group">
                <FileUpload
                  label="체육시설업 신고증"
                  onFileSelect={setSportsLicenseCert}
                  currentFile={sportsLicenseCert}
                />
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="btn-secondary"
            >
              이전
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
