import { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import ClientPageTopSection from "../../components/layout/client-page-top-section";
import { useLocation, useParams } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments";
import {
  CategoryQuery,
  CategoryQueryVariables,
} from "../../__generated__/graphql";
import RestaurantResults from "../../components/restaurants-page/restaurant-results";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENT}
`;

interface ICategoryParams {
  slug: string;
}

interface Props {}

const Category: FC<Props> = (props): JSX.Element => {
  const [currentPage, setCurrentPage] = useState(1);
  const params = useParams<ICategoryParams>();
  const { data, loading } = useQuery<CategoryQuery, CategoryQueryVariables>(
    CATEGORY_QUERY,
    { variables: { input: { page: 1, slug: params.slug } } }
  );

  return (
    <>
      <Helmet>
        <title>{`${(data?.category.category as any)?.name} | Loship`}</title>
      </Helmet>
      <ClientPageTopSection initialSearchQuery="" />

      <div className="container">
        <h2 className="font-extrabold text-xl mt-16">
          Tìm thấy {data?.category.totalResults} kết quả cho danh mục
          <span className="text-primary">
            &nbsp;"{(data?.category.category as any)?.name}"
          </span>
        </h2>

        <RestaurantResults
          currentPage={currentPage}
          loading={loading}
          restaurants={data?.category.restaurants}
          setCurrentPage={setCurrentPage}
          totalPages={data?.category.totalPages || 1}
        />
      </div>
    </>
  );
};

export default Category;
