import { Link } from "react-router-dom";

interface AuthBrandingProps {
  tagline: string;
}

export function AuthBranding({ tagline }: AuthBrandingProps) {
  return (
    <div className="mb-6 flex flex-col items-center text-center">
      {/* Chat-it speech bubble logo with radiating accent marks */}
      <Link to="/" className="group mb-3.5 inline-block focus:outline-none">
        <div className="relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
          <svg
            width="76"
            height="72"
            viewBox="0 0 76 72"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
            aria-hidden="true"
          >
            {/* Three radiating accent marks / sparks at top-right */}
            {/* Mark 1: Leftmost ray */}
            <path
              d="M51 10L52.5 4"
              stroke="#168CF5"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Mark 2: Middle ray */}
            <path
              d="M58 13L63 7"
              stroke="#168CF5"
              strokeWidth="3.2"
              strokeLinecap="round"
            />
            {/* Mark 3: Rightmost ray */}
            <path
              d="M62 19L69 17"
              stroke="#168CF5"
              strokeWidth="3.2"
              strokeLinecap="round"
            />

            {/* Main speech bubble */}
            <path
              d="M12 28C12 17.5066 20.5066 9 31 9H43C53.4934 9 62 17.5066 62 28V36C62 46.4934 53.4934 55 43 55H26L14.2 64.6C13.06 65.51 11.36 64.7 11.36 63.24V54.5C11.75 54.34 12 53.94 12 53.5V28Z"
              fill="#168CF5"
            />

            {/* Three dots inside bubble */}
            <circle cx="27" cy="36" r="3.4" fill="white" />
            <circle cx="37" cy="36" r="3.4" fill="white" />
            <circle cx="47" cy="36" r="3.4" fill="white" />
          </svg>
        </div>
      </Link>

      {/* App name */}
      <h1 className="text-[30px] font-bold tracking-tight text-[#102448]">
        Chat-it
      </h1>

      {/* Tagline */}
      <p className="mt-1 text-[14px] text-[#627895]">{tagline}</p>
    </div>
  );
}
