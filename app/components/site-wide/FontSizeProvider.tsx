// app/components/site-wide/FontSizeProvider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type FontSize = 'normal' | 'large' | 'xlarge'

const FontSizeContext = createContext({
  fontSize: 'normal' as FontSize,
  cycleSize: () => {},
})

const SIZE_ORDER: FontSize[] = ['normal', 'large', 'xlarge']
const SIZE_CLASSES: Record<FontSize, string> = {
  normal: '',
  large: 'font-scale-large',
  xlarge: 'font-scale-xlarge',
}
const SIZE_LABELS: Record<FontSize, string> = {
  normal: 'Normal',
  large: 'Large',
  xlarge: 'Extra Large',
}

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>('normal')

  useEffect(() => {
    const stored = localStorage.getItem('fontSize') as FontSize | null
    if (stored && SIZE_ORDER.includes(stored)) {
      applySize(stored)
      setFontSize(stored)
    }
  }, [])

  function applySize(size: FontSize) {
    document.documentElement.classList.remove('font-scale-large', 'font-scale-xlarge')
    if (SIZE_CLASSES[size]) {
      document.documentElement.classList.add(SIZE_CLASSES[size])
    }
  }

  function cycleSize() {
    const next = SIZE_ORDER[(SIZE_ORDER.indexOf(fontSize) + 1) % SIZE_ORDER.length]
    applySize(next)
    setFontSize(next)
    localStorage.setItem('fontSize', next)
  }

  return (
    <FontSizeContext.Provider value={{ fontSize, cycleSize }}>
      {children}
    </FontSizeContext.Provider>
  )
}

export const useFontSize = () => useContext(FontSizeContext)
export { SIZE_LABELS }
