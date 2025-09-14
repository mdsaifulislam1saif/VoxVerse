// Base URL for API requests
export const API_BASE = 'http://localhost:8000';

// Supported languages with codes, names, and flag emojis
export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'bn', name: 'Bengali', flag: '🇧🇩' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
  { code: 'pl', name: 'Polish', flag: '🇵🇱' },
  { code: 'tr', name: 'Turkish', flag: '🇹🇷' },
  { code: 'zh-cn', name: 'Chinese (Simplified)', flag: '🇨🇳' },
  { code: 'bg', name: 'Bulgarian', flag: '🇧🇬' },
  { code: 'cs', name: 'Czech', flag: '🇨🇿' },
  { code: 'da', name: 'Danish', flag: '🇩🇰' },
  { code: 'et', name: 'Estonian', flag: '🇪🇪' },
  { code: 'ga', name: 'Irish', flag: '🇮🇪' },
  { code: 'el', name: 'Greek', flag: '🇬🇷' },
  { code: 'fi', name: 'Finnish', flag: '🇫🇮' },
  { code: 'hr', name: 'Croatian', flag: '🇭🇷' },
  { code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
  { code: 'lt', name: 'Lithuanian', flag: '🇱🇹' },
  { code: 'lv', name: 'Latvian', flag: '🇱🇻' },
  { code: 'mt', name: 'Maltese', flag: '🇲🇹' },
  { code: 'ro', name: 'Romanian', flag: '🇷🇴' },
  { code: 'sk', name: 'Slovak', flag: '🇸🇰' },
  { code: 'sl', name: 'Slovenian', flag: '🇸🇮' },
  { code: 'sv', name: 'Swedish', flag: '🇸🇪' },
  { code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
  { code: 'ca', name: 'Catalan', flag: '🇪🇸' },
  { code: 'fa', name: 'Persian (Farsi)', flag: '🇮🇷' },
  { code: 'be', name: 'Belarusian', flag: '🇧🇾' }
];

// Available summary types for text summarization
export const SUMMARY_TYPES = [
  { value: 'brief', label: 'Brief Summary', description: 'Short and concise overview' },
  { value: 'detailed', label: 'Detailed Summary', description: 'Comprehensive analysis' },
  { value: 'bullet_points', label: 'Bullet Points', description: 'Key points in list format' }
];

// Routes used across the application
export const ROUTES = {
  HOME: '/',
  AUTH: '/auth',
  LOGIN: '/login',
  REGISTER: '/register',
  CONVERTER: '/converter',
  HISTORY: '/history',
  PROFILE: '/profile'
};
