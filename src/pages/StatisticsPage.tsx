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
    <div className="statistics-page">
      {/* 헤더 */}
      <header className="statistics-header">
        <div className="header-content">
          <div className="header-left">
            <button 
              onClick={() => navigate(ROUTES.DASHBOARD)} 
              className="back-button"
            >
              ← 돌아가기
            </button>
            <h1 className="page-title">통계 보기</h1>
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
      <main className="statistics-main">
        <div className="container">
          {/* 총 통계 요약 */}
          <section className="total-stats-section">
            <h2 className="section-title">전체 현황</h2>
            <div className="total-stats-grid">
              <div className="total-stat-card">
                <div className="stat-value">{totalStats.totalContracts}</div>
                <div className="stat-label">총 계약</div>
              </div>
              <div className="total-stat-card">
                <div className="stat-value">{totalStats.totalRevenue.toLocaleString()}원</div>
                <div className="stat-label">총 매출</div>
              </div>
              <div className="total-stat-card">
                <div className="stat-value">{totalStats.avgContractValue.toLocaleString()}원</div>
                <div className="stat-label">평균 계약금액</div>
              </div>
              <div className="total-stat-card">
                <div className="stat-value">+{totalStats.monthlyGrowth}%</div>
                <div className="stat-label">월간 성장률</div>
              </div>
            </div>
          </section>

          {/* 월별 통계 */}
          <section className="monthly-stats-section">
            <h2 className="section-title">월별 통계</h2>
            <div className="monthly-stats-table">
              <table className="stats-table">
                <thead>
                  <tr>
                    <th>월</th>
                    <th>계약 수</th>
                    <th>매출</th>
                    <th>전월 대비</th>
                  </tr>
                </thead>
                <tbody>
                  {monthlyStats.map((stat, index) => {
                    const prevStat = index > 0 ? monthlyStats[index - 1] : null;
                    const growth = prevStat 
                      ? ((stat.revenue - prevStat.revenue) / prevStat.revenue * 100).toFixed(1)
                      : '0';
                    
                    return (
                      <tr key={stat.month}>
                        <td>{formatMonth(stat.month)}</td>
                        <td>{stat.contracts}건</td>
                        <td>{stat.revenue.toLocaleString()}원</td>
                        <td className={`growth ${parseFloat(growth) >= 0 ? 'positive' : 'negative'}`}>
                          {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          {/* 상태별 통계 */}
          <section className="status-stats-section">
            <h2 className="section-title">계약 상태별 분포</h2>
            <div className="status-stats-grid">
              {statusStats.map(stat => (
                <div key={stat.status} className="status-stat-card">
                  <div className="status-header">
                    <span className="status-name">{stat.status}</span>
                    <span className="status-count">{stat.count}건</span>
                  </div>
                  <div className="status-bar">
                    <div 
                      className="status-progress" 
                      style={{ width: `${stat.percentage}%` }}
                    ></div>
                  </div>
                  <div className="status-percentage">{stat.percentage}%</div>
                </div>
              ))}
            </div>
          </section>

          {/* 차트 영역 (향후 확장) */}
          <section className="charts-section">
            <h2 className="section-title">성과 트렌드</h2>
            <div className="chart-placeholder">
              <div className="placeholder-content">
                <h3>차트가 곧 추가될 예정입니다</h3>
                <p>월별 계약 수 및 매출 트렌드를 시각적으로 확인할 수 있습니다.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
