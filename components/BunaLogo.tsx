export function BunaLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Cream background circle */}
      <circle cx="32" cy="32" r="32" fill="#EAE0CE" />

      {/* Saucer */}
      <ellipse cx="32" cy="46" rx="18" ry="4" fill="#3D1A0E" opacity="0.15" />
      <ellipse cx="32" cy="44" rx="16" ry="3" fill="#C8A951" />

      {/* Cup body */}
      <path
        d="M18 24 C18 24 20 42 32 42 C44 42 46 24 46 24 Z"
        fill="#CC1F2F"
      />
      {/* Cup top rim */}
      <ellipse cx="32" cy="24" rx="14" ry="3" fill="#3D1A0E" />
      {/* Cup inner top */}
      <ellipse cx="32" cy="24" rx="12" ry="2.2" fill="#1C0D08" />
      {/* Coffee surface */}
      <ellipse cx="32" cy="24" rx="10" ry="1.8" fill="#6B3A2A" />

      {/* Handle */}
      <path
        d="M46 28 Q56 28 56 34 Q56 40 46 40"
        stroke="#3D1A0E"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Steam lines */}
      <path
        d="M27 18 Q25 14 27 10"
        stroke="#C8A951"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M32 16 Q30 12 32 8"
        stroke="#C8A951"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
      <path
        d="M37 18 Q35 14 37 10"
        stroke="#C8A951"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}
