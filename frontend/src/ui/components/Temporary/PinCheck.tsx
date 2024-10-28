import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import React, { useState } from 'react';

interface pinInput {
  onChange: (inputPin:string) => void;
}

const PinInfo = ({ onChange }: pinInput) => {
    const router = useRouter();

    const [numCheck, setNumCheck] = useState(0); // 입력된 핀번호 개수
    const [pinCheck, setPinCheck] = useState<string>('') // 최종 입력된 6자리 핀번호
  
  
    // 핀번호 입력 시 상태 변경 (초기화, 삭제, 추가)
    const pinChecking = (value: string) => {
        if (value=='정정') {
          setNumCheck(0)
          setPinCheck(prevNum => prevNum = '')
        } else if (value=='←'){
          if (numCheck>0) {
            setNumCheck(prevNum => prevNum - 1)
            setPinCheck(prevNum => prevNum.slice(0,-1))
          }
        } else {
          if (numCheck<6){
            setNumCheck(prevNum => prevNum + 1)
            setPinCheck(prevNum => prevNum + value.toString())
          } 
        }
      }
  
    // 핀번호 점검
    // ★ 등록한 핀번호와 일치하는 지 내용 추가해야 함
    const thirdCheck = () => {
      if (numCheck == 6) {
        onChange(pinCheck)
      } else {
        Alert.alert('핀번호 확인', '번호를 총 6자리 입력해주세요!')
      }
    }


  
    // 1차 숫자 키패드 배열
    const touchNumber = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['정정', '0', '←']] 
    // 1차 동그라미 6자리 배열
    const circleNumber = [1, 2, 3, 4, 5, 6]
    // 1차 입력된 핀번호 개수에 맞춰 동그라미 색 변경
    const touchCircle = circleNumber.map((number) => 
      <View className={`${number<=numCheck ? 'bg-blue-500' : 'bg-white'} w-8 h-8 rounded-full m-1`} key={number}></View>)

     return(
        <View className='flex-1 items-center'>
                <View className='bg-gray-300 rounded-xl w-2/4 p-4 mt-16'>
                  <Text className='text-2xl text-center font-bold'>비밀번호를</Text>
                  <Text className='text-2xl text-center font-bold'>입력해주세요</Text>
                </View>
                <View className='m-5'>
                    <View className='flex-row'>
                        {touchCircle}
                    </View>
                </View>
            <View>
                {touchNumber.map((list, index) => 
                    <View className='flex-row' key={index}>
                        {list.map((number, indexs)=> 
                        <TouchableOpacity 
                        className='w-16 h-16 rounded-2xl justify-center items-center m-1 bg-white' 
                        onPress={() => pinChecking(number)} 
                        key={indexs}>
                        <Text className='text-center text-2xl'>{number}</Text>
                        </TouchableOpacity>
                        )}
                    </View>
                    )}
            <TouchableOpacity 
            className='m-2 py-2 px-4 bg-red-400 rounded-3xl bg-sky-500'
            onPress={thirdCheck} 
            >
            <Text className='text-white text-center font-bold'>송금하기</Text></TouchableOpacity>
            </View>

        </View>

    )



}

export default PinInfo