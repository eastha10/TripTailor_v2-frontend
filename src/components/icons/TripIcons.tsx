import type { SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement>

export function PeopleIcon(props: IconProps) {
  return (
    <svg {...props} aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function LocationIcon(props: IconProps) {
  return (
    <svg {...props} aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...props} aria-hidden="true" fill="none" focusable="false" viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </svg>
  )
}
