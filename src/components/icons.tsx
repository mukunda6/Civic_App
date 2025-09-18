import type { SVGProps } from 'react';

export function CivicSolveLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        width="1em"
        height="1em"
        {...props}
    >
        <g fill="currentColor">
            <path d="M128 24a104 104 0 1 0 104 104A104.12 104.12 0 0 0 128 24Zm45.66 154.34a8 8 0 0 1-11.32 11.32L112 139.31l-10.34 10.35a8 8 0 0 1-11.32-11.32L112 116.69l30.34-30.35a8 8 0 0 1 11.32 11.32L123.31 128Z"/>
        </g>
    </svg>
  );
}
