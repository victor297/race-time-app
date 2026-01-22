import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppBar } from "~/components";

const TermsPage = () => {
  return (
    <>
      <SafeAreaView
        className="flex-1 bg-white"
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 bg-white">
          <AppBar title={`Teams`} />
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
                    These Terms and Conditions (“Terms”) govern your use of
                    www.racetime.app
                  </Text>
                  <Text className="text-sm text-black/50 font-bold mb-2">
                    , the RaceTime mobile application, and any websites,
                    features, applications, widgets, or online services owned or
                    controlled by RaceTime Technologies (“RaceTime”) that link
                    to these Terms (collectively, the “Site”). By accessing or
                    using the Site, you agree to be bound by these Terms.
                  </Text>
                  <Text className="text-sm text-black/50 font-bold mb-2">
                    RaceTime is an event-hosting platform where users can
                    discover, register for, and participate in marathons and
                    other athletic events. These Terms apply to all users,
                    participants, event organizers, and visitors who access or
                    use the Site.
                  </Text>
                  <Text className="text-sm text-black/50 font-bold mb-2">
                    Please read these Terms carefully before using the Site. If
                    you do not agree with any part of these Terms, you should
                    not access or use RaceTime services.
                  </Text>
                  <Text className="text-sm text-black/50 font-bold mb-2">
                    RaceTime reserves the right to update or modify these Terms
                    at any time. Any changes will be effective immediately upon
                    posting, and your continued use of the Site constitutes
                    acceptance of the updated Terms.
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
export default TermsPage;
