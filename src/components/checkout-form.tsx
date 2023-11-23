import { PaymentElement } from "@stripe/react-stripe-js";
import { FormEvent, useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";
import StyledImage from "./styled-image";

interface Props {
  restaurantId: number;
}

export default function CheckoutForm({ restaurantId }: Props) {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/restaurant/${restaurantId}/checkout-success`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message || "");
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <div className="flex items-center gap-4 mb-6 border border-[#e6e6e6] rounded-[5px] p-4">
        <StyledImage
          src="/assets/images/icon-quang-cao.png"
          wrapperClasses="w-[55px] h-[55px] rounded-full"
          alt="Icon gói quảng cáo"
        />

        <div className="flex-1">
          <h3 className="font-bold text-primary">
            Mua gói quảng cáo cửa hàng 7 ngày
          </h3>
          <p className="text-sm">
            Gói quảng cáo giúp cửa hàng của bạn được ưu tiên xuất hiện tại vị
            trí cao trong danh sách tìm kiếm của Loship
          </p>
        </div>
        <div className="w-[50px] text-center font-bold text-lg">$5.00</div>
      </div>
      <PaymentElement id="payment-element" />
      <div className="text-right">
        <button disabled={isProcessing || !stripe || !elements} id="submit">
          <span className="bg-blue-900 font-bold p-2 text-white mt-4 block rounded-md">
            {isProcessing ? "Đang xử lý ... " : "Thanh toán"}
          </span>
        </button>
      </div>
      {/* Show any error or success messages */}
      {message && <div className="text-sm mt-3 text-primary">{message}</div>}
    </form>
  );
}
