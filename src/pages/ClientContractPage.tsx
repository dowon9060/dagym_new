import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { 
  ALL_AGREEMENT_ITEMS, 
  FEE_CONDITIONS,
  REQUIRED_TERMS,
  OPTIONAL_TERMS 
} from '../utils/contractTerms';
import { ContractInfo } from '../types';

export function ClientContractPage() {
  const { contractId } = useParams<{ contractId: string }>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const navigate = useNavigate();
  const signatureRef = useRef<SignatureCanvas>(null);
  
  const [contract, setContract] = useState<ContractInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState<'terms' | 'signature' | 'complete'>('terms');
  const [agreements, setAgreements] = useState<Record<string, boolean>>({});
  const [allAgreed, setAllAgreed] = useState(false);
  const [signatureData, setSignatureData] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // 계약서 정보 로드
  useEffect(() => {
    const loadContract = async () => {
      try {
        // TODO: 실제 API 호출로 대체
        // 임시 데이터
        const mockContract: ContractInfo = {
          id: contractId,
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
          clientContact: {
            name: '김대표',
            email: 'ceo@healthcare-gym.com',
            phone: '010-1234-5678',
          },
          sendMethod: 'email',
        };

        setContract(mockContract);
      } catch (error) {
        console.error('계약서 로드 실패:', error);
        alert('계약서를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (contractId) {
      loadContract();
    }
  }, [contractId]);

  // 전체 동의 처리
  const handleAllAgreement = (checked: boolean) => {
    setAllAgreed(checked);
    const newAgreements: Record<string, boolean> = {};
    
    if (checked) {
      ALL_AGREEMENT_ITEMS.forEach(item => {
        newAgreements[item.id] = true;
      });
    } else {
      ALL_AGREEMENT_ITEMS.forEach(item => {
        newAgreements[item.id] = false;
      });
    }
    
    setAgreements(newAgreements);
  };

  // 개별 동의 처리
  const handleAgreementChange = (itemId: string, checked: boolean) => {
    const newAgreements = { ...agreements, [itemId]: checked };
    setAgreements(newAgreements);

    // 전체 동의 상태 업데이트
    const allChecked = ALL_AGREEMENT_ITEMS.every(item => newAgreements[item.id]);
    setAllAgreed(allChecked);
  };

  // 필수 동의 확인
  const isRequiredAgreementsComplete = () => {
    return REQUIRED_TERMS.every(term => agreements[term.id]);
  };

  // 서명 단계로 이동
  const handleProceedToSignature = () => {
    if (!isRequiredAgreementsComplete()) {
      alert('필수 동의항목을 모두 체크해주세요.');
      return;
    }
    setStep('signature');
  };

  // 서명 완료
  const handleSignatureComplete = async () => {
    if (!signatureRef.current || signatureRef.current.isEmpty()) {
      alert('서명을 입력해주세요.');
      return;
    }

    const signatureDataURL = signatureRef.current.toDataURL();
    setSignatureData(signatureDataURL);
    setSubmitting(true);

    try {
      // TODO: 실제 API 호출로 대체
      console.log('계약서 서명 완료:', {
        contractId,
        agreements,
        signature: signatureDataURL,
        timestamp: new Date(),
      });

      // 임시 딜레이
      await new Promise(resolve => setTimeout(resolve, 2000));

      setStep('complete');
    } catch (error) {
      console.error('서명 저장 실패:', error);
      alert('서명 저장에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  // 서명 지우기
  const handleClearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear();
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString() + '원';
  };

  if (loading) {
    return (
      <div className="client-contract-loading">
        <div className="loading-spinner">계약서를 불러오는 중...</div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="client-contract-error">
        <h2>계약서를 찾을 수 없습니다</h2>
        <p>유효하지 않은 계약서 링크입니다.</p>
      </div>
    );
  }

  // 완료 화면
  if (step === 'complete') {
    return (
      <div className="client-contract-complete">
        <div className="complete-content">
          <h2 className="complete-title">계약서 서명이 완료되었습니다!</h2>
          <div className="complete-info">
            <p><strong>사업자명:</strong> {contract.businessInfo.businessName}</p>
            <p><strong>계약금액:</strong> {formatAmount(contract.totalAmount)}</p>
            <p><strong>서명일시:</strong> {new Date().toLocaleString()}</p>
          </div>
          <p className="complete-message">
            계약서 서명이 성공적으로 완료되었습니다.<br />
            결제 안내가 곧 발송될 예정입니다.
          </p>
        </div>
      </div>
    );
  }

  // 서명 화면
  if (step === 'signature') {
    return (
      <div className="client-contract-signature">
        <div className="signature-header">
          <h2>전자서명</h2>
          <p>아래 서명란에 서명해주세요.</p>
        </div>

        <div className="contract-summary">
          <h3>계약 내용 확인</h3>
          <div className="summary-item">
            <span className="label">사업자명:</span>
            <span className="value">{contract.businessInfo.businessName}</span>
          </div>
          <div className="summary-item">
            <span className="label">대표자:</span>
            <span className="value">{contract.representativeInfo.name}</span>
          </div>
          <div className="summary-item">
            <span className="label">계약금액:</span>
            <span className="value">{formatAmount(contract.totalAmount)}</span>
          </div>
          <div className="summary-item">
            <span className="label">선택플랜:</span>
            <div className="plans-list">
              {contract.selectedPlans.map((plan, index) => (
                <div key={index} className="plan-item">
                  {plan.planName} ({plan.billingType === 'monthly' ? '월간' : '연간'}): {formatAmount(plan.price)}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="signature-section">
          <h4>서명</h4>
          <div className="signature-canvas-container">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                width: 500,
                height: 200,
                className: 'signature-canvas'
              }}
            />
          </div>
          <div className="signature-controls">
            <button
              type="button"
              onClick={handleClearSignature}
              className="clear-signature-btn"
            >
              지우기
            </button>
          </div>
        </div>

        <div className="signature-actions">
          <button
            onClick={() => setStep('terms')}
            className="back-btn"
            disabled={submitting}
          >
            이전
          </button>
          <button
            onClick={handleSignatureComplete}
            className="complete-btn"
            disabled={submitting}
          >
            {submitting ? '처리 중...' : '서명 완료'}
          </button>
        </div>
      </div>
    );
  }

  // 약관 동의 화면
  return (
    <div className="client-contract-terms">
      <div className="contract-header">
        <h1>다짐 제휴 계약서</h1>
        <div className="contract-info">
          <p><strong>사업자명:</strong> {contract.businessInfo.businessName}</p>
          <p><strong>대표자:</strong> {contract.representativeInfo.name}</p>
          <p><strong>계약금액:</strong> {formatAmount(contract.totalAmount)}</p>
        </div>
      </div>

      <div className="fee-conditions-section">
        <h2>{FEE_CONDITIONS.title}</h2>
        <div className="fee-content">
          <pre>{FEE_CONDITIONS.content}</pre>
        </div>
      </div>

      <div className="terms-section">
        <h2>계약 약관</h2>
        
        {/* 전체 동의 */}
        <div className="all-agreement">
          <label className="agreement-item all">
            <input
              type="checkbox"
              checked={allAgreed}
              onChange={(e) => handleAllAgreement(e.target.checked)}
            />
            <span className="checkmark"></span>
            <span className="agreement-text">
              <strong>전체 동의하기</strong>
            </span>
          </label>
        </div>

        <div className="agreement-divider"></div>

        {/* 필수 동의항목 */}
        <div className="required-agreements">
          <h3>필수 동의항목</h3>
          {REQUIRED_TERMS.map((term) => (
            <div key={term.id} className="agreement-item">
              <label>
                <input
                  type="checkbox"
                  checked={agreements[term.id] || false}
                  onChange={(e) => handleAgreementChange(term.id, e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="agreement-text">
                  <strong>[필수] {term.title}</strong>
                </span>
              </label>
              <div className="agreement-content">
                <pre>{term.content}</pre>
              </div>
            </div>
          ))}
        </div>

        {/* 선택 동의항목 */}
        <div className="optional-agreements">
          <h3>선택 동의항목</h3>
          {OPTIONAL_TERMS.map((term) => (
            <div key={term.id} className="agreement-item">
              <label>
                <input
                  type="checkbox"
                  checked={agreements[term.id] || false}
                  onChange={(e) => handleAgreementChange(term.id, e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="agreement-text">
                  <strong>[선택] {term.title}</strong>
                </span>
              </label>
              <div className="agreement-content">
                <pre>{term.content}</pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="terms-actions">
        <button
          onClick={handleProceedToSignature}
          className="proceed-btn"
          disabled={!isRequiredAgreementsComplete()}
        >
          서명하기
        </button>
      </div>
    </div>
  );
}
