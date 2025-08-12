import notifee, { AndroidForegroundServiceType, AndroidImportance, Notification } from "@notifee/react-native";

const foregroundNotification = async (notificationId: string | undefined, title: string, body: string): Promise<Notification> => {
  const channelId = await notifee.createChannel({
    id: "info",
    name: "Info",
    importance: AndroidImportance.MIN,
  });

  // this is an workaround: notifee just get lost when id=undefined or id=""
  const idObj: Notification = notificationId ? { id: notificationId } : {};

  return {
    ...idObj,
    title,
    body,
    android: {
      channelId,
      ongoing: true,
      asForegroundService: true,
      foregroundServiceTypes: [AndroidForegroundServiceType.FOREGROUND_SERVICE_TYPE_DATA_SYNC],
    },
    ios: {
      interruptionLevel: "passive",
    },
  };
};

export const foregroundServiceStartNotification = async (title: string, body: string): Promise<string> => {
  notifee.registerForegroundService((notification) => {
    return new Promise(() => {});
  });

  const notification = await foregroundNotification("", title, body);
  return await notifee.displayNotification(notification);
};

export const foregroundServiceUpdateNotification = async (notificationId: string, title: string, body: string): Promise<void> => {
  const notification: Notification = await foregroundNotification(notificationId, title, body);
  await notifee.displayNotification(notification);
};

export const foregroundServiceStopNotification = async (notificationId: string): Promise<void> => {
  await notifee.stopForegroundService();
  if (notificationId != null) {
    await notifee.cancelNotification(notificationId);
  }
  console.log("done foregroundServiceStopNotification");
};
