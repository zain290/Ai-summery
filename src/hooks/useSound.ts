import { useRef, useCallback } from 'react'
import { Howl } from 'howler'

export function useSound(src: string) {
  const howlRef = useRef<Howl | null>(null)

  if (!howlRef.current) {
    howlRef.current = new Howl({ src: [src] })
  }

  const play = useCallback(() => howlRef.current?.play(), [])
  const stop = useCallback(() => howlRef.current?.stop(), [])
  const setVolume = useCallback((vol: number) => {
    if (howlRef.current) howlRef.current.volume(vol)
  }, [])

  return { play, stop, setVolume }
}
