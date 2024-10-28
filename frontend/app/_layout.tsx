
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import { Provider, useDispatch, useSelector } from 'react-redux';
import { setToken } from '../src/store/tokenSlice';

import Toast from "react-native-toast-message";
import { registerForPushNotificationsAsync } from "../src/utils/NotificationToken";
import * as Notifications from 'expo-notifications';
import store, { RootState } from "../src/store/store";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const LayoutContent = () => {

  const dispatch = useDispatch();
  
  useEffect(() => {
    console.log("Layout initialized with Firebase");

    registerForPushNotificationsAsync().then(token => {
      
      console.log('Expo Push Token:', token);
      dispatch(setToken(token));
    });

    // 알림 수신 리스너 설정
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('푸시 알림 수신:', notification);
      router.replace('/')
    });

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      subscription.remove();
    };
    
  }, []);

  return (
    
    <>
        <Stack screenOptions={{headerShown:false}}/>
        <Toast />
    </>
  );
}

// Provider로 LayoutContent를 감싸는 구조
export default function Layout () {
  return (
    <Provider store={store}>
      <LayoutContent />
    </Provider>
  );
}