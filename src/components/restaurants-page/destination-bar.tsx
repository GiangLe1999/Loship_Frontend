import { FC } from "react";
import { MdLocationPin } from "react-icons/md";
import { BiSolidChevronRight } from "react-icons/bi";

interface Props {}

const DestinationBar: FC<Props> = (props): JSX.Element => {
  return (
    <div className="px-4 py-3 w-[40%] rounded-lg shadow -mb-8 bg-white">
      <p className="text-[#9C9C9C] font-semibold mb-1 text-sm">
        Giao tới địa chỉ
      </p>
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-3">
          <MdLocationPin size={20} className="text-primary" />
          <span className="font-extrabold">Hồ Chí Minh</span>
        </p>
        <BiSolidChevronRight size={25} />
      </div>
    </div>
  );
};

export default DestinationBar;
