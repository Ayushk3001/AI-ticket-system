// Priority badge variants
export const getPriorityVariant = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'high';
    case 'medium':
      return 'medium';
    case 'low':
      return 'low';
    default:
      return 'default';
  }
};

// Status badge variants
export const getStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'todo':
      return 'todo';
    case 'in_progress':
      return 'in_progress';
    case 'done':
      return 'done';
    default:
      return 'default';
  }
};

// Confidence display
export const formatConfidence = (confidence) => {
  if (typeof confidence !== 'number') return 'Unknown';
  
  const percentage = Math.round(confidence * 100);
  
  if (percentage >= 90) return `${percentage}% (Very High)`;
  if (percentage >= 70) return `${percentage}% (High)`;
  if (percentage >= 50) return `${percentage}% (Medium)`;
  if (percentage >= 30) return `${percentage}% (Low)`;
  return `${percentage}% (Very Low)`;
};

// Confidence color
export const getConfidenceColor = (confidence) => {
  if (typeof confidence !== 'number') return 'default';
  
  const percentage = confidence * 100;
  
  if (percentage >= 90) return 'success';
  if (percentage >= 70) return 'info';
  if (percentage >= 50) return 'warning';
  return 'danger';
};

// Date formatting
export const formatDate = (date) => {
  if (!date) return 'Unknown';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Relative time formatting
export const formatRelativeTime = (date) => {
  if (!date) return 'Unknown';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'Invalid date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now - d) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  
  return formatDate(date);
};

// Status display text
export const getStatusText = (status) => {
  switch (status?.toLowerCase()) {
    case 'todo':
      return 'To Do';
    case 'in_progress':
      return 'In Progress';
    case 'done':
      return 'Done';
    default:
      return status || 'Unknown';
  }
};

// Priority display text
export const getPriorityText = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'High';
    case 'medium':
      return 'Medium';
    case 'low':
      return 'Low';
    default:
      return priority || 'Unknown';
  }
};

// Truncate text
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Format skills as chips
export const formatSkills = (skills) => {
  if (!Array.isArray(skills)) return [];
  return skills.filter(Boolean).map(skill => skill.trim()).filter(skill => skill.length > 0);
};