import { useEffect } from 'react'

type HotkeyCallback = (e: KeyboardEvent) => void

interface HotkeyOptions {
  ctrl?: boolean
  alt?: boolean
  shift?: boolean
  meta?: boolean
}

export function useHotkeys(
  key: string,
  callback: HotkeyCallback,
  options: HotkeyOptions = {}
) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { ctrl = false, alt = false, shift = false, meta = false } = options

      if (
        e.key.toLowerCase() === key.toLowerCase() &&
        e.ctrlKey === ctrl &&
        e.altKey === alt &&
        e.shiftKey === shift &&
        e.metaKey === meta
      ) {
        e.preventDefault()
        callback(e)
      }
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback, options])
}
