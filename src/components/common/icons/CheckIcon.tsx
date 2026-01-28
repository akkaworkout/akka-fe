type CheckIconProps = {
  size?: number;
};

export default function CheckIcon({ size = 20 }: CheckIconProps) {
  return (
    <svg
      width={size}
      height={(size * 14) / 20}
      viewBox="0 0 20 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 7.5L7.5 12L18 2"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}