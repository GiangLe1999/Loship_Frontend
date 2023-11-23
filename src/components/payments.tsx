import { FC, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "./checkout-form";

interface Props {
  restaurantId: number;
}

const Payments: FC<Props> = ({ restaurantId }): JSX.Element => {
  const [stripePromise, setStripePromise] = useState<any>(null);
  const [clientSecret, setClientSecret] = useState();

  useEffect(() => {
    setStripePromise(
      loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || "")
    );
  }, []);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_SERVER_URL}/payments/create-payment-intent`,
      {
        method: "POST",
        body: JSON.stringify({}),
      }
    ).then(async (r) => {
      const { clientSecret } = await r.json();
      setClientSecret(clientSecret);
    });
  }, []);

  return (
    <>
      {stripePromise && clientSecret && (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm restaurantId={restaurantId} />
        </Elements>
      )}
    </>
  );
};

export default Payments;
