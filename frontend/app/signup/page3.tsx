import { View, Text, Button, ImageBackground, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import Checkbox from 'expo-checkbox';

export default function page1(){
  const router = useRouter();

  // 계좌번호 페이지 확인 (1 - 1차, 2 - 2차)
  const [def, setDef] = useState(1);

  // 임시 대표 계좌
  const [mainAccount, setMainAccount] = useState('');

  // 임시 전체 계좌
  interface AccountItem {
    id: string;
    bank: string;
    number: string;
  }

  // 임시 전체 계좌
  const accountList : AccountItem [] = [{id:'1', bank:'신한은행', number:'11111111111'}, {id:'2', bank:'하나은행', number:'2222222222'}, {id:'3', bank:'국민은행', number:'33333333333'}]

  // 체크박스 표시
  const [accountChecked, setAccountChecked] = useState(Array(accountList.length).fill(false));
    
  // 체크박스 변경 - 중복 없이 하나만 체크되도록 설정 (나머지는 체크박스 false로)
  const checkChange = (index:number) => {
    const updateCheck = [...accountChecked]
    updateCheck[index] = true
    for (let i = 0; i < accountList.length; i++){
      if (i == index){
        updateCheck[i] = true
      }
      else {
        updateCheck[i] = false
      }
    }
    setAccountChecked(updateCheck)
  }

  // 선택한 계좌를 메인 계좌로 등록하기
  const mainSelect = () => {
    for (let i=0; i<accountList.length; i++){
      if (accountChecked[i] == true){
        setMainAccount(accountList[i]['number'])
      }
    }
    setDef(2)
  }

  if (def == 1){
    return (
      <ImageBackground source={require('../../src/assets/POBbackGround.png')} style={{ flex: 1 }}>
      <View className='flex-1 justify-center items-center'>
        <Text className='text-3xl my-1'>계좌등록</Text>
        <Text className='text-2xl my-1'>서비스를 이용할 계좌를 선택해주세요</Text>
          <ScrollView className='flex-1'>
            {accountList.map((list, index) => (
                <View key={index} className='w-80 h-12 p-2 m-2 flex-row bg-white'>
                    <Checkbox color="skyblue" value={accountChecked[index]} onValueChange={() => checkChange(index)}></Checkbox>
                      <View className='w-8'></View>
                      <Text>{list.bank}</Text>
                      <Text>{list.number}</Text>
                </View>
            ))}
            <Button title="등록" onPress={mainSelect}></Button>
            
          </ScrollView>
      </View>
      </ImageBackground>
    );
  } else if (def == 2){
    return (
      <ImageBackground source={require('../../src/assets/POBbackGround.png')} style={{ flex: 1 }}>
      <View className='flex-1 justify-center items-center'>
        <Text className='text-3xl'>{mainAccount}를 계좌등록 하시겠습니까?</Text>
        <Button title="다음" onPress={() => 
          Alert.alert('확인', '확인되었습니다',[
            {
              text:"서비스 이용하기",
              onPress:() => router.push("/")
            }
          ])
          }></Button>
      </View>
      </ImageBackground>
    );
  }
}
