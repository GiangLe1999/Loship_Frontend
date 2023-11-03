import { FC } from "react";

interface Props {
  wrapperClasses: string;
  imageClasses?: string;
  src: string;
  alt: string;
}

const StyledImage: FC<Props> = ({
  wrapperClasses,
  imageClasses,
  src,
  alt,
}): JSX.Element => {
  return (
    <div className={` ${wrapperClasses}`}>
      <img
        className={`h-full w-full object-cover object-center ${imageClasses}`}
        src={src}
        alt={alt}
      />
    </div>
  );
};

export default StyledImage;
