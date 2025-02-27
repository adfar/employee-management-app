import React, { useState } from 'react';
import styled from 'styled-components';
import { FiPlus, FiEdit, FiEye, FiSave, FiTrash2, FiDownload } from 'react-icons/fi';
import { useEmployeeStore } from '../store/employeeStore';
import toast from 'react-hot-toast';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const ToolbarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ToolbarTitle = styled.h1`
  margin: 0;
  font-size: 24px;
  font-weight: 600;
  color: #333;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  background-color: ${props => {
    if (props.variant === 'danger') return '#f44336';
    if (props.variant === 'secondary') return '#e0e0e0';
    return '#4CAF50';
  }};
  color: ${props => (props.variant === 'secondary' ? '#333' : '#fff')};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
  }
`;

const AddEmployeeForm = styled.form`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Input = styled.input`
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  min-width: 200px;
  
  @media (max-width: 768px) {
    flex: 1;
  }
`;

const ShortcutHint = styled.span`
  margin-left: 5px;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: normal;
`;

const Toolbar: React.FC = () => {
  const { mode, toggleMode, addEmployee, employees } = useEmployeeStore();
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('');
  
  // Initialize the keyboard shortcuts hook
  useKeyboardShortcuts({
    toggleAddEmployee: () => setIsAddingEmployee(prev => !prev)
  });
  
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmployeeName.trim()) {
      toast.error('Please enter an employee name');
      return;
    }
    
    addEmployee(newEmployeeName);
    setNewEmployeeName('');
    setIsAddingEmployee(false);
    toast.success(`${newEmployeeName} added successfully`);
  };
  
  const exportEmployeeData = () => {
    try {
      const dataStr = JSON.stringify(employees, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileName = `employee-schedule-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileName);
      linkElement.click();
      
      toast.success('Employee data exported successfully');
    } catch (error) {
      toast.error('Failed to export employee data');
      console.error('Export error:', error);
    }
  };
  
  return (
    <ToolbarContainer>
      <ToolbarTitle>Employee Management</ToolbarTitle>
      
      <ButtonGroup>
        {isAddingEmployee ? (
          <AddEmployeeForm onSubmit={handleAddEmployee}>
            <Input
              type="text"
              placeholder="Employee Name"
              value={newEmployeeName}
              onChange={(e) => setNewEmployeeName(e.target.value)}
              autoFocus
            />
            <Button type="submit">
              <FiSave /> Save
            </Button>
            <Button 
              variant="secondary" 
              type="button" 
              onClick={() => setIsAddingEmployee(false)}
            >
              Cancel
            </Button>
          </AddEmployeeForm>
        ) : (
          <>
            <Button onClick={() => setIsAddingEmployee(true)}>
              <FiPlus /> Add Employee <ShortcutHint>A</ShortcutHint>
            </Button>
            <Button 
              variant="secondary" 
              onClick={toggleMode}
            >
              {mode === 'edit' ? (
                <><FiEye /> Manage Mode <ShortcutHint>E</ShortcutHint></>
              ) : (
                <><FiEdit /> Edit Mode <ShortcutHint>E</ShortcutHint></>
              )}
            </Button>
            <Button 
              variant="secondary" 
              onClick={exportEmployeeData}
            >
              <FiDownload /> Export Data
            </Button>
          </>
        )}
      </ButtonGroup>
    </ToolbarContainer>
  );
};

export default Toolbar;