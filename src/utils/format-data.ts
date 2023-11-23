import moment from "moment";

export function generateLast7DaysData(dateArr: any[]) {
  const last7Days: any[] = [
    { day: moment().subtract(1, "days").format("DD-MM"), items: [] },
    { day: moment().subtract(2, "days").format("DD-MM"), items: [] },
    { day: moment().subtract(3, "days").format("DD-MM"), items: [] },
    { day: moment().subtract(4, "days").format("DD-MM"), items: [] },
    { day: moment().subtract(5, "days").format("DD-MM"), items: [] },
    { day: moment().subtract(6, "days").format("DD-MM"), items: [] },
    { day: moment().subtract(7, "days").format("DD-MM"), items: [] },
  ];
  const currentDate = moment().subtract(1, "days");

  for (let i = 0; i <= 6; i++) {
    const startDate = moment(moment(currentDate).subtract(i, "days")).startOf(
      "day"
    );
    const endDate = moment(moment(currentDate).subtract(i, "days")).endOf(
      "day"
    );

    dateArr?.forEach((item) => {
      if (moment(item?.createdAt).isBetween(startDate, endDate)) {
        last7Days[i].items.push(item);
      }
    });
  }

  const newLast7Days = last7Days.map((day) => ({
    x: day.day,
    y: day.items.reduce((acc: number, cur: any) => {
      return acc + cur.total;
    }, 0),
  }));

  return newLast7Days.reverse();
}
