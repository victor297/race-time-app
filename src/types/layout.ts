import { ReactNode } from "react";
import { ColorValue } from "react-native";

export enum AbarType {
  VARIANT1 = "variant1",
  VARIANT2 = "variant2",
  VARIANT3 = "variant3",
  VARIANT4 = "variant4",
}

export type AppLayoutProps = {
  appBar?: AppBar;
  children?: ReactNode;
  withBackground?: boolean;
  bgColor?: ColorValue;
  onBackPress?: () => void;
};

export type AppBar = {
  variant: AbarType;
  children?: ReactNode;
  action?: ReactNode[];
  leading?: ReactNode;
  title?: string;
};
