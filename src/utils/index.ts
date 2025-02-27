/**
 * Format a date object to display time in 12-hour format (e.g., "2:30 PM")
 */
export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Get a color based on employee status
 */
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return '#4CAF50'; // Green
    case 'break1':
    case 'break2':
      return '#2196F3'; // Blue
    case 'lunch':
      return '#FF9800'; // Orange
    case 'completed':
      return '#9E9E9E'; // Grey
    case 'tardy':
      return '#FFC107'; // Amber
    case 'absent':
      return '#F44336'; // Red
    default:
      return 'transparent';
  }
};

/**
 * Parse time string (e.g., "9:00" or "9:00 AM") to hours and minutes
 */
export const parseTimeString = (timeStr: string): { hours: number; minutes: number } => {
  if (!timeStr) return { hours: 0, minutes: 0 };
  
  // Handle "9:00 AM" format
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    const date = new Date(`01/01/2023 ${timeStr}`);
    return {
      hours: date.getHours(),
      minutes: date.getMinutes()
    };
  }
  
  // Handle "9:00" format
  const [hours, minutes] = timeStr.split(':').map(Number);
  return { hours, minutes };
};

/**
 * Format time object to string in 12-hour format (e.g., "9:00 AM")
 */
export const formatTimeString = (hours: number, minutes: number): string => {
  if (isNaN(hours) || isNaN(minutes)) return '';
  
  const date = new Date();
  date.setHours(hours);
  date.setMinutes(minutes);
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

/**
 * Convert 24-hour format time to 12-hour AM/PM format
 */
export const convertTo12HourFormat = (timeStr: string): string => {
  if (!timeStr) return '';
  
  // If already in 12-hour format, return as is
  if (timeStr.includes('AM') || timeStr.includes('PM')) {
    return timeStr;
  }
  
  try {
    const [hours, minutes] = timeStr.split(':').map(Number);
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return timeStr;
  }
};