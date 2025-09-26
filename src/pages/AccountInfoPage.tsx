import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { FileUpload } from '../components/FileUpload';
import { StepNavigation } from '../components/StepNavigation';
import { AccountInfo } from '../types';
import { ROUTES, BANKS } from '../utils/constants';

export function AccountInfoPage() {
  const navigate = useNavigate();
  const { state, setAccountInfo, setCurrentStep } = useContract();
  
  const [bankbookPhoto, setBankbookPhoto] = useState<File | undefined>();

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
      bankbookPhoto,
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


  return (
    <div className="contract-form-page">
      <div className="form-container">
        {/* 단계 네비게이션 */}
        <StepNavigation onStepClick={handleStepClick} />

        {/* 폼 카드 */}
        <div className="form-card">
          <h1 className="form-title">정산계좌 정보</h1>
          <p className="form-subtitle">
            수익금을 받을 계좌 정보를 입력해주세요
          </p>

          {/* 폼 */}
          <form onSubmit={handleSubmit(onSubmit)} className="account-form">
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
                    required: '은행을 선택해주세요'
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
                  <span className="error-message">{errors.bankName.message}</span>
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
                  <span className="error-message">{errors.accountNumber.message}</span>
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
                    required: '예금주명을 입력해주세요',
                    minLength: {
                      value: 2,
                      message: '예금주명은 2글자 이상이어야 합니다'
                    }
                  })}
                  className={`input-field ${errors.accountHolder ? 'error' : ''}`}
                  placeholder="예금주명을 입력하세요"
                />
                {errors.accountHolder && (
                  <span className="error-message">{errors.accountHolder.message}</span>
                )}
              </div>
            </div>
          </div>

          {/* 통장 사진 첨부 */}
          <div className="form-section">
            <h2 className="section-title">첨부 서류</h2>
            
            <div className="form-fields-vertical">
              <div className="form-group">
                <FileUpload
                  label="통장 사진"
                  onFileSelect={setBankbookPhoto}
                  currentFile={bankbookPhoto}
                  required
                />
                <div className="upload-hint">
                  <p>계좌번호와 예금주명이 명확히 보이는 통장 사진을 첨부해주세요</p>
                </div>
              </div>
            </div>
          </div>

          {/* 계좌 확인 안내 */}
          <div className="info-section">
            <div className="info-card">
              <div className="info-icon">ℹ️</div>
              <div className="info-content">
                <h3>계좌 확인 안내</h3>
                <ul>
                  <li>입력하신 계좌 정보는 정산금 입금에 사용됩니다</li>
                  <li>계좌 정보가 정확하지 않을 경우 정산이 지연될 수 있습니다</li>
                  <li>법인 계좌인 경우 사업자등록증상의 상호와 예금주가 일치해야 합니다</li>
                  <li>개인 계좌인 경우 대표자와 예금주가 일치해야 합니다</li>
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
              disabled={!isValid || !bankbookPhoto}
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
