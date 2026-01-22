// central route definitions + param types
export type RouteParams = {
  "/": undefined;
  "/auth/login": undefined;
  "/auth/register": undefined;
  "/auth/verify": undefined;
  "/auth/forgetPassword": undefined;
  "/auth/resetPassword": undefined;
  "/events": undefined;
  "/feeds": undefined;
  "/activities": undefined;
  "/profile": undefined;
  "/add": undefined;
  "/modal/create-event": undefined;
  "/modal/payment-success": undefined;
  "/modal/post": undefined;
  "/modal/edit-profile": undefined;
  "/modal/stats-details": undefined;
  // "/race/details/[id]": { id: string | number };
  // add other routes here, use the same path format as your app/ file paths
};

// helper type: union of all route string literals
export type RouteKey = keyof RouteParams;
