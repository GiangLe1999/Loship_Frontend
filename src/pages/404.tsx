import { FC } from "react";
import Logo from "../components/logo";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

interface Props {}

const NotFound: FC<Props> = (props): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Not Found | Loship</title>
      </Helmet>
      <div className="not-found-background">
        <div className="not-found-foreground"></div>
        <header className="flex items-center justify-center border-b shadow-sm py-4">
          <div className="relative z-[9999]">
            <Logo wrapperClasses="w-[160px] h-5" />
          </div>
        </header>
        <div className="text-center w-[450px] mx-auto text-white mt-[10%] relative z-[9999]">
          <p className="font-black text-5xl mb-5">HMMM!</p>
          <p className="uppercase font-extrabold text-2xl mb-4">
            Xin lỗi, Loship không tìm thấy cửa hàng bạn cần...
          </p>
          <p className="mb-5 text-sm">error code: 404</p>
          <p className="text-sm mb-3">
            Hãy tham khảo các cửa hàng dưới đây, Loship có đến hơn 30.000 cửa
            hàng đang chờ bạn!
          </p>
          <Link to="/" className="text-sm underline">
            Về trang chủ Loship
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
