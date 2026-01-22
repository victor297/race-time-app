import { withLayoutContext } from "expo-router";
import { createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { View, TouchableOpacity, Text } from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image } from "expo-image";
import { useTailwindConfigColors } from "~/src/hooks/useTailwindConfigColors";
import { useAuthStore, useProfileStore } from "~/src/store";
import { useTypedRouter } from "~/src/configs";
import { Avatar, AvatarFallbackText } from "~/components/ui/avatar";
import { useNavigation } from "@react-navigation/native";

const { Navigator } = createDrawerNavigator();
const Drawer = withLayoutContext(Navigator);

function CustomDrawerContent(props: any) {
  const colors = useTailwindConfigColors();
  const profile = useProfileStore((s) => s.data);
  const logout = useAuthStore((s) => s.logout);
  const { replace } = useTypedRouter();
  const navigation = useNavigation();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ flex: 1 }}>
      <View style={{ padding: 20, flex: 1 }}>
        <DrawerLink
          label="Race Results"
          icon={<Feather name="award" size={20} color={colors.gray[500]} />}
          onPress={() => {
            // navigation.dispatch(DrawerActions.closeDrawer());
            router.push("/modal/race-results");
          }}
        />
        <DrawerLink
          label="User QR"
          icon={
            <MaterialIcons
              name="qr-code-2"
              size={20}
              color={colors.gray[500]}
            />
          }
          onPress={() => {
            // navigation.dispatch(DrawerActions.closeDrawer());
            router.push("/modal/user-qr");
          }}
        />
        <DrawerLink
          label="Connect Fitness App"
          icon={<Feather name="link" size={20} color={colors.gray[500]} />}
          onPress={() => {
            // navigation.dispatch(DrawerActions.closeDrawer());
            router.push("modal/connect-app");
          }}
        />
        <DrawerLink
          label="Terms"
          icon={<Feather name="list" size={20} color={colors.gray[500]} />}
          onPress={() => {
            // navigation.dispatch(DrawerActions.closeDrawer());
            router.push("/modal/terms");
          }}
        />
        <DrawerLink
          label="Privacy"
          icon={<Feather name="shield" size={20} color={colors.gray[500]} />}
          onPress={() => {
            // navigation.dispatch(DrawerActions.closeDrawer());
            router.push("/modal/privacy");
          }}
        />
      </View>

      {/* Bottom User Section */}
      <View
        style={{
          borderTopWidth: 1,
          borderColor: "#eee",
          padding: 20,
          width: "100%",
        }}
        className="flex"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
          }}
          className="flex w-full"
        >
          {profile?.profileUri && (
            <Image
              source={{
                uri: profile?.profileUri ?? "https://i.pravatar.cc/100",
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 10,
              }}
            />
          )}
          {!profile?.profileUri && (
            <Avatar
              style={{ width: 40, height: 40 }}
              className="bg-primary-500"
            >
              <AvatarFallbackText className="text-white">
                {profile?.firstName} {profile?.lastName}
              </AvatarFallbackText>
            </Avatar>
          )}
          {profile && (
            <View className="flex flex-1">
              <Text style={{ fontWeight: "bold" }} className="w-full">
                {profile?.firstName} {profile?.lastName}
              </Text>
              <Text style={{ color: "gray", fontSize: 12 }} className="w-full">
                {profile?.email ?? ""}
              </Text>
            </View>
          )}
        </View>
        <DrawerItem
          label="Logout"
          style={{ backgroundColor: colors.primary[50] }}
          icon={({ size }) => (
            <Feather name="log-out" size={size} color={colors.primary[500]} />
          )}
          labelStyle={{ color: colors.primary[500] }}
          onPress={async () => {
            await logout();
            replace("/auth/login");
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: "front",
        overlayColor: "rgba(0,0,0,0.3)",
        drawerStyle: {
          width: 300,
          backgroundColor: "#fff",
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    />
  );
}
function DrawerLink({
  label,
  icon,
  onPress,
}: {
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
        width: "100%",
      }}
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
        className="flex-1 flex-row w-full"
      >
        <View>{icon}</View>
        <View className="w-full flex flex-1 flex-row">
          <Text style={{ fontSize: 16 }} className="flex-1">
            {label}
          </Text>
        </View>
      </View>
      <View className="flex flex-row justify-end">
        <Feather name="chevron-right" size={20} color="#999" />
      </View>
    </TouchableOpacity>
  );
}
