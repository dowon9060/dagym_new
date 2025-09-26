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
            <div className="stats-grid">
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

          {/* 시설 목록 */}
          <section className="facilities-section">
            <h2 className="section-title">시설 목록</h2>
            <div className="facilities-table-container">
              <table className="facilities-table">
                <thead>
                  <tr>
                    <th>시설명</th>
                    <th>타입</th>
                    <th>운영상태</th>
                    <th>회원 수</th>
                    <th>이번 달 매출</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.map((facility) => (
                    <tr key={facility.id} className="facility-row">
                      <td className="facility-name">{facility.name}</td>
                      <td className="facility-type">{facility.type}</td>
                      <td>
                        <span className={`facility-status ${facility.status === '운영중' ? 'active' : 'inactive'}`}>
                          {facility.status}
                        </span>
                      </td>
                      <td className="facility-members">{facility.memberCount}명</td>
                      <td className="facility-revenue">{(facility.revenue / 10000).toLocaleString()}만원</td>
                      <td className="facility-actions">
                        <button className="btn-outline btn-sm">상세보기</button>
                        <button className="btn-outline btn-sm">관리</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
