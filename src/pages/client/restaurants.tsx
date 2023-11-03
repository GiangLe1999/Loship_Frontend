import { FC } from "react";
import SearchBar from "../../components/restaurants-page/search-bar";
import Header from "../../components/layout/header";
import { Helmet } from "react-helmet";

interface Props {}

const Restaurants: FC<Props> = (props): JSX.Element => {
  return (
    <>
      <Helmet>
        <title>Loship | Luôn Freeship đồ ăn</title>
      </Helmet>
      <Header />
      <div className="home-background flex flex-col items-center justify-center gap-y-6">
        <h1 className="uppercase text-center font-black text-5xl leading-[60px]">
          <span className="text-[#333]">Đặt món nào</span> <br />
          <span className="text-primary">cũng freeship</span>
        </h1>

        <SearchBar />
      </div>
    </>
  );
};

export default Restaurants;
