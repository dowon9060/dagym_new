import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useContract } from '../context/ContractContext';
import { StepNavigation } from '../components/StepNavigation';
import { SelectedPlan } from '../types';
import { ROUTES, PLANS } from '../utils/constants';

export function PlanSelectionPage() {
  const navigate = useNavigate();
  const { state, setSelectedPlans, setCurrentStep } = useContract();
  
  const [localSelectedPlans, setLocalSelectedPlans] = useState<SelectedPlan[]>(state.selectedPlans);
  const [billingType, setBillingType] = useState<'monthly' | 'yearly'>('yearly');
  const [isPartner, setIsPartner] = useState(false);

  // 기본 플랜 선택/해제 처리 (단일 선택)
  const handlePlanToggle = (planId: string, isSelected: boolean) => {
    console.log('🔍 handlePlanToggle 호출:', { planId, isSelected, currentPlans: localSelectedPlans });
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) {
      console.log('❌ 플랜을 찾을 수 없습니다:', planId);
      return;
    }

    if (isSelected) {
      // 기본 플랜은 단일 선택이므로 기존 기본 플랜들을 모두 제거하고 새로운 플랜 추가
      const newPlans = localSelectedPlans.filter(p => {
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

      console.log('✅ 기본 플랜 추가:', newPlan);
      setLocalSelectedPlans([...newPlans, newPlan]);
    } else {
      // 플랜 제거
      setLocalSelectedPlans(prev => prev.filter(p => p.planId !== planId));
    }
  };

  // 부가 서비스 선택/해제 처리 (복수 선택)
  const handleAddonPlanToggle = (planId: string, isSelected: boolean) => {
    console.log('🔍 handleAddonPlanToggle 호출:', { planId, isSelected, currentPlans: localSelectedPlans });
    const plan = PLANS.find(p => p.id === planId);
    if (!plan) {
      console.log('❌ 플랜을 찾을 수 없습니다:', planId);
      return;
    }

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

      console.log('✅ 부가 서비스 추가:', newPlan);
      setLocalSelectedPlans(prev => [...prev, newPlan]);
    } else {
      // 플랜 제거
      setLocalSelectedPlans(prev => {
        const filtered = prev.filter(p => p.planId !== planId);
        
                // 다짐매니저를 제거하는 경우, 다른 부가서비스들도 모두 제거
                if (planId === 'manager') {
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
    const updatedPlans = localSelectedPlans.map(selectedPlan => {
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
  }, [billingType, isPartner, localSelectedPlans]);

  // 자동 제휴가 계산 로직
  useEffect(() => {
    // 매출솔루션(main 카테고리) 플랜이 하나라도 선택되어 있으면 제휴가
    const hasMainPlan = localSelectedPlans.some((plan: SelectedPlan) => {
      const planInfo = PLANS.find(p => p.id === plan.planId);
      return planInfo?.category === 'main';
    });
    setIsPartner(hasMainPlan);
  }, [localSelectedPlans]);

  const handleSubmit = () => {
    // 선택된 플랜을 그대로 저장 (로컬 상태 기준)
    setSelectedPlans(localSelectedPlans);
    setCurrentStep(5);
    navigate(ROUTES.PAYMENT);
  };

  const handleStepClick = (step: number) => {
    setSelectedPlans(localSelectedPlans);
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
    setSelectedPlans(localSelectedPlans);
    setCurrentStep(3);
    navigate(ROUTES.REPRESENTATIVE_INFO);
  };

  // 총 금액 계산 (로컬 상태 기준)
  const totalAmount = localSelectedPlans.reduce((sum: number, plan: SelectedPlan) => sum + plan.price, 0);

  // 플랜이 선택되었는지 확인 (로컬 상태 기준)
  const isPlanSelected = (planId: string) => {
    return localSelectedPlans.some((p: SelectedPlan) => p.planId === planId);
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

          </div>
        </div>

        {/* 운영솔루션 */}
        <div className="form-section">
          <h2 className="section-title">운영솔루션</h2>
          <p className="form-subtitle">
            체육시설 운영에 필요한 솔루션을 선택해주세요 (선택사항)
          </p>
          <div className="plans-section">
            <div className="plan-category">
              <div className="plans-grid">
                {PLANS.filter(plan => plan.category === 'addon').map(plan => {
                  const isSelected = isPlanSelected(plan.id);
                  const price = getPlanPrice(plan);
                  const isDagymManagerSelected = isPlanSelected('manager'); // 다짐매니저 선택 여부
                  const isDagymManager = plan.id === 'manager';
                  // 다짐매니저는 항상 선택 가능, 다른 부가서비스는 다짐매니저 선택 후에만 선택 가능
                  const isDisabled = !isDagymManager && !isDagymManagerSelected;

                  // 디버깅 정보 (개발 중에만)
                  if (plan.id === 'manager') {
                    console.log('다짐매니저:', { isSelected, isDagymManagerSelected });
                  } else {
                    console.log(`${plan.name}:`, { isSelected, isDisabled, isDagymManagerSelected });
                  }

                  return (
                    <div 
                      key={plan.id} 
                      className={`plan-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : 'clickable'}`}
                      onClick={() => !isDisabled && handleAddonPlanToggle(plan.id, !isSelected)}
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

                      {isDisabled && (
                        <div className="plan-status">
                          <span className="status-text disabled">
                            ⚠️ 다짐매니저 선택 후 이용 가능
                          </span>
                        </div>
                      )}
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
            {localSelectedPlans.length > 0 ? (
              <div className="selected-plans">
                <div className="partner-status">
                  <span className={`partner-badge ${isPartner ? 'partner' : 'non-partner'}`}>
                    {isPartner ? '🤝 제휴가 적용' : '🏢 비제휴가 적용'}
                  </span>
                </div>
                {localSelectedPlans.map((plan: SelectedPlan) => (
                  <div key={plan.planId} className="selected-plan-item">
                    <span className="plan-name">
                      {plan.planName} ({billingType === 'yearly' ? '연간' : '월간'})
                    </span>
                    <span className="plan-price">
                      {plan.price.toLocaleString()}원/{billingType === 'yearly' ? '년' : '월'}
                    </span>
                  </div>
                ))}
                <div className="total-amount">
                  <strong>총 합계: {totalAmount.toLocaleString()}원 / {billingType === 'yearly' ? '년' : '월'}</strong>
                </div>
              </div>
            ) : (
              <p className="no-selection">선택된 플랜이 없습니다</p>
            )}
          </div>
        </div>

        {/* 매출솔루션 */}
        <div className="form-section">
          <h2 className="section-title">매출솔루션</h2>
          <p className="form-subtitle">
            매출 관리를 위한 솔루션을 선택해주세요 (선택사항)
          </p>
          <div className="plans-section">
            <div className="plan-category">
              <div className="plans-grid">
                {PLANS.filter(plan => plan.category === 'main').map(plan => {
                  const isSelected = isPlanSelected(plan.id);
                  const price = getPlanPrice(plan);
                  const isRequired = plan.isRequired;

                  return (
                    <div 
                      key={plan.id} 
                      className={`plan-card ${isSelected ? 'selected' : ''} ${isRequired ? 'required' : ''} clickable`}
                      onClick={() => handlePlanToggle(plan.id, !isSelected)}
                    >
                      <div className="plan-header">
                        <h3 className="plan-name">{plan.name}</h3>
                        {isRequired && <span className="required-badge">필수</span>}
                      </div>
                      
                      <div className="plan-price">
                        <span className="price">{price.toLocaleString()}원</span>
                        <span className="period">/ {billingType === 'yearly' ? '년' : '월'}</span>
                      </div>

                      {isRequired && (
                        <div className="plan-status">
                          <span className="status-text required">🎯 기본 포함</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
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
          >
            다음 단계
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
