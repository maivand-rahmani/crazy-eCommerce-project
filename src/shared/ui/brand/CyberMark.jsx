import React from "react";

/**
 * Cyber brand mark — octagonal "C" with a spark (concept "Nova").
 * 64x64 viewBox; inherits the current text color. Size via className, e.g. "h-6 w-auto".
 */
const CyberMark = ({ className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 64 64"
    fill="none"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path d="M 48.77 22.82 L 35.78 9.83 L 17.42 9.83 L 4.43 22.82 L 4.43 41.18 L 17.42 54.17 L 35.78 54.17 L 48.77 41.18 L 41.38 38.12 L 32.72 46.78 L 20.48 46.78 L 11.82 38.12 L 11.82 25.88 L 20.48 17.22 L 32.72 17.22 L 41.38 25.88 Z" fill="currentColor" />
    <path d="M 53.5 26 L 55.3 30.2 L 59.5 32 L 55.3 33.8 L 53.5 38 L 51.7 33.8 L 47.5 32 L 51.7 30.2 Z" fill="currentColor" />
  </svg>
);

export default CyberMark;
