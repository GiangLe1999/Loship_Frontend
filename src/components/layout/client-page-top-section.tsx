import { FC } from "react";
import Header from "./header";
import SearchBar from "../restaurants-page/search-bar";
import DestinationBar from "../restaurants-page/destination-bar";

interface Props {
  initialSearchQuery: string;
}

const ClientPageTopSection: FC<Props> = ({
  initialSearchQuery,
}): JSX.Element => {
  return (
    <>
      <Header />
      <div className="home-background flex flex-col items-center justify-center gap-y-6 pt-8">
        <h1 className="uppercase text-center font-black text-5xl leading-[60px]">
          <span className="text-[#333]">Đặt món nào</span> <br />
          <span className="text-primary">cũng freeship</span>
        </h1>

        <SearchBar initialSearchQuery={initialSearchQuery} />
        <DestinationBar />
      </div>
    </>
  );
};

export default ClientPageTopSection;
