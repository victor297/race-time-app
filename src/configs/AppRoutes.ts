import { useRouter as useExpoRouter } from "expo-router";
import { RouteKey, RouteParams } from "../types";

/**
 * toPath(routeTemplate, params?)
 * - routeTemplate is a key of RouteParams e.g. "/race/details/[id]"
 * - If the route requires params (not undefined), you must pass them
 *
 * Uses a rest parameter trick so params are required only when needed.
 */
export function toPath<R extends RouteKey>(
  route: R,
  ...args: RouteParams[R] extends undefined ? [] : [params: RouteParams[R]]
): string {
  let path = route as string;
  const params = (args[0] ?? {}) as Record<string, string | number>;

  // replace placeholders like [id] with param value
  for (const k in params) {
    path = path.replace(`[${k}]`, encodeURIComponent(String(params[k])));
  }

  return path;
}

/**
 * useTypedRouter()
 * - wrapper around expo-router's useRouter that accepts typed routes
 */
export function useTypedRouter() {
  const router = useExpoRouter();

  function push<R extends RouteKey>(
    route: R,
    ...args: RouteParams[R] extends undefined ? [] : [params: RouteParams[R]]
  ) {
    const path = toPath(route, ...(args as any));
    router.push(path);
  }

  function replace<R extends RouteKey>(
    route: R,
    ...args: RouteParams[R] extends undefined ? [] : [params: RouteParams[R]]
  ) {
    const path = toPath(route, ...(args as any));
    router.replace(path);
  }

  function back() {
    router.back?.();
  }

  return { push, replace, back, raw: router };
}
