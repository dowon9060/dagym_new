import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleNewContract = () => {
    navigate(ROUTES.BUSINESS_INFO);
  };

  const handleContractList = () => {
    navigate(ROUTES.CONTRACT_LIST);
  };

  const handleFacilityManagement = () => {
    navigate(ROUTES.FACILITY_MANAGEMENT);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // 임시 통계 데이터 (추후 API에서 가져올 예정)
  const stats = {
    totalContracts: 156,
    pendingContracts: 23,
    completedContracts: 133,
    monthlyContracts: 18,
  };

  return (
    <div className="dashboard-page">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">DAGYM 어드민</h1>
            <p className="welcome-message">
              안녕하세요, {user?.name}님
            </p>
          </div>
          <div className="header-right">
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
          
          {/* 빠른 액션 */}
          <section className="actions-section">
            <h2 className="section-title">빠른 작업</h2>
            <div className="action-cards">
                  <div 
                    className="action-card primary"
                    onClick={handleNewContract}
                  >
                    <div className="action-content">
                      <h3 className="action-title">새 계약서 작성</h3>
                      <p className="action-description">
                        새로운 계약서를 작성하고 고객에게 발송하세요
                      </p>
                    </div>
                  </div>

                  <div 
                    className="action-card"
                    onClick={handleFacilityManagement}
                  >
                    <div className="action-content">
                      <h3 className="action-title">시설관리</h3>
                      <p className="action-description">
                        체육시설 현황과 회원 정보를 관리하세요
                      </p>
                    </div>
                  </div>

                  <div 
                    className="action-card"
                    onClick={handleContractList}
                  >
                    <div className="action-content">
                      <h3 className="action-title">계약서 목록</h3>
                      <p className="action-description">
                        기존 계약서들을 확인하고 관리하세요
                      </p>
                    </div>
                  </div>

                  <div 
                    className="action-card"
                    onClick={() => navigate(ROUTES.STATISTICS)}
                  >
                    <div className="action-content">
                      <h3 className="action-title">통계 보기</h3>
                      <p className="action-description">
                        계약 및 매출 통계를 확인하세요
                      </p>
                    </div>
                  </div>

                  <div className="action-card">
                    <div className="action-content">
                      <h3 className="action-title">설정</h3>
                      <p className="action-description">
                        시스템 설정을 변경하세요
                      </p>
                    </div>
                  </div>
            </div>
          </section>

          {/* 통계 카드들 */}
          <section className="stats-section">
            <h2 className="section-title">계약 현황</h2>
            <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-content">
                      <div className="stat-value">{stats.totalContracts}</div>
                      <div className="stat-label">총 계약</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-content">
                      <div className="stat-value">{stats.pendingContracts}</div>
                      <div className="stat-label">진행중</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-content">
                      <div className="stat-value">{stats.completedContracts}</div>
                      <div className="stat-label">완료</div>
                    </div>
                  </div>

                  <div className="stat-card">
                    <div className="stat-content">
                      <div className="stat-value">{stats.monthlyContracts}</div>
                      <div className="stat-label">이번달 계약</div>
                    </div>
                  </div>
            </div>
          </section>

          {/* 최근 계약서 */}
          <section className="recent-section">
            <h2 className="section-title">최근 계약서</h2>
            <div className="recent-contracts">
              <div className="contract-item">
                <div className="contract-info">
                  <div className="contract-name">㈜헬스케어짐</div>
                  <div className="contract-date">2024-01-15</div>
                </div>
                <div className="contract-status pending">진행중</div>
              </div>

              <div className="contract-item">
                <div className="contract-info">
                  <div className="contract-name">피트니스센터</div>
                  <div className="contract-date">2024-01-14</div>
                </div>
                <div className="contract-status completed">완료</div>
              </div>

              <div className="contract-item">
                <div className="contract-info">
                  <div className="contract-name">스포츠클럽</div>
                  <div className="contract-date">2024-01-13</div>
                </div>
                <div className="contract-status signed">서명완료</div>
              </div>
            </div>
            
            <button 
              className="view-all-button"
              onClick={handleContractList}
            >
              전체 보기
            </button>
          </section>

        </div>
      </main>
    </div>
  );
}
