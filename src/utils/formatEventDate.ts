import dayjs from "dayjs";
import {
  addDays,
  format,
  isAfter,
  isEqual,
  isThisWeek,
  isValid,
  startOfWeek,
  toDate,
} from "date-fns";

export function formatEventDate(dateString: string) {
  const date = dayjs(dateString);
  const day = date.date();

  // determine suffix
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
        ? "nd"
        : day % 10 === 3 && day !== 13
          ? "rd"
          : "th";

  return `${date.format("MMMM D")}${suffix}, ${date.format("YYYY")}`;
}

// Example:
// console.log(formatEventDate("2025-12-31T23:59:59Z"));
// Output: December 31st, 2025
export function validateDate(date: any) {
  if (isValid(date)) {
    return date;
  }
  const d: Date = toDate(Date.parse(date));
  return d;
}
export function validateTime(time: any) {
  if (!time) return new Date();
  var d = toDate(
    Date.parse(`${format(new Date(), "dd MMM yyyy")} ${time}:00 GMT+0100`)
  );
  if (!isValid(d)) {
    return new Date();
  }
  return d;
}
export function reverseDate(date: any) {
  if (!isValid(date)) {
    return date;
  }
  return format(date, "yyyy-MM-dd");
}
export function reverseTime(date: any) {
  if (!isValid(date)) {
    return date;
  }
  return format(date, "HH:mm");
}
export function dateRanges(date1: string, date2: string) {
  const d1: Date = toDate(Date.parse(String(date1).split(" ")[0]));
  const d2: Date = toDate(Date.parse(String(date2).split(" ")[0]));
  const today = toDate(Date.parse(format(new Date(), "yyyy-MM-dd")));
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, +1);
  if (!isValid(d1) && !isValid(d2)) {
    return "Unknown date";
  }
  if (isEqual(d1, d2)) {
    if (isEqual(today, d1)) {
      return "Today";
    }
    // console.log(yesterday,)
    if (isEqual(yesterday, d1)) {
      return "Yesterday";
    }
    if (isEqual(tomorrow, d1)) {
      return "Tomorrow";
    }
    return format(d1, "dd MMMM, yyyy");
  } else {
    if (isEqual(today, d1)) {
      return "Today - " + format(d2, "dd MMMM, yyyy");
    }
    return `${format(d1, "dd MMMM, yyyy")} - ${format(d2, "dd MMMM, yyyy")}`;
  }
}
export function formatDateTitle(date: string) {
  const d: Date = toDate(Date.parse(String(date).split(" ")[0]));
  if (!isValid(toDate(Date.parse(String(date).split(" ")[0])))) {
    return "Unknown date";
  }
  const today = toDate(Date.parse(format(new Date(), "yyyy-MM-dd")));
  const yesterday = addDays(today, -1);
  const tomorrow = addDays(today, +1);
  const result = startOfWeek(d, { weekStartsOn: 1 });
  if (isEqual(today, d)) {
    return "Today";
  }
  if (isEqual(yesterday, d)) {
    return "Yesterday";
  }
  if (isEqual(tomorrow, d)) {
    return "Tomorrow";
  }
  // if (!isEqual(today, d) && !isEqual(yesterday, d) && isThisWeek(d)) {
  //     return "This Week";
  // }
  return format(d, "dd MMMM, yyyy");
}
export function isDateGreater(date1: string, date2: string): boolean {
  if (!date1 || !date2) return false;
  const d1: Date = toDate(Date.parse(String(date1).split(" ")[0]));
  const d2: Date = toDate(Date.parse(String(date2).split(" ")[0]));
  return isAfter(d1, d2);
}
