import { FC } from "react";
import Logo from "../logo";
import { RiSparkling2Line } from "react-icons/ri";

interface Props {
  content: string;
}

const AuthHeader: FC<Props> = ({ content }): JSX.Element => {
  return (
    <>
      <header className="flex items-center justify-center border-b shadow-sm py-4">
        <Logo wrapperClasses="w-[160px] h-5" />
      </header>
      <div className="bg-[#ecfcfc] h-11 flex items-center justify-center gap-2 text-sm">
        <RiSparkling2Line color="#00666d" size={25} />
        {content}
      </div>
    </>
  );
};

export default AuthHeader;
