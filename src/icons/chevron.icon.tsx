import type { IconModel } from './icon.model'

export const ChevronIcon = ({ className }: IconModel) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <title id="svgTitle">Chevron icon</title>
    <polyline points="6 9 12 15 18 9" />
  </svg>
)
