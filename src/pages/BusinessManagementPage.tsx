import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

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
                    <th>업종</th>
                    <th>등록일시</th>
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
                      <td className="business-category">{business.businessCategory}</td>
                      <td className="registration-date">{formatDateTime(business.registrationDate)}</td>
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

// 사업자 상세보기 모달 컴포넌트
function BusinessDetailModal({ business, onClose }: { business: any; onClose: () => void }) {
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
          <h2>{business.businessName} 상세정보</h2>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>

        <div className="modal-body">
          {/* 기본 정보 */}
          <div className="form-section">
            <h3 className="form-section-title">사업자 기본정보</h3>
            
            <div className="detail-grid">
              <div className="detail-item">
                <label className="detail-label">사업자명</label>
                <div className="detail-value">{business.businessName}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">사업자번호</label>
                <div className="detail-value">{business.businessNumber}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">대표자명</label>
                <div className="detail-value">{business.representativeName}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">업태</label>
                <div className="detail-value">{business.businessType}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">업종</label>
                <div className="detail-value">{business.businessCategory}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">연락처</label>
                <div className="detail-value">{business.phoneNumber}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">사업자주소</label>
                <div className="detail-value">{business.businessAddress}</div>
              </div>

              {business.businessDetailAddress && (
                <div className="detail-item">
                  <label className="detail-label">상세주소</label>
                  <div className="detail-value">{business.businessDetailAddress}</div>
                </div>
              )}

              <div className="detail-item">
                <label className="detail-label">등록일시</label>
                <div className="detail-value">{formatDateTime(business.registrationDate)}</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">상태</label>
                <div className="detail-value">
                  <span className={`business-status ${business.status === '활성' ? 'active' : 'inactive'}`}>
                    {business.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 통계 정보 */}
          <div className="form-section">
            <h3 className="form-section-title">활동 현황</h3>
            
            <div className="detail-grid">
              <div className="detail-item">
                <label className="detail-label">계약 수</label>
                <div className="detail-value">{business.contractCount}건</div>
              </div>

              <div className="detail-item">
                <label className="detail-label">시설 수</label>
                <div className="detail-value">{business.facilityCount}개</div>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-primary">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
