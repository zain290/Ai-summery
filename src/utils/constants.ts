export const API_BASE = '/api'
export const APP_NAME = 'AI Text Summariser'
export const ROUTES = {
  home: '/',
  history: '/history',
  instructions: '/instructions',
} as const
export const MAX_WORD_COUNT = 10000
export const FILE_SIZE_LIMIT = 5 * 1024 * 1024
export const SUPPORTED_FILE_TYPES = ['.txt', '.pdf', '.docx', '.md']
export const DEFAULT_BULLET_COUNT = 5
export const MIN_BULLET_COUNT = 3
export const MAX_BULLET_COUNT = 10
