import { lazy, Suspense, useEffect, useState } from 'react'
import './BloodFluidBackground.css'

const LiquidEther = lazy(() => import('../LiquidEther/LiquidEther'))

const BLOOD_COLORS = ['#1a0000', '#8b0000', '#c41e3a', '#4a0000']

/**
 * WebGL viscous “blood” fluid — wraps LiquidEther with an Obsession palette.
 * Falls back to a static crimson vignette when prefers-reduced-motion is set.
 */
export default function BloodFluidBackground() {
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduceMotion(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    return () => mq.removeEventListener?.('change', update)
  }, [])

  if (reduceMotion) {
    return (
      <div
        className="blood-fluid blood-fluid--static"
        data-testid="blood-fluid"
        aria-hidden="true"
      />
    )
  }

  return (
    <div className="blood-fluid" data-testid="blood-fluid" aria-hidden="true">
      <Suspense fallback={<div className="blood-fluid__fallback" />}>
        <LiquidEther
          colors={BLOOD_COLORS}
          mouseForce={28}
          cursorSize={120}
          isViscous
          viscous={42}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.55}
          isBounce={false}
          autoDemo
          autoSpeed={0.35}
          autoIntensity={2.8}
          takeoverDuration={0.2}
          autoResumeDelay={2200}
          autoRampDuration={0.7}
        />
      </Suspense>
    </div>
  )
}
