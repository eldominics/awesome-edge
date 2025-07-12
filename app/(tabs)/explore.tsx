import ParallaxScrollView from "@/components/ParallaxScrollView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from "../lib/pushnotification";
import { supabase } from "../lib/supabase";

export default function TabTwoScreen() {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    const registerToken = async () => {
      const pushTokenRegisteredString = await AsyncStorage.getItem(
        "pushTokenRegistered"
      );
      const alreadyRegistered = pushTokenRegisteredString
        ? JSON.parse(pushTokenRegisteredString)
        : false;

      if (alreadyRegistered) return;

      registerForPushNotificationsAsync()
        .then(async (token) => {
          const sessionString = await AsyncStorage.getItem("session");
          const session = sessionString ? JSON.parse(sessionString) : null;
          console.log("token", token);
          console.log("session", session);
          if (session === null) {
            console.log("sessionError");
            return;
          }

          const { data, error } = await supabase
            .from("awesome_users")
            .upsert({ id: session?.user.id, expo_push_token: token })
            .select();

          console.log("upserted user", data);

          if (!error) {
            await AsyncStorage.setItem("pushTokenRegistered", "true");
          }
        })
        .catch((error: any) => setExpoPushToken(`${error}`));
    };

    registerToken();

    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        setNotification(notification);
      }
    );

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
    >
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "space-around",
        }}
      >
        <Text style={{ color: "white" }}>
          Your Expo push token: {expoPushToken}
        </Text>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "white" }}>
            Title: {notification && notification.request.content.title}{" "}
          </Text>
          <Text style={{ color: "white" }}>
            Body: {notification && notification.request.content.body}
          </Text>
          <Text style={{ color: "white" }}>
            Data:
            {notification && JSON.stringify(notification.request.content.data)}
          </Text>
        </View>
        <Button
          title="Press to Send Notification"
          onPress={async () => {
            const { data, error } = await supabase
              .from("awesome_users")
              .select("expo_push_token");
            if (error) {
              console.error("Error fetching push token:", error);
              return;
            }

            await sendPushNotification(data[0].expo_push_token);
          }}
        />
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
