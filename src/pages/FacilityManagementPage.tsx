import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export function FacilityManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // 임시 시설 데이터 (추후 API에서 가져올 예정)
  const facilities = [
    {
      id: 1,
      name: '강남점',
      type: '헬스장',
      status: '운영중',
      memberCount: 234,
      revenue: 12500000,
    },
    {
      id: 2,
      name: '홍대점',
      type: '크로스핏',
      status: '운영중',
      memberCount: 156,
      revenue: 8900000,
    },
    {
      id: 3,
      name: '잠실점',
      type: '필라테스',
      status: '휴업',
      memberCount: 89,
      revenue: 5600000,
    },
  ];

  const totalMembers = facilities.reduce((sum, facility) => sum + facility.memberCount, 0);
  const totalRevenue = facilities.reduce((sum, facility) => sum + facility.revenue, 0);

  return (
    <div className="dashboard-page">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              onClick={() => navigate(ROUTES.DASHBOARD)} 
              className="back-button"
            >
              ← 돌아가기
            </button>
            <div className="header-text">
              <h1 className="dashboard-title">시설관리</h1>
              <p className="welcome-message">
                {user?.name}님의 시설 현황
              </p>
            </div>
          </div>
          <div className="header-right">
            <button
              onClick={() => navigate(ROUTES.DASHBOARD)}
              className="btn-secondary"
            >
              대시보드
            </button>
            <button
              onClick={handleLogout}
              className="btn-text"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          {/* 요약 통계 */}
          <section className="stats-section">
            <h2 className="section-title">시설 현황</h2>
            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{facilities.length}</div>
                  <div className="stat-label">총 시설 수</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{totalMembers.toLocaleString()}</div>
                  <div className="stat-label">총 회원 수</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{(totalRevenue / 10000).toLocaleString()}만원</div>
                  <div className="stat-label">이번 달 매출</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{facilities.filter(f => f.status === '운영중').length}</div>
                  <div className="stat-label">운영중 시설</div>
                </div>
              </div>
            </div>
          </section>

          {/* 빠른 액션 */}
          <section className="actions-section">
            <h2 className="section-title">시설 관리</h2>
            <div className="action-cards">
              <div className="action-card primary">
                <div className="action-content">
                  <h3 className="action-title">새 시설 등록</h3>
                  <p className="action-description">
                    새로운 체육시설을 등록하고 관리를 시작하세요
                  </p>
                </div>
              </div>

              <div className="action-card">
                <div className="action-content">
                  <h3 className="action-title">회원 관리</h3>
                  <p className="action-description">
                    시설별 회원 정보를 확인하고 관리하세요
                  </p>
                </div>
              </div>

              <div className="action-card">
                <div className="action-content">
                  <h3 className="action-title">매출 분석</h3>
                  <p className="action-description">
                    시설별 매출 현황과 통계를 분석하세요
                  </p>
                </div>
              </div>

              <div className="action-card">
                <div className="action-content">
                  <h3 className="action-title">설정 관리</h3>
                  <p className="action-description">
                    시설별 운영 설정과 옵션을 관리하세요
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 시설 목록 */}
          <section className="facilities-section">
            <h2 className="section-title">시설 목록</h2>
            <div className="facilities-grid">
              {facilities.map((facility) => (
                <div key={facility.id} className="facility-card">
                  <div className="facility-header">
                    <h3 className="facility-name">{facility.name}</h3>
                    <span className={`facility-status ${facility.status === '운영중' ? 'active' : 'inactive'}`}>
                      {facility.status}
                    </span>
                  </div>
                  <div className="facility-details">
                    <div className="facility-type">{facility.type}</div>
                    <div className="facility-stats">
                      <div className="facility-stat">
                        <span className="stat-label">회원 수</span>
                        <span className="stat-value">{facility.memberCount}명</span>
                      </div>
                      <div className="facility-stat">
                        <span className="stat-label">이번 달 매출</span>
                        <span className="stat-value">{(facility.revenue / 10000).toLocaleString()}만원</span>
                      </div>
                    </div>
                  </div>
                  <div className="facility-actions">
                    <button className="btn-outline">상세보기</button>
                    <button className="btn-outline">관리</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
