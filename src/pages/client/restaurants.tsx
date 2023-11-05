import { FC } from "react";
import SearchBar from "../../components/restaurants-page/search-bar";
import Header from "../../components/layout/header";
import { Helmet } from "react-helmet";
import { gql, useQuery } from "@apollo/client";
import {
  RestaurantsPageQuery,
  RestaurantsPageQueryVariables,
} from "../../__generated__/graphql";
import DestinationBar from "../../components/restaurants-page/destination-bar";
import PromotionSwiper from "../../components/restaurants-page/promotion-swiper";
import CategoryItem from "../../components/restaurants-page/category-item";
import StyledImage from "../../components/styled-image";
import { Link } from "react-router-dom";
import RestaurantCard from "../../components/restaurant-card";

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
        id
        name
        coverImg
        category {
          name
        }
        address
        isPromoted
      }
    }
  }
`;

interface Props {}

const Restaurants: FC<Props> = (props): JSX.Element => {
  const { data, loading, error } = useQuery<
    RestaurantsPageQuery,
    RestaurantsPageQueryVariables
  >(RESTAURANTS_QUERY, { variables: { input: { page: 1 } } });

  return (
    <>
      <Helmet>
        <title>Loship | Luôn Freeship đồ ăn</title>
      </Helmet>
      <Header />
      <div className="home-background flex flex-col items-center justify-center gap-y-6 pt-8">
        <h1 className="uppercase text-center font-black text-5xl leading-[60px]">
          <span className="text-[#333]">Đặt món nào</span> <br />
          <span className="text-primary">cũng freeship</span>
        </h1>

        <SearchBar />
        <DestinationBar />
      </div>
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
        <div className="grid grid-cols-5 gap-4 mt-4">
          {data?.restaurants.results?.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Restaurants;
