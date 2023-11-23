import { FC } from "react";
import StyledImage from "./styled-image";
import { Link } from "react-router-dom";
import { MdFastfood } from "react-icons/md";
import { Restaurant } from "../__generated__/graphql";

interface Props {
  restaurant: Restaurant;
}

const RestaurantCard: FC<Props> = ({ restaurant }): JSX.Element => {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="rounded-lg border">
      <StyledImage
        src={restaurant?.coverImg}
        alt={restaurant?.name}
        wrapperClasses="w-full aspect-square rounded-t-lg overflow-hidden"
      />
      <div className="py-3 px-2">
        <h4 className="font-extrabold line-clamp-2 h-[45px] text-primary">
          {restaurant?.name}
        </h4>
        <span className="font-bold flex items-center gap-[2px] text-sm mt-[10px] text-slate-600">
          <MdFastfood className="-mt-[1px]" />
          <span>{restaurant?.category?.name}</span>
        </span>

        <span className="text-slate-400 line-clamp-2 text-xs mt-2">
          {restaurant?.address}
        </span>
      </div>
    </Link>
  );
};

export default RestaurantCard;
