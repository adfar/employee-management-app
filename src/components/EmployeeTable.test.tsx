import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EmployeeTable from '../components/EmployeeTable';
import { Employee } from '../types';
import { useEmployeeStore } from '../store/employeeStore';

// Mock the Zustand store
vi.mock('../store/employeeStore', () => ({
  useEmployeeStore: vi.fn(),
}));

// Mock toast notifications
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('EmployeeTable Component', () => {
  // Sample employee data for testing
  const mockEmployees: Employee[] = [
    {
      id: '1',
      name: 'John Doe',
      shift: { start: '9:00', end: '17:00' },
      break1: { start: '10:30', end: '10:45' },
      lunch: { start: '12:00', end: '13:00' },
      break2: { start: '15:00', end: '15:15' },
      status: 'idle',
      statusHistory: [],
    },
  ];

  const mockUpdateEmployeeStatus = vi.fn();
  const mockUpdateEmployee = vi.fn();
  const mockRemoveEmployee = vi.fn();

  beforeEach(() => {
    // Reset the mock implementations
    vi.mocked(useEmployeeStore).mockReturnValue({
      mode: 'manage',
      updateEmployeeStatus: mockUpdateEmployeeStatus,
      updateEmployee: mockUpdateEmployee,
      removeEmployee: mockRemoveEmployee,
    });
  });

  it('renders employee data correctly', () => {
    render(<EmployeeTable employees={mockEmployees} />);
    
    // Check if employee name is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check if shift times are rendered
    expect(screen.getByText('9:00 - 17:00')).toBeInTheDocument();
    
    // Check if break times are rendered
    expect(screen.getByText('10:30 - 10:45')).toBeInTheDocument();
    expect(screen.getByText('12:00 - 13:00')).toBeInTheDocument();
    expect(screen.getByText('15:00 - 15:15')).toBeInTheDocument();
  });

  it('updates employee status correctly when name cell is clicked', () => {
    render(<EmployeeTable employees={mockEmployees} />);
    
    // Click on the employee name cell
    fireEvent.click(screen.getByText('John Doe'));
    
    // Check if updateEmployeeStatus was called with the correct parameters
    expect(mockUpdateEmployeeStatus).toHaveBeenCalledWith('1', 'active');
  });

  it('displays empty state message when no employees', () => {
    render(<EmployeeTable employees={[]} />);
    
    // Check if empty state message is displayed
    expect(screen.getByText(/No employees added yet/i)).toBeInTheDocument();
  });
  
  it('does not trigger status updates in edit mode', () => {
    vi.mocked(useEmployeeStore).mockReturnValue({
      mode: 'edit',
      updateEmployeeStatus: mockUpdateEmployeeStatus,
      updateEmployee: mockUpdateEmployee,
      removeEmployee: mockRemoveEmployee,
    });
    
    render(<EmployeeTable employees={mockEmployees} />);
    
    // Click on the employee name cell
    fireEvent.click(screen.getByText('John Doe'));
    
    // Check that updateEmployeeStatus was not called
    expect(mockUpdateEmployeeStatus).not.toHaveBeenCalled();
  });
});