import { FC } from "react";
import { Link } from "react-router-dom";

interface Props {}

const AuthCommitContent: FC<Props> = (props): JSX.Element => {
  return (
    <>
      <div className="flex items-center justify-between gap-x-4 mt-8">
        <div className="h-[1px] w-full bg-[#ebebeb]"></div>
        <h2 className="text-sm font-bold min-w-fit block text-[#9c9c9c]">
          Chào mừng bạn đến với Loship
        </h2>
        <div className="h-[1px] w-full bg-[#ebebeb]"></div>
      </div>

      <p className="text-[#6b6b6b] text-xs py-4">
        Tiếp tục nghĩa là bạn đồng ý nhận cuộc gọi hoặc tin nhắn WhatsApp hay
        SMS, kể cả từ công cụ tự động, của&nbsp;
        <Link to="/" className="text-blue_link underline font-bold">
          Loship
        </Link>
        &nbsp; và các công ty liên kết đến số bạn cung cấp.
      </p>

      <p className="text-[#6b6b6b] text-xs pb-10">
        Trang web này được bảo vệ bởi reCAPTCHA và áp dụng&nbsp;
        <Link to="/" className="text-blue_link underline font-bold">
          Chính sách Quyền riêng tư
        </Link>
        &nbsp; và&nbsp;
        <Link to="/" className="text-blue_link underline font-bold">
          Điều khoản dịch vụ
        </Link>
        &nbsp; của Google.
      </p>
    </>
  );
};

export default AuthCommitContent;
