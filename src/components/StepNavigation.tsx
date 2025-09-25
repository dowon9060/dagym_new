import React from 'react';
import { useContract } from '../context/ContractContext';
import { FORM_STEPS } from '../utils/constants';

interface StepNavigationProps {
  onStepClick?: (step: number) => void;
  className?: string;
}

export function StepNavigation({ onStepClick, className = '' }: StepNavigationProps) {
  const { state, canProceedToStep, isStepCompleted } = useContract();

  const handleStepClick = (step: number) => {
    if (canProceedToStep(step) && onStepClick) {
      onStepClick(step);
    }
  };

  return (
    <div className={`step-navigation ${className}`}>
      <div className="steps-container">
        {FORM_STEPS.map((step, index) => {
          const isActive = state.currentStep === step.id;
          const isCompleted = isStepCompleted(step.id);
          const isAccessible = canProceedToStep(step.id);
          const isClickable = isAccessible && onStepClick;

          return (
            <div key={step.id} className="step-item">
              {/* 단계 원형 표시 */}
              <div
                className={`step-circle ${isActive ? 'active' : ''} ${
                  isCompleted ? 'completed' : ''
                } ${isAccessible ? 'accessible' : 'disabled'} ${
                  isClickable ? 'clickable' : ''
                }`}
                onClick={() => isClickable && handleStepClick(step.id)}
              >
                {isCompleted ? (
                  <span className="check-icon">✓</span>
                ) : (
                  <span className="step-number">{step.id}</span>
                )}
              </div>

              {/* 단계 라벨 */}
              <div
                className={`step-label ${isActive ? 'active' : ''} ${
                  isAccessible ? 'accessible' : 'disabled'
                }`}
              >
                {step.name}
              </div>

              {/* 연결선 (마지막 단계가 아닌 경우) */}
              {index < FORM_STEPS.length - 1 && (
                <div
                  className={`step-connector ${
                    isCompleted ? 'completed' : ''
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
