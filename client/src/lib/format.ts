/**
 * Format large numbers with K/M/B notation
 */
export function formatNumber(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  
  if (isNaN(num) || num === 0) return '0';
  
  const abs = Math.abs(num);
  
  if (abs >= 1000000000) {
    return `${(num / 1000000000).toFixed(1)}B`;
  } else if (abs >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (abs >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toFixed(0);
  }
}

/**
 * Format currency values with K/M/B notation
 */
export function formatCurrency(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  
  if (isNaN(num) || num === 0) return '$0';
  
  const abs = Math.abs(num);
  
  if (abs >= 1000000000) {
    return `$${(num / 1000000000).toFixed(1)}B`;
  } else if (abs >= 1000000) {
    return `$${(num / 1000000).toFixed(1)}M`;
  } else if (abs >= 1000) {
    return `$${(num / 1000).toFixed(1)}K`;
  } else {
    return `$${num.toFixed(0)}`;
  }
}

/**
 * Format percentage values
 */
export function formatPercentage(value: number | string): string {
  const num = typeof value === 'string' ? parseFloat(value.replace('%', '')) : value;
  return `${(num || 0).toFixed(1)}%`;
}