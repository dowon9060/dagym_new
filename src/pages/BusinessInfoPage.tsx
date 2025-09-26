import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
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
  const [bankBookImage, setBankBookImage] = useState<File | undefined>();

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
      bankBookImage,
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

  // 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setFile: (file: File | undefined) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  };

  // 카메라 촬영 핸들러
  const handleCameraCapture = (setFile: (file: File | undefined) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFile(file);
      }
    };
    input.click();
  };

  // 한국 은행 목록
  const koreanBanks = [
    '은행을 선택하세요',
    'KB국민은행',
    '신한은행',
    '우리은행',
    '하나은행',
    'NH농협은행',
    'IBK기업은행',
    'SC제일은행',
    '한국시티은행',
    '경남은행',
    '광주은행',
    '대구은행',
    '부산은행',
    '전북은행',
    '제주은행',
    '카카오뱅크',
    '케이뱅크',
    '토스뱅크',
    '새마을금고',
    '신협',
    '우체국',
  ];

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
                <label className="form-label">
                  사업자등록증 <span className="required">*</span>
                </label>
                <div className="file-upload-box">
                  <div className="file-upload-content">
                    {businessRegistrationCert ? (
                      <div className="file-preview">
                        <span className="file-name">{businessRegistrationCert.name}</span>
                        <button
                          type="button"
                          onClick={() => setBusinessRegistrationCert(undefined)}
                          className="remove-file-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span>사업자등록증을 첨부해주세요</span>
                      </div>
                    )}
                  </div>
                  <div className="upload-buttons">
                    <input
                      type="file"
                      id="businessRegistrationCert"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, setBusinessRegistrationCert)}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('businessRegistrationCert')?.click()}
                      className="upload-btn"
                    >
                      📎 사진첨부
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCameraCapture(setBusinessRegistrationCert)}
                      className="camera-btn"
                    >
                      📷 사진촬영
                    </button>
                  </div>
                </div>
              </div>

              {/* 체육시설업 신고증 */}
              <div className="form-group">
                <label className="form-label">체육시설업 신고증</label>
                <div className="file-upload-box">
                  <div className="file-upload-content">
                    {sportsLicenseCert ? (
                      <div className="file-preview">
                        <span className="file-name">{sportsLicenseCert.name}</span>
                        <button
                          type="button"
                          onClick={() => setSportsLicenseCert(undefined)}
                          className="remove-file-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span>체육시설업 신고증을 첨부해주세요 (선택사항)</span>
                      </div>
                    )}
                  </div>
                  <div className="upload-buttons">
                    <input
                      type="file"
                      id="sportsLicenseCert"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload(e, setSportsLicenseCert)}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('sportsLicenseCert')?.click()}
                      className="upload-btn"
                    >
                      📎 사진첨부
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCameraCapture(setSportsLicenseCert)}
                      className="camera-btn"
                    >
                      📷 사진촬영
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 정산계좌 등록 */}
          <div className="form-section">
            <h2 className="section-title">정산계좌 등록</h2>
            
            <div className="form-fields-vertical">
              {/* 은행명 */}
              <div className="form-group">
                <label htmlFor="bankName" className="form-label">
                  은행명 <span className="required">*</span>
                </label>
                <select
                  id="bankName"
                  {...register('bankName', {
                    required: '은행을 선택해주세요'
                  })}
                  className={`select-field ${errors.bankName ? 'error' : ''}`}
                >
                  {koreanBanks.map((bank, index) => (
                    <option key={index} value={index === 0 ? '' : bank}>
                      {bank}
                    </option>
                  ))}
                </select>
                {errors.bankName && (
                  <span className="error-message">{errors.bankName.message as string}</span>
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
                    required: '계좌번호를 입력해주세요',
                    pattern: {
                      value: /^\d+$/,
                      message: '숫자만 입력 가능합니다'
                    }
                  })}
                  className={`input-field ${errors.accountNumber ? 'error' : ''}`}
                  placeholder="계좌번호를 입력하세요 (숫자만)"
                />
                {errors.accountNumber && (
                  <span className="error-message">{errors.accountNumber.message as string}</span>
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
                    required: '예금주를 입력해주세요'
                  })}
                  className={`input-field ${errors.accountHolder ? 'error' : ''}`}
                  placeholder="예금주명을 입력하세요"
                />
                {errors.accountHolder && (
                  <span className="error-message">{errors.accountHolder.message as string}</span>
                )}
              </div>

              {/* 통장사진 첨부 */}
              <div className="form-group">
                <label className="form-label">
                  통장사진 첨부 <span className="required">*</span>
                </label>
                <div className="file-upload-box">
                  <div className="file-upload-content">
                    {bankBookImage ? (
                      <div className="file-preview">
                        <span className="file-name">{bankBookImage.name}</span>
                        <button
                          type="button"
                          onClick={() => setBankBookImage(undefined)}
                          className="remove-file-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="upload-placeholder">
                        <span>통장 첫 페이지 사진을 첨부해주세요</span>
                      </div>
                    )}
                  </div>
                  <div className="upload-buttons">
                    <input
                      type="file"
                      id="bankBookImage"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, setBankBookImage)}
                      style={{ display: 'none' }}
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('bankBookImage')?.click()}
                      className="upload-btn"
                    >
                      📎 사진첨부
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCameraCapture(setBankBookImage)}
                      className="camera-btn"
                    >
                      📷 사진촬영
                    </button>
                  </div>
                </div>
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
