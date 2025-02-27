import React, { useState } from 'react';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import './App.css';

// Components
import Toolbar from './components/Toolbar';
import EmployeeTable from './components/EmployeeTable';
import StatusLegend from './components/StatusLegend';
import Instructions from './components/Instructions';

// Store
import { useEmployeeStore } from './store/employeeStore';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const AppHeader = styled.header`
  margin-bottom: 20px;
`;

const MainContent = styled.main`
  @media (max-width: 768px) {
    overflow-x: hidden;
  }
`;

const Footer = styled.footer`
  margin-top: 40px;
  padding: 20px 0;
  text-align: center;
  color: #666;
  font-size: 14px;
  border-top: 1px solid #eee;
`;

function App() {
  const { employees } = useEmployeeStore();
  
  return (
    <Container>
      <AppHeader>
        <Toolbar />
      </AppHeader>
      
      <MainContent>
        <Instructions />
        <StatusLegend />
        <EmployeeTable employees={employees} />
      </MainContent>
      
      <Footer>
        &copy; {new Date().getFullYear()} Employee Management App
      </Footer>
      
      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#4CAF50',
            },
          },
          error: {
            style: {
              background: '#F44336',
            },
          },
          warning: {
            style: {
              background: '#FF9800',
            },
          },
        }}
      />
    </Container>
  );
}

export default App;
