export default function SparkleDecorations() {
  const sparkles = [
    { left: "49.2666%", top: "16.667%", fill: "#9E7AFF" },
    { left: "89.9124%", top: "26.0125%", fill: "#FE8BBB" },
    { left: "0.72824%", top: "10.1756%", fill: "#FE8BBB" },
    { left: "67.2119%", top: "25.0293%", fill: "#9E7AFF" },
    { left: "74.3665%", top: "17.1086%", fill: "#FE8BBB" },
    { left: "12.0871%", top: "28.1885%", fill: "#FE8BBB" },
    { left: "81.86%", top: "7.4337%", fill: "#FE8BBB" },
    { left: "17.0921%", top: "19.34786%", fill: "#FE8BBB" },
    { left: "62.0351%", top: "26.5403%", fill: "#FE8BBB" },
    { left: "61.388%", top: "4.4553%", fill: "#9E7AFF" },
    { left: "27.0921%", top: "6.34786%", fill: "#FE8BBB" },
    { left: "32.0351%", top: "26.5403%", fill: "#FE8BBB" },
    { left: "11.388%", top: "7.4553%", fill: "#9E7AFF" },
  ];

  return (
    <>
      {sparkles.map((sparkle, index) => (
        <svg
          key={index}
          className="pointer-events-none absolute z-20 animate-sparkle"
          width="21"
          height="21"
          viewBox="0 0 21 21"
          style={{
            left: sparkle.left,
            top: sparkle.top,
            animationDelay: `${index * 0.15}s`,
          }}
        >
          <path
            d="M9.82531 0.843845C10.0553 0.215178 10.9446 0.215178 11.1746 0.843845L11.8618 2.72026C12.4006 4.19229 12.3916 6.39157 13.5 7.5C14.6084 8.60843 16.8077 8.59935 18.2797 9.13822L20.1561 9.82534C20.7858 10.0553 20.7858 10.9447 20.1561 11.1747L18.2797 11.8618C16.8077 12.4007 14.6084 12.3916 13.5 13.5C12.3916 14.6084 12.4006 16.8077 11.8618 18.2798L11.1746 20.1562C10.9446 20.7858 10.0553 20.7858 9.82531 20.1562L9.13819 18.2798C8.59932 16.8077 8.60843 14.6084 7.5 13.5C6.39157 12.3916 4.19225 12.4007 2.72023 11.8618L0.843814 11.1747C0.215148 10.9447 0.215148 10.0553 0.843814 9.82534L2.72023 9.13822C4.19225 8.59935 6.39157 8.60843 7.5 7.5C8.60843 6.39157 8.59932 4.19229 9.13819 2.72026L9.82531 0.843845Z"
            fill={sparkle.fill}
          ></path>
        </svg>
      ))}
    </>
  );
}
