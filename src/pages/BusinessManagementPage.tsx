import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

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

export function BusinessManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // 임시 사업자 데이터 (추후 API에서 가져올 예정)
  const businesses = [
    {
      id: 1,
      businessName: '㈜다짐피트니스',
      businessNumber: '123-45-67890',
      representativeName: '김대표',
      businessType: '체육시설업',
      businessCategory: '헬스장',
      businessAddress: '서울특별시 강남구 테헤란로 123',
      businessDetailAddress: '다짐빌딩 2층',
      phoneNumber: '010-1234-5678',
      registrationDate: '2024-01-15 14:30:00',
      status: '활성',
      contractCount: 3,
      facilityCount: 2,
    },
    {
      id: 2,
      businessName: '헬스케어㈜',
      businessNumber: '234-56-78901',
      representativeName: '이대표',
      businessType: '서비스업',
      businessCategory: '크로스핏',
      businessAddress: '서울특별시 마포구 홍익로 456',
      businessDetailAddress: '홍대빌딩 지하1층',
      phoneNumber: '010-2345-6789',
      registrationDate: '2024-01-10 09:15:00',
      status: '활성',
      contractCount: 1,
      facilityCount: 1,
    },
    {
      id: 3,
      businessName: '스포츠센터㈜',
      businessNumber: '345-67-89012',
      representativeName: '박대표',
      businessType: '체육시설업',
      businessCategory: '필라테스',
      businessAddress: '서울특별시 송파구 잠실로 789',
      businessDetailAddress: '잠실타워 3층',
      phoneNumber: '010-3456-7890',
      registrationDate: '2024-01-05 16:45:00',
      status: '비활성',
      contractCount: 0,
      facilityCount: 1,
    },
    {
      id: 4,
      businessName: '피트니스월드',
      businessNumber: '456-78-90123',
      representativeName: '최대표',
      businessType: '체육시설업',
      businessCategory: '헬스장',
      businessAddress: '서울특별시 서초구 서초대로 321',
      businessDetailAddress: '서초빌딩 4층',
      phoneNumber: '010-4567-8901',
      registrationDate: '2024-01-20 11:20:00',
      status: '활성',
      contractCount: 2,
      facilityCount: 3,
    },
  ];

  // 통계 계산
  const totalBusinesses = businesses.length;
  const activeBusinesses = businesses.filter(b => b.status === '활성').length;
  const totalContracts = businesses.reduce((sum, b) => sum + b.contractCount, 0);
  const totalFacilities = businesses.reduce((sum, b) => sum + b.facilityCount, 0);

  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const handleOpenDetailModal = (business: any) => {
    setSelectedBusiness(business);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedBusiness(null);
    setIsDetailModalOpen(false);
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="dashboard-page">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">사업자 관리</h1>
            <p className="welcome-message">
              등록된 사업자 정보를 관리하세요
            </p>
          </div>
          <div className="header-right">
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="back-button"
            >
              대시보드로 돌아가기
            </button>
            <button
              onClick={handleLogout}
              className="logout-button"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          {/* 통계 요약 */}
          <section className="stats-section">
            <h2 className="section-title">사업자 현황</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{totalBusinesses}</div>
                  <div className="stat-label">총 사업자</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{activeBusinesses}</div>
                  <div className="stat-label">활성 사업자</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{totalContracts}</div>
                  <div className="stat-label">총 계약 수</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{totalFacilities}</div>
                  <div className="stat-label">총 시설 수</div>
                </div>
              </div>
            </div>
          </section>

          {/* 사업자 목록 */}
          <section className="businesses-section">
            <div className="section-header">
              <h2 className="section-title">사업자 목록</h2>
            </div>
            <div className="businesses-table-container">
              <table className="businesses-table">
                <thead>
                  <tr>
                    <th>사업자명</th>
                    <th>사업자번호</th>
                    <th>대표자</th>
                    <th>사업자 주소</th>
                  </tr>
                </thead>
                <tbody>
                  {businesses.map((business) => (
                    <tr 
                      key={business.id} 
                      className="business-row clickable-row"
                      onClick={() => handleOpenDetailModal(business)}
                    >
                      <td className="business-name">{business.businessName}</td>
                      <td className="business-number">{business.businessNumber}</td>
                      <td className="representative-name">{business.representativeName}</td>
                      <td className="business-address">
                        {business.businessAddress}
                        {business.businessDetailAddress && (
                          <span className="detail-address-inline"> {business.businessDetailAddress}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* 사업자 상세보기 모달 */}
      {isDetailModalOpen && selectedBusiness && (
        <BusinessDetailModal business={selectedBusiness} onClose={handleCloseDetailModal} />
      )}
    </div>
  );
}

// 사업자 상세보기/수정 모달 컴포넌트
function BusinessDetailModal({ business, onClose }: { business: any; onClose: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [businessFiles, setBusinessFiles] = useState<{[key: string]: File | null}>({
    businessRegistrationCert: null,
    sportsLicenseCert: null
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      businessName: business.businessName,
      businessNumber: business.businessNumber,
      representativeName: business.representativeName,
      businessType: business.businessType,
      businessCategory: business.businessCategory,
      businessAddress: business.businessAddress,
      businessDetailAddress: business.businessDetailAddress || '',
      phoneNumber: business.phoneNumber,
    },
    mode: 'onChange',
  });

  const onSubmit = (data: any) => {
    console.log('수정된 데이터:', data);
    console.log('첨부파일:', businessFiles);
    // TODO: 실제 업데이트 API 호출
    setIsEditing(false);
    alert('사업자 정보가 수정되었습니다.');
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setBusinessFiles(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content business-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{business.businessName} 정보</h2>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-body business-form">
          
          {/* 기본 정보 */}
          <div className="form-section">
            <h2 className="section-title">기본 정보</h2>
            <div className="form-fields-vertical">
              
              {/* 사업자명 */}
              <div className="form-group">
                <label htmlFor="businessName" className="form-label">
                  사업자명 <span className="required">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="businessName"
                    {...register('businessName', {
                      required: '사업자명을 입력해주세요'
                    })}
                    className={`input-field ${errors.businessName ? 'error' : ''}`}
                    placeholder="사업자명을 입력하세요"
                  />
                ) : (
                  <div className="input-field readonly">{business.businessName}</div>
                )}
                {errors.businessName && (
                  <span className="error-message">{errors.businessName.message}</span>
                )}
              </div>

              {/* 사업자번호 */}
              <div className="form-group">
                <label htmlFor="businessNumber" className="form-label">
                  사업자번호 <span className="required">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="businessNumber"
                    {...register('businessNumber', {
                      required: '사업자번호를 입력해주세요',
                      pattern: {
                        value: /^\d{3}-\d{2}-\d{5}$/,
                        message: '올바른 사업자번호 형식이 아닙니다 (000-00-00000)'
                      }
                    })}
                    className={`input-field ${errors.businessNumber ? 'error' : ''}`}
                    placeholder="000-00-00000"
                  />
                ) : (
                  <div className="input-field readonly">{business.businessNumber}</div>
                )}
                {errors.businessNumber && (
                  <span className="error-message">{errors.businessNumber.message}</span>
                )}
              </div>

              {/* 대표자명 */}
              <div className="form-group">
                <label htmlFor="representativeName" className="form-label">
                  대표자명 <span className="required">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="representativeName"
                    {...register('representativeName', {
                      required: '대표자명을 입력해주세요'
                    })}
                    className={`input-field ${errors.representativeName ? 'error' : ''}`}
                    placeholder="대표자명을 입력하세요"
                  />
                ) : (
                  <div className="input-field readonly">{business.representativeName}</div>
                )}
                {errors.representativeName && (
                  <span className="error-message">{errors.representativeName.message}</span>
                )}
              </div>

              {/* 업태 */}
              <div className="form-group">
                <label htmlFor="businessType" className="form-label">
                  업태 <span className="required">*</span>
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="businessType"
                    {...register('businessType', {
                      required: '업태를 입력해주세요'
                    })}
                    className={`input-field ${errors.businessType ? 'error' : ''}`}
                    placeholder="예: 체육시설업, 서비스업, 도매업 등"
                  />
                ) : (
                  <div className="input-field readonly">{business.businessType}</div>
                )}
                {errors.businessType && (
                  <span className="error-message">{errors.businessType.message}</span>
                )}
              </div>

              {/* 업종 */}
              <div className="form-group">
                <label htmlFor="businessCategory" className="form-label">
                  업종 <span className="required">*</span>
                </label>
                {isEditing ? (
                  <select
                    id="businessCategory"
                    {...register('businessCategory', {
                      required: '업종을 선택해주세요'
                    })}
                    className={`select-field ${errors.businessCategory ? 'error' : ''}`}
                  >
                    <option value="">업종을 선택하세요</option>
                    <option value="헬스장">헬스장</option>
                    <option value="필라테스">필라테스</option>
                    <option value="요가">요가</option>
                    <option value="크로스핏">크로스핏</option>
                    <option value="태권도장">태권도장</option>
                    <option value="수영장">수영장</option>
                    <option value="기타">기타</option>
                  </select>
                ) : (
                  <div className="input-field readonly">{business.businessCategory}</div>
                )}
                {errors.businessCategory && (
                  <span className="error-message">{errors.businessCategory.message}</span>
                )}
              </div>

              {/* 사업자 주소 */}
              <div className="form-group">
                <label htmlFor="businessAddress" className="form-label">
                  사업자 주소 <span className="required">*</span>
                </label>
                {isEditing ? (
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
                        new window.daum.Postcode({
                          oncomplete: function(data) {
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
                ) : (
                  <div className="input-field readonly">{business.businessAddress}</div>
                )}
                {errors.businessAddress && (
                  <span className="error-message">{errors.businessAddress.message}</span>
                )}
              </div>

              {/* 상세주소 */}
              <div className="form-group">
                <label htmlFor="businessDetailAddress" className="form-label">
                  상세주소
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    id="businessDetailAddress"
                    {...register('businessDetailAddress')}
                    className="input-field"
                    placeholder="건물명, 동호수 등 상세주소를 입력하세요"
                  />
                ) : (
                  <div className="input-field readonly">{business.businessDetailAddress || '-'}</div>
                )}
              </div>

              {/* 연락처 */}
              <div className="form-group">
                <label htmlFor="phoneNumber" className="form-label">
                  연락처
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    id="phoneNumber"
                    {...register('phoneNumber')}
                    className="input-field"
                    placeholder="010-0000-0000"
                  />
                ) : (
                  <div className="input-field readonly">{business.phoneNumber || '-'}</div>
                )}
              </div>

              {/* 등록일시 (읽기 전용) */}
              <div className="form-group">
                <label className="form-label">등록일시</label>
                <div className="input-field readonly">{formatDateTime(business.registrationDate)}</div>
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
                {isEditing ? (
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('businessRegistrationCert', e.target.files?.[0] || null)}
                      className="file-input"
                    />
                    <div className="upload-hint">JPG, PNG, PDF 파일만 업로드 가능합니다.</div>
                  </div>
                ) : (
                  <div className="file-info">기존 파일 있음 (수정 시 변경 가능)</div>
                )}
              </div>

              {/* 체육시설업 신고증 */}
              <div className="form-group">
                <label className="form-label">
                  체육시설업 신고증
                </label>
                {isEditing ? (
                  <div className="file-upload">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => handleFileUpload('sportsLicenseCert', e.target.files?.[0] || null)}
                      className="file-input"
                    />
                    <div className="upload-hint">JPG, PNG, PDF 파일만 업로드 가능합니다.</div>
                  </div>
                ) : (
                  <div className="file-info">기존 파일 있음 (수정 시 변경 가능)</div>
                )}
              </div>

            </div>
          </div>

        </form>

        <div className="modal-footer">
          {isEditing ? (
            <div className="form-actions">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn-secondary"
              >
                취소
              </button>
              <button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                className="btn-primary"
                disabled={!isValid}
              >
                저장
              </button>
            </div>
          ) : (
            <div className="form-actions">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="btn-primary"
              >
                수정
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
