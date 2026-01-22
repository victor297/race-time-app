import { View } from "react-native";
import { Skeleton } from "moti/skeleton";

export default function EventCardSkeleton() {
  return (
    <View className="mb-5 bg-white w-full">
      <Skeleton.Group show={true}>
        {/* Banner Image */}
        <Skeleton colorMode="light" height={274} radius={4} />

        {/* Icons + Participants */}
        <View className="flex flex-row justify-between items-center px-2 mt-2">
          <View className="flex flex-row justify-start gap-4">
            <Skeleton colorMode="light" width={24} height={24} radius={12} />
            <Skeleton colorMode="light" width={24} height={24} radius={12} />
          </View>
          <Skeleton colorMode="light" width={140} height={10} radius={4} />
        </View>

        {/* Title + Arrow */}
        <View className="flex flex-row justify-between items-center mt-2 px-2 gap-2">
          <Skeleton colorMode="light" width={180} height={14} radius={4} />
          <Skeleton colorMode="light" width={24} height={24} radius={12} />
        </View>

        {/* Date */}
        <View className="mt-2 px-2">
          <Skeleton colorMode="light" width={100} height={10} radius={4} />
        </View>

        {/* Badge */}
        <View className="absolute bottom-36 right-3">
          <Skeleton colorMode="light" width={80} height={24} radius={12} />
        </View>
      </Skeleton.Group>
    </View>
  );
}
