import { Dispatch, FC, SetStateAction } from "react";
import RestaurantCard from "../restaurant-card";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Props {
  loading: boolean;
  restaurants: any;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPages: number;
}

const RestaurantResults: FC<Props> = ({
  loading,
  restaurants,
  currentPage,
  setCurrentPage,
  totalPages,
}): JSX.Element => {
  return (
    <>
      <div className="grid grid-cols-5 gap-4 mt-4">
        {loading ? (
          <>
            {[...Array(5).keys()].map((item) => (
              <Skeleton key={item} className="w-full aspect-[0.65]" inline />
            ))}
          </>
        ) : (
          <>
            {restaurants?.map((restaurant: any) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </>
        )}
      </div>
      <div className="w-fit pagination mx-auto py-8">
        <ResponsivePagination
          current={currentPage}
          total={totalPages || 1}
          onPageChange={setCurrentPage}
          previousLabel="Trang trước"
          nextLabel="Trang sau"
        />
      </div>
    </>
  );
};

export default RestaurantResults;
