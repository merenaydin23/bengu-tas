import React from 'react'

export interface MotifProps {
  className?: string
  size?: number
  color?: string
}

/**
 * Türk Mitolojisi ve Bozkır: Bozkurt Silueti
 */
export const WolfSilhouette: React.FC<MotifProps> = ({
  className = '',
  size = 48,
  color = 'currentColor'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Bozkurt Başı Silueti */}
    <path
      d="M20 75 C 25 70, 30 65, 32 55 C 33 48, 30 42, 28 35 C 27 30, 32 20, 38 15 C 40 22, 45 28, 48 30 C 52 24, 58 16, 64 12 C 65 18, 64 26, 60 32 C 68 35, 78 38, 85 45 C 88 48, 86 52, 80 54 C 74 56, 68 53, 62 55 C 55 57, 50 65, 46 72 C 40 80, 28 80, 20 75 Z"
      fill={color}
    />
    {/* Kurt Gözü */}
    <circle cx="58" cy="40" r="3" fill="#D4A017" />
  </svg>
)

/**
 * Göktürk Güneş Motifi: Işınlar ve İç Halka
 */
export const SunPattern: React.FC<MotifProps> = ({
  className = '',
  size = 48,
  color = '#D4A017'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="50" cy="50" r="18" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="3" />
    <circle cx="50" cy="50" r="8" fill={color} />
    {/* 8 Güneş Işını */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <line
        key={i}
        x1="50"
        y1="18"
        x2="50"
        y2="6"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        transform={`rotate(${angle} 50 50)`}
      />
    ))}
  </svg>
)

/**
 * 16 Köşeli Türk Yıldızı
 */
export const Star16: React.FC<MotifProps> = ({
  className = '',
  size = 48,
  color = '#D4A017'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <g transform="translate(50, 50)">
      {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map((angle, i) => (
        <rect
          key={i}
          x="-35"
          y="-35"
          width="70"
          height="70"
          rx="6"
          stroke={color}
          strokeWidth="1.5"
          fill={color}
          fillOpacity="0.06"
          transform={`rotate(${angle})`}
        />
      ))}
      <circle cx="0" cy="0" r="12" fill={color} />
      <circle cx="0" cy="0" r="6" fill="#0E1B2B" />
    </g>
  </svg>
)

/**
 * Orhun Tamgası / Geometrik Bezeme
 */
export const TamgaMotif: React.FC<MotifProps> = ({
  className = '',
  size = 36,
  color = '#4A90C2'
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Boy Tamgası (Yay ve Ok Çatısı) */}
    <path
      d="M30 8 L50 28 L30 48 L10 28 Z"
      stroke={color}
      strokeWidth="2.5"
      fill="none"
    />
    <line x1="30" y1="8" x2="30" y2="48" stroke={color} strokeWidth="2.5" />
    <line x1="10" y1="28" x2="50" y2="28" stroke={color} strokeWidth="2.5" />
    <circle cx="30" cy="28" r="4" fill="#D4A017" />
  </svg>
)
