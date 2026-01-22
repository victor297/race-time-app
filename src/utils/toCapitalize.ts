import { ActivityStatusDto } from "../types";

export function toCapitalizeActivityStatus(status: ActivityStatusDto): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
