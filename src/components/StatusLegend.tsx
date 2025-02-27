import React from 'react';
import styled from 'styled-components';
import { getStatusColor } from '../utils';

const LegendContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ColorBox = styled.div<{ color: string }>`
  width: 16px;
  height: 16px;
  border-radius: 4px;
  background-color: ${(props) => props.color};
`;

const LegendText = styled.span`
  font-size: 14px;
  color: #333;
`;

const StatusLegend: React.FC = () => {
  const statuses = [
    { status: 'idle', label: 'Not Clocked In' },
    { status: 'active', label: 'Clocked In' },
    { status: 'break1', label: 'On Break' },
    { status: 'lunch', label: 'On Lunch' },
    { status: 'completed', label: 'Clocked Out' },
    { status: 'tardy', label: 'Tardy' },
    { status: 'absent', label: 'Absent' }
  ];

  return (
    <LegendContainer>
      {statuses.map((item) => (
        <LegendItem key={item.status}>
          <ColorBox color={getStatusColor(item.status)} />
          <LegendText>{item.label}</LegendText>
        </LegendItem>
      ))}
    </LegendContainer>
  );
};

export default StatusLegend;