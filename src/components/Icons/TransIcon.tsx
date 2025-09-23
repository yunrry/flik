<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_118_1621)">
<path d="M9.66307 2.64892L7.01415 0L4.36523 2.64892H9.66307ZM4.36523 11.3511L7.01415 14L9.6619 11.3511H4.36523Z" fill="#979797"/>
<path d="M7.6965 2.61914V11.3511H6.40267V2.61914H7.6965ZM2.64892 4.36622L0 7.01514L2.64892 9.66406V4.36622ZM11.3511 9.66347L14 7.01456L11.3511 4.36564V9.66347Z" fill="#979797"/>
<path d="M2.61914 6.33203H11.3511V7.62586H2.61914V6.33203Z" fill="#979797"/>
</g>
<defs>
<clipPath id="clip0_118_1621">
<rect width="14" height="14" fill="white"/>
</clipPath>
</defs>
</svg>


interface TransIconProps {
    width?: number;
    height?: number;
    fill?: string;
    className?: string;
  }

  const TransIcon: React.FC<TransIconProps> = ({ 
    width = 14, 
    height = 14, 
    fill = "#979797",
    className = ""
  }) => {
    return (
      <svg
            width={width}
            height={height}
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <g clip-path="url(#clip0_118_1621)">
            <path d="M9.66307 2.64892L7.01415 0L4.36523 2.64892H9.66307ZM4.36523 11.3511L7.01415 14L9.6619 11.3511H4.36523Z" fill="#979797" />
            <path d="M7.6965 2.61914V11.3511H6.40267V2.61914H7.6965ZM2.64892 4.36622L0 7.01514L2.64892 9.66406V4.36622ZM11.3511 9.66347L14 7.01456L11.3511 4.36564V9.66347Z" fill="#979797" />
            <path d="M2.61914 6.33203H11.3511V7.62586H2.61914V6.33203Z" fill="#979797" />
            </g>
            <defs>
                <clipPath id="clip0_118_1621">
                    <rect width="14" height="14" fill="white" />
                </clipPath>
            </defs>
      </svg>
    );
  };
  
  export default TransIcon;
