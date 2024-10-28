import { View, Text, SafeAreaView, TextInput, Button, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
// import { Header } from "react-native/Libraries/NewAppScreen";
import { useEffect, useState } from "react";
import Toast from 'react-native-toast-message';
import CancelButton from "../../src/ui/components/CancelButton";
import { subOnce, subDaily } from "../../src/services/api";

const MoneyTrheshHold = () => {
  const [oneLimit, setOneLimit] = useState<number>(100000000);
  const [todayLimit, setTodayLimit] = useState<number>(500000000);
  const router = useRouter()

  /*
  ★★★★★★추가해야 할 내용★★★★★★
  1. 금액 한도 존재하는지 요청
  - 있으면 금액 정보 보여주기

  2. 금액 한도 입력 후 저장하는 요청
  
  */

  /* 알림팝업 Logic */
  const handleBtn = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    })
  }

  const limitCheck = async() => {
    // () => router.push('/family copy/familyMain')
    try{
      const onceLimit = parseInt(oneLimit)
      const dayLimit = parseInt(todayLimit)
      // console.log('###')
      // // console.log(onceLimit)
      // console.log(oneLimit)
      const oneData = {
        'newLimit':onceLimit
      }
      const dayData = {
        'newLimit':dayLimit
      }
      const onceRequest = await subOnce(oneData)
      const dayRequest = await subDaily(dayData)
      console.log(onceRequest)
      console.log(dayRequest)
      Toast.show({
        type: 'success',
        text1: '설정 완료',
        text2: '한도 제한 설정이 완료되었습니다!'
      })
      router.push('family/familyMain')
    }catch(error){
      console.log(error)
    }
  }

  useEffect(() => {

  }, [])

  return (
    <View className='flex-1'>
      <View className='justify-center items-center p-4'>
        <Text className='mt-20 mb-8 bg-gray-300 p-3 w-48 rounded-3xl text-xl text-center font-semibold'>금액 한도 설정</Text>
        <SafeAreaView className='bg-gray-300 rounded-3xl p-5'>
          <Text className="my-2 text-center font-bold text-2xl">1회</Text>
          <View className='flex-row'>
            <TextInput className="mx-2 py-2 w-60 bg-white rounded-3xl"
              keyboardType="numeric" onChangeText={(limit) => setOneLimit(limit)}></TextInput>
            <Text className='text-xl font-bold py-2'>원</Text>
          </View>
          <Text className="my-2 text-center font-bold text-2xl mt-3">하루 총</Text>
          <View className='flex-row'>
          <TextInput className="mx-2 py-2 w-60 bg-white rounded-3xl" keyboardType="numeric" onChangeText={(limit) => setTodayLimit(limit)}></TextInput>
          <Text className='text-xl font-bold py-2'>원</Text>
          </View>
          <Text className="text-center font-bold mt-6">한도 이상 송금 요청 시</Text>
          <Text className="text-center font-bold mb-6">승인 절차를 거쳐야 합니다</Text>
        </SafeAreaView>
        <View className='flex-row mt-2'>
          <TouchableOpacity 
            className='m-2 py-2 px-4 bg-red-400 rounded-3xl bg-sky-500'
            onPress={limitCheck} 
            >
            <Text className='text-white text-center font-bold'>설정 완료</Text></TouchableOpacity>
            <CancelButton />
        </View>

      </View>
    </View>
  );
};

export default MoneyTrheshHold;