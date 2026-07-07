import { createContext } from 'react'
import { tokens } from './tokens'

export type ThemeTokens = typeof tokens
export const ThemeContext = createContext<ThemeTokens>(tokens)
