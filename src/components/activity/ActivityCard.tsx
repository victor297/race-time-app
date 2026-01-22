import { Text, TouchableOpacity, View } from "react-native";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
} from "~/components/ui/avatar";
import { AnimatedView } from "../ui";
import { ActivityDto } from "~/src/types";
import { timeAgo } from "~/src/utils";

const ActivityCard: React.FC<{
  activity: ActivityDto;
  onPress?: () => void;
}> = ({ activity, onPress }) => {
  const { user, description, createdAt } = activity;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      className="flex-row items-center py-4"
      accessibilityRole="button"
    >
      <AnimatedView variant="fade">
        <Avatar className="w-12 h-12">
          {user.profileUri && <AvatarImage source={{ uri: user.profileUri }} />}
          {!user.profileUri && (
            <AvatarFallbackText className="text-white">
              {user.firstName} {user.lastName}
            </AvatarFallbackText>
          )}
        </Avatar>
      </AnimatedView>
      <View className="flex-1 ml-2">
        {/* Primary line: Name (red) followed by verb and short text */}
        <AnimatedView variant="scale">
          <Text className="text-base">
            <Text className="font-semibold text-red-500">
              {user.firstName} {user.lastName}
            </Text>
            <Text className="text-gray-700"> {description}</Text>
          </Text>
        </AnimatedView>
      </View>
      <AnimatedView variant="slideX" direction="right">
        <Text className="text-xs text-gray-400 ml-3">{timeAgo(createdAt)}</Text>
      </AnimatedView>
    </TouchableOpacity>
  );
};

export default ActivityCard;
