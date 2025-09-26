import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

export function FacilityManagementPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const handleOpenRegisterModal = () => {
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  // 임시 시설 데이터 (추후 API에서 가져올 예정)
  const facilities = [
    {
      id: 1,
      name: '강남점',
      type: '헬스장',
      status: '운영중',
      memberCount: 234,
      revenue: 12500000,
    },
    {
      id: 2,
      name: '홍대점',
      type: '크로스핏',
      status: '운영중',
      memberCount: 156,
      revenue: 8900000,
    },
    {
      id: 3,
      name: '잠실점',
      type: '필라테스',
      status: '휴업',
      memberCount: 89,
      revenue: 5600000,
    },
  ];

  const totalMembers = facilities.reduce((sum, facility) => sum + facility.memberCount, 0);
  const totalRevenue = facilities.reduce((sum, facility) => sum + facility.revenue, 0);

  return (
    <div className="dashboard-page">
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
              <h1 className="dashboard-title">시설관리</h1>
              <p className="welcome-message">
                {user?.name}님의 시설 현황
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

      {/* 메인 콘텐츠 */}
      <main className="dashboard-main">
        <div className="dashboard-container">
          
          {/* 요약 통계 */}
          <section className="stats-section">
            <h2 className="section-title">시설 현황</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{facilities.length}</div>
                  <div className="stat-label">총 시설 수</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{totalMembers.toLocaleString()}</div>
                  <div className="stat-label">총 회원 수</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{(totalRevenue / 10000).toLocaleString()}만원</div>
                  <div className="stat-label">이번 달 매출</div>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-content">
                  <div className="stat-number">{facilities.filter(f => f.status === '운영중').length}</div>
                  <div className="stat-label">운영중 시설</div>
                </div>
              </div>
            </div>
          </section>

          {/* 시설 목록 */}
          <section className="facilities-section">
            <div className="section-header">
              <h2 className="section-title">시설 목록</h2>
              <button 
                onClick={handleOpenRegisterModal}
                className="btn-primary"
              >
                + 시설 등록
              </button>
            </div>
            <div className="facilities-table-container">
              <table className="facilities-table">
                <thead>
                  <tr>
                    <th>시설명</th>
                    <th>타입</th>
                    <th>운영상태</th>
                    <th>회원 수</th>
                    <th>이번 달 매출</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {facilities.map((facility) => (
                    <tr key={facility.id} className="facility-row">
                      <td className="facility-name">{facility.name}</td>
                      <td className="facility-type">{facility.type}</td>
                      <td>
                        <span className={`facility-status ${facility.status === '운영중' ? 'active' : 'inactive'}`}>
                          {facility.status}
                        </span>
                      </td>
                      <td className="facility-members">{facility.memberCount}명</td>
                      <td className="facility-revenue">{(facility.revenue / 10000).toLocaleString()}만원</td>
                      <td className="facility-actions">
                        <button className="btn-outline btn-sm">상세보기</button>
                        <button className="btn-outline btn-sm">관리</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>

      {/* 시설 등록 모달 */}
      {isRegisterModalOpen && <FacilityRegisterModal onClose={handleCloseRegisterModal} />}
    </div>
  );
}

// 시설 등록 모달 컴포넌트
function FacilityRegisterModal({ onClose }: { onClose: () => void }) {
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    storeName: '',
    storeAddress: '',
    storeDetailAddress: '',
    category: '',
    description: '',
    photos: [] as File[],
    membershipCards: [] as File[],
    notice: '',
    operatingHours: {
      monday: { start: '09:00', end: '22:00', closed: false },
      tuesday: { start: '09:00', end: '22:00', closed: false },
      wednesday: { start: '09:00', end: '22:00', closed: false },
      thursday: { start: '09:00', end: '22:00', closed: false },
      friday: { start: '09:00', end: '22:00', closed: false },
      saturday: { start: '10:00', end: '18:00', closed: false },
      sunday: { start: '10:00', end: '18:00', closed: false },
    },
    holidays: [] as string[],
  });

  // 임시 사업자 데이터
  const businesses = [
    { id: 1, name: '㈜다짐피트니스', businessNumber: '123-45-67890', representative: '김대표' },
    { id: 2, name: '헬스케어㈜', businessNumber: '234-56-78901', representative: '이대표' },
    { id: 3, name: '스포츠센터㈜', businessNumber: '345-67-89012', representative: '박대표' },
  ];

  // 카테고리 옵션들
  const categories = [
    '헬스', 'P.T', 'G.X', '요가', '필라테스', '무술/권투', 
    '크로스핏', '댄스/체조/다이어트', '구기/라켓', '클라이밍',
    '관리/사우나', '사이클/스케이트', '수영/수상', '기타'
  ];

  const filteredBusinesses = businesses.filter(business =>
    business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.businessNumber.includes(searchTerm) ||
    business.representative.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBusinessSelect = (business: any) => {
    setSelectedBusiness(business);
    setSearchTerm('');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: string, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field as keyof typeof prev] as File[], ...fileArray]
      }));
    }
  };

  const handleAddressSearch = () => {
    if (window.daum && window.daum.Postcode) {
      new window.daum.Postcode({
        oncomplete: function(data: any) {
          const fullAddress = data.roadAddress || data.jibunAddress;
          handleInputChange('storeAddress', fullAddress);
        }
      }).open();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 여기서 API 호출하여 시설 등록
    console.log('시설 등록 데이터:', { selectedBusiness, formData });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content facility-register-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>시설 등록</h2>
          <button onClick={onClose} className="modal-close-btn">×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* 사업자 연결하기 */}
          <div className="form-section">
            <h3 className="form-section-title">사업자 연결하기</h3>
            
            {!selectedBusiness ? (
              <div className="business-search">
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="사업자명, 사업자번호, 대표자명으로 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field"
                  />
                </div>
                
                {searchTerm && (
                  <div className="search-results">
                    {filteredBusinesses.map(business => (
                      <div 
                        key={business.id} 
                        className="business-item"
                        onClick={() => handleBusinessSelect(business)}
                      >
                        <div className="business-name">{business.name}</div>
                        <div className="business-details">
                          <span>사업자번호: {business.businessNumber}</span>
                          <span>대표자: {business.representative}</span>
                        </div>
                      </div>
                    ))}
                    {filteredBusinesses.length === 0 && (
                      <div className="no-results">검색 결과가 없습니다.</div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="selected-business">
                <div className="business-info">
                  <h4>{selectedBusiness.name}</h4>
                  <p>사업자번호: {selectedBusiness.businessNumber}</p>
                  <p>대표자: {selectedBusiness.representative}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedBusiness(null)}
                  className="btn-outline btn-sm"
                >
                  변경
                </button>
              </div>
            )}
          </div>

          {/* 매장 정보 입력 */}
          {selectedBusiness && (
            <>
              {/* 매장명 */}
              <div className="form-section">
                <h3 className="form-section-title">매장 정보</h3>
                
                <div className="form-group">
                  <label className="form-label">매장명 *</label>
                  <input
                    type="text"
                    value={formData.storeName}
                    onChange={(e) => handleInputChange('storeName', e.target.value)}
                    className="input-field"
                    placeholder="매장명을 입력하세요"
                    required
                  />
                </div>

                {/* 매장주소 */}
                <div className="form-group">
                  <label className="form-label">매장주소 *</label>
                  <div className="address-input-container">
                    <input
                      type="text"
                      value={formData.storeAddress}
                      className="input-field"
                      placeholder="주소 검색 버튼을 클릭하세요"
                      readOnly
                      required
                    />
                    <button
                      type="button"
                      onClick={handleAddressSearch}
                      className="address-search-btn"
                    >
                      🔍 주소 검색
                    </button>
                  </div>
                </div>

                {/* 상세주소 */}
                <div className="form-group">
                  <label className="form-label">상세주소</label>
                  <input
                    type="text"
                    value={formData.storeDetailAddress}
                    onChange={(e) => handleInputChange('storeDetailAddress', e.target.value)}
                    className="input-field"
                    placeholder="상세주소를 입력하세요"
                  />
                </div>

                {/* 카테고리 */}
                <div className="form-group">
                  <label className="form-label">카테고리 *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="select-field"
                    required
                  >
                    <option value="">카테고리를 선택하세요</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                {/* 매장소개 */}
                <div className="form-group">
                  <label className="form-label">매장소개 (300자 이내)</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value.slice(0, 300))}
                    className="textarea-field"
                    placeholder="매장을 소개해주세요"
                    rows={4}
                    maxLength={300}
                  />
                  <div className="char-count">{formData.description.length}/300</div>
                </div>

                {/* 매장 사진 */}
                <div className="form-group">
                  <label className="form-label">매장 사진 (최소 10개 이상) *</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload('photos', e.target.files)}
                    className="file-input"
                  />
                  <div className="file-count">업로드된 사진: {formData.photos.length}개</div>
                </div>

                {/* 회원권 등록 */}
                <div className="form-group">
                  <label className="form-label">회원권 등록</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload('membershipCards', e.target.files)}
                    className="file-input"
                  />
                  <div className="file-count">업로드된 회원권: {formData.membershipCards.length}개</div>
                </div>

                {/* 공지사항 */}
                <div className="form-group">
                  <label className="form-label">공지사항 (300자 이내)</label>
                  <textarea
                    value={formData.notice}
                    onChange={(e) => handleInputChange('notice', e.target.value.slice(0, 300))}
                    className="textarea-field"
                    placeholder="공지사항을 입력하세요"
                    rows={3}
                    maxLength={300}
                  />
                  <div className="char-count">{formData.notice.length}/300</div>
                </div>
              </div>

              {/* 운영시간 */}
              <div className="form-section">
                <h3 className="form-section-title">운영시간</h3>
                <div className="operating-hours">
                  {Object.entries(formData.operatingHours).map(([day, hours]) => (
                    <div key={day} className="operating-hour-row">
                      <div className="day-label">
                        {day === 'monday' ? '월요일' :
                         day === 'tuesday' ? '화요일' :
                         day === 'wednesday' ? '수요일' :
                         day === 'thursday' ? '목요일' :
                         day === 'friday' ? '금요일' :
                         day === 'saturday' ? '토요일' : '일요일'}
                      </div>
                      <label className="checkbox-label">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={(e) => {
                            setFormData(prev => ({
                              ...prev,
                              operatingHours: {
                                ...prev.operatingHours,
                                [day]: { ...hours, closed: e.target.checked }
                              }
                            }));
                          }}
                          className="checkbox-field"
                        />
                        <span className="checkbox-custom"></span>
                        휴무
                      </label>
                      {!hours.closed && (
                        <div className="time-inputs">
                          <input
                            type="time"
                            value={hours.start}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                operatingHours: {
                                  ...prev.operatingHours,
                                  [day]: { ...hours, start: e.target.value }
                                }
                              }));
                            }}
                            className="time-input"
                          />
                          <span>~</span>
                          <input
                            type="time"
                            value={hours.end}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                operatingHours: {
                                  ...prev.operatingHours,
                                  [day]: { ...hours, end: e.target.value }
                                }
                              }));
                            }}
                            className="time-input"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              취소
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={!selectedBusiness || !formData.storeName || !formData.storeAddress || !formData.category || formData.photos.length < 10}
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
