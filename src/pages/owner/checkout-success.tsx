import { FC, useEffect } from "react";
import Header from "../../components/layout/header";
import { Helmet } from "react-helmet";
import { gql, useMutation } from "@apollo/client";
import {
  CreatePaymentMutation,
  CreatePaymentMutationVariables,
} from "../../__generated__/graphql";
import { useHistory, useParams } from "react-router-dom";
import { BsCheckCircleFill } from "react-icons/bs";

interface Props {}

const CREATE_PAYMENT_MUTATION = gql`
  mutation createPayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      ok
      error
    }
  }
`;

interface IParams {
  restaurantId: string;
}

const CheckoutSuccess: FC<Props> = (props): JSX.Element => {
  const { restaurantId } = useParams<IParams>();
  const history = useHistory();
  const onCompleted = (data: CreatePaymentMutation) => {
    if (data.createPayment.ok) {
      setTimeout(() => {
        history.push("/");
      }, 2000);
    }
  };
  const [createPaymentMutation] = useMutation<
    CreatePaymentMutation,
    CreatePaymentMutationVariables
  >(CREATE_PAYMENT_MUTATION, { onCompleted });

  useEffect(() => {
    if (restaurantId) {
      createPaymentMutation({
        variables: {
          input: { transactionId: "", restaurantId: Number(restaurantId) },
        },
      });
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Thanh toán thành công | Loship</title>
      </Helmet>

      <Header />

      <div className="border rounded-md p-6 pb-9 w-[500px] mx-auto mt-[5%] shadow bg-white">
        <h1 className="my-2 flex items-center justify-center gap-1 text-xl font-bold text-emerald-700">
          Bạn đã thanh toán thành công
          <BsCheckCircleFill className="text-emerald-700" />
        </h1>
        <p className="mt-3 text-center">
          Cảm ơn bạn vì đã tin tưởng và sử dụng dịch vụ của Loship
        </p>
      </div>
    </>
  );
};

export default CheckoutSuccess;
