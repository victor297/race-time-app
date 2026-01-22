import { Text, View } from "react-native";
import { AppBtn } from "../ui";
import { Box } from "~/components/ui/box";
import { Feather } from "@expo/vector-icons";
type FormButtonControlProps = {
  currentStep: number;
  onPress: () => void;
  loaing?: boolean;
  isFree?: boolean;
  steps?: number;
};
const FormButtonControl = ({
  currentStep = 1,
  onPress,
  loaing = false,
  isFree = false,
  steps = 4,
}: FormButtonControlProps) => {
  return (
    <>
      <View
        className="w-full absolute left-0 right-0 bottom-0 px-0 bg-white pb-4"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
          elevation: 8,
        }}
      >
        <View className="bg-white p-3 px-5 flex-row items-center justify-between">
          <View className="w-1/2"><Text className="text-gray-500">
            Step {currentStep} of {steps}
          </Text></View>
          <View className={currentStep > 2 ? "w-52" : "w-40"}>
            {currentStep == 1 && (
              <AppBtn onPress={onPress}>
                <Box className="justify-center gap-2 items-center flex-row">
                  <Text className="text-white font-semibold">Next</Text>
                  <Feather name="arrow-right" size={18} color={"white"} />
                </Box>
              </AppBtn>
            )}
            {currentStep == 2 && (
              <AppBtn onPress={onPress}>
                <Box className="justify-center gap-2 items-center flex-row">
                  <Text className="text-white font-semibold">Next</Text>
                  <Feather name="arrow-right" size={18} color={"white"} />
                </Box>
              </AppBtn>
            )}
            {currentStep == 3 && (
              <AppBtn onPress={onPress}>
                <Box className="justify-center gap-2 items-center flex-row">
                  <Text className="text-white font-semibold">
                    {isFree ? "Submit" : "Proceed To Payment"}
                  </Text>
                  <Feather name="arrow-right" size={18} color={"white"} />
                </Box>
              </AppBtn>
            )}
            {currentStep == 4 && (
              <AppBtn
                loading={loaing}
                loadingText="Please wait..."
                onPress={onPress}
              >
                <Box className="justify-center gap-2 items-center flex-row">
                  <Text className="text-white font-semibold">
                    Proceed To Checkout
                  </Text>
                  <Feather name="arrow-right" size={18} color={"white"} />
                </Box>
              </AppBtn>
            )}
          </View>
        </View>
      </View>
    </>
  );
};
export default FormButtonControl;
