import { Link } from "expo-router";
import {
  View,
  Image,
  Text,
  ImageBackground,
  TextInput,
  SafeAreaView,
  Alert,
  TouchableOpacity,
  Button,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import smallLogo from "../../src/assets/SmallLogo.png";
import Header from "../../src/ui/components/Header";
import CancelButton from "../../src/ui/components/CancelButton";
import {
    getToken,
    getUserInfo,
  notifyList,
  sendExpoNotification,
  subscriptionApproval,
  subscriptionName,
  subscriptionRefusal,
} from "../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const familyAdd = () => {
  /* 인터페이스 */
  interface NameItem {
    requesterName: string;
    subscriptionId: number;
    senderKey: string,
    receiverKey: string,
  }

  interface ConnectItem {
    created: string;
    notificationId: number;
    notificationStatus: string;
    notificationType: string;
    readAt: null;
    receiverKey: string;
    senderKey: string;
  }

  const router = useRouter();

  // 요청 리스트
  const [connectList, setConnectList] = useState<ConnectItem[]>([]);

  // 요청 이름 리스트
  const [numList, setNumList] = useState<number[]>([]);

  // 구독 아이디, 이름 리스트
  const [nameList, setNameList] = useState<NameItem[]>([]);

  const [data, setData] = useState(1);

  /* 화면 가로 고정, 구독 보여주는 요청 보내기 */
  useEffect(() => {
    const screenChange = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    };
    screenChange();

    // 요청 전체 조회
    const notifyView = async () => {
      try {
        // 유저키 가져오기
        const keyGet = await AsyncStorage.getItem("myKey");
        const myKey = JSON.parse(keyGet!);

        const data = {
          receiverKey: myKey,
        };
        const response = await notifyList(data);
        console.log(response.data);
        setConnectList(response.data);
        setNumList((prevList) => {
          const items = [];
          for (let i = 0; i < response.data.length; i++) {
            const abc = response.data[i]["notificationId"];
            items.push(response.data[i]["notificationId"]);
          }
          return [...prevList, ...items];
        });
        setData(1);
      } catch (error) {
        console.log(`에러: ${error}`);
      }
    };
    notifyView();
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  /* 구독 요청 목록 생긴 후 실행 - 구독자 이름 + 구독 Id 정보 */
  useEffect(() => {
    const fetchData = async () => {
      if (numList.length > 0) {
        try {
          const items = await Promise.all(
            numList.map(async (num) => {
              const response = await subscriptionName(num);
              console.log(response);
              return {
                requesterName: response.data["requesterName"],
                subscriptionId: response.data["subscriptionId"],
                senderKey: response.data["senderKey"], // 자식 - protect
                receiverKey: response.data["receiverKey"], // 부모 - target
              };
            })
          );
          // 요청 완료된 후 상태 업데이트
          setNameList((prevList) => [...prevList, ...items]);
        } catch (error) {
          console.log(error);
        }
      }
    };
    if (numList.length > 0) {
      fetchData();
    }

    console.log("######")
    console.log(nameList);
    console.log("######")
  }, [numList]);

  /* 구독 요청 수락 */
  const checkAccept = (index: number) => {
    for (let i = 0; i < connectList.length; i++) {
      if (i == index) {
        const subCreate = async () => {
          try {
            const subId = nameList[i].subscriptionId;
            console.log("자식 ID " + subId)
              const response = await subscriptionApproval(subId);
              // 자식 유저키 구하기
            const familyUserKey = response.data.protectUser.userKey;
            console.log("자식 유저 키 : " + familyUserKey)
              // 자식 디바이스 토큰 구하기
              const familyExpoTokenRes = await getToken(familyUserKey);
              const familyExpoToken = familyExpoTokenRes.data;
            // 알람 붙이기
            console.log("자식 Expo 토큰 : " + familyExpoToken)
              const notificationMsg = {
                  to: familyExpoToken,
                  title: "구독 완료 알림",
                  content: "구독 관계가 설정되었어요!"
              }
            await sendExpoNotification(notificationMsg);
            console.log("알림 보낸ㅆ슴다...")
              
            console.log(response.data);
            router.replace('/ward/main')
          } catch (error) {
            console.log(error);
          }
        };
        subCreate();
        Toast.show({
          type: "success",
          text1: `${nameList[index].requesterName}님과의 관계 설정이 완료되었습니다.`,
          text2: "앞으로 주요 서비스를 이용하실 수 있습니다",
        });
        router.push("/ward/main");
      }
    }
  };

  /* 구독 요청 거절 */
  const checkReject = (index: number) => {
    for (let i = 0; i < connectList.length; i++) {
      if (i == index) {
        const subRefusal = async () => {
          try {
            console.log(nameList[i]);
            const subId = nameList[i].subscriptionId;
            const response = await subscriptionRefusal(subId);
          } catch (error) {
            console.log(error);
          }
        };
        subRefusal();
        Toast.show({
          type: "info",
          text1: `${nameList[index].requesterName}님과의 관계를 거절했습니다.`,
          text2: "관계 설정 후 주요 서비스를 이용하실 수 있습니다",
        });
        router.push("/ward/main");
      }
    }
  };

  if (connectList == null || connectList == undefined) return null;

  return (
    <ImageBackground source={require("../../src/assets/POBbackGround.png")} className="flex-1">
      <Header />
      <View className="justify-center items-center h-4/5">
        <Text className="text-2xl text-white font-bold my-2">관계 맺기</Text>

        <ScrollView className="flex-1">
          {connectList.map((list, index) => (
            <View
              key={index}
              className="w-80 h-12 p-2 m-2 flex-row bg-white justify-between rounded-3xl"
            >
              <View className="m-1 ml-3">
                {nameList.length == 0 ? (
                  <Text>요쳥 확인중입니다</Text>
                ) : (
                  <Text>{nameList[index].requesterName}님의 요청입니다</Text>
                )}
              </View>
              <View className="flex-row mx-2">
                <TouchableOpacity
                  className="w-16 h-8 mx-1 rounded-3xl justify-center bg-sky-500"
                  onPress={() => checkAccept(index)}
                >
                  <Text className="text-white text-center font-bold">수락</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="w-16 h-8 mx-1 rounded-3xl justify-center bg-red-500"
                  onPress={() => checkReject(index)}
                >
                  <Text className="text-white text-center font-bold">거절</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <CancelButton />
        <View className="h-20"></View>
      </View>
    </ImageBackground>
  );
};

export default familyAdd;
