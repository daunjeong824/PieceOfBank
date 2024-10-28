import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import Toast from "react-native-toast-message";


interface pinSecond{
    onChange:(value:string) => void
    visible: boolean
    transparent: boolean
}

const PinReModal = ({ onChange, visible, transparent }: pinSecond) => {

  const router = useRouter();

  const [numCheck, setNumCheck] = useState(0); // 2차 입력된 비밀번호 개수
  const [pinCheck, setPinCheck] = useState<string>('') // 2차 6자리 비밀번호

  const [pinAlert, setPinAlert] = useState(false) // 비밀번호 6자리인지 확인

  // 비밀번호 입력 시 상태 변경 (초기화, 삭제, 추가)
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

  // 2차 비밀번호 점검
  const secondPinCheck = () => {
    if (numCheck == 6) {
      setPinAlert(false)
      onChange(pinCheck)
    } else {
      setPinAlert(true)
    }
  }
  

  // 2차 숫자 키패드 배열
  const touchNumber = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['정정', '0', '←']] 
  // 2차 동그라미 6자리 배열
  const circleNumber = [1, 2, 3, 4, 5, 6]
  // 2차 입력된 비밀번호 개수에 맞춰 동그라미 색 변경
  const touchCircle = circleNumber.map((number) => 
    <View className={`${number<=numCheck ? 'bg-blue-500' : 'bg-white'} w-8 h-8 rounded-full m-1`} key={number}></View>)

    return (
      <Modal visible={visible} transparent={transparent}>
      <View className='flex-1 justify-center items-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
        <View className='bg-gray-200 p-12 rounded-3xl justify-center items-center'>
        <Text className='text-2xl font-bold'>비밀번호 확인</Text>
        <Text className='text-2xl mt-2 mb-4 font-bold'>6자리를 입력해주세요</Text>

            {/* 동그라미 6자리 표시 */}
            <View className='m-2 py-2'>
                <View className='flex-row'>
                    {touchCircle}
                </View>
            </View>

            {/* 숫자 터치 패드 */}
            <View className='m-2'>
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
            </View>
            {(pinAlert) ? <View className='my-1'><Text className='text-red-500 font-bold text-lg'>비밀번호를 총 6자리 입력해주세요</Text></View> : null}
            <TouchableOpacity 
                className='w-32 h-12 rounded-3xl justify-center items-center m-3 bg-sky-500' 
                onPress={secondPinCheck}>
                <Text className='text-center text-lg text-white font-bold'>입력 완료</Text>
                </TouchableOpacity>
        </View>

      </View>
      </Modal>
    );
  } 


export default PinReModal