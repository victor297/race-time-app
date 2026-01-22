import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiFileUpload, apiRequest, ApiResponse } from "../lib";

type ErrorResponse = {
  status?: number;
  message: string;
  data?: any;
};
interface FetchOptions {
  enabled?: boolean;
  params?: Record<string, string | number | boolean | undefined>;
  forceRefetch?: boolean;
}
type QueryInvalidateKey = string | string[] | (string | string[])[];

function invalidateQueriesHelper(
  queryClient: ReturnType<typeof useQueryClient>,
  keys?: QueryInvalidateKey
) {
  if (!keys) return;

  const keyList: (string | string[])[] = Array.isArray(keys[0])
    ? (keys as (string | string[])[])
    : [keys].flat();

  keyList.forEach((key) => {
    queryClient.invalidateQueries({
      queryKey: Array.isArray(key) ? key : [key],
    });
  });
}

// --------------------
// 🔹 GET / Fetch Hook
// --------------------
export const useFetch = <TData = any>(
  key: string | string[],
  url: string,
  options: FetchOptions = {}
) => {
  const { enabled = true, params = {}, forceRefetch = false } = options;

  const queryKey = Array.isArray(key) ? [...key, params] : [key, params];

  const alwaysRefetchEndpoints = ["/users/profile"];

  const shouldForceRefetch =
    forceRefetch || alwaysRefetchEndpoints.some((e) => url.includes(e));

  const query = useQuery<
    { status: number; message: string; data: TData },
    ErrorResponse
  >({
    queryKey,
    queryFn: async () => {
      // build query string from params
      const queryString = new URLSearchParams(
        Object.entries(params).reduce(
          (acc, [k, v]) => {
            if (v !== undefined && v !== null) acc[k] = String(v);
            return acc;
          },
          {} as Record<string, string>
        )
      ).toString();

      const fullUrl = queryString ? `${url}?${queryString}` : url;

      return await apiRequest<TData>("get", fullUrl);
    },
    staleTime: shouldForceRefetch ? 0 : 1000 * 60 * 5,
    refetchOnMount: shouldForceRefetch ? "always" : false,
    refetchOnReconnect: shouldForceRefetch,
    refetchOnWindowFocus: shouldForceRefetch,
    retry: 1,
  });

  // Expose refetch & query state
  return {
    ...query,
    refetch: query.refetch, // allows manual refresh
  };
};

// --------------------
// 🔹 POST / Create Hook
// --------------------
export const useCreate = <TData = any>(
  url: string,
  invalidateKeys?: QueryInvalidateKey
) => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: number; message: string; data: TData },
    ErrorResponse,
    any
  >({
    mutationFn: async (data) => {
      return await apiRequest<TData>("post", url, data);
    },
    onSuccess: (data) => {
      invalidateQueriesHelper(queryClient, invalidateKeys);
    },
  });
};

// --------------------
// 🔹 PUT / Update Hook
// --------------------
export const useUpdate = <TData = any>(
  url: string,
  invalidateKeys?: QueryInvalidateKey
) => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: number; message: string; data: TData },
    ErrorResponse,
    any
  >({
    mutationFn: async (data) => {
      return await apiRequest<TData>("put", url, data);
    },
    onSuccess: (data) => {
      invalidateQueriesHelper(queryClient, invalidateKeys);
    },
  });
};

// --------------------
// 🔹 DELETE / Delete Hook
// --------------------
export const useDelete = <TData = any>(
  url: string,
  invalidateKeys?: QueryInvalidateKey
) => {
  const queryClient = useQueryClient();

  return useMutation<
    { status: number; message: string; data: TData },
    ErrorResponse,
    any
  >({
    mutationFn: async (data) => {
      return await apiRequest<TData>("delete", url, data);
    },
    onSuccess: (data) => {
      invalidateQueriesHelper(queryClient, invalidateKeys);
    },
  });
};

// --------------------
// 🔹 File upload / Hook
// --------------------
interface UseFileUploadOptions {
  invalidateKeys?: QueryInvalidateKey;
  onProgress?: (progress: number) => void;
  onSuccess?: <T>(data: ApiResponse<T>) => void;
  onError?: (error: any) => void;
}

export const useFileUpload = <TData = any>(
  uploadUrl: string,
  { invalidateKeys, onProgress, onSuccess, onError }: UseFileUploadOptions = {}
) => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<TData>,
    Error,
    {
      fileUri: string;
      options?: Partial<Omit<Parameters<typeof apiFileUpload>[1], "url">>;
    }
  >({
    mutationFn: async ({ fileUri, options }) => {
      return await apiFileUpload<TData>(
        fileUri,
        {
          url: uploadUrl,
          method: options?.method ?? "PATCH",
          fieldName: options?.fieldName ?? "file",
          fileInfo: options?.fileInfo,
          extraData: options?.extraData,
        },
        onProgress
      );
    },
    onSuccess: (data) => {
      invalidateQueriesHelper(queryClient, invalidateKeys);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Upload error:", error);
      onError?.(error);
    },
  });
};
