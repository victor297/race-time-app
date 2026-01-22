import { Text, TouchableOpacity, View } from "react-native";
import { ActivityStatusDto, UserRaceActivityDto } from "~/src/types";
import { AnimatedView } from "../ui";
import { Skeleton } from "moti/skeleton";
import {
  activitySourceLogo,
  formatDateToYMD,
  toCapitalizeActivityStatus,
} from "~/src/utils";
import { CloseIcon, Icon } from "~/components/ui/icon";
import { Check } from "lucide-react-native";
import { useTailwindConfigColors } from "~/src/hooks";
import React from "react";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
} from "~/components/ui/modal";
import { Heading } from "~/components/ui/heading";
import { Image } from "~/components/ui/image";
import { Divider } from "~/components/ui/divider";
import { StatsCard } from "../common";

type ActivityListCardProps = {
  items: UserRaceActivityDto[];
  title?: string;
  isLoading?: boolean;
  status: "pending" | "verified" | "declined" | "all";
};

const ActivityListCard = ({
  items,
  title = "Activities",
  isLoading,
  status,
}: ActivityListCardProps) => {
  const colors = useTailwindConfigColors();

  // Filter items by status
  const filteredItems = React.useMemo(() => {
    if (status === "all") {
      return items;
    }
    return items.filter((item) => item.status === status);
  }, [items, status]);

  const badgeColor = (status: ActivityStatusDto, code: 700 | 100 | 50) => {
    switch (status) {
      case ActivityStatusDto.VERIFIED:
        return colors.green[code];
      case ActivityStatusDto.DECLINED:
        return colors.red[code];
      default:
        return colors.gray[code];
    }
  };
  const ActivityCard = ({
    x,
    isLast,
  }: {
    x: UserRaceActivityDto;
    isLast: boolean;
  }) => {
    const [showModal, setShowModal] = React.useState<boolean>(false);
    return (
      <>
        <TouchableOpacity onPress={() => setShowModal(true)} className="w-full">
          <View
            className={`flex flex-row justify-between w-full ${isLast ? "pt-2" : "py-2 border-b border-b-black/5"}`}
          >
            <View className="flex-1 flex-row gap-2 items-center">
              <Image
                source={activitySourceLogo(x.source)}
                className="w-[50px] h-[50px] rounded-lg"
                resizeMode="contain"
                alt="Logo"
              />
              <View className="flex-1 flex-col gap-1 items-start">
                <Text className="text-lg font-semibold">Running</Text>
                <Text className="text-10px font-medium text-black/50">
                  {x.distanceKm} kM - {x.averageSpeedKmh} /KM
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-10px font-medium text-black/75 text-ellipsis"
                >
                  {x.event.title}
                </Text>
              </View>
            </View>
            <View className="flex flex-col items-end justify-between">
              <View
                className="flex flex-row gap-2 items-center p-2 rounded-full"
                style={{
                  backgroundColor: badgeColor(
                    x.status,
                    x.status == ActivityStatusDto.PENDING ? 100 : 50
                  ),
                }}
              >
                <Icon as={Check} size={12} color={badgeColor(x.status, 700)} />
                <Text
                  className={`text-xs font-medium`}
                  style={{ color: badgeColor(x.status, 700) }}
                >
                  {toCapitalizeActivityStatus(x.status)}
                </Text>
              </View>
              <Text className="text-10px font-medium text-black/50">
                {formatDateToYMD(x.dateUtc)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
          }}
          size="lg"
        >
          <ModalBackdrop />
          <ModalContent className="bg-white rounded-2xl px-6 pt-4 pb-8">
            <ModalHeader>
              <Heading size="sm">{x.name}</Heading>
              <ModalCloseButton>
                <Icon as={CloseIcon} className="text-black/50" />
              </ModalCloseButton>
            </ModalHeader>
            <ModalBody>
              <View className="flex-1 flex-col justify-center items-center gap-4">
                <Image
                  source={activitySourceLogo(x.source)}
                  className="w-[114px] h-[114px] rounded-lg"
                  resizeMode="contain"
                  alt="Logo"
                />
                <Divider />
                <View className="flex-1 flex-row justify-between items-start w-full">
                  <View className="flex-1 flex-col items-start gap-2">
                    <View className="flex flex-row gap-2 items-center">
                      <Text className="text-xs font-semibold text-black">
                        {x.name}
                      </Text>
                      <View
                        className="flex flex-row gap-2 items-center p-1 rounded-full"
                        style={{
                          backgroundColor: badgeColor(
                            x.status,
                            x.status == ActivityStatusDto.PENDING ? 100 : 50
                          ),
                        }}
                      >
                        <Icon
                          as={Check}
                          size={12}
                          color={badgeColor(x.status, 700)}
                        />
                        <Text
                          className={`text-xs font-medium`}
                          style={{ color: badgeColor(x.status, 700) }}
                        >
                          {toCapitalizeActivityStatus(x.status)}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-10px font-medium text-black/75 text-wrap">
                      {x.event.title}
                    </Text>
                  </View>
                  <View className="flex flex-col items-end justify-between gap-2">
                    <Text className="text-10px font-medium text-black/50">
                      {x.distanceKm} kM - {x.averageSpeedKmh} /KM
                    </Text>
                    <Text className="text-10px font-medium text-black/50">
                      {formatDateToYMD(x.dateUtc)}
                    </Text>
                  </View>
                </View>
                <Divider />
                <View className="w-full">
                  <StatsCard
                    title=""
                    year={""}
                    stats={{
                      distanceKm: x.distanceKm,
                      noOfRuns: 1,
                      pace: x.averageSpeedKmh,
                    }}
                    isLoading={false}
                    padding={0}
                  />
                </View>
              </View>
            </ModalBody>
          </ModalContent>
        </Modal>
      </>
    );
  };
  return (
    <View className="bg-white rounded-[12px] p-[20px] shadow-none">
      {/* header */}
      <View className="flex-row justify-between items-center mb-1">
        <AnimatedView variant="slideX" direction="left">
          {isLoading ? (
            <Skeleton
              width={120}
              height={18}
              colorMode="light"
              radius="round"
            />
          ) : (
            <Text className="text-lg font-semibold text-black">{title}</Text>
          )}
        </AnimatedView>
      </View>
      {isLoading &&
        Array.from({ length: 4 }, (_, i) => i).map((x) => (
          <AnimatedView key={`race-activity-loading-index-${x}`}>
            <ActivityItemSkeleton isLoading />
          </AnimatedView>
        ))}
      {!isLoading &&
        filteredItems.length > 0 &&
        filteredItems.map((x, i) => (
          <AnimatedView key={`race-activity-index-${i}`}>
            <ActivityCard x={x} isLast={i == filteredItems.length - 1} />
          </AnimatedView>
        ))}
      {!isLoading && filteredItems.length <= 0 && (
        <View className="w-full flex flex-row justify-center py-10">
          <Text className="text-gray-500">No activities</Text>
        </View>
      )}
    </View>
  );
};
export default ActivityListCard;

interface ActivitySkeletonProps {
  isLoading: boolean;
}

export const ActivityItemSkeleton: React.FC<ActivitySkeletonProps> = ({
  isLoading,
}) => {
  if (!isLoading) return null;

  return (
    <View className="flex flex-row justify-between w-full py-2 border-b border-b-black/5">
      {/* Left side: image + text */}
      <View className="flex flex-row gap-2 items-center">
        {/* Image placeholder */}
        <Skeleton colorMode="light" width={50} height={50} radius={8} />

        {/* Text placeholders */}
        <View className="flex flex-col gap-1 items-start">
          <Skeleton colorMode="light" width={100} height={18} />
          <Skeleton colorMode="light" width={120} height={10} />
          <Skeleton colorMode="light" width={80} height={10} />
        </View>
      </View>

      {/* Right side: badge + date */}
      <View className="flex flex-col items-end justify-between">
        {/* Status badge */}
        <Skeleton colorMode="light" width={80} height={28} radius={"round"} />

        {/* Date */}
        <Skeleton colorMode="light" width={60} height={10} />
      </View>
    </View>
  );
};
