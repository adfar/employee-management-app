import React, { useState } from 'react';
import styled from 'styled-components';
import { FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const InstructionsContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #2196F3;
  padding: 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const InstructionsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
`;

const Title = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  color: #333;
`;

const InstructionsContent = styled.div<{ isOpen: boolean }>`
  max-height: ${props => (props.isOpen ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease;
`;

const InstructionsList = styled.ul`
  margin-top: 12px;
  padding-left: 20px;
`;

const InstructionItem = styled.li`
  margin-bottom: 8px;
  line-height: 1.5;
`;

const Instructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <InstructionsContainer>
      <InstructionsHeader onClick={() => setIsOpen(!isOpen)}>
        <Title>
          <FiInfo size={18} color="#2196F3" />
          How to Use This App
        </Title>
        {isOpen ? <FiChevronUp /> : <FiChevronDown />}
      </InstructionsHeader>
      
      <InstructionsContent isOpen={isOpen}>
        <InstructionsList>
          <InstructionItem>
            <strong>Edit Mode</strong>: Click the "Edit Mode" button to add employee names and schedule times.
          </InstructionItem>
          <InstructionItem>
            <strong>Manage Mode</strong>: Switch to "Manage Mode" to track employee status during the day.
          </InstructionItem>
          <InstructionItem>
            <strong>Employee Status</strong>:
            <ul>
              <li>Click on an employee name to mark them as clocked in/out</li>
              <li>Click on the shift cell to mark as tardy or absent</li>
              <li>Click on break or lunch cells to mark when breaks start and end</li>
            </ul>
          </InstructionItem>
          <InstructionItem>
            <strong>Keyboard Shortcuts</strong>:
            <ul>
              <li><kbd>E</kbd> - Toggle between Edit and Manage modes</li>
              <li><kbd>A</kbd> - Add a new employee</li>
            </ul>
          </InstructionItem>
        </InstructionsList>
      </InstructionsContent>
    </InstructionsContainer>
  );
};

export default Instructions;