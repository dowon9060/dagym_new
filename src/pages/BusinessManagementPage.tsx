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
      contractStatus: 'contracted', // 'registered', 'contracted', 'uncontracted'
      contractDate: '2024-01-16 10:30:00', // 계약 완료일
      contractPdfUrl: '/contracts/contract-001.pdf',
      lastSentDate: '2024-01-15 15:00:00',
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
      contractStatus: 'registered', // 등록완료 (아직 계약 안됨)
      contractDate: null,
      contractPdfUrl: null,
      lastSentDate: '2024-01-10 10:00:00',
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
      contractStatus: 'uncontracted', // 미계약
      contractDate: null,
      contractPdfUrl: null,
      lastSentDate: '2024-01-05 17:00:00',
      contractCount: 0,
      facilityCount: 1,
    },
    {
      id: 4,
      businessName: '피트니스월드',
      businessNumber: '456-78-90123',
      representativeName: '최대표',
      businessType: '서비스업',
      businessCategory: '헬스장',
      businessAddress: '서울특별시 서초구 서초대로 321',
      businessDetailAddress: '서초빌딩 4층',
      phoneNumber: '010-4567-8901',
      registrationDate: '2024-01-20 11:20:00',
      status: '활성',
      contractStatus: 'contracted', // 계약완료
      contractDate: '2024-01-21 14:15:00', // 계약 완료일
      contractPdfUrl: '/contracts/contract-004.pdf',
      lastSentDate: '2024-01-20 12:00:00',
      contractCount: 2,
      facilityCount: 3,
    },
  ];

  // 통계 계산
  const totalBusinesses = businesses.length;
  const registeredCount = businesses.filter(b => b.contractStatus === 'registered').length;
  const contractedCount = businesses.filter(b => b.contractStatus === 'contracted').length;
  const uncontractedCount = businesses.filter(b => b.contractStatus === 'uncontracted').length;

  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all'); // 'all', 'registered', 'contracted', 'uncontracted'
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleOpenDetailModal = (business: any) => {
    setSelectedBusiness(business);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setSelectedBusiness(null);
    setIsDetailModalOpen(false);
  };

  // 통계 카드 클릭 핸들러
  const handleStatCardClick = (status: string) => {
    setFilterStatus(status);
  };

  // 검색어 변경 핸들러
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // 필터링된 사업자 목록
  const filteredBusinesses = businesses.filter(business => {
    // 상태 필터링
    const statusMatch = filterStatus === 'all' || business.contractStatus === filterStatus;
    
    // 검색어 필터링 (사업자명, 사업자번호, 대표자명)
    const searchMatch = searchTerm === '' || 
      business.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      business.businessNumber.includes(searchTerm) ||
      business.representativeName.toLowerCase().includes(searchTerm.toLowerCase());
    
    return statusMatch && searchMatch;
  });

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
              <div 
                className={`stat-card clickable ${filterStatus === 'all' ? 'active' : ''}`}
                onClick={() => handleStatCardClick('all')}
              >
                <div className="stat-content">
                  <div className="stat-number">{totalBusinesses}</div>
                  <div className="stat-label">총 사업자</div>
                </div>
              </div>
              <div 
                className={`stat-card clickable ${filterStatus === 'registered' ? 'active' : ''}`}
                onClick={() => handleStatCardClick('registered')}
              >
                <div className="stat-content">
                  <div className="stat-number">{registeredCount}</div>
                  <div className="stat-label">등록완료</div>
                </div>
              </div>
              <div 
                className={`stat-card clickable ${filterStatus === 'contracted' ? 'active' : ''}`}
                onClick={() => handleStatCardClick('contracted')}
              >
                <div className="stat-content">
                  <div className="stat-number">{contractedCount}</div>
                  <div className="stat-label">계약완료</div>
                </div>
              </div>
              <div 
                className={`stat-card clickable ${filterStatus === 'uncontracted' ? 'active' : ''}`}
                onClick={() => handleStatCardClick('uncontracted')}
              >
                <div className="stat-content">
                  <div className="stat-number">{uncontractedCount}</div>
                  <div className="stat-label">미계약</div>
                </div>
              </div>
            </div>
          </section>

          {/* 사업자 목록 */}
          <section className="businesses-section">
            <div className="section-header">
              <h2 className="section-title">사업자 목록</h2>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="상호명, 사업자번호, 대표자명으로 검색..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="search-clear-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
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
                  {filteredBusinesses.length > 0 ? (
                    filteredBusinesses.map((business) => (
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="no-results">
                        {searchTerm ? 
                          `"${searchTerm}" 검색 결과가 없습니다.` : 
                          '해당 조건의 사업자가 없습니다.'
                        }
                      </td>
                    </tr>
                  )}
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
  const [contractPdf, setContractPdf] = useState<File | null>(null);
  const [isSending, setIsSending] = useState(false);
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

  // 계약서 PDF 업로드
  const handleContractPdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setContractPdf(file);
    } else {
      alert('PDF 파일만 업로드 가능합니다.');
    }
  };

  // 계약서 재발송
  const handleResendContract = async () => {
    setIsSending(true);
    try {
      // TODO: 실제 재발송 API 호출
      console.log('계약서 재발송 중...', business.businessName);
      await new Promise(resolve => setTimeout(resolve, 2000)); // 시뮬레이션
      alert('계약서가 재발송되었습니다.');
    } catch (error) {
      console.error('재발송 실패:', error);
      alert('재발송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  // 계약서 PDF 다운로드
  const handleDownloadContract = () => {
    if (business.contractPdfUrl) {
      // TODO: 실제 다운로드 로직
      const link = document.createElement('a');
      link.href = business.contractPdfUrl;
      link.download = `${business.businessName}_계약서.pdf`;
      link.click();
    }
  };

  // 계약 상태 변경 (임시 - 실제로는 서명 완료 시 자동으로 변경됨)
  const handleContractStatusChange = async (newStatus: string) => {
    try {
      // TODO: 실제 상태 변경 API 호출
      console.log('계약 상태 변경:', newStatus);
      alert(`계약 상태가 ${newStatus === 'contracted' ? '계약완료' : '계약전'}로 변경되었습니다.`);
      // 페이지 새로고침 또는 상태 업데이트 필요
    } catch (error) {
      console.error('상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
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
                  <span className="error-message">{errors.businessName.message as string}</span>
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
                  <span className="error-message">{errors.businessNumber.message as string}</span>
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
                  <span className="error-message">{errors.representativeName.message as string}</span>
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
                  <span className="error-message">{errors.businessType.message as string}</span>
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
                  <span className="error-message">{errors.businessCategory.message as string}</span>
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
                  <span className="error-message">{errors.businessAddress.message as string}</span>
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

          {/* 계약 현황 및 관리 */}
          <div className="form-section">
            <h2 className="section-title">계약 현황</h2>
            
            {/* 계약 상태 카드 */}
            <div className="contract-status-card">
              <div className="contract-status-header">
                <div className="status-indicator">
                  <div className={`status-badge ${business.contractStatus === 'contracted' ? 'completed' : business.contractStatus === 'registered' ? 'pending' : 'none'}`}>
                    <span className="status-icon">
                      {business.contractStatus === 'contracted' ? '✅' : 
                       business.contractStatus === 'registered' ? '📝' : 
                       '⚪'}
                    </span>
                    <span className="status-text">
                      {business.contractStatus === 'contracted' ? '계약완료' : 
                       business.contractStatus === 'registered' ? '계약 진행중' : 
                       '계약전'}
                    </span>
                  </div>
                </div>
                
                {!isEditing && business.contractStatus !== 'contracted' && (
                  <button
                    type="button"
                    onClick={handleResendContract}
                    disabled={isSending}
                    className="btn-contract-action"
                  >
                    {isSending ? (
                      <>
                        <span className="loading-spinner">⏳</span>
                        발송중...
                      </>
                    ) : (
                      <>
                        <span className="action-icon">📤</span>
                        계약서 재발송
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* 계약 타임라인 */}
              <div className="contract-timeline">
                <div className="timeline-item">
                  <div className="timeline-marker active">
                    <span className="marker-icon">📋</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">사업자 정보 등록</div>
                    <div className="timeline-date">{formatDateTime(business.registrationDate)}</div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className={`timeline-marker ${business.lastSentDate ? 'active' : ''}`}>
                    <span className="marker-icon">📤</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">계약서 발송</div>
                    <div className="timeline-date">
                      {business.lastSentDate ? formatDateTime(business.lastSentDate) : '미발송'}
                    </div>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className={`timeline-marker ${business.contractDate ? 'active' : ''}`}>
                    <span className="marker-icon">✅</span>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-title">계약 체결</div>
                    <div className="timeline-date">
                      {business.contractDate ? formatDateTime(business.contractDate) : '미완료'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 계약서 문서 관리 */}
            <div className="contract-document-section">
              <h3 className="subsection-title">계약서 문서</h3>
              
              <div className="document-card">
                {business.contractPdfUrl ? (
                  <div className="document-exists">
                    <div className="document-info">
                      <div className="document-icon">📄</div>
                      <div className="document-details">
                        <div className="document-name">계약서.pdf</div>
                        <div className="document-meta">등록된 계약서 문서</div>
                      </div>
                    </div>
                    <div className="document-actions">
                      <button
                        type="button"
                        onClick={handleDownloadContract}
                        className="btn-document-action primary"
                      >
                        <span className="action-icon">⬇️</span>
                        다운로드
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="document-empty">
                    <div className="empty-icon">📄</div>
                    <div className="empty-text">등록된 계약서가 없습니다</div>
                    <div className="empty-desc">계약서 PDF 파일을 업로드해주세요</div>
                  </div>
                )}
                
                {isEditing && (
                  <div className="document-upload">
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleContractPdfUpload}
                      className="file-input"
                      id="contractPdf"
                    />
                    <label htmlFor="contractPdf" className="upload-zone">
                      <div className="upload-icon">📁</div>
                      <div className="upload-text">
                        {contractPdf ? contractPdf.name : 'PDF 파일을 선택하거나 드래그하세요'}
                      </div>
                      <div className="upload-hint">최대 10MB, PDF 파일만 가능</div>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* 관리자 도구 (개발/테스트용) */}
            {!isEditing && (
              <div className="admin-tools">
                <details className="admin-collapse">
                  <summary className="admin-toggle">⚙️ 관리자 도구 (개발용)</summary>
                  <div className="admin-content">
                    <div className="admin-actions">
                      <button
                        type="button"
                        onClick={() => handleContractStatusChange('registered')}
                        className="btn-admin"
                      >
                        계약전으로 변경
                      </button>
                      <button
                        type="button"
                        onClick={() => handleContractStatusChange('contracted')}
                        className="btn-admin"
                      >
                        계약완료로 변경
                      </button>
                    </div>
                  </div>
                </details>
              </div>
            )}
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
