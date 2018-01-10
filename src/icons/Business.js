import React from "react";

const Business = props => (
  <svg
    width={11}
    height={22}
    viewBox="0 0 11 22"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <title>Page 1</title>
    <defs>
      <path id="a" d="M0 0h11v16.5H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        fill="#000"
        d="M3.988 4.125h2.75V0h-2.75zM3.988 22h2.75v-4.125h-2.75z"
      />
      <path fill="#000" d="M3.988 18.563l2.75 2.75v-2.75z" />
      <g transform="translate(0 2.75)">
        <mask id="b" fill="#fff">
          <use xlinkHref="#a" />
        </mask>
        <path
          d="M.825 12.581c.963.481 2.475.963 3.988.963 1.65 0 2.543-.688 2.543-1.788 0-.962-.756-1.581-2.68-2.2-2.682-.962-4.4-2.406-4.4-4.744C.275 2.062 2.543 0 6.325 0 8.18 0 9.487.344 10.38.825l-.825 2.887c-.618-.343-1.787-.756-3.3-.756-1.58 0-2.337.756-2.337 1.513 0 1.03.894 1.443 2.956 2.268C9.694 7.77 11 9.281 11 11.55c0 2.681-2.062 4.95-6.462 4.95-1.857 0-3.644-.481-4.538-.963l.825-2.956z"
          fill="#000"
          mask="url(#b)"
        />
      </g>
    </g>
  </svg>
);

export default Business;
