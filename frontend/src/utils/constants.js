export const API_BASE = 'http://localhost:8000';

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
];

export const SUMMARY_TYPES = [
  { value: 'brief', label: 'Brief Summary', description: 'Short and concise overview' },
  { value: 'detailed', label: 'Detailed Summary', description: 'Comprehensive analysis' },
  { value: 'bullet_points', label: 'Bullet Points', description: 'Key points in list format' }
];

export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  CONVERTER: '/converter',
  HISTORY: '/history',
  PROFILE: '/profile'
};