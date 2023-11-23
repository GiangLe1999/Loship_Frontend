export const formatToDayAndMonth = (rawDate: string) => {
  const date = new Date(rawDate);

  return date.toLocaleDateString("vi-VN", { day: "numeric", month: "numeric" });
};
