import { BaseToastProps } from "react-native-toast-message";
import FullWidthToast from "./FullWidthToast";

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <FullWidthToast {...props} type="success" />
  ),
  error: (props: BaseToastProps) => <FullWidthToast {...props} type="error" />,
  info: (props: BaseToastProps) => <FullWidthToast {...props} type="info" />,
};
