import type { ImageModel } from './image.model'

export const LogoImage = ({ className }: ImageModel) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="10 10 220 60"
    className={className}
  >
    <title id="svgTitle">Logo Image</title>
    <rect width="100%" height="100%" fill="#475b74" />
    <text
      x="20"
      y="50"
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
      fontSize="36"
      fill="#ffffff"
    >
      Link Hub
    </text>
    <g transform="translate(200, 40) scale(1.2)">
      <circle cx="0" cy="0" r="20" fill="#f3a253" />
      <g fill="#ffffff" transform="translate(-10, -10) scale(0.8)">
        <path d="M21,14c-1.1,0-2,0.9-2,2v4c0,1.1-0.9,2-2,2H7c-1.1,0-2-0.9-2-2V7c0-1.1,0.9-2,2-2h4c1.1,0,2-0.9,2-2s-0.9-2-2-2H7C4.2,1,2,3.2,2,6v13c0,2.8,2.2,5,5,5h10c2.8,0,5-2.2,5-5v-4C22,14.9,21.1,14,21,14z" />
        <path d="M23,1h-7c-1.1,0-2,0.9-2,2s0.9,2,2,2h3.6l-9.3,9.3c-0.8,0.8-0.8,2,0,2.8C10.5,17.4,11,17.5,11.4,17.5s0.9-0.1,1.3-0.4l9.3-9.3V11c0,1.1,0.9,2,2,2s2-0.9,2-2V3C26,1.9,25.1,1,23,1z" />
      </g>
    </g>
    <line x1="20" y1="58" x2="180" y2="58" stroke="#f3a253" strokeWidth="3" />
  </svg>
)
