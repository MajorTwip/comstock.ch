'use client'

import { createContext, useContext } from 'react'

interface SearchContextValue {
  open: boolean
  toggle: () => void
}

const SearchContext = createContext<SearchContextValue | null>(null)

export const useSearch = () => {
  const ctx = useContext(SearchContext)
  if (!ctx) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return ctx
}

export default SearchContext
