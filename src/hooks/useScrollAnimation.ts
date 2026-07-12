import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollAnimationConfig {
  from?: gsap.TweenVars
  to?: gsap.TweenVars
  scrub?: boolean | number
}

export function useScrollAnimation(
  ref: RefObject<HTMLElement | null>,
  config: ScrollAnimationConfig = {},
) {
  const { from = { opacity: 0, y: 60 }, to = { opacity: 1, y: 0 }, scrub = false } = config

  useEffect(() => {
    if (!ref.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(ref.current, from, {
        ...to,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 85%',
          end: 'top 20%',
          scrub,
          toggleActions: 'play none none reverse',
        },
      })
    }, ref)

    return () => ctx.revert()
  }, [ref, from, to, scrub])
}
