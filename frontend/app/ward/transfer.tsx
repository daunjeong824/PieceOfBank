import { Link, useRouter, useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  Image,
  ImageBackground,
  TextInput,
  SafeAreaView,
  Alert,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import TransferObject from "../../src/ui/components/TransferObject";
import TransferCheck from "../../src/ui/components/TransferCheck";
import PinConfirm from "../../src/ui/components/PinConfirm";
import TransferOk from "../../src/ui/components/TransferOk";
import DirectoryTransfer from "../../src/ui/components/DirectoryTransfer";
import Toast from "react-native-toast-message";
import smallLogo from "../../src/assets/SmallLogo.png";
import { accountTransfer, getAccount, notifyPost } from "../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const careTransfer = () => {
  interface directoryInfo {
    nowAccount?: string;
    nowBank?: string;
    nowName?: string;
    countLimit?: string;
    allLimit?: string;
    mymyKey?:string;
    youyouKey?:string;
    
  }

  // 전달받은 계좌번호, 은행, 이름
  const params = useLocalSearchParams() as directoryInfo;
  const { nowAccount, nowBank, nowName, countLimit, allLimit, mymyKey, youyouKey } = params;

  // 전달받은 정보 변환 - 연락처 등록 대상에게 송금 할 때만 사용
  const [existAccount, setExistAccount] = useState<directoryInfo>({});
  const [existBank, setExistBank] = useState<directoryInfo>({});

  // 현재 계정의 핀 번호 정보
  const [nowPin, setNowPin] = useState("");

  // 현재 계정의 핀 번호 요청
  const pinInfo = () => {
    try {
      /* ★ 핀 번호 요청 보내는 내용 추가하기 ★ */
      setNowPin("111111"); // 임시 핀번호
    } catch (error) {
      console.log(error);
    }
  };

  // 현재 계정의 금액 한도 정보
  const [nowLimit, setNowLimit] = useState<string>("");
  const [totalLimit, setTotalLimit] = useState<string>("");

  // 현재 계정의 한도 정보 요청
  const limitInfo = () => {
    try {
      if (countLimit) {
        setNowLimit(countLimit); // 임시 한도 금액
      }
      if (allLimit){
        setTotalLimit(allLimit)
      }
      console.log('DD')
      console.log(countLimit)
      console.log(typeof countLimit)
      /* ★ 한도 정보 요청 보내는 내용 추가하기 ★ */
    } catch (error) {
      console.log(error);
    }
  };

  // 화면 가로고정
  useEffect(() => {
    const screenChange = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

      // 전달받은 계좌번호, 은행 정보 최초 송금 정보에 넣기 (일반 송금해서 직접 입력하는 경우 나중에 재입력 됨)
      setExistAccount({ nowAccount });
      setExistBank({ nowBank });

      // 현재 계정의 핀번호 확인
      pinInfo();

      // 현재 계정의 금액 한도 확인
      limitInfo();
    };
    screenChange();
    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  const router = useRouter();

  const [step, setStep] = useState("1"); // 송금 절차 화면 (1-1차, 2-2차, 3-3차, 4-4차)

  /* 요청 보낼 정보 */
  const [account, setAccount] = useState<string>(""); // 계좌번호
  const [bank, setBank] = useState<string>(""); // 은행
  const [balance, setBalance] = useState<string>(""); // 금액

  const [inputPin, setInputPin] = useState<string>(""); // 핀번호
  // 대표 내 계좌 (부모), (api) 
  const [myAccount, setMyAccount] = useState <string> ("");

  const moneyGo = async (balance: number) => {
    try {

      const keyGet = await AsyncStorage.getItem("myKey");
      const myKey = JSON.parse(keyGet!)

      const accountMy = await AsyncStorage.getItem("mainAccount");
      // const myAc = JSON.parse(acGet!)
      const JsonData = {
        depositAccountNo: account, // 상대방 계좌
        transactionBalance: balance,
        withdrawalAccountNo: accountMy, // 내 계좌
        depositTransactionSummary: "string", // 임시
        withdrawalTransactionSummary: "string", // 임시
      };

      console.log("최종 JsonData:", JsonData);
      const response = await accountTransfer(JsonData);
      console.log(response);
      
    } catch (error) {
      console.log(`에러: ${error}`);
      Toast.show({
        type: "error",
        text1: "송금 실패!",
        text2: "입력 정보를 다시 확인해주세요",
      });
      router.push('ward/main')

    }
  };

  // 알림 보내기
  const notifySend = async() =>{
    try{
      const data = {
        senderKey: mymyKey!,
        receiverKey: youyouKey!,
        notificationType: "account"
      }
      const response = await notifyPost(data);
      console.log(response)
    }
    catch(error){
      console.log(`에러: ${error}`)
    }
  }

  const getMoney = async () => {
    try {
      
      const response = await getAccount({ accountNo: myAccount });
      return response.data.REC.accountBalance;

    } catch (error) {
      console.log(`에러: ${error}`);
      Toast.show({
        type: "error",
        text1: "잔액 조회 실패!",
        text2: "다시 확인해주세요",
      });
    }
  }

  /* 1차 - 전체 대상 송금 (연락처 없는 경우) : 송금시 필요한 계좌, 은행, 금액 입력 받는 화면 */
  const firstChange = (account: string, bank: string, balance: string) => {
    setAccount(account);
    setBank(bank);
    setBalance(balance);
    setStep("2");
  };

  /* 1차 - 연락처 대상 송금 : 송금시 필요한 금액 입력 받는 화면 & 계좌, 은행은 전달받은 정보 활용 */
  const existChange = (balance: string) => {
    setBank(nowBank as string);
    setAccount(nowAccount as string);
    setBalance(balance);
    setStep("2");
  };

  /* 2차 - 송금 정보 맞는지 확인하는 화면 */
  const secondChange = () => {
    setStep("3");
  };

  /* 3차 - 핀번호 입력 화면 후 송금 요청*/
  const thirdChange = async (inputPin: string) => {
    if (inputPin == nowPin) {
      // 금액 한도 제한 확인해야 함
      const limitCheck = parseInt(nowLimit); // 한도 기준 숫자 변환
      const allCheck = parseInt(totalLimit)
      const balanceCheck = parseInt(balance); // 송금 금액 숫자 변환

        try{
/* pending history에 보내는 요청 추가 */
        /* 계좌 이체 보내는 요청 추가 */
        moneyGo(balanceCheck);
        if (balanceCheck > limitCheck || balanceCheck > allCheck) {
          console.log('키확인')
          console.log(mymyKey)
          console.log(youyouKey)
          // notifySend()
          Toast.show({
            type: "error",
            text1: "송금 실패 - 한도 초과!",
            text2: "기준 금액 초과로 승인 허락 요청이 들어갔습니다",
          });
          router.push("/ward/main");
      } else{
        // const remainderMoney = await getMoney(); 
        // checkBalanceAndNotify(remainderMoney);
        Toast.show({
          type: "success",
          text1: "송금 성공!",
          text2: "송금에 성공하셨습니다!",
        });
        router.push("/ward/main");
        }  
      }catch(error){
        console.log(`기준 확인 에러${error}`)
      }





    } else {
      Toast.show({
        type: "error",
        text1: "비밀번호가 일치하지 않습니다",
        text2: "다시 입력해주세요!",
      });
    }
  };

  // 계좌 잔액 체크
  // const checkBalanceAndNotify = async (accountBalance: number) => {
  //   const threshold = 100000; // 예시 임계값

  //   if (accountBalance < threshold) {
  //     try {
  //       // await notifyLimitRequest();
  //     } catch (error) {
  //       console.error("Error sending notification request:", error);

  //     }
  //   }
  // };

  // 1차 송금 화면 - 연락처 있는 사람이면 전달받은 계좌 정보 넣기 / 전체 거래 내역에서 송금하면 계좌 정보 직접 입력
  if (step == "1") {
    // 연락처에 없는 경우 일반 송금 - 계좌번호 & 은행 & 금액 입력받기
    if (nowName == "전체 기록") {
      return (
        <ImageBackground source={require("../../src/assets/POBbackGround.png")} className="flex-1">
          <View className="h-16 bg-blue-400 dark:bg-blue-100 flex flex-row justify-start items-center">
            <Image source={smallLogo} className="w-12 h-12" />
            <View className="flex-1 justify-start items-center">
              <Text className="text-2xl text-white font-bold">송금하기</Text>
            </View>
          </View>
          <View className="flex-1 justify-center items-center">
            <View className="flex-1 flex-row justify-center items-center">
              <TransferObject onChange={firstChange} />
            </View>
          </View>
        </ImageBackground>
      );
    }
    // 연락처 등록된 경우 - 금액만 입력 받고 전달받은 계좌 정보 넣기
    else {
      return (
        <ImageBackground source={require("../../src/assets/POBbackGround.png")} className="flex-1">
          <View className="h-16 bg-blue-400 dark:bg-blue-100 flex flex-row justify-start items-center">
            <Image source={smallLogo} className="w-12 h-12" />
            <View className="flex-1 justify-start items-center">
              <Text className="text-2xl text-white font-bold">송금하기</Text>
            </View>
          </View>
          <View className="flex-1 justify-center items-center">
            <View className="flex-1 flex-row justify-center items-center">
              <DirectoryTransfer onChange={existChange} name={nowName} />
            </View>
          </View>
        </ImageBackground>
      );
    }
  }

  // 2차 송금 화면 - 계좌 이체 정보 맞는지 보여주기
  else if (step == "2") {
    return (
      <ImageBackground source={require("../../src/assets/POBbackGround.png")} className="flex-1">
        <View className="h-16 bg-blue-400 dark:bg-blue-100 flex flex-row justify-start items-center">
          <Image source={smallLogo} className="w-12 h-12" />
          <View className="flex-1 justify-start items-center">
            <Text className="text-2xl text-white font-bold">송금 정보 확인</Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center">
          <View className="flex-1 flex-row justify-center items-center">
            <TransferCheck onChange={secondChange} balance={balance} />
          </View>
        </View>
      </ImageBackground>
    );
  }

  // 3차 송금 화면 - 핀번호 입력 일치 확인하기
  else if (step == "3") {
    return (
      <ImageBackground source={require("../../src/assets/POBbackGround.png")} className="flex-1">
        <View className="h-16 bg-blue-400 dark:bg-blue-100 flex flex-row justify-start items-center">
          <Image source={smallLogo} className="w-12 h-12" />
          <View className="flex-1 justify-start items-center">
            <Text className="text-2xl text-white font-bold">송금하기</Text>
          </View>
        </View>
        <View>
          <View className="flex-1 justify-center items-center">
            <View className="flex-1 flex-row justify-center items-center">
              <PinConfirm onChange={thirdChange} />
            </View>
          </View>
        </View>
      </ImageBackground>
    );
  }

  // 4차 송금 화면
  // 금액 한도 초과일 경우 보호자에게 알림
  // 금액 한도 이하일 경우 송금 완료
  // else if (step == "4") {
  //   return (
  //     <ImageBackground source={require("../../src/assets/POBbackGround.png")} className="flex-1">
  //       <View className="h-16 bg-blue-400 dark:bg-blue-100 flex flex-row justify-start items-center">
  //         <Image source={smallLogo} className="w-12 h-12" />
  //         <View className="flex-1 justify-start items-center">
  //           <Text className="text-2xl text-white font-bold">송금하기</Text>
  //         </View>
  //       </View>
  //       <View>
  //         <View className="flex-1 justify-center items-center">
  //           <View className="flex-1 flex-row justify-center items-center">
  //             <Text>{}</Text>
  //             {/* <TransferOk /> */}
  //           </View>
  //         </View>
  //       </View>
  //     </ImageBackground>
  //   );
  // }
};

export default careTransfer;
