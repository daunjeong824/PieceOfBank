import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';

const PinRegister = ({ onChange }: {onChange:(value:string) => void}) => {

  const router = useRouter();

  const [numCheck, setNumCheck] = useState(0); // 1차 입력된 핀번호 개수
  const [pinCheck, setPinCheck] = useState<string>('') // 1차 6자리 핀번호


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

  // 1차 핀번호 점검
  const firstPinCheck = () => {
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

    return (
      <ImageBackground source={require('../../../src/assets/POBbackGround.png')} style={{ flex: 1 }}>
      <View className='flex-1 justify-center items-center'>
        <Text className='text-2xl'>비밀번호 설정</Text>
        <Text className='text-2xl'>6자리를 입력해주세요</Text>

        {/* 동그라미 6자리 표시 */}
        <View className='m-2'>
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
              className='w-16 h-16 border justify-center items-center m-1 bg-white' 
              onPress={() => pinChecking(number)} 
              key={indexs}>
              <Text className='text-center text-2xl'>{number}</Text>
            </TouchableOpacity>
            )}
          </View>
          )}
        </View>
        <Button title="확인" onPress={firstPinCheck}></Button>
      </View>
      </ImageBackground>
    );
  } 


export default PinRegister