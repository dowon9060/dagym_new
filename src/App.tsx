import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext';
import { ContractProvider } from './context/ContractContext';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { BusinessInfoPage } from './pages/BusinessInfoPage';
import { AccountInfoPage } from './pages/AccountInfoPage';
import { RepresentativeInfoPage } from './pages/RepresentativeInfoPage';
import { PlanSelectionPage } from './pages/PlanSelectionPage';
import { PaymentPage } from './pages/PaymentPage';
import { ContractListPage } from './pages/ContractListPage';
import { ContractDetailPage } from './pages/ContractDetailPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { ClientContractPage } from './pages/ClientContractPage';
import { ROUTES } from './utils/constants';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <ContractProvider>
        <Router>
          <div className="app">
            <Routes>
                  {/* 공개 라우트 */}
                  <Route path={ROUTES.LOGIN} element={<LoginPage />} />
                  <Route path="/contract/:contractId" element={<ClientContractPage />} />
              
              {/* 보호된 라우트들 */}
              <Route 
                path={ROUTES.DASHBOARD} 
                element={
                  <ProtectedRoute fallback={<Navigate to={ROUTES.LOGIN} />}>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path={ROUTES.BUSINESS_INFO} 
                element={
                  <ProtectedRoute fallback={<Navigate to={ROUTES.LOGIN} />}>
                    <BusinessInfoPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path={ROUTES.ACCOUNT_INFO} 
                element={
                  <ProtectedRoute fallback={<Navigate to={ROUTES.LOGIN} />}>
                    <AccountInfoPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path={ROUTES.REPRESENTATIVE_INFO} 
                element={
                  <ProtectedRoute fallback={<Navigate to={ROUTES.LOGIN} />}>
                    <RepresentativeInfoPage />
                  </ProtectedRoute>
                } 
              />
              
                  <Route
                    path={ROUTES.PLAN_SELECTION}
                    element={
                      <ProtectedRoute fallback={<Navigate to={ROUTES.LOGIN} />}>
                        <PlanSelectionPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path={ROUTES.PAYMENT}
                    element={
                      <ProtectedRoute fallback={<Navigate to={ROUTES.LOGIN} />}>
                        <PaymentPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path={ROUTES.CONTRACT_LIST}
                    element={
                      <ProtectedRoute fallback={<Navigate to={ROUTES.LOGIN} />}>
                        <ContractListPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path={ROUTES.CONTRACT_DETAIL}
                    element={
                      <ProtectedRoute fallback={<Navigate to={ROUTES.LOGIN} />}>
                        <ContractDetailPage />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path={ROUTES.STATISTICS}
                    element={
                      <ProtectedRoute fallback={<Navigate to={ROUTES.LOGIN} />}>
                        <StatisticsPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 기본 리다이렉트 */}
                  <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} />} />

                  {/* 404 처리 */}
                  <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} />} />
            </Routes>
          </div>
        </Router>
      </ContractProvider>
    </AuthProvider>
  );
}

export default App;