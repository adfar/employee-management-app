import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Employee } from '../types';
import { getStatusColor, convertTo12HourFormat } from '../utils';
import { useEmployeeStore } from '../store/employeeStore';
import { FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

// Styled components for our table
const TableContainer = styled.div`
  overflow-x: auto;
  max-width: 100%;
  -webkit-overflow-scrolling: touch; /* Improves scrolling on iOS */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
  background-color: #fff;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
`;

const TableHeader = styled.th`
  padding: 12px 16px;
  text-align: left;
  background-color: #f5f5f5;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 10;
  
  @media (max-width: 768px) {
    font-size: 14px;
    padding: 10px 8px;
  }
`;

interface CellProps {
  status?: string;
  isClickable?: boolean;
  isEditing?: boolean;
  finishedBreak?: boolean;
}

const TableCell = styled.td<CellProps>`
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
  background-color: ${(props) => {
    // For breaks and lunch that have been completed, use active color (green)
    if (props.finishedBreak) {
      return getStatusColor('active');
    }
    return props.status ? getStatusColor(props.status) : 'transparent';
  }};
  opacity: ${(props) => props.status === 'completed' ? 0.7 : 1};
  transition: all 0.2s ease;
  cursor: ${(props) => (props.isClickable && !props.isEditing) ? 'pointer' : 'default'};
  
  @media (max-width: 768px) {
    padding: 10px 8px;
    font-size: 14px;
  }
  
  &:hover {
    background-color: ${(props) => 
      props.isClickable && !props.isEditing 
        ? props.status 
          ? `${getStatusColor(props.status)}dd` 
          : '#f9f9f9' 
        : props.status 
          ? getStatusColor(props.status) 
          : 'transparent'};
  }
`;

const TimeInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  @media (max-width: 768px) {
    padding: 6px;
    font-size: 13px;
  }
`;

const NameInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  @media (max-width: 768px) {
    padding: 6px;
    font-size: 13px;
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  color: #f44336;
  cursor: pointer;
  padding: 4px;
  margin-left: 8px;
  opacity: 0.7;
  transition: all 0.2s;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const EmptyStateMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: #757575;
  font-style: italic;
`;

const EmployeeTableRow = styled.tr`
  &:hover {
    background-color: rgba(0, 0, 0, 0.01);
  }
`;

interface EmployeeTableProps {
  employees: Employee[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
  const { mode, updateEmployee, updateEmployeeStatus, removeEmployee } = useEmployeeStore();
  
  // Track if breaks/lunch have been taken
  const [finishedBreaks, setFinishedBreaks] = React.useState<Record<string, Record<string, boolean>>>({});
  
  const handleCellClick = (employee: Employee, field: string) => {
    if (mode === 'edit') return;
    
    // Handle status changes based on which field was clicked
    switch (field) {
      case 'name':
        if (employee.status === 'idle') {
          updateEmployeeStatus(employee.id, 'active');
          toast.success(`${employee.name} clocked in`);
        } else if (employee.status === 'active' || ['break1', 'lunch', 'break2'].includes(employee.status)) {
          updateEmployeeStatus(employee.id, 'completed');
          toast.success(`${employee.name} clocked out`);
        } else if (employee.status === 'completed') {
          updateEmployeeStatus(employee.id, 'idle');
          toast(`${employee.name} reset to idle`);
        }
        break;
        
      case 'shift':
        if (['idle', 'active'].includes(employee.status)) {
          if (employee.status === 'tardy') {
            updateEmployeeStatus(employee.id, 'active');
            toast(`${employee.name} no longer marked as tardy`);
          } else {
            updateEmployeeStatus(employee.id, 'tardy');
            toast(`${employee.name} marked as tardy`);
          }
        } else if (employee.status === 'tardy') {
          updateEmployeeStatus(employee.id, 'absent');
          toast.error(`${employee.name} marked as absent`);
        } else if (employee.status === 'absent') {
          updateEmployeeStatus(employee.id, 'idle');
          toast(`${employee.name} reset to idle`);
        }
        break;
        
      case 'break1':
        if (employee.status === 'active') {
          updateEmployeeStatus(employee.id, 'break1');
          toast(`${employee.name} on first break`);
        } else if (employee.status === 'break1') {
          updateEmployeeStatus(employee.id, 'active');
          toast.success(`${employee.name} returned from first break`);
          
          // Mark break1 as complete
          setFinishedBreaks(prev => ({
            ...prev,
            [employee.id]: {
              ...prev[employee.id],
              break1: true
            }
          }));
        }
        break;
        
      case 'lunch':
        if (employee.status === 'active') {
          updateEmployeeStatus(employee.id, 'lunch');
          toast(`${employee.name} on lunch`);
        } else if (employee.status === 'lunch') {
          updateEmployeeStatus(employee.id, 'active');
          toast.success(`${employee.name} returned from lunch`);
          
          // Mark lunch as complete
          setFinishedBreaks(prev => ({
            ...prev,
            [employee.id]: {
              ...prev[employee.id],
              lunch: true
            }
          }));
        }
        break;
        
      case 'break2':
        if (employee.status === 'active') {
          updateEmployeeStatus(employee.id, 'break2');
          toast(`${employee.name} on second break`);
        } else if (employee.status === 'break2') {
          updateEmployeeStatus(employee.id, 'active');
          toast.success(`${employee.name} returned from second break`);
          
          // Mark break2 as complete
          setFinishedBreaks(prev => ({
            ...prev,
            [employee.id]: {
              ...prev[employee.id],
              break2: true
            }
          }));
        }
        break;
    }
  };
  
  const handleTimeChange = (employee: Employee, field: keyof Employee, subField: string, value: string) => {
    if (field === 'name') {
      updateEmployee(employee.id, { [field]: value });
      return;
    }
    
    const scheduleField = field as 'shift' | 'break1' | 'lunch' | 'break2';
    updateEmployee(employee.id, {
      [scheduleField]: {
        ...employee[scheduleField],
        [subField]: value
      }
    });
  };
  
  const handleDeleteEmployee = (employeeId: string, employeeName: string) => {
    // Confirm before deleting
    if (window.confirm(`Are you sure you want to remove ${employeeName}?`)) {
      removeEmployee(employeeId);
      toast.success(`${employeeName} removed successfully`);
    }
  };
  
  // Format time display for rendering
  const formatTimeDisplay = (time: { start: string, end: string }) => {
    if (!time.start && !time.end) return '';
    const formattedStart = convertTo12HourFormat(time.start);
    const formattedEnd = convertTo12HourFormat(time.end);
    
    if (!formattedStart && !formattedEnd) return '';
    if (!formattedStart) return formattedEnd;
    if (!formattedEnd) return formattedStart;
    
    return `${formattedStart} - ${formattedEnd}`;
  };
  
  // Reset finishedBreaks when status changes to idle or completed
  useEffect(() => {
    employees.forEach(emp => {
      if (emp.status === 'idle' || emp.status === 'completed') {
        setFinishedBreaks(prev => ({
          ...prev,
          [emp.id]: { break1: false, lunch: false, break2: false }
        }));
      }
    });
  }, [employees]);
  
  return (
    <TableContainer>
      <StyledTable>
        <thead>
          <tr>
            <TableHeader style={{ width: '25%' }}>Name</TableHeader>
            <TableHeader style={{ width: '15%' }}>Shift</TableHeader>
            <TableHeader style={{ width: '20%' }}>1st Break</TableHeader>
            <TableHeader style={{ width: '20%' }}>Lunch</TableHeader>
            <TableHeader style={{ width: '20%' }}>2nd Break</TableHeader>
          </tr>
        </thead>
        <tbody>
          {employees.length === 0 ? (
            <tr>
              <td colSpan={5}>
                <EmptyStateMessage>
                  No employees added yet. Click "Add Employee" to get started.
                </EmptyStateMessage>
              </td>
            </tr>
          ) : (
            employees.map((employee) => (
              <EmployeeTableRow key={employee.id}>
                <TableCell 
                  status={['active', 'tardy', 'absent'].includes(employee.status) ? employee.status : (employee.status === 'completed' ? 'completed' : undefined)}
                  isClickable
                  isEditing={mode === 'edit'}
                  onClick={() => handleCellClick(employee, 'name')}
                >
                  {mode === 'edit' ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <NameInput
                        value={employee.name}
                        onChange={(e) => handleTimeChange(employee, 'name', '', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <ActionButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteEmployee(employee.id, employee.name);
                        }}
                        title="Delete employee"
                      >
                        <FiTrash2 />
                      </ActionButton>
                    </div>
                  ) : (
                    employee.name
                  )}
                </TableCell>
                
                <TableCell 
                  status={['active', 'tardy', 'absent'].includes(employee.status) ? employee.status : (employee.status === 'completed' ? 'completed' : undefined)} 
                  isClickable
                  isEditing={mode === 'edit'}
                  onClick={() => handleCellClick(employee, 'shift')}
                >
                  {mode === 'edit' ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <TimeInput
                        value={employee.shift.start}
                        onChange={(e) => handleTimeChange(employee, 'shift', 'start', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Start"
                        aria-label="Shift start time"
                      />
                      <TimeInput
                        value={employee.shift.end}
                        onChange={(e) => handleTimeChange(employee, 'shift', 'end', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="End"
                        aria-label="Shift end time"
                      />
                    </div>
                  ) : (
                    formatTimeDisplay(employee.shift)
                  )}
                </TableCell>
                
                <TableCell 
                  status={employee.status === 'break1' ? 'break1' : (employee.status === 'completed' ? 'completed' : undefined)}
                  finishedBreak={finishedBreaks[employee.id]?.break1}
                  isClickable
                  isEditing={mode === 'edit'}
                  onClick={() => handleCellClick(employee, 'break1')}
                >
                  {mode === 'edit' ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <TimeInput
                        value={employee.break1.start}
                        onChange={(e) => handleTimeChange(employee, 'break1', 'start', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Start"
                        aria-label="First break start time"
                      />
                      <TimeInput
                        value={employee.break1.end}
                        onChange={(e) => handleTimeChange(employee, 'break1', 'end', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="End"
                        aria-label="First break end time"
                      />
                    </div>
                  ) : (
                    formatTimeDisplay(employee.break1)
                  )}
                </TableCell>
                
                <TableCell 
                  status={employee.status === 'lunch' ? 'lunch' : (employee.status === 'completed' ? 'completed' : undefined)}
                  finishedBreak={finishedBreaks[employee.id]?.lunch}
                  isClickable
                  isEditing={mode === 'edit'}
                  onClick={() => handleCellClick(employee, 'lunch')}
                >
                  {mode === 'edit' ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <TimeInput
                        value={employee.lunch.start}
                        onChange={(e) => handleTimeChange(employee, 'lunch', 'start', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Start"
                        aria-label="Lunch start time"
                      />
                      <TimeInput
                        value={employee.lunch.end}
                        onChange={(e) => handleTimeChange(employee, 'lunch', 'end', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="End"
                        aria-label="Lunch end time"
                      />
                    </div>
                  ) : (
                    formatTimeDisplay(employee.lunch)
                  )}
                </TableCell>
                
                <TableCell 
                  status={employee.status === 'break2' ? 'break2' : (employee.status === 'completed' ? 'completed' : undefined)}
                  finishedBreak={finishedBreaks[employee.id]?.break2}
                  isClickable
                  isEditing={mode === 'edit'}
                  onClick={() => handleCellClick(employee, 'break2')}
                >
                  {mode === 'edit' ? (
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <TimeInput
                        value={employee.break2.start}
                        onChange={(e) => handleTimeChange(employee, 'break2', 'start', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Start"
                        aria-label="Second break start time"
                      />
                      <TimeInput
                        value={employee.break2.end}
                        onChange={(e) => handleTimeChange(employee, 'break2', 'end', e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="End"
                        aria-label="Second break end time"
                      />
                    </div>
                  ) : (
                    formatTimeDisplay(employee.break2)
                  )}
                </TableCell>
              </EmployeeTableRow>
            ))
          )}
        </tbody>
      </StyledTable>
    </TableContainer>
  );
};

export default EmployeeTable;