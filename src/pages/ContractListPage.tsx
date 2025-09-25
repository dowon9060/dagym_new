import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ContractInfo } from '../types';
import { ROUTES, CONTRACT_STATUS_LABELS } from '../utils/constants';
import { format } from 'date-fns';

export function ContractListPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [contracts, setContracts] = useState<ContractInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'draft' | 'sent' | 'signed' | 'paid' | 'completed'>('all');

  // 임시 데이터 (추후 API로 대체)
  useEffect(() => {
    const fetchContracts = async () => {
      const mockContracts: ContractInfo[] = [
        {
          id: '1',
          businessInfo: {
            businessName: '㈜헬스케어짐',
            businessNumber: '123-45-67890',
            representativeName: '김대표',
            businessAddress: '서울시 강남구 테헤란로 123',
            businessType: '서비스업',
            businessCategory: '체육시설 운영업',
          },
          accountInfo: {
            bankName: '국민은행',
            accountNumber: '123456-12-123456',
            accountHolder: '㈜헬스케어짐',
          },
          representativeInfo: {
            name: '김대표',
            phoneNumber: '010-1234-5678',
            address: '서울시 강남구 역삼동 123-45',
          },
          selectedPlans: [
            {
              planId: 'light',
              planName: '라이트플랜',
              billingType: 'yearly',
              price: 1188000,
            },
            {
              planId: 'manager',
              planName: '다짐매니저',
              billingType: 'yearly',
              price: 646800,
            },
          ],
          totalAmount: 1834800,
          status: 'sent',
          createdAt: new Date('2024-01-15'),
        },
        {
          id: '2',
          businessInfo: {
            businessName: '피트니스센터',
            businessNumber: '234-56-78901',
            representativeName: '이사장',
            businessAddress: '부산시 해운대구 센텀로 456',
            businessType: '서비스업',
            businessCategory: '체육시설 운영업',
          },
          accountInfo: {
            bankName: '신한은행',
            accountNumber: '234567-23-234567',
            accountHolder: '피트니스센터',
          },
          representativeInfo: {
            name: '이사장',
            phoneNumber: '010-2345-6789',
            address: '부산시 해운대구 우동 234-56',
          },
          selectedPlans: [
            {
              planId: 'standard',
              planName: '스탠다드플랜',
              billingType: 'yearly',
              price: 3828000,
            },
          ],
          totalAmount: 3828000,
          status: 'completed',
          createdAt: new Date('2024-01-14'),
          signedAt: new Date('2024-01-15'),
          paidAt: new Date('2024-01-15'),
        },
        {
          id: '3',
          businessInfo: {
            businessName: '요가스튜디오',
            businessNumber: '345-67-89012',
            representativeName: '박원장',
            businessAddress: '대구시 중구 동성로 789',
            businessType: '서비스업',
            businessCategory: '요가',
          },
          accountInfo: {
            bankName: '우리은행',
            accountNumber: '345678-34-345678',
            accountHolder: '요가스튜디오',
          },
          representativeInfo: {
            name: '박원장',
            phoneNumber: '010-3456-7890',
            address: '대구시 중구 삼덕동 345-67',
          },
          selectedPlans: [
            {
              planId: 'free',
              planName: '무료플랜',
              billingType: 'yearly',
              price: 0,
            },
          ],
          totalAmount: 0,
          status: 'draft',
          createdAt: new Date('2024-01-13'),
        },
        {
          id: '4',
          businessInfo: {
            businessName: '크로스핏박스',
            businessNumber: '456-78-90123',
            representativeName: '최코치',
            businessAddress: '광주시 서구 농성로 101',
            businessType: '서비스업',
            businessCategory: '크로스핏',
          },
          accountInfo: {
            bankName: '하나은행',
            accountNumber: '456789-45-456789',
            accountHolder: '크로스핏박스',
          },
          representativeInfo: {
            name: '최코치',
            phoneNumber: '010-4567-8901',
            address: '광주시 서구 농성동 456-78',
          },
          selectedPlans: [
            {
              planId: 'light',
              planName: '라이트플랜',
              billingType: 'monthly',
              price: 165000,
            },
          ],
          totalAmount: 165000,
          status: 'signed',
          createdAt: new Date('2024-01-12'),
          signedAt: new Date('2024-01-13'),
        },
      ];
      
      setContracts(mockContracts);
      setLoading(false);
    };

    fetchContracts();
  }, []);

  const handleNewContract = () => {
    navigate(ROUTES.BUSINESS_INFO);
  };

  const handleDetailClick = (id: string) => {
    navigate(ROUTES.CONTRACT_DETAIL.replace(':id', id));
  };

  const filteredContracts = contracts.filter(contract => {
    if (filter === 'all') return true;
    return contract.status === filter;
  });

  const getStatusBadgeClass = (status: ContractInfo['status']) => {
    switch (status) {
      case 'draft': return 'status-draft';
      case 'sent': return 'status-sent';
      case 'signed': return 'status-signed';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (loading) {
    return (
      <div className="client-contract-loading">
        <div>계약서 목록을 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div className="contract-list-page">
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
              <h1 className="dashboard-title">계약서 관리</h1>
              <p className="welcome-message">
                {user?.name}님의 계약서
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

      {/* 새 계약서 작성 버튼 */}
      <div className="contract-actions">
        <button
          onClick={handleNewContract}
          className="btn-primary"
        >
          새 계약서 작성
        </button>
      </div>

      {/* 필터 */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          전체
        </button>
        {Object.entries(CONTRACT_STATUS_LABELS).map(([key, label]) => (
          <button
            key={key}
            className={`filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key as keyof typeof CONTRACT_STATUS_LABELS)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 계약서 목록 */}
      <div className="contracts-section">
        {filteredContracts.length === 0 ? (
          <div className="empty-state">
            <h3>계약서가 없습니다</h3>
            <p>새 계약서를 작성해보세요</p>
            <button
              onClick={handleNewContract}
              className="btn-primary"
            >
              새 계약서 작성
            </button>
          </div>
        ) : (
          <div className="contracts-table-container">
            <table className="contracts-table">
              <thead>
                <tr>
                  <th>사업자명</th>
                  <th>대표자</th>
                  <th>상태</th>
                  <th>계약금액</th>
                  <th>작성일</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map(contract => (
                  <tr key={contract.id} className="contract-row">
                    <td className="business-name-cell">
                      <div className="business-name">{contract.businessInfo.businessName}</div>
                      <div className="business-number">{contract.businessInfo.businessNumber}</div>
                    </td>
                    <td>{contract.representativeInfo.name}</td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(contract.status)}`}>
                        {CONTRACT_STATUS_LABELS[contract.status]}
                      </span>
                    </td>
                    <td className="amount-cell">
                      {contract.totalAmount.toLocaleString()}원
                    </td>
                    <td>
                      {contract.createdAt ? format(new Date(contract.createdAt), 'yyyy-MM-dd') : '-'}
                    </td>
                    <td>
                      <button
                        className="btn-detail"
                        onClick={() => handleDetailClick(contract.id!)}
                      >
                        상세보기
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}