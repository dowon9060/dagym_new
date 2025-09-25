import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { StepNavigation } from '../components/StepNavigation';
import { SelectedPlan } from '../types';
import { ROUTES, PLANS } from '../utils/constants';

export function PlanSelectionPage() {
  const navigate = useNavigate();
  const { state, setSelectedPlans, setCurrentStep } = useContract();
  
  const [selectedPlans, setLocalSelectedPlans] = useState<SelectedPlan[]>(state.selectedPlans);
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('yearly');
  const [isPartner, setIsPartner] = useState(false);

  // 플랜 선택/해제 처리
  const handlePlanToggle = (planId: string, isSelected: boolean) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return;

    if (isSelected) {
      // 플랜 추가
      let price = billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
      
      // 파트너 가격이 있는 경우
      if (plan.partnerPrice !== undefined && plan.nonPartnerPrice !== undefined) {
        if (billingType === 'yearly') {
          price = isPartner ? plan.partnerPrice : plan.nonPartnerPrice;
        } else {
          // 월간 가격 계산 (연간 가격을 12로 나눔)
          const yearlyPrice = isPartner ? plan.partnerPrice : plan.nonPartnerPrice;
          price = Math.round(yearlyPrice / 12);
        }
      }

      const newPlan: SelectedPlan = {
        planId: plan.id,
        planName: plan.name,
        billingType,
        price,
      };

      setLocalSelectedPlans(prev => [...prev, newPlan]);
    } else {
      // 플랜 제거
      setLocalSelectedPlans(prev => prev.filter(p => p.planId !== planId));
    }
  };

  // 과금 주기 변경 시 선택된 플랜들의 가격 업데이트
  useEffect(() => {
    const updatedPlans = selectedPlans.map(selectedPlan => {
      const plan = PLANS.find(p => p.id === selectedPlan.planId);
      if (!plan) return selectedPlan;

      let price = billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
      
      if (plan.partnerPrice !== undefined && plan.nonPartnerPrice !== undefined) {
        if (billingType === 'yearly') {
          price = isPartner ? plan.partnerPrice : plan.nonPartnerPrice;
        } else {
          const yearlyPrice = isPartner ? plan.partnerPrice : plan.nonPartnerPrice;
          price = Math.round(yearlyPrice / 12);
        }
      }

      return {
        ...selectedPlan,
        billingType,
        price,
      };
    });

    setLocalSelectedPlans(updatedPlans);
  }, [billingType, isPartner, selectedPlans]);

  const handleSubmit = () => {
    if (selectedPlans.length === 0) {
      alert('최소 1개 이상의 플랜을 선택해주세요');
      return;
    }

    // 무료플랜이 없으면 자동으로 추가
    const hasFree = selectedPlans.some(p => p.planId === 'free');
    const plansToSave = hasFree ? selectedPlans : [
      {
        planId: 'free',
        planName: '무료플랜',
        billingType: billingType as 'monthly' | 'yearly',
        price: 0,
      },
      ...selectedPlans
    ];

    setSelectedPlans(plansToSave);
    setCurrentStep(5);
    navigate(ROUTES.PAYMENT);
  };

  const handleStepClick = (step: number) => {
    setSelectedPlans(selectedPlans);
    setCurrentStep(step);

    switch (step) {
      case 1:
        navigate(ROUTES.BUSINESS_INFO);
        break;
      case 2:
        navigate(ROUTES.ACCOUNT_INFO);
        break;
      case 3:
        navigate(ROUTES.REPRESENTATIVE_INFO);
        break;
      default:
        break;
    }
  };

  const handlePrevious = () => {
    setSelectedPlans(selectedPlans);
    setCurrentStep(3);
    navigate(ROUTES.REPRESENTATIVE_INFO);
  };

  // 총 금액 계산
  const totalAmount = selectedPlans.reduce((sum, plan) => sum + plan.price, 0);

  // 플랜이 선택되었는지 확인
  const isPlanSelected = (planId: string) => {
    return selectedPlans.some(p => p.planId === planId);
  };

  // 플랜 가격 계산
  const getPlanPrice = (plan: any) => {
    let price = billingType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice;
    
    if (plan.partnerPrice !== undefined && plan.nonPartnerPrice !== undefined) {
      if (billingType === 'yearly') {
        price = isPartner ? plan.partnerPrice : plan.nonPartnerPrice;
      } else {
        const yearlyPrice = isPartner ? plan.partnerPrice : plan.nonPartnerPrice;
        price = Math.round(yearlyPrice / 12);
      }
    }
    
    return price;
  };

  return (
    <div className="contract-form-page">
      <div className="form-container">
        {/* 단계 네비게이션 */}
        <StepNavigation onStepClick={handleStepClick} />

        {/* 폼 카드 */}
        <div className="form-card">
          <h1 className="form-title">플랜 선택</h1>
          <p className="form-subtitle">
            필요한 서비스 플랜을 선택해주세요
          </p>

        {/* 옵션 설정 */}
        <div className="plan-options">
          <div className="billing-type">
            <label className="option-label">과금 주기</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="monthly"
                  checked={billingType === 'monthly'}
                  onChange={(e) => setBillingType(e.target.value as 'monthly')}
                />
                <span>월간</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="yearly"
                  checked={billingType === 'yearly'}
                  onChange={(e) => setBillingType(e.target.value as 'yearly')}
                />
                <span>연간 (할인)</span>
              </label>
            </div>
          </div>

          <div className="partner-type">
            <label className="option-label">제휴 여부</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="non-partner"
                  checked={!isPartner}
                  onChange={() => setIsPartner(false)}
                />
                <span>비제휴가</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="partner"
                  checked={isPartner}
                  onChange={() => setIsPartner(true)}
                />
                <span>제휴가</span>
              </label>
            </div>
          </div>
        </div>

        {/* 플랜 목록 */}
        <div className="plans-section">
          {/* 메인 플랜 */}
          <div className="plan-category">
            <h2 className="category-title">기본 플랜</h2>
            <div className="plans-grid">
              {PLANS.filter(plan => plan.category === 'main').map(plan => {
                const isSelected = isPlanSelected(plan.id);
                const price = getPlanPrice(plan);
                const isRequired = plan.isRequired;

                return (
                  <div 
                    key={plan.id} 
                    className={`plan-card ${isSelected ? 'selected' : ''} ${isRequired ? 'required' : ''}`}
                  >
                    <div className="plan-header">
                      <h3 className="plan-name">{plan.name}</h3>
                      {isRequired && <span className="required-badge">필수</span>}
                    </div>
                    
                    <div className="plan-price">
                      <span className="price">{price.toLocaleString()}원</span>
                      <span className="period">/ {billingType === 'yearly' ? '년' : '월'}</span>
                    </div>

                    <div className="plan-actions">
                      <label className="plan-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected || isRequired}
                          disabled={isRequired}
                          onChange={(e) => handlePlanToggle(plan.id, e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        {isRequired ? '기본 포함' : '선택'}
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 부가 서비스 */}
          <div className="plan-category">
            <h2 className="category-title">부가 서비스</h2>
            <div className="plans-grid">
              {PLANS.filter(plan => plan.category === 'addon').map(plan => {
                const isSelected = isPlanSelected(plan.id);
                const price = getPlanPrice(plan);

                return (
                  <div 
                    key={plan.id} 
                    className={`plan-card ${isSelected ? 'selected' : ''}`}
                  >
                    <div className="plan-header">
                      <h3 className="plan-name">{plan.name}</h3>
                    </div>
                    
                    <div className="plan-price">
                      {plan.partnerPrice !== undefined ? (
                        <div className="price-options">
                          <div className={`price-option ${isPartner ? 'active' : ''}`}>
                            <span className="label">제휴가</span>
                            <span className="price">
                              {isPartner ? price.toLocaleString() : (billingType === 'yearly' ? plan.partnerPrice : Math.round(plan.partnerPrice / 12)).toLocaleString()}원
                            </span>
                          </div>
                          <div className={`price-option ${!isPartner ? 'active' : ''}`}>
                            <span className="label">비제휴가</span>
                            <span className="price">
                              {!isPartner ? price.toLocaleString() : (billingType === 'yearly' ? plan.nonPartnerPrice! : Math.round(plan.nonPartnerPrice! / 12)).toLocaleString()}원
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <span className="price">{price.toLocaleString()}원</span>
                          <span className="period">/ {billingType === 'yearly' ? '년' : '월'}</span>
                        </>
                      )}
                    </div>

                    <div className="plan-actions">
                      <label className="plan-checkbox">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handlePlanToggle(plan.id, e.target.checked)}
                        />
                        <span className="checkmark"></span>
                        선택
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 선택된 플랜 요약 */}
        <div className="selected-summary">
          <h3 className="summary-title">선택된 플랜</h3>
          {selectedPlans.length > 0 ? (
            <div className="selected-plans">
              {selectedPlans.map(plan => (
                <div key={plan.planId} className="selected-plan-item">
                  <span className="plan-name">{plan.planName}</span>
                  <span className="plan-price">{plan.price.toLocaleString()}원</span>
                </div>
              ))}
              <div className="total-amount">
                <strong>총 합계: {totalAmount.toLocaleString()}원</strong>
              </div>
            </div>
          ) : (
            <p className="no-selection">선택된 플랜이 없습니다</p>
          )}
        </div>

        {/* 버튼 영역 */}
        <div className="form-actions">
          <button
            type="button"
            onClick={handlePrevious}
            className="btn-secondary"
          >
            이전 단계
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="btn-primary"
            disabled={selectedPlans.length === 0}
          >
            다음 단계
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
