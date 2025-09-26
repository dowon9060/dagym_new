import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';

interface MonthlyStats {
  month: string;
  contracts: number;
  revenue: number;
}

interface StatusStats {
  status: string;
  count: number;
  percentage: number;
}

export function StatisticsPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStats[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStats[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalContracts: 0,
    totalRevenue: 0,
    avgContractValue: 0,
    monthlyGrowth: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      
      // TODO: 실제 API 호출로 대체
      const mockMonthlyStats: MonthlyStats[] = [
        { month: '2024-01', contracts: 12, revenue: 1200000 },
        { month: '2024-02', contracts: 15, revenue: 1500000 },
        { month: '2024-03', contracts: 18, revenue: 1800000 },
        { month: '2024-04', contracts: 22, revenue: 2200000 },
        { month: '2024-05', contracts: 19, revenue: 1900000 },
        { month: '2024-06', contracts: 25, revenue: 2500000 },
      ];

      const mockStatusStats: StatusStats[] = [
        { status: '작성중', count: 8, percentage: 12.3 },
        { status: '발송됨', count: 15, percentage: 23.1 },
        { status: '서명완료', count: 12, percentage: 18.5 },
        { status: '결제완료', count: 20, percentage: 30.8 },
        { status: '완료', count: 10, percentage: 15.4 },
      ];

      const mockTotalStats = {
        totalContracts: 156,
        totalRevenue: 15600000,
        avgContractValue: 100000,
        monthlyGrowth: 15.2,
      };

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMonthlyStats(mockMonthlyStats);
      setStatusStats(mockStatusStats);
      setTotalStats(mockTotalStats);
      setLoading(false);
    };

    fetchStatistics();
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const formatMonth = (month: string) => {
    const [year, monthNum] = month.split('-');
    return `${year}년 ${parseInt(monthNum)}월`;
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner">통계 데이터를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* 헤더 */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="header-left">
            <h1 className="dashboard-title">통계 보기</h1>
            <p className="welcome-message">계약 및 매출 현황을 확인하세요</p>
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
          
          {/* 전체 현황 */}
          <section className="stats-section">
            <h2 className="section-title">전체 현황</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{totalStats.totalContracts}</div>
                  <div className="stat-label">총 계약</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{(totalStats.totalRevenue / 10000).toLocaleString()}만원</div>
                  <div className="stat-label">총 매출</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">{(totalStats.avgContractValue / 10000).toLocaleString()}만원</div>
                  <div className="stat-label">평균 계약금액</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-value">+{totalStats.monthlyGrowth}%</div>
                  <div className="stat-label">월간 성장률</div>
                </div>
              </div>
            </div>
          </section>

          {/* 월별 현황 */}
          <section className="recent-section">
            <h2 className="section-title">최근 6개월 현황</h2>
            <div className="monthly-list">
              {monthlyStats.map((stat, index) => {
                const prevStat = index > 0 ? monthlyStats[index - 1] : null;
                const growth = prevStat 
                  ? ((stat.revenue - prevStat.revenue) / prevStat.revenue * 100).toFixed(1)
                  : '0';
                
                return (
                  <div key={stat.month} className="monthly-item">
                    <div className="monthly-info">
                      <div className="monthly-month">{formatMonth(stat.month)}</div>
                      <div className="monthly-details">
                        계약 {stat.contracts}건 · 매출 {(stat.revenue / 10000).toLocaleString()}만원
                      </div>
                    </div>
                    <div className={`monthly-growth ${parseFloat(growth) >= 0 ? 'positive' : 'negative'}`}>
                      {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 계약 상태 */}
          <section className="contract-status-section">
            <h2 className="section-title">계약 상태 현황</h2>
            <div className="status-grid">
              {statusStats.map(stat => (
                <div key={stat.status} className="status-card">
                  <div className="status-info">
                    <div className="status-name">{stat.status}</div>
                    <div className="status-count">{stat.count}건</div>
                  </div>
                  <div className="status-percentage">{stat.percentage}%</div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
