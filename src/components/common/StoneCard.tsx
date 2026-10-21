import React from 'react'

export interface StoneCardProps {
  children: React.ReactNode
  className?: string
  variant?: 'gold' | 'crimson' | 'sky' | 'default'
  withCorners?: boolean
}

export const StoneCard: React.FC<StoneCardProps> = ({
  children,
  className = '',
  variant = 'default',
  withCorners = true
}) => {
  const borderStyles = {
    gold: 'border-gold/40 hover:border-gold shadow-lg shadow-gold/5',
    crimson: 'border-crimson/50 hover:border-crimson shadow-lg shadow-crimson/5',
    sky: 'border-sky-light/40 hover:border-sky-light shadow-lg shadow-sky-light/5',
    default: 'border-gold/20 hover:border-gold/40'
  }[variant]

  return (
    <div
      className={`relative stone-texture rounded-2xl p-5 md:p-7 border transition-all duration-300 ${borderStyles} ${className}`}
    >
      {withCorners && (
        <>
          {/* Sol Üst Köşe Tamgası */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-gold pointer-events-none opacity-60" />
          {/* Sağ Üst Köşe Tamgası */}
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-gold pointer-events-none opacity-60" />
          {/* Sol Alt Köşe Tamgası */}
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-gold pointer-events-none opacity-60" />
          {/* Sağ Alt Köşe Tamgası */}
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-gold pointer-events-none opacity-60" />
        </>
      )}
      {children}
    </div>
  )
}
