import React from "react";

const Both = props => (
  <svg
    width={52}
    height={25}
    viewBox="0 0 52 25"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    {...props}
  >
    <title>Group</title>
    <defs>
      <path id="a" d="M0 0h11v16.5H0z" />
      <path id="c" d="M0 0h24.994v8.529H0z" />
    </defs>
    <g fill="none" fillRule="evenodd">
      <path
        d="M39.5 1.5l-16 22"
        stroke="#000"
        strokeWidth={2}
        strokeLinecap="square"
      />
      <path
        fill="#000"
        d="M44.988 7.125h2.75V3h-2.75zM44.988 25h2.75v-4.125h-2.75z"
      />
      <path fill="#000" d="M44.988 21.563l2.75 2.75v-2.75z" />
      <g transform="translate(41 5.75)">
        <mask id="b" fill="#fff">
          <use xlinkHref="#a" />
        </mask>
        <path
          d="M.825 12.581c.963.481 2.475.963 3.988.963 1.65 0 2.543-.688 2.543-1.788 0-.962-.756-1.581-2.68-2.2-2.682-.962-4.4-2.406-4.4-4.744C.275 2.062 2.543 0 6.325 0 8.18 0 9.487.344 10.38.825l-.825 2.887c-.618-.343-1.787-.756-3.3-.756-1.58 0-2.337.756-2.337 1.513 0 1.03.894 1.443 2.956 2.268C9.694 7.77 11 9.281 11 11.55c0 2.681-2.062 4.95-6.462 4.95-1.857 0-3.644-.481-4.538-.963l.825-2.956z"
          fill="#000"
          mask="url(#b)"
        />
      </g>
      <g>
        <g transform="translate(0 4)">
          <mask id="d" fill="#fff">
            <use xlinkHref="#c" />
          </mask>
          <path
            d="M24.977 4.96C21.667 1.765 17.335 0 12.791 0 8.231 0 3.904 1.764.582 4.96L0 5.52l.565.579 1.844 1.887.53.543.548-.519c2.54-2.412 5.84-3.745 9.293-3.745 3.453 0 6.758 1.333 9.292 3.745l.548.519.53-.543L24.995 6.1"
            fill="#000"
            mask="url(#d)"
          />
        </g>
        <path
          d="M20.456 13.025a11.733 11.733 0 0 0-7.945-3.104h-.501l-.006.011a11.75 11.75 0 0 0-7.465 3.093l-.592.542.569.57 1.841 1.85.513.513.54-.48c1.425-1.266 3.232-1.968 5.084-1.968 1.864 0 3.671.702 5.096 1.969l.54.479.513-.514 1.841-1.848.569-.57-.597-.543zM12.832 22.421l.562-.553 3.09-3.04.621-.61-.679-.554c-.901-.663-1.896-1.164-3.6-1.164-1.698 0-2.628.547-3.6 1.164l-.673.554.62.61 3.091 3.04.568.553z"
          fill="#000"
        />
      </g>
    </g>
  </svg>
);

export default Both;