import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Employee, EmployeeStatus } from '../types';
import { getStatusColor } from '../utils';
import { FiUser, FiUserCheck, FiUserX, FiClock, FiCoffee, FiAlertCircle } from 'react-icons/fi';
import { BiRestaurant } from 'react-icons/bi';

interface StatisticsProps {
  employees: Employee[];
}

const StatisticsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
  }
`;

const StatCard = styled.div<{ color: string }>`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border-left: 4px solid ${props => props.color};
`;

const StatHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;

const StatIcon = styled.div<{ color: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  font-size: 20px;
`;

const StatTitle = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #555;
`;

const StatCount = styled.div`
  font-size: 28px;
  font-weight: 700;
  color: #333;
  margin-bottom: 4px;
`;

const StatDescription = styled.div`
  font-size: 13px;
  color: #777;
`;

const EmployeeList = styled.div`
  margin-top: 8px;
  max-height: 60px;
  overflow-y: auto;
  font-size: 13px;
`;

const EmployeeListItem = styled.div`
  padding: 3px 0;
  border-bottom: 1px dashed #eee;
  
  &:last-child {
    border-bottom: none;
  }
`;

const Statistics: React.FC<StatisticsProps> = ({ employees }) => {
  const stats = useMemo(() => {
    const counts = {
      total: employees.length,
      active: 0,
      onBreak: 0,
      onLunch: 0,
      completed: 0,
      tardy: 0,
      absent: 0,
      idle: 0
    };
    
    const lists = {
      active: [] as string[],
      onBreak: [] as string[],
      onLunch: [] as string[],
      tardy: [] as string[],
      absent: [] as string[]
    };
    
    employees.forEach(employee => {
      switch (employee.status) {
        case 'active':
          counts.active++;
          lists.active.push(employee.name);
          break;
        case 'break1':
        case 'break2':
          counts.onBreak++;
          lists.onBreak.push(employee.name);
          break;
        case 'lunch':
          counts.onLunch++;
          lists.onLunch.push(employee.name);
          break;
        case 'completed':
          counts.completed++;
          break;
        case 'tardy':
          counts.tardy++;
          lists.tardy.push(employee.name);
          break;
        case 'absent':
          counts.absent++;
          lists.absent.push(employee.name);
          break;
        case 'idle':
          counts.idle++;
          break;
      }
    });
    
    return { counts, lists };
  }, [employees]);
  
  return (
    <StatisticsContainer>
      <StatCard color={getStatusColor('active')}>
        <StatHeader>
          <StatIcon color={getStatusColor('active')}>
            <FiUserCheck />
          </StatIcon>
          <StatTitle>Working</StatTitle>
        </StatHeader>
        <StatCount>{stats.counts.active}</StatCount>
        <StatDescription>Employees currently working</StatDescription>
        {stats.lists.active.length > 0 && (
          <EmployeeList>
            {stats.lists.active.map(name => (
              <EmployeeListItem key={name}>{name}</EmployeeListItem>
            ))}
          </EmployeeList>
        )}
      </StatCard>
      
      <StatCard color={getStatusColor('break1')}>
        <StatHeader>
          <StatIcon color={getStatusColor('break1')}>
            <FiCoffee />
          </StatIcon>
          <StatTitle>On Break</StatTitle>
        </StatHeader>
        <StatCount>{stats.counts.onBreak}</StatCount>
        <StatDescription>Employees on break</StatDescription>
        {stats.lists.onBreak.length > 0 && (
          <EmployeeList>
            {stats.lists.onBreak.map(name => (
              <EmployeeListItem key={name}>{name}</EmployeeListItem>
            ))}
          </EmployeeList>
        )}
      </StatCard>
      
      <StatCard color={getStatusColor('lunch')}>
        <StatHeader>
          <StatIcon color={getStatusColor('lunch')}>
            <BiRestaurant />
          </StatIcon>
          <StatTitle>On Lunch</StatTitle>
        </StatHeader>
        <StatCount>{stats.counts.onLunch}</StatCount>
        <StatDescription>Employees on lunch break</StatDescription>
        {stats.lists.onLunch.length > 0 && (
          <EmployeeList>
            {stats.lists.onLunch.map(name => (
              <EmployeeListItem key={name}>{name}</EmployeeListItem>
            ))}
          </EmployeeList>
        )}
      </StatCard>
      
      <StatCard color={getStatusColor('tardy')}>
        <StatHeader>
          <StatIcon color={getStatusColor('tardy')}>
            <FiClock />
          </StatIcon>
          <StatTitle>Tardy</StatTitle>
        </StatHeader>
        <StatCount>{stats.counts.tardy}</StatCount>
        <StatDescription>Employees marked as tardy</StatDescription>
        {stats.lists.tardy.length > 0 && (
          <EmployeeList>
            {stats.lists.tardy.map(name => (
              <EmployeeListItem key={name}>{name}</EmployeeListItem>
            ))}
          </EmployeeList>
        )}
      </StatCard>
      
      <StatCard color={getStatusColor('absent')}>
        <StatHeader>
          <StatIcon color={getStatusColor('absent')}>
            <FiUserX />
          </StatIcon>
          <StatTitle>Absent</StatTitle>
        </StatHeader>
        <StatCount>{stats.counts.absent}</StatCount>
        <StatDescription>Employees marked as absent</StatDescription>
        {stats.lists.absent.length > 0 && (
          <EmployeeList>
            {stats.lists.absent.map(name => (
              <EmployeeListItem key={name}>{name}</EmployeeListItem>
            ))}
          </EmployeeList>
        )}
      </StatCard>
      
      <StatCard color="#9e9e9e">
        <StatHeader>
          <StatIcon color="#9e9e9e">
            <FiUser />
          </StatIcon>
          <StatTitle>Total</StatTitle>
        </StatHeader>
        <StatCount>{stats.counts.total}</StatCount>
        <StatDescription>Total employees</StatDescription>
      </StatCard>
    </StatisticsContainer>
  );
};

export default Statistics;