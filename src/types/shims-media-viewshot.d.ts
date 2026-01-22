declare module "react-native-view-shot" {
  import * as React from "react";
  import { ViewProps } from "react-native";
  export interface ViewShotProps extends ViewProps {
    options?: {
      format?: "png" | "jpg" | "webm" | string;
      quality?: number;
      result?: "tmpfile" | "base64" | "data-uri" | string;
    };
  }
  export default class ViewShot extends React.Component<ViewShotProps> {
    capture: (options?: ViewShotProps["options"]) => Promise<string>;
  }
}

declare module "expo-media-library" {
  export type PermissionResponse = { granted: boolean };
  export function requestPermissionsAsync(): Promise<PermissionResponse>;
  export function saveToLibraryAsync(assetUri: string): Promise<void>;
}
