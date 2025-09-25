import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ContractInfo } from '../types';
import { ROUTES, CONTRACT_STATUS_LABELS } from '../utils/constants';
import { format } from 'date-fns';

export function ContractDetailPage() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, logout } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [contract, setContract] = useState<ContractInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContract = async () => {
      setLoading(true);
      
      // TODO: 실제 API 호출로 대체
      const mockContract: ContractInfo = {
        id: id,
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
          accountNumber: '123456-78-901234',
          accountHolder: '김대표',
        },
        representativeInfo: {
          name: '김대표',
          phoneNumber: '010-1234-5678',
          address: '서울시 강남구 테헤란로 123',
          agreeToPersonalInfo: true,
        },
        selectedPlans: [
          {
            id: 'standard',
            planName: 'Standard',
            price: 99000,
            billingType: 'monthly',
            isPartner: false,
          },
        ],
        totalAmount: 99000,
        status: 'sent',
        createdAt: '2024-01-15',
        updatedAt: '2024-01-15',
      };

      await new Promise(resolve => setTimeout(resolve, 500));
      setContract(mockContract);
      setLoading(false);
    };

    if (id) {
      fetchContract();
    }
  }, [id]);

  const getStatusBadgeClass = (status: ContractInfo['status']) => {
    switch (status) {
      case 'draft': return 'status-draft';
      case 'sent': return 'status-sent';
      case 'signed': return 'status-signed';
      case 'paid': return 'status-paid';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const handleBack = () => {
    navigate(ROUTES.CONTRACT_LIST);
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner">계약서 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="contract-detail-error">
        <h2>계약서를 찾을 수 없습니다</h2>
        <p>요청하신 계약서가 존재하지 않거나 삭제되었습니다.</p>
        <button onClick={handleBack} className="btn-primary">
          계약서 목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="contract-detail-page">
      {/* 헤더 */}
      <header className="contract-detail-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={handleBack} className="back-button">
              ← 돌아가기
            </button>
            <h1 className="page-title">계약서 상세정보</h1>
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
      <main className="contract-detail-main">
        <div className="container">
          {/* 계약서 기본 정보 */}
          <div className="contract-overview">
            <div className="overview-header">
              <h2 className="business-name">{contract.businessInfo.businessName}</h2>
              <span className={`status-badge ${getStatusBadgeClass(contract.status)}`}>
                {CONTRACT_STATUS_LABELS[contract.status]}
              </span>
            </div>
            <div className="overview-meta">
              <div className="meta-item">
                <span className="label">계약 번호:</span>
                <span className="value">{contract.id}</span>
              </div>
              <div className="meta-item">
                <span className="label">작성일:</span>
                <span className="value">
                  {contract.createdAt ? format(new Date(contract.createdAt), 'yyyy년 MM월 dd일') : '-'}
                </span>
              </div>
              <div className="meta-item">
                <span className="label">최종 수정:</span>
                <span className="value">
                  {contract.updatedAt ? format(new Date(contract.updatedAt), 'yyyy년 MM월 dd일') : '-'}
                </span>
              </div>
              <div className="meta-item">
                <span className="label">계약 금액:</span>
                <span className="value amount">{contract.totalAmount.toLocaleString()}원</span>
              </div>
            </div>
          </div>

          {/* 상세 정보 섹션들 */}
          <div className="detail-sections">
            {/* 사업자 정보 */}
            <section className="detail-section">
              <h3 className="section-title">사업자 정보</h3>
              <div className="section-content">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">사업자명</span>
                    <span className="value">{contract.businessInfo.businessName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">사업자등록번호</span>
                    <span className="value">{contract.businessInfo.businessNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">대표자명</span>
                    <span className="value">{contract.businessInfo.representativeName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">사업장 주소</span>
                    <span className="value">{contract.businessInfo.businessAddress}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">업종</span>
                    <span className="value">{contract.businessInfo.businessType}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">업태</span>
                    <span className="value">{contract.businessInfo.businessCategory}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 정산 계좌 정보 */}
            <section className="detail-section">
              <h3 className="section-title">정산 계좌 정보</h3>
              <div className="section-content">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">은행명</span>
                    <span className="value">{contract.accountInfo.bankName}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">계좌번호</span>
                    <span className="value">{contract.accountInfo.accountNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">예금주</span>
                    <span className="value">{contract.accountInfo.accountHolder}</span>
                  </div>
                </div>
              </div>
            </section>

            {/* 담당자 정보 */}
            <section className="detail-section">
              <h3 className="section-title">담당자 정보</h3>
              <div className="section-content">
                <div className="info-grid">
                  <div className="info-item">
                    <span className="label">담당자명</span>
                    <span className="value">{contract.representativeInfo.name}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">연락처</span>
                    <span className="value">{contract.representativeInfo.phoneNumber}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">주소</span>
                    <span className="value">{contract.representativeInfo.address}</span>
                  </div>
                  <div className="info-item">
                    <span className="label">개인정보 동의</span>
                    <span className="value">
                      {contract.representativeInfo.agreeToPersonalInfo ? '동의함' : '동의하지 않음'}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* 선택 플랜 정보 */}
            <section className="detail-section">
              <h3 className="section-title">선택 플랜</h3>
              <div className="section-content">
                <div className="plans-list">
                  {contract.selectedPlans.map((plan, index) => (
                    <div key={index} className="plan-item">
                      <div className="plan-header">
                        <h4 className="plan-name">{plan.planName}</h4>
                        <span className="plan-price">{plan.price.toLocaleString()}원</span>
                      </div>
                      <div className="plan-details">
                        <span className="billing-type">
                          {plan.billingType === 'monthly' ? '월간 결제' : '연간 결제'}
                        </span>
                        <span className="partner-status">
                          {plan.isPartner ? '제휴사' : '일반사'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="total-amount-section">
                  <div className="total-item">
                    <span className="label">총 계약 금액</span>
                    <span className="amount">{contract.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* 액션 버튼들 */}
          <div className="contract-actions">
            <button className="btn-secondary" onClick={handleBack}>
              목록으로 돌아가기
            </button>
            <button className="btn-primary">
              PDF 다운로드
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
