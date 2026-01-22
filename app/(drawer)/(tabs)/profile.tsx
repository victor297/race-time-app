import { Feather } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { AppLayout } from "~/components";
import { ProfileScreen } from "~/src/screens";
import { AbarType } from "~/src/types";
import { useNavigation, DrawerActions } from "@react-navigation/native";

export default function ProfilePage() {
  const navigation = useNavigation();

  return (
    <AppLayout
      withBackground={false}
      appBar={{
        variant: AbarType.VARIANT1,
        action: [
          <TouchableOpacity
            key="menu"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          >
            <Feather name="menu" size={24} color="black" />
          </TouchableOpacity>,
        ],
      }}
    >
      <ProfileScreen />
    </AppLayout>
  );
}
