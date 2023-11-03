import { FC } from "react";
import { Link } from "react-router-dom";
import { path } from "../constants";

interface Props {
  isActive: string;
  switchTo: string;
}

const commonClasses =
  "px-3 py-[6px] rounded-full font-bold text-sm cursor-pointer";
const activeClasses = "bg-bold_black text-white font-extrabold";

const AuthSwitchBtns: FC<Props> = ({ isActive, switchTo }): JSX.Element => {
  return (
    <div className="flex rounded-full bg-[#e7e7e7] w-fit mx-auto mt-6">
      <Link
        to={path.login}
        className={`${commonClasses} ${isActive === "login" && activeClasses}`}
      >
        Đăng nhập
      </Link>
      <Link
        to={path.signup}
        className={`${commonClasses} ${isActive === "signup" && activeClasses}`}
      >
        Đăng kí
      </Link>
    </div>
  );
};

export default AuthSwitchBtns;
