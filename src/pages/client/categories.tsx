import { FC } from "react";
import { Helmet } from "react-helmet";
import Header from "../../components/layout/header";
import { gql, useQuery } from "@apollo/client";
import { CATEGORY_FRAGMENT } from "../../fragments";
import {
  AllCategoriesQuery,
  AllCategoriesQueryVariables,
  Category,
} from "../../__generated__/graphql";
import { Link } from "react-router-dom";
import StyledImage from "../../components/styled-image";

const CATEGORIES_QUERY = gql`
  query allCategories {
    allCategories {
      ok
      error
      categories {
        ...CategoryParts
      }
    }
  }
  ${CATEGORY_FRAGMENT}
`;

interface Props {}

const Categories: FC<Props> = (props): JSX.Element => {
  const { data, loading } = useQuery<
    AllCategoriesQuery,
    AllCategoriesQueryVariables
  >(CATEGORIES_QUERY);
  console.log(data);
  return (
    <>
      <Helmet>
        <title>Tất cả danh mục | Loship</title>
      </Helmet>

      <Header />

      <div className="container">
        <h2 className="font-extrabold text-xl mt-10">Tất cả thể loại</h2>

        <div className="flex gap-4 mt-4">
          <div className="w-[15%] bg-white rounded-lg common-shadow p-4 h-fit">
            <ul>
              {data?.allCategories.categories?.map((category) => (
                <li>
                  <Link
                    to={`/category/${(category as Category).slug}`}
                    className="text-sm py-2 pl-2 block hover:text-primary hover:underline transition mb-1"
                  >
                    {(category as Category).name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 grid grid-cols-5 gap-4">
            {data?.allCategories.categories?.map((category) => (
              <div className="w-full bg-white rounded-lg common-shadow hover:shadow-[0_5px_15px_#0000004d] transition duration-500">
                <Link to={`/category/${(category as Category).slug}`}>
                  <StyledImage
                    wrapperClasses="w-full aspect-square"
                    imageClasses="rounded-t-lg"
                    src={(category as Category).coverImg || ""}
                    alt={(category as Category).name}
                  />
                  <h2 className="my-3 py-2 text-center font-bold text-lg">
                    {(category as Category).name}
                  </h2>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Categories;
