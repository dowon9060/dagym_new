import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { FileUpload } from '../components/FileUpload';
import { StepNavigation } from '../components/StepNavigation';
import { BusinessInfo } from '../types';
import { ROUTES, BUSINESS_TYPES } from '../utils/constants';

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
            
            <div className="form-grid">
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
                  className={`form-input ${errors.businessName ? 'error' : ''}`}
                  placeholder="사업자명을 입력하세요"
                />
                {errors.businessName && (
                  <span className="error-text">{errors.businessName.message}</span>
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
                  className={`form-input ${errors.businessNumber ? 'error' : ''}`}
                  placeholder="000-00-00000"
                />
                {errors.businessNumber && (
                  <span className="error-text">{errors.businessNumber.message}</span>
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
                  className={`form-input ${errors.representativeName ? 'error' : ''}`}
                  placeholder="대표자명을 입력하세요"
                />
                {errors.representativeName && (
                  <span className="error-text">{errors.representativeName.message}</span>
                )}
              </div>

              {/* 업태 */}
              <div className="form-group">
                <label htmlFor="businessType" className="form-label">
                  업태 <span className="required">*</span>
                </label>
                <select
                  id="businessType"
                  {...register('businessType', {
                    required: '업태를 선택해주세요'
                  })}
                  className={`form-select ${errors.businessType ? 'error' : ''}`}
                >
                  <option value="">업태를 선택하세요</option>
                  {BUSINESS_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.businessType && (
                  <span className="error-text">{errors.businessType.message}</span>
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
                  className={`form-input ${errors.businessCategory ? 'error' : ''}`}
                  placeholder="예: 체육시설 운영업"
                />
                {errors.businessCategory && (
                  <span className="error-text">{errors.businessCategory.message}</span>
                )}
              </div>
            </div>

            {/* 사업자 주소 */}
            <div className="form-group full-width">
              <label htmlFor="businessAddress" className="form-label">
                사업자 주소 <span className="required">*</span>
              </label>
              <textarea
                id="businessAddress"
                {...register('businessAddress', {
                  required: '사업자 주소를 입력해주세요'
                })}
                className={`form-textarea ${errors.businessAddress ? 'error' : ''}`}
                placeholder="사업자 주소를 입력하세요"
                rows={3}
              />
              {errors.businessAddress && (
                <span className="error-text">{errors.businessAddress.message}</span>
              )}
            </div>
          </div>

          {/* 첨부 서류 */}
          <div className="form-section">
            <h2 className="section-title">첨부 서류</h2>
            
            <div className="upload-grid">
              {/* 사업자등록증 */}
              <div className="upload-group">
                <FileUpload
                  label="사업자등록증"
                  onFileSelect={setBusinessRegistrationCert}
                  currentFile={businessRegistrationCert}
                  required
                />
              </div>

              {/* 체육시설업 신고증 */}
              <div className="upload-group">
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
