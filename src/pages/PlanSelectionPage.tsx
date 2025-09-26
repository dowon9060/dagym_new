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

  // 기본 플랜 선택/해제 처리 (단일 선택)
  const handlePlanToggle = (planId: string, isSelected: boolean) => {
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return;

    if (isSelected) {
      // 기본 플랜은 단일 선택이므로 기존 기본 플랜들을 모두 제거하고 새로운 플랜 추가
      const newPlans = selectedPlans.filter(p => {
        const existingPlan = PLANS.find(existing => existing.id === p.planId);
        return existingPlan?.category !== 'main';
      });

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

      setLocalSelectedPlans([...newPlans, newPlan]);
    } else {
      // 플랜 제거
      setLocalSelectedPlans(prev => prev.filter(p => p.planId !== planId));
    }
  };

  // 부가 서비스 선택/해제 처리 (복수 선택) 
  const handleAddonPlanToggle = (planId: string, isSelected: boolean) => {
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
      setLocalSelectedPlans(prev => {
        const filtered = prev.filter(p => p.planId !== planId);
        
        // 다짐매니저를 제거하는 경우, 다른 부가서비스들도 모두 제거
        if (planId === 'dagym-manager') {
          return filtered.filter(p => {
            const existingPlan = PLANS.find(existing => existing.id === p.planId);
            return existingPlan?.category !== 'addon';
          });
        }
        
        return filtered;
      });
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
        <div className="form-section">
          <h2 className="section-title">설정 옵션</h2>
          <div className="plan-options">
            <div className="billing-type">
              <label className="option-label">과금 주기</label>
              <div className="radio-group">
                <label className="radio-button">
                  <input
                    type="radio"
                    value="monthly"
                    checked={billingType === 'monthly'}
                    onChange={(e) => setBillingType(e.target.value as 'monthly')}
                  />
                  월간
                </label>
                <label className="radio-button">
                  <input
                    type="radio"
                    value="yearly"
                    checked={billingType === 'yearly'}
                    onChange={(e) => setBillingType(e.target.value as 'yearly')}
                  />
                  연간 (할인)
                </label>
              </div>
            </div>

            <div className="partner-type">
              <label className="option-label">제휴 여부</label>
              <div className="radio-group">
                <label className="radio-button">
                  <input
                    type="radio"
                    value="non-partner"
                    checked={!isPartner}
                    onChange={() => setIsPartner(false)}
                  />
                  비제휴가
                </label>
                <label className="radio-button">
                  <input
                    type="radio"
                    value="partner"
                    checked={isPartner}
                    onChange={() => setIsPartner(true)}
                  />
                  제휴가
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 플랜 목록 */}
        <div className="form-section">
          <h2 className="section-title">플랜 목록</h2>
          <div className="plans-section">
            {/* 메인 플랜 */}
            <div className="plan-category">
              <h3 className="category-title">기본 플랜</h3>
            <div className="plans-grid">
              {PLANS.filter(plan => plan.category === 'main').map(plan => {
                const isSelected = isPlanSelected(plan.id);
                const price = getPlanPrice(plan);
                const isRequired = plan.isRequired;

                return (
                  <div 
                    key={plan.id} 
                    className={`plan-card ${isSelected ? 'selected' : ''} ${isRequired ? 'required' : ''} clickable`}
                    onClick={() => !isRequired && handlePlanToggle(plan.id, !isSelected)}
                  >
                    <div className="plan-header">
                      <h3 className="plan-name">{plan.name}</h3>
                      {isRequired && <span className="required-badge">필수</span>}
                    </div>
                    
                    <div className="plan-price">
                      <span className="price">{price.toLocaleString()}원</span>
                      <span className="period">/ {billingType === 'yearly' ? '년' : '월'}</span>
                    </div>

                    <div className="plan-status">
                      {isRequired ? (
                        <span className="status-text required">기본 포함</span>
                      ) : (
                        <span className={`status-text ${isSelected ? 'selected' : ''}`}>
                          {isSelected ? '✓ 선택됨' : '클릭하여 선택'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

            {/* 부가 서비스 */}
            <div className="plan-category">
              <h3 className="category-title">부가 서비스</h3>
            <div className="plans-grid">
              {PLANS.filter(plan => plan.category === 'addon').map(plan => {
                const isSelected = isPlanSelected(plan.id);
                const price = getPlanPrice(plan);
                const isDagymManagerSelected = isPlanSelected('dagym-manager'); // 다짐매니저 선택 여부
                const isDagymManager = plan.id === 'dagym-manager';
                const isDisabled = !isDagymManager && !isDagymManagerSelected;

                return (
                  <div 
                    key={plan.id} 
                    className={`plan-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : 'clickable'}`}
                    onClick={() => !isDisabled && handleAddonPlanToggle(plan.id, !isSelected)}
                  >
                    <div className="plan-header">
                      <h3 className="plan-name">{plan.name}</h3>
                      {isDagymManager && <span className="required-badge">기본 필수</span>}
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

                    <div className="plan-status">
                      {isDisabled ? (
                        <span className="status-text disabled">다짐매니저 필요</span>
                      ) : (
                        <span className={`status-text ${isSelected ? 'selected' : ''}`}>
                          {isSelected ? '✓ 선택됨' : '클릭하여 선택'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            </div>
          </div>
        </div>

        {/* 선택된 플랜 요약 */}
        <div className="form-section">
          <h2 className="section-title">선택된 플랜</h2>
          <div className="selected-summary">
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
