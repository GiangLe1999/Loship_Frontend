import { gql, useQuery } from "@apollo/client";
import { FC, useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RESTAURANT_FRAGMENT } from "../../fragments";
import {
  Restaurant as IRestaurant,
  RestaurantQuery,
  RestaurantQueryVariables,
} from "../../__generated__/graphql";
import { Helmet } from "react-helmet";
import Header from "../../components/layout/header";
import StyledImage from "../../components/styled-image";
import QRCode from "qrcode.react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AiFillStar } from "react-icons/ai";
import { HiLink } from "react-icons/hi";
import { BiHome } from "react-icons/bi";
import { CopyToClipboard } from "react-copy-to-clipboard";

const RESTAURANT_QUERY = gql`
  query restaurant($input: RestaurantInput!) {
    restaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
`;

interface Props {}

interface IRestaurantParams {
  id: string;
}

const Restaurant: FC<Props> = (props): JSX.Element => {
  const [copied, setCopied] = useState(false);

  const params = useParams<IRestaurantParams>();
  const { data, loading } = useQuery<RestaurantQuery, RestaurantQueryVariables>(
    RESTAURANT_QUERY,
    {
      variables: {
        input: {
          restaurantId: Number(params.id),
        },
      },
    }
  );

  const onCopy = useCallback(() => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, []);

  const restaurant = data?.restaurant?.restaurant as IRestaurant;

  return (
    <>
      <Helmet>
        <title>{`${
          (data?.restaurant?.restaurant as any)?.name
        } | Loship`}</title>
      </Helmet>

      <Header />

      <div className="container mt-6">
        <div className="flex">
          <div className="w-[70%] pb-2 rounded-lg common-shadow bg-white overflow-hidden">
            {loading ? (
              <Skeleton className="w-full aspect-[2.5]" />
            ) : (
              <div className="relative">
                <StyledImage
                  src={restaurant?.coverImg2 || ""}
                  wrapperClasses="w-full aspect-[2.5]"
                  alt={restaurant?.name || ""}
                />
                <div className="bg-white rounded-lg absolute -bottom-10 right-20 overflow-hidden">
                  <QRCode
                    id="qrcode"
                    value={`${process.env.REACT_APP_BASE_URL}/restaurant/${restaurant?.id}`}
                    size={86}
                    level={"H"}
                    includeMargin={true}
                  />
                </div>
              </div>
            )}

            <div className="py-4 px-6">
              <div className="bg-primary text-white font-bold flex items-center gap-1 w-fit rounded-xl py-1 px-3">
                <AiFillStar />
                Đối tác Loship
              </div>

              <h1 className="font-bold text-2xl mt-4 mb-2">
                {(data?.restaurant?.restaurant as IRestaurant)?.name}
              </h1>

              <div className="">
                <h2 className="py-[2px] px-2 border border-[#cbcbcb] w-fit rounded-xl">
                  <Link
                    to={`/category/${restaurant?.category?.slug}`}
                    className="block"
                  >
                    {restaurant?.category?.name}
                  </Link>
                </h2>

                <address className="text-sm flex items-center gap-1 not-italic mt-5 mb-3">
                  <BiHome /> {restaurant?.address}
                </address>

                <p className="flex items-center gap-1 text-sm w-[45%]">
                  <HiLink color="#0897ee" />{" "}
                  <span className="text-[#0897ee]">{`${process.env.REACT_APP_BASE_URL}/restaurant/${restaurant?.id}`}</span>
                  <CopyToClipboard
                    onCopy={onCopy}
                    text={`${process.env.REACT_APP_BASE_URL}/restaurant/${restaurant?.id}`}
                  >
                    <button className="ml-4 text-[#9c9c9c] bg-[#f6f6f6] leading-5 rounded cursor-pointer px-[5px] text-xs">
                      {copied ? "đã copy" : "coppy link"}
                    </button>
                  </CopyToClipboard>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Restaurant;
