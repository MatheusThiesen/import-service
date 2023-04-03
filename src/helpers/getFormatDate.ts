export function getFormatDate({
  dateType,
  minutes,
  operationType,
}: {
  minutes: number;
  operationType: "pre" | "pos";
  dateType: "date" | "dateTime" | "time";
}) {
  const dateNow = new Date();

  if (operationType === "pre") {
    dateNow.setMinutes(dateNow.getMinutes() - minutes);
  } else {
    dateNow.setMinutes(dateNow.getMinutes() + minutes);
  }

  const day = dateNow.toLocaleString("pt-br", {
    day: "2-digit",
  });

  const month = dateNow.toLocaleString("pt-br", {
    month: "2-digit",
  });

  const year = dateNow.toLocaleString("pt-br", {
    year: "numeric",
  });

  const time = dateNow.toLocaleString("pt-br", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  switch (dateType) {
    case "date":
      return `${year}-${month}-${day}`;
    case "dateTime":
      return `${year}-${month}-${day}T${time}`;
    case "time":
      return time.replace(/[^a-zA-Z0-9]/g, "");
  }
}
