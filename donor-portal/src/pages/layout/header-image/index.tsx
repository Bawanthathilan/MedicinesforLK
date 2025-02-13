import { FullBleedContainer } from "../full-bleed-container";
import "./styles.css";

export function HeaderImage({
  imageUrl,
  children,
  style = {},
}: {
  imageUrl: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <FullBleedContainer
      style={{ backgroundImage: `url(${imageUrl})`, ...style }}
      className="header-image"
    >
      {children}
    </FullBleedContainer>
  );
}
