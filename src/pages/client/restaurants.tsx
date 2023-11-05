import { FC, useState } from "react";
import { Helmet } from "react-helmet";
import { gql, useQuery } from "@apollo/client";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from "../../__generated__/graphql";
import PromotionSwiper from "../../components/restaurants-page/promotion-swiper";
import CategoryItem from "../../components/restaurants-page/category-item";
import StyledImage from "../../components/styled-image";
import { Link } from "react-router-dom";
import RestaurantCard from "../../components/restaurant-card";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import ClientPageTopSection from "../../components/layout/client-page-top-section";
import RestaurantResults from "../../components/restaurants-page/restaurant-results";

const RESTAURANTS_QUERY = gql`
  query restaurantsPage($input: RestaurantsInput!) {
    allCategories {
      ok
      error
      categories {
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }

    restaurants(input: $input) {
      ok
      error
      totalPages
      totalResults
      results {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface Props {}

const Restaurants: FC<Props> = (props): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, { variables: { input: { page: currentPage } } });

  return (
    <>
      <Helmet>
        <title>Loship | Luôn Freeship đồ ăn</title>
      </Helmet>
      <ClientPageTopSection initialSearchQuery="" />
      <PromotionSwiper />

      <div className="container">
        <div className="grid grid-cols-10 gap-5 mt-10">
          {data?.allCategories.categories?.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
          <Link to="/">
            <StyledImage
              wrapperClasses="w-full aspect-square rounded-full"
              src="/assets/images/home/symbol-food.png"
              alt="Xem tất cả danh mục"
            />

            <span className="text-center font-extrabold mt-2 text-[#333] line-clamp-2">
              Xem tất cả
            </span>
          </Link>
        </div>

        <h2 className="font-extrabold uppercase text-xl mt-10">THỬ QUÁN MỚI</h2>
        <RestaurantResults
          currentPage={currentPage}
          loading={loading}
          restaurants={data?.restaurants.results}
          setCurrentPage={setCurrentPage}
          totalPages={data?.restaurants.totalPages || 1}
        />
      </div>
    </>
  );
};

export default Restaurants;
