import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import PinRegister from '../../src/ui/components/PinRegister';
import PinReRegister from '../../src/ui/components/PinReRegister';

export default function page1(){

  const router = useRouter();

  const [pinRegister, setPinRegister] = useState('1'); // 핀번호 페이지 확인 (1 - 1차, 2 - 2차)

  const [firstPin, setFirstPin] = useState<string>(''); // 1차 6자리 핀번호

  // 1차 확인 완료될경우 2차로 이동
  const changePin = (value: string) => {
    setPinRegister('2');
    setFirstPin(value);
  }

  // 1차 핀번호 입력 확인 페이지
  if (pinRegister == '1'){
    return (
      <ImageBackground source={require('../../src/assets/POBbackGround.png')} style={{ flex: 1 }}>
        <PinRegister onChange={changePin}/>
      </ImageBackground>
    );
  } 
  // 2차 핀번호 입력 확인 페이지
  else if (pinRegister == '2'){ 
    return (
      <ImageBackground source={require('../../src/assets/POBbackGround.png')} style={{ flex: 1 }}>
        <PinReRegister firstPin={firstPin}/>
      </ImageBackground>
    );
  }

}



