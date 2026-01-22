import { withLayoutContext } from "expo-router";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useTailwindConfigColors } from "~/src/hooks/useTailwindConfigColors";

const { Navigator } = createDrawerNavigator();
const Drawer = withLayoutContext(Navigator);

function CustomDrawerContent(props: any) {
  const colors = useTailwindConfigColors();
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20 }}>
        <TouchableOpacity onPress={() => router.push("/(drawer)/race-results")}>
          <Text style={{ fontSize: 16 }}>Race Results</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(drawer)/user-qr")}>
          <Text style={{ fontSize: 16, marginTop: 10 }}>User QR</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "front", // or "slide"
        overlayColor: "rgba(0,0,0,0.3)",
        drawerStyle: {
          width: 300,
          backgroundColor: "#fff",
          zIndex: 9999,
          elevation: 20,
          shadowColor: "#000",
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}
