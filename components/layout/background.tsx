import { ReactNode } from "react";
import { Image, View, StyleSheet, Dimensions } from "react-native";
import AppImages from "~/src/configs/AppImages";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

type AppLayoutProps = {
  children?: ReactNode;
  withBackground?: boolean;
};

function AppBackground({ children, withBackground = true }: AppLayoutProps) {
  return (
    <View style={styles.container}>
      {withBackground && (
        <Image
          source={AppImages.bg}
          style={[
            styles.backgroundImage,
            {
              width: wp("100%"),
            },
          ]}
          resizeMode="cover"
        />
      )}
      <View style={styles.overlay}>{children}</View>
    </View>
  );
}

export default AppBackground;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  backgroundImage: {
    position: "absolute",
    opacity: 0.7,
  },
  overlay: {
    flex: 1,
  },
});
