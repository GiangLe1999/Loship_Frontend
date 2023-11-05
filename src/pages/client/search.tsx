import { gql, useLazyQuery } from "@apollo/client";
import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory, useLocation } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  SearchRestaurantQuery,
  SearchRestaurantQueryVariables,
} from "../../__generated__/graphql";
import ClientPageTopSection from "../../components/layout/client-page-top-section";
import RestaurantResults from "../../components/restaurants-page/restaurant-results";

const SEARCH_RESTAURANT = gql`
  query searchRestaurant($input: SearchRestaurantInput!) {
    searchRestaurant(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface Props {}

const Search: FC<Props> = (props): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const history = useHistory();
  const [queryReadyToStart, { loading, data }] = useLazyQuery<
    SearchRestaurantQuery,
    SearchRestaurantQueryVariables
  >(SEARCH_RESTAURANT);

  useEffect(() => {
    const query = location.search.split("?term=")[1];

    if (!query) {
      history.replace("/");
    }

    queryReadyToStart({ variables: { input: { page: 1, query } } });
  }, [history, location]);
  return (
    <div>
      <Helmet>
        <title>
          Kết quả cho "{location.search.split("?term=")[1]}" | Loship
        </title>
      </Helmet>
      <ClientPageTopSection
        initialSearchQuery={location.search.split("?term=")[1]}
      />

      <div className="container">
        <h2 className="font-extrabold text-xl mt-16">
          Tìm thấy {data?.searchRestaurant.totalResults} kết quả phù hợp cho{" "}
          <span className="text-primary">
            "{location.search.split("?term=")[1]}"
          </span>
        </h2>

        <RestaurantResults
          currentPage={currentPage}
          loading={loading}
          restaurants={data?.searchRestaurant.restaurants}
          setCurrentPage={setCurrentPage}
          totalPages={data?.searchRestaurant.totalPages || 1}
        />
      </div>
    </div>
  );
};

export default Search;
