export const formatVNDCurrency = (rawPrice: any) => {
  const config = {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 9,
  };
  const formatted = new Intl.NumberFormat("vi-VN", config).format(rawPrice);

  return formatted;
};
