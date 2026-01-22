import { GestureResponderEvent, ImageSourcePropType } from "react-native";

export interface IPhotoItem {
  id?: string | number;
  source: ImageSourcePropType; // supports require(...) or { uri: string }
  alt?: string;
}
