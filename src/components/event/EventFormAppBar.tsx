import { FontAwesome6 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { AppBtn } from "../ui";
type EventFormAppBarProps = {
  currentStep: number;
  onPress: () => void;
  onPrevious: () => void;
  onGoBack: () => void;
  title?: string;
  showPrevious?: boolean;
};
const EventFormAppBar = ({
  currentStep,
  onPress,
  onGoBack,
  onPrevious,
  title = "Registration",
  showPrevious = true,
}: EventFormAppBarProps) => {
  return (
    <>
      <View className="bg-white p-3 px-5 py-5 flex-row items-center justify-between shadow-black shadow-lg">
        {/* LEFT SECTION */}
        <View className="w-1/2 flex flex-row justify-start items-center gap-4">
          <TouchableOpacity onPress={onGoBack}>
            <FontAwesome6 name="arrow-left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="flex-1 text-black/75 font-bold text-[16px]">{title}</Text>
        </View>

        {/* RIGHT SECTION */}
        <View className="flex-row w-[180px] justify-end">
          {currentStep > 1 && showPrevious && (
            <View className="w-[95px]">
              <AppBtn
                onPress={onPrevious}
                variant="default"
                className="bg-transparent"
              >
                <Text className="text-black/75 font-bold text-[14px] text-right">
                  Previous
                </Text>
              </AppBtn>
            </View>
          )}

          <View className="w-[95px] items-end">
            <AppBtn
              onPress={onPress}
              variant="default"
              className="bg-transparent"
            >
              <Text className="text-black/75 font-bold text-[14px] text-right">
                Continue
              </Text>
            </AppBtn>
          </View>
        </View>
      </View>
    </>
  );
};
export default EventFormAppBar;
