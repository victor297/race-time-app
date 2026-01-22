import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function timeAgo(date: string): string {
  if (!date) return "";
  return dayjs(date).fromNow();
}

export function getPostYear(date: string | undefined | null): string | null {
  if (!date) return null;
  const year = new Date(date).getFullYear();
  return year.toString();
}
export function formatDateToYMD(date: string | Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
