import { FC } from "react";
import StyledImage from "../styled-image";
import { Link } from "react-router-dom";
import Logo from "../logo";
import { useMe } from "../../hooks/useMe";
import { FiInfo } from "react-icons/fi";
import { path } from "../../constants";

interface Props {}

const Header: FC<Props> = (props): JSX.Element => {
  const { data } = useMe();
  return (
    <>
      {!data?.me.verified && (
        <div className="bg-primary text-white py-4">
          <div className="container">
            <div className=" flex items-center gap-1">
              <FiInfo size={20} />
              Chào mừng bạn đến với Loship! Để hoàn tất thủ tục đăng kí, vui
              lòng xác nhận tại email <b>{data?.me.email}</b>
            </div>
          </div>
        </div>
      )}
      <header className="bg-white shadow">
        <div className="max-w-5xl flex items-center text-xs justify-center gap-9 py-2 mx-auto">
          <div className="flex items-center gap-1">
            <StyledImage
              wrapperClasses="h-[11px] w-[15px]"
              src="/assets/images/layout/vietnam.png"
              alt="Việt Nam"
            />
            Vietnamese
          </div>

          <div className="flex items-center gap-2">
            Tải ứng dụng:
            <Link
              to="/"
              className="rounded-[3px] border border-[#9b9b9b] px-1 hover:text-primary hover:border-primary transition"
            >
              iOS
            </Link>
            <Link
              to="/"
              className="rounded-[3px] border border-[#9b9b9b] px-1 hover:text-primary hover:border-primary transition"
            >
              Android
            </Link>
          </div>

          <Link to="/" className="">
            Trở thành đối tác Loship
          </Link>

          <Link to="/" className="">
            Đi chợ với Lomart
          </Link>
          <Link to="/" className="">
            Loship hỏi đáp
          </Link>
        </div>

        <Link
          to={path.editProfile}
          className="container flex justify-between pt-2 pb-3"
        >
          <Logo wrapperClasses="w-[100px] h-full" />

          <div className="flex items-center gap-2">
            <StyledImage
              wrapperClasses="w-9 h-9 rounded-full overflow-hidden"
              alt={data?.me.email as string}
              src="/assets/images/layout/default-user.png"
            />
            <div className="flex flex-col justify-center gap-y-1">
              <span className="text-sm">{data?.me.email}</span>
              <p className="text-xs">
                <b>Role:</b> {data?.me.role}
              </p>
            </div>
          </div>
        </Link>
      </header>
    </>
  );
};

export default Header;
