import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, ImageBackground, TextInput, SafeAreaView, Alert, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Toast from "react-native-toast-message";
import TransferInput from "../../src/ui/components/Temporary/TransferInput";
import PinInfo from "../../src/ui/components/Temporary/PinCheck";
import MediaConfirm from "../../src/ui/components/Temporary/MediaConfirm";
import { useSelector } from "react-redux";
import { RootState } from "../../src/store/store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { accountTransfer } from "../../src/services/api";

/*
일반 송금 후 미디어 송금 추가 요청 -> 송금 후 거래고유번호 받아와서 변수로 넘기기
*/
const sendMoney = () => {

  const params = useLocalSearchParams()
  const { sendAccount, sendBank, sendName } = params
  const myUserKey = useSelector((state: RootState) => state.getUserKey.userKey);


    /* 요청 보낼 정보 */
    const [account, setAccount] = useState<string>(''); // 계좌번호
    const [bank, setBank] = useState<string>(''); // 은행  
    const [balance, setBalance] = useState<string>(''); // 금액

    // 현재 계정의 핀 번호 정보
    const [nowPin, setNowPin] = useState('')

      // 현재 계정의 핀 번호 요청
  const pinInfo = () => {
    try{
      /* ★ 핀 번호 요청 보내는 내용 추가하기 ★ */

      setNowPin('111111') // 임시 핀번호

    } catch(error){
      console.log(error)
    }
  }

  /* 미디어를 보낼 경우 필요한 거래고유번호 저장하기 */
  const [mediaNo, setMediaNo] = useState(0)

  /* 이체 */
  const moneyGo = async (balance:number) => {
  try {
    const keyGet = await AsyncStorage.getItem("myKey");
    const myKey = JSON.parse(keyGet!)
    const accountMy = await AsyncStorage.getItem("mainAccount");
    const JsonData = {
      depositAccountNo: sendBank,  // 임시 - 받는 계좌 정보 *구독 정보에서 가져오기*
      transactionBalance: balance,
      withdrawalAccountNo: accountMy, // 내 계좌
      depositTransactionSummary: "string", // 임시
      withdrawalTransactionSummary: "string" // 임시
    };

    console.log("최종 JsonData:", JsonData);
    const response = await accountTransfer(JsonData);
    console.log(response.data)

        Toast.show({
          type: 'success',
          text1: '송금 완료',
          text2: '송금이 완료되었습니다'
        })

    const transNo = response.data.REC[0]["transactionUniqueNo"] // 거래번호 맞게 가져오는지 확인해봐야 함
    console.log(transNo)
    setMediaNo(transNo)
    setStep('3')

  }
  catch (error) {
    console.log(`에러에러에러에러에러: ${error}`)
    Toast.show({
      type: 'error',
      text1: '송금 실패!',
      text2: '입력 정보를 다시 확인해주세요'
    })
router.push('family/familyMain')
  }
} 
const router = useRouter();
useEffect(() => {

    
    // 현재 계정의 핀번호 확인
    pinInfo()
}, [])
    
    const nowName = sendName

    /* 1차 - 연락처 대상 송금 : 송금시 필요한 금액 입력 받는 화면 & 계좌, 은행은 전달받은 정보 활용 */
    const existChange = (balance:string) => {
        setBalance(balance)
        setStep('2')
    }

    const thirdChange = () => {
        setStep('4')
      }
    const [step, setStep] = useState('1'); // 송금 절차 화면 (1-1차, 2-2차, 3-3차, 4-4차)

    const secondChange = async (inputPin:string) => {
        if (inputPin == nowPin){
  
          const balanceCheck = parseInt(balance) // 송금 금액 숫자 변환
          moneyGo(balanceCheck)
      
          }

          else {
            Toast.show({
              type: 'error',
              text1: '송금 실패!',
              text2: '비밀번호를 다시 입력해주세요'
            })
          }
  
        }


    return(
      <View className='flex-1'>
        {step == '1' && (
          <View className='flex-row justify-center items-center'>
              {/* <TransferObject onChange={firstChange} />  */}
              <TransferInput onChange={existChange} name={nowName}/>
          </View>
          )
        }
        {step == '2' && (
          <PinInfo onChange={secondChange}/>
          )
        }
        {step == '3' && (
          <MediaConfirm onChange={thirdChange} mediaNo={mediaNo}/>
          )
        }
      </View>
    )
    // if (step == '1') {
    //     return (
    //       <View className='flex-1'>
    //         <View className='flex-row justify-center items-center'>
    //             {/* <TransferObject onChange={firstChange} />  */}
    //             <TransferInput onChange={existChange} name={nowName}/>
    //         </View>
    //       </View>

    //     )
    // }

    // // 2차 화면 - 핀번호 입력받는 화면
    // else if (step == '2') {
    //     return(
    //         <View className='flex-1'>
    //             <PinInfo onChange={secondChange}/>
    //         </View>
    //       )
    // }

    // // 3차 화면 - 일반 송금 완료 후 미디어 보낼 지 확인하는 화면
    // else if (step == '3'){
    //     return(
    //         <View className='flex-1'>
    //             <MediaConfirm onChange={thirdChange} mediaNo={mediaNo}/>
    //         </View>
    //     )
    // }

    // // // 미디어 보낼 경우 media/selectMedia로 보내기
    // // else if (step == '4'){
    // //     return(
    // //         router.push('/family copy/media/selectMedia')
    // //     )
    // // }

};

export default sendMoney;