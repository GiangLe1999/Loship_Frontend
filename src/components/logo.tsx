import { FC } from "react";
import { Link } from "react-router-dom";
import StyledImage from "./styled-image";

interface Props {
  wrapperClasses: string;
}

const Logo: FC<Props> = ({ wrapperClasses }): JSX.Element => {
  return (
    <Link to="/">
      <StyledImage
        wrapperClasses={wrapperClasses}
        src="/assets/images/layout/logo.png"
        alt="Loship Logo"
        imageClasses="!object-contain"
      />
    </Link>
  );
};

export default Logo;
