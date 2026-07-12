import { useRef, useCallback } from 'react'
import { useSpring, useMotionValue } from 'framer-motion'

export function useMagneticEffect(strength = 0.3) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      x.set((e.clientX - centerX) * strength)
      y.set((e.clientY - centerY) * strength)
    },
    [strength, x, y],
  )

  const onMouseLeave = useCallback(() => {
    x.set(0)
    y.set(0)
  }, [x, y])

  return { ref, style: { x: springX, y: springY }, onMouseMove, onMouseLeave }
}
