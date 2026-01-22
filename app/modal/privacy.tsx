import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";

const PolicyPage = () => {
  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar title={`Privacy Policy`} />
          <View className="flex-1 bg-[#F1F1F3]">
            <KeyboardAwareScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{
                paddingHorizontal: 8,
                paddingTop: 10,
                paddingBottom: 140,
              }}
              enableOnAndroid={true}
              extraScrollHeight={20}
              showsVerticalScrollIndicator={false}
            >
              <View className="py-4 gap-4">
                <View className={`bg-white rounded-[12px] p-5 shadow-none`}>
                  <Text className="text-xl text-black/75 font-bold mb-2">
                    Effective date: October 2019
                  </Text>
                  <Text className="text-sm text-black/50 font-bold mb-2">
                    RaceTime Technologies (“RaceTime”) provides this Privacy
                    Policy to explain our policies and procedures regarding the
                    collection, use, and disclosure of information through
                    www.racetime.app
                  </Text>
                  <Text className="text-sm text-black/50 font-bold mb-2">
                    our mobile application, and any other websites, features,
                    applications, widgets, or online services owned or
                    controlled by RaceTime that link to this Privacy Policy
                    (collectively, the “Site”). This Privacy Policy also applies
                    to any information RaceTime collects offline in connection
                    with the Site.
                  </Text>
                  <Text className="text-sm text-black/50 font-bold mb-2">
                    RaceTime is an event-hosting platform that allows users to
                    participate in marathons and other athletic events. This
                    Privacy Policy applies to all information collected from the
                    effective date forward. Any information collected while a
                    previous version of this Privacy Policy was in effect will
                    remain governed by the terms of that prior policy.
                  </Text>
                </View>
              </View>
            </KeyboardAwareScrollView>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};
export default PolicyPage;
// Effective date: October 2019
