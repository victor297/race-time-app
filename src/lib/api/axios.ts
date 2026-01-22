import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { router } from "expo-router";
import { Constants } from "~/src/utils";
// import fetchAdapter from "@vespaiach/axios-fetch-adapter";
export const api = axios.create({
  // baseURL: Constants.baseUrl.staging,
  baseURL: Constants.baseUrl.live,
  // timeout: 90000,
  // adapter: fetchAdapter,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 List of public (unauthenticated) endpoints
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/resentOtp",
  "/auth/verify-email",
];

api.interceptors.request.use(async (config) => {
  // Skip adding token if endpoint is public
  console.log(config.url);
  if (PUBLIC_ENDPOINTS.some((path) => config.url?.includes(path))) {
    return config;
  }

  const token = await AsyncStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export type ApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};

export async function apiRequest<T>(
  method: "get" | "post" | "put" | "delete",
  url: string,
  data?: any
): Promise<ApiResponse<T>> {
  try {
    const isMultipart =
      typeof FormData !== "undefined" && data instanceof FormData;

    const res = await api.request<ApiResponse<T>>({
      method,
      url,
      data,
      headers: {
        ...(isMultipart
          ? { "Content-Type": "multipart/form-data" }
          : { "Content-Type": "application/json" }),
      },
    });

    const payload = res.data;
    const normalized: ApiResponse<T> = {
      status: res.status ?? (payload?.status as number) ?? 200,
      message: (payload?.message as string) ?? "Success",
      data: ((payload as any).user ?? payload) as T,
    };

    console.log("normalized", JSON.stringify(normalized));
    return normalized;
  } catch (error: any) {
    const status = error.response?.status ?? 500;
    console.log(status);
    console.log(error.response?.status);
    if (!error.response?.status) {
      console.log(JSON.stringify(error));
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";
    console.log(url);
    if ((status === 401 || status === 403) && url != "v2/auth/login") {
      await AsyncStorage.removeItem("auth_token");
      router.replace("/auth/login");
    }
    console.log(message);

    return Promise.reject({
      status,
      message,
      data: error.response?.data ?? null,
    });
  }
}

export interface FileUploadOptions {
  /** API endpoint (absolute or relative) */
  url: string;
  /** HTTP method (default: POST) */
  method?: "POST" | "PATCH" | "PUT";
  /** Field name in FormData (default: 'file') */
  fieldName?: string;
  /** Optional file type and name override */
  fileInfo?: {
    name?: string;
    type?: string;
  };
  /** Optional extra form data fields */
  extraData?: Record<string, any>;
}

/**
 * Generic file upload function with progress tracking
 */
export async function apiFileUpload<T>(
  fileUri: string,
  {
    url,
    method = "POST",
    fieldName = "file",
    fileInfo = {},
    extraData = {},
  }: FileUploadOptions,
  onProgress?: (progress: number) => void
): Promise<ApiResponse<T>> {
  try {
    const token = await AsyncStorage.getItem("auth_token");
    const formData = new FormData();

    // Append the file
    formData.append(fieldName, {
      uri: fileUri,
      type: fileInfo.type || "image/jpeg",
      name: fileInfo.name || "upload.jpg",
    } as any);

    // Append any additional data
    Object.entries(extraData).forEach(([key, value]) =>
      formData.append(key, value)
    );

    const res = await api.request<ApiResponse<T>>({
      method,
      url,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(progress);
        }
      },
    });

    const payload = res.data;
    const normalized: ApiResponse<T> = {
      status: res.status ?? (payload?.status as number) ?? 200,
      message: (payload?.message as string) ?? "Success",
      data: ((payload as any).user ?? payload) as T,
    };

    return normalized;
  } catch (error: any) {
    const status = error.response?.status ?? 500;
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    return Promise.reject({
      status,
      message,
      data: error.response?.data ?? null,
    });
  }
}
