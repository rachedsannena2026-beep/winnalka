interface BrandLogoProps {
  variant?: 'light' | 'dark';
}

export function BrandLogo({ variant = 'light' }: BrandLogoProps) {
  const textColor =
    variant === 'dark' ? 'text-white' : 'text-[#0F2547] dark:text-white';

  return (
    <span
      dir="ltr"
      className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0 select-none"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0 rounded-lg ring-1 ring-transparent dark:ring-white/15"
      >
        <rect width="32" height="32" rx="8" fill="#0F2547" />
        <path
          d="M8.5 11.5L12.1 21.5L16 13.8L19.9 21.5L23.5 11.5"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="16" cy="8.8" r="2.1" fill="#14B8A6" />
      </svg>
      <span
        className={`font-brand text-2xl font-bold tracking-tight ${textColor}`}
      >
        winnal9a
      </span>
    </span>
  );
}
