import { FC } from "react";
import { Helmet } from "react-helmet";
import Header from "../../components/layout/header";
import { gql, useQuery } from "@apollo/client";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import { MyRestaurantsQuery } from "../../__generated__/graphql";
import { Link } from "react-router-dom";
import RestaurantCard from "../../components/restaurant-card";

interface Props {}

export const MY_RESTAURANTS_QUERY = gql`
  query myRestaurants {
    myRestaurants {
      ok
      error
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

const MyRestaurants: FC<Props> = (props): JSX.Element => {
  const { data } = useQuery<MyRestaurantsQuery>(MY_RESTAURANTS_QUERY);

  return (
    <>
      <Helmet>
        <title>Cửa hàng của tôi | Loship</title>
      </Helmet>

      <Header />

      <div className="container">
        {data?.myRestaurants.ok &&
        data?.myRestaurants?.restaurants?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[80vh]">
            <p className="font-bold text-red-700 text-2xl">
              Bạn không sở hữu cửa hàng nào!
            </p>
            <p className="flex items-center gap-1 mt-3">
              Tạo ngay cửa hàng riêng cho mình tại
              <Link
                to="/add-restaurant"
                className="text-blue_link underline font-bold"
              >
                đây
              </Link>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-4 my-4">
            {data?.myRestaurants?.restaurants?.map((restaurant: any) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyRestaurants;
