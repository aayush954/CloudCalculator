// utils/format.js — Number and string helpers

export const formatCurrency = (n, decimals = 2) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);

export const formatNumber = (n) =>
  new Intl.NumberFormat('en-US').format(n);

export const capitalize = (s) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

export const providerColor = (provider) =>
  ({ aws: '#FF9900', azure: '#0078D4', gcp: '#4285F4' }[provider] || '#888');

export const providerGradient = (provider) =>
  ({
    aws:   'from-amber-500 to-orange-600',
    azure: 'from-blue-500 to-blue-700',
    gcp:   'from-blue-400 to-indigo-600',
  }[provider] || 'from-gray-500 to-gray-700');

export const providerBg = (provider) =>
  ({
    aws:   'bg-amber-500/10 border-amber-500/30 text-amber-400',
    azure: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    gcp:   'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
  }[provider] || '');
