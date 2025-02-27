import React, { useState, useRef } from 'react';
import styled from 'styled-components';

interface TimeInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  'aria-label'?: string;
  onClick?: (e: React.MouseEvent) => void;
}

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  
  @media (max-width: 768px) {
    padding: 10px 8px;
    font-size: 16px; /* Prevents zoom on iOS */
  }
  
  &:focus {
    outline: none;
    border-color: #2196F3;
    box-shadow: 0 0 0 2px rgba(33, 150, 243, 0.2);
  }
`;

const TimePickerContainer = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  width: 200px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 100;
  padding: 10px;
  margin-top: 5px;
`;

const TimeOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 5px;
  margin-bottom: 10px;
`;

const TimeOption = styled.button`
  padding: 8px 4px;
  border: 1px solid #eee;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #f5f5f5;
  }
  
  &:active {
    background-color: #e0e0e0;
  }
`;

const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChange,
  placeholder,
  'aria-label': ariaLabel,
  onClick,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Common hour options
  const hourOptions = ['7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];
  
  // Common minute options
  const minuteOptions = ['00', '15', '30', '45'];
  
  const handleInputFocus = () => {
    // Only open the picker on mobile devices
    if (window.innerWidth <= 768) {
      setIsPickerOpen(true);
    }
  };
  
  const handleInputClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick(e);
    }
    e.stopPropagation();
  };
  
  const handleSelectHour = (hour: string) => {
    // If there's already a time with minutes, preserve the minutes
    const currentMinutes = value.includes(':') ? value.split(':')[1] : '00';
    onChange(`${hour}:${currentMinutes}`);
  };
  
  const handleSelectMinute = (minute: string) => {
    // If there's no hour set yet, use a default hour of 9
    const currentHour = value.includes(':') ? value.split(':')[0] : '9';
    onChange(`${currentHour}:${minute}`);
  };
  
  // Close the picker when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  return (
    <InputWrapper ref={containerRef}>
      <StyledInput
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        onFocus={handleInputFocus}
        onClick={handleInputClick}
      />
      
      <TimePickerContainer isOpen={isPickerOpen}>
        <h4>Hour</h4>
        <TimeOptions>
          {hourOptions.map((hour) => (
            <TimeOption 
              key={`hour-${hour}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectHour(hour);
              }}
            >
              {hour}
            </TimeOption>
          ))}
        </TimeOptions>
        
        <h4>Minute</h4>
        <TimeOptions>
          {minuteOptions.map((minute) => (
            <TimeOption 
              key={`minute-${minute}`}
              onClick={(e) => {
                e.stopPropagation();
                handleSelectMinute(minute);
                setIsPickerOpen(false);
              }}
            >
              {minute}
            </TimeOption>
          ))}
        </TimeOptions>
      </TimePickerContainer>
    </InputWrapper>
  );
};

export default TimeInput;