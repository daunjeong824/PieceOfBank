import { View, Text, Button, ImageBackground, TextInput, SafeAreaView, Alert, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import Checkbox from 'expo-checkbox';
import Toast from "react-native-toast-message";
import { createUser, registUser } from "../../services/api";
import PinModal from './PinModal';
import PinReModal from './PinReModal';
import { useDispatch, useSelector } from 'react-redux';
import { setUserKey } from "../../store/userKeySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignupForm = () => {
    
  const router = useRouter();
  const dispatch = useDispatch();

  // 회원가입 정보 저장
  const [email, setEmail] = useState(''); // 이메일
  const [userId, setUserId] = useState(''); // 아이디
  const [name, setName] = useState(''); // 이름
  const [relation, setRelation] = useState(2); // 관계 [0:Default, 1:보호자, 2:피보호자]
  const [isChecked, setChecked] = useState(false); // 개인정보 동의 체크
  const [firstPin, setFirstPin] = useState<string>(''); // 비밀번호 6자리
  const [secondPin, setSecondPin] = useState<string>(''); // 비밀번호 재입력 6자리
  const [emailToken, setEmailToken] = useState('') // 이메일 토큰 - 이메일 가입 후 받는 토큰 (user 회원 가입 시 필요)

  // 회원가입 조건 체크 (다 만족되어야 회원 가입 완료)
  const [idCheck, setIdCheck] = useState(false); // 이메일
  const [nameCheck, setNameCheck] = useState(false); // 이름
  const [relationCheck, setRelationCheck] = useState(false); // 관계
  const [boxCheck, setBoxCheck] = useState(false); // 개인정보 동의 체크
  const [pinCheck, setPinCheck] = useState(false); // 비밀번호

  // 이메일 인증 버튼 (클릭 후 인증 완료되면 다시 인증 안 되게 비활성화)
  const [disabled, setDisabled] = useState(false);

  // [회원가입 완료] - 버튼 클릭 후 입력 값 다 들어왔는지 확인 (아닌 조건은 밑에 빨간 글씨로 보여줌) 
  const [emailAlert, setEmailAlert] = useState(false)
  const [nameAlert, setNameAlert] = useState(false)
  const [pinAlert, setPinAlert] = useState(false)
  const [relationAlert, setRelationAlert] = useState(false)
  const [checkAlert, setCheckAlert] = useState(false)

  /* 이메일 가입 요청 */
  const emailCheck = async () => {
    try {
      const JsonData = {
        email : email,
      }
      const response = await createUser(JsonData);

      console.log(response)

      dispatch(setUserKey(await AsyncStorage.getItem('userKey')));
      // console.log(response)

      // const emailAnswer = response.data.split(':')[1].trim() // 응답값에서 토큰만 가져오기
      // console.log(emailAnswer)
      Toast.show({
        type: 'success',
        text1: '이메일 인증에 성공했습니다',
        text2: ':happy:'
      })
      setIdCheck(true) // 이메일 조건 완료 처리
      setDisabled(true) // 인증하기 버튼 비활성화
      // setEmailToken(emailAnswer) // 이메일 토큰 정보
    }
    catch (error) {
        console.log(error)
        Toast.show({
          type: 'error',
          text1: '이메일 인증에 실패했습니다. 중복 아이디일 수도 있습니다.',
          text2: ':cry:'
        })
      }
    }

  // 관계 선택 - 부모
  const wardCheck = () => {
    setRelation(0)
    setRelationCheck(true)
  }

  // 관계 선택 - 자식
  const familyCheck = () => {
    setRelation(1)
    setRelationCheck(true)
  }

  // 개인정보 동의 체크 반영
  const consentCheck = () => {
    setChecked(!isChecked)
    setBoxCheck(!boxCheck)
  }

  const IdInput = (value:string) => {
    setUserId(value)
  }

  // 이름 입력 반영 : 두 글자 이상일 때만 (나중에 필요하면 조건 추가하기)
  const nameConfirm = (value:string) => {
    if (value.length >= 2) {
      setName(value)
      setNameCheck(true)
    }
    else{
      setNameCheck(false)
    }
  }

  // 테스트 - 나중에 삭제 예정
  const checkPrint = () => {
    console.log(email)
    console.log(name)
    console.log(relation)
    console.log(firstPin)
    console.log(emailToken)
  }
  
  // 비밀번호 입력 받을 모달 보여줄 정보 (true면 보여주기) - first 최초입력 / second 재입력
  const [firstModal, setFirstModal] = useState(false)
  const [secondModal, setSecondModal] = useState(false)

  // 최초 비밀번호 모달 보여주는 정보 업데이트 (보여주기 / 안 보여주기)
  const firstModalOpen = () => {
    setFirstModal(!firstModal)
  } 
  // 재입력 비밀번호 모달 보여주는 정보 업데이트 (보여주기 / 안 보여주기)
  const secondModalOpen = () => {
    setSecondModal(!secondModal)
  } 

  // 모달에서 최초 비밀번호 입력 받은 후 업데이트 - 모달 창 닫기 & 비밀번호 정보 넣기
  const changeFirstPin = (value: string) => {
    setFirstPin(value);
    setFirstModal(!firstModal)
  }

  // 모달에서 재입력 비밀번호 입력 받은 후 업데이트 - 모달 창 닫기 
  // 최초 비밀번호 입력과 일치하는지 확인
  const changeSecondPin = (value: string) => {
    setSecondModal(!secondModal)
    if (value != firstPin){
        setPinCheck(false)
    }
    else{
      setPinCheck(true)
    }
  }

  /* 회원가입 요청 */
  const registTry = async () => {
    try {
      const JsonData = {
        userId: userId,
        userName: name,
        userPassword: firstPin,
        userSubscriptionType: relation
      }
      const response = await registUser(JsonData);
      console.log(response)
      Toast.show({
        type: 'success',
        text1: '회원 가입 성공!',
        text2: '회원 가입이 완료되었습니다'
      })
      router.push('/')
    }
    catch (error) {
      console.log(`에러: ${error}`)
      Toast.show({
        type: 'error',
        text1: '회원 가입 실패!',
        text2: '입력한 정보를 다시 확인해주세요'
      })
    }
  }

  /* 회원가입 검증 */
  const signupCheck = () => {
    // 비밀번호 입력 일치하면 나머지 조건 체크 후 회원가입 요청 보내기
      checkPrint()
      if (idCheck && nameCheck && relationCheck && boxCheck && pinCheck) {
        registTry() // 회원가입 요청 보내기
      }
      // 입력 안 된 곳은 빨간 글씨로 보여주기
      else {
        if (idCheck==false) {setEmailAlert(true)} else{setEmailAlert(false)}
        if (nameCheck==false) {setNameAlert(true)} else{setNameAlert(false)}
        if (relationCheck==false) {setRelationAlert(true)} else{setRelationAlert(false)}
        if (boxCheck==false) {setCheckAlert(true)} else{setCheckAlert(false)}
      }
  }
    

  return (
  <View className='flex-1 justify-center items-center'>
    <View className='bg-sky-600 px-12 py-2 mb-7 rounded-xl'> 
      <Text className='text-2xl text-white font-black'>회원가입</Text>
    </View>
    <SafeAreaView className='bg-gray-200 py-4 px-12 rounded-3xl'>
      <Text className='my-2'>이메일 아이디</Text>
      <View className='flex-row justify-between w-64'>
        <TextInput className='bg-white w-44 rounded-lg px-2' onChangeText={(email) => setEmail(email)}></TextInput>
        <TouchableOpacity 
          className={`${!disabled ? 'bg-sky-500' : 'bg-gray-500'} w-16 h-8 rounded justify-center`}
          onPress={emailCheck} disabled={disabled}>
        <Text className='text-white text-center font-bold'>{(idCheck)? '인증완료' : '인증하기'}</Text></TouchableOpacity>
      </View>

      {(emailAlert) ? <View className='my-1'><Text className='text-red-500 font-bold'>이메일 인증을 진행해주세요</Text></View> : null}

      <Text className='my-2'>아이디</Text>
        <TextInput className='bg-white w-64 rounded-lg px-2 mb-3' onChangeText={(name) => setUserId(name)}></TextInput>
      
      {(nameAlert) ? <View className='my-1'><Text className='text-red-500 font-bold'>이름을 입력해주세요</Text></View> : null}
      
      <Text className='my-2'>이름</Text>
        <TextInput className='bg-white w-64 rounded-lg px-2 mb-3' onChangeText={(name) => nameConfirm(name)}></TextInput>

      <Text className='my-2'>비밀번호</Text>
      <TouchableOpacity 
        className='flex-row justify-between items-center w-64 rounded-lg pl-2 bg-white mb-3'
        onPress={firstModalOpen}>
        <Text className='text-gray-400'>비밀번호 (숫자 6자리)</Text>
        <View className={`${pinCheck ? 'bg-gray-500' : 'bg-sky-500'} w-16 h-8 rounded justify-center`}>
          <Text className='text-center font-bold text-white'>{(pinCheck)? '입력완료' : '입력하기'}</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity 
        className='flex-row justify-between items-center w-64 rounded-lg pl-2 bg-white mb-2'
        onPress={secondModalOpen}>
        <Text className='text-gray-400'>비밀번호 확인 (숫자 6자리)</Text>
        <View className={`${pinCheck ? 'bg-gray-500' : 'bg-sky-500'} w-16 h-8 rounded justify-center`}>
          <Text className='text-center font-bold text-white'>{(pinCheck)? '입력완료' : '입력하기'}</Text>
        </View>
      </TouchableOpacity>

      {(pinCheck==false) ? <View className='my-1'><Text className='text-red-500 font-bold'>처음 입력한 비밀번호와 일치하지 않습니다</Text></View> : null}

      <Text className='my-2'>관계</Text>
      <View className='flex-row justify-between w-64'>
        <TouchableOpacity className={`${relation==0 ? 'bg-sky-500' : 'bg-white'} w-28 h-8 rounded-3xl justify-center`} 
          onPress={wardCheck}>
          <Text className={`${relation==0 ? 'text-white' : 'text-black'} text-center rounded-3xl font-bold`}>부모</Text></TouchableOpacity>
        <TouchableOpacity className={`${relation==1 ? 'bg-sky-500' : 'bg-white'} w-28 h-8 rounded-3xl justify-center`} 
          onPress={familyCheck}>
          <Text className={`${relation==1 ? 'text-white': 'text-black'} text-center rounded-3xl font-bold`}>자식</Text></TouchableOpacity>    
      </View>

      {(relationAlert) ? <View className='my-1'><Text className='text-red-500 font-bold'>관계를 하나 선택해주세요</Text></View> : null}

      <View className='flex-row justify-between w-64 my-6'>
        <Checkbox value={isChecked} onValueChange={consentCheck} className={`${isChecked ? '' : 'bg-white border-transparent'}`} />
        <Text>개인정보 수집 및 이용에 동의합니다.</Text>
      </View>

      {(checkAlert) ? <View className='my-1'><Text className='text-red-500 font-bold'>개인 정보 수집 및 이용에 동의해주세요</Text></View> : null}

      <View className='flex-row justify-center items-center my-3'>
        <TouchableOpacity 
          className='justify-center items-center w-32 h-8 rounded-lg bg-sky-500'
          onPress={signupCheck}>
          <Text className='text-white font-bold'>회원가입 완료</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
    <PinModal onChange={changeFirstPin} visible={firstModal} transparent={true}/>
    <PinReModal onChange={changeSecondPin} visible={secondModal} transparent={true}/>
  </View>
  );
}

export default SignupForm;