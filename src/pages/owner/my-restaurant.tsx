import { gql, useQuery } from "@apollo/client";
import { FC, useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  DISH_FRAGMENT,
  ORDERS_FRAGMENT,
  RESTAURANT_FRAGMENT,
} from "../../fragments";
import {
  Dish,
  Restaurant as IRestaurant,
  MyRestaurantQuery,
  MyRestaurantQueryVariables,
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
import { FiPlus } from "react-icons/fi";
import { formatVNDCurrency } from "../../utils/format-price";
import { ImPlus } from "react-icons/im";
import {
  VictoryChart,
  VictoryAxis,
  VictoryLine,
  VictoryLabel,
  VictoryTooltip,
  VictoryTheme,
  VictoryVoronoiContainer,
} from "victory";
import { generateLast7DaysData } from "../../utils/format-data";
import Payments from "../../components/payments";
import CustomModal from "../../components/custom-modal";

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!) {
    myRestaurant(input: $input) {
      ok
      error
      restaurant {
        ...RestaurantParts
        menu {
          ...DishParts
        }
        orders {
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`;

interface Props {}

interface IParams {
  id: string;
}

const MyRestaurant: FC<Props> = (props): JSX.Element => {
  const { id } = useParams<IParams>();

  const [copied, setCopied] = useState(false);

  const [isCheckout, setIsCheckout] = useState(false);

  const { data, loading } = useQuery<
    MyRestaurantQuery,
    MyRestaurantQueryVariables
  >(MY_RESTAURANT_QUERY, {
    variables: { input: { id: Number(id) } },
  });

  const restaurant = data?.myRestaurant?.restaurant as IRestaurant;

  const chartData = generateLast7DaysData(restaurant?.orders);

  const onCopy = useCallback(() => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }, []);

  const openCheckout = () => {
    setIsCheckout(true);
  };

  return (
    <>
      <Helmet>
        <title>
          {`Cửa hàng ${restaurant?.name} |
          Loship`}
        </title>
      </Helmet>
      <Header />
      <div className="container mt-6">
        <div className="flex gap-6">
          <div className="w-[55%]">
            <div className="pb-2 rounded-lg common-shadow bg-white overflow-hidden">
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
                  {restaurant?.name}
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

                  <div className="flex items-center justify-between">
                    <p className="flex items-center gap-1 text-sm">
                      <HiLink color="#0897ee" />{" "}
                      <span className="text-[#0897ee]">{`${process.env.REACT_APP_BASE_URL}/restaurant/${restaurant?.id}`}</span>
                      <CopyToClipboard
                        onCopy={onCopy}
                        text={`${process.env.REACT_APP_BASE_URL}/restaurant/${restaurant?.id}`}
                      >
                        <button className="ml-4 text-[#9c9c9c] bg-[#f6f6f6] leading-5 rounded px-[5px] cursor-pointer text-xs">
                          {copied ? "đã copy" : "copy link"}
                        </button>
                      </CopyToClipboard>
                    </p>

                    <div className="flex items-center gap-3">
                      <Link
                        to={`/restaurant/${restaurant?.id}/add-dish`}
                        className="bg-emerald-700 text-white px-2 py-1 rounded-md text-sm hover:scale-105 transition"
                      >
                        Thêm món ăn
                      </Link>
                      <button
                        onClick={openCheckout}
                        className="bg-red-700 text-white px-2 py-1 rounded-md text-sm hover:scale-105 transition"
                      >
                        Mua quảng cáo
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg common-shadow bg-white p-6 mt-6">
              {data?.myRestaurant.restaurant?.menu.length === 0 ? (
                <div className="flex items-center justify-center flex-col h-full">
                  <p className="mb-2">Hiện tại cửa hàng chưa có món ăn nào</p>
                  <Link
                    to={`/restaurant/${restaurant?.id}/add-dish`}
                    className="flex items-center gap-1 bg-emerald-700 text-white px-3 py-2 rounded-md my-2 hover:scale-105 transition"
                  >
                    <FiPlus /> Thêm món ăn đầu tiên
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {data?.myRestaurant?.restaurant?.menu.map((dish) => (
                    <div key={(dish as Dish)?.id} className="flex gap-4">
                      <StyledImage
                        src={(dish as Dish)?.photo || ""}
                        alt={(dish as Dish).name}
                        wrapperClasses="w-[120px] h-[120px] rounded-md"
                        imageClasses="rounded-md"
                      />

                      <div className="font-bold flex-1">
                        <h4 className="text-bold_black w-[90%]">
                          {(dish as Dish).name}
                        </h4>
                        <p className="text-[#4e4e4e] font-normal text-sm mt-1 mb-2 w-[95%]">
                          {(dish as Dish).description}
                        </p>
                        <p className="text-primary">
                          {formatVNDCurrency((dish as Dish).price)}
                        </p>
                      </div>

                      <button className="w-7 h-7 bg-red-700 text-white grid place-items-center rounded-md">
                        <ImPlus />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            <div className="pb-2 rounded-lg common-shadow bg-white overflow-hidden">
              <h3 className="font-bold text-lg mt-4 mb-2 text-center">
                Doanh số 7 ngày gần đây
              </h3>

              <div className="w-[95%] ml-auto">
                <VictoryChart
                  height={500}
                  theme={VictoryTheme.material}
                  width={window.innerWidth}
                  domainPadding={50}
                  containerComponent={<VictoryVoronoiContainer />}
                >
                  <VictoryLine
                    labels={(data: any) => `${data.datum.y / 1000}K`}
                    labelComponent={
                      <VictoryTooltip
                        style={{ fontSize: 28 } as any}
                        renderInPortal
                        dy={-20}
                      />
                    }
                    data={chartData}
                    interpolation="natural"
                    style={{
                      data: {
                        strokeWidth: 5,
                      },
                    }}
                  />
                  <VictoryAxis
                    tickLabelComponent={<VictoryLabel renderInPortal />}
                    dependentAxis
                    tickFormat={(tick) => `${tick / 1000}K`}
                    style={{ tickLabels: { fontSize: 28 } }}
                  />
                  <VictoryAxis
                    tickLabelComponent={<VictoryLabel renderInPortal />}
                    style={{
                      tickLabels: {
                        fontSize: 28,
                      } as any,
                    }}
                  />
                </VictoryChart>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CustomModal
        heading="Nhập thông tin thanh toán"
        onClose={() => setIsCheckout(false)}
        open={isCheckout}
      >
        <Payments restaurantId={restaurant?.id} />
      </CustomModal>
    </>
  );
};

export default MyRestaurant;
