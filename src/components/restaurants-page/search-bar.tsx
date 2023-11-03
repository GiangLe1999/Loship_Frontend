import { FC } from "react";
import { RiSearch2Line } from "react-icons/ri";

interface Props {}

const SearchBar: FC<Props> = (props): JSX.Element => {
  return (
    <div className="bg-white rounded-full w-[40%] flex items-center">
      <div className="h-[50px] aspect-square grid place-items-center">
        <RiSearch2Line size={20} />
      </div>
      <input
        type="search"
        className="flex-1 outline-none mr-4"
        placeholder="Tìm quán ăn, trà sữa yêu thích để đặt Loship giao ngay"
      />
    </div>
  );
};

export default SearchBar;
