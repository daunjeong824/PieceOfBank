import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import { View, Text, Image, Button, ImageBackground, TouchableOpacity, SafeAreaView, } from "react-native";
import { Link } from "expo-router";
import LinkToAddWard from "../../src/ui/components/LinkToAddWard";
import sendMoney from "./sendMoney";
import DealHistory from "./dealHistory";
import smallLogo from "../../src/assets/SmallLogo.png";
import mail from '../../src/assets/mail.png'
import Toast from "react-native-toast-message";
import { logoutUser, subTargetCheck, subProtectCheck, accountPatch } from "../../src/services/api";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../src/store/userSlice";
import { createAccount } from "../../src/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { addMoney, getAccountList, mediaPost } from "../../src/services/api";
import { RootState } from "../../src/store/store";

const FamilyMain = () => {

  const dispatch = useDispatch();
  const logFlag = useSelector((state: RootState) => state.getUser.isLogged);

  /* 내가 보호자인 경우, 피보호자를 가져온다. */
  const [flag, setFlag] = useState(false)

  const [wardBank, setWardBank] = useState('')
  const [mainBank, setMainBank] = useState('')

  const router = useRouter();

  const logoutTry = async() => {
    try{
      const response = await logoutUser();
      
      console.log(response)
      dispatch(logout());
      
        Toast.show({
          type: 'success',
          text1: '로그아웃 성공!',
          text2: '정상적으로 로그아웃 되었습니다'
        })
      router.push('/')
  }
  catch(error){
      console.log(error)
      Toast.show({
          type: 'error',
          text1: '로그아웃 실패',
          text2: '정보를 다시 확인해주세요.'
        })
  }
  }

  /*
  ★★★★★★추가해야 할 내용★★★★★★
  1. 대표 계좌 조회 요청
  - 있으면 보여주고, 없으면 대표 계좌 등록 메세지 보여주기

  */

  interface wardState{
    accountNo: null | string, 
    created: string, 
    subscriptionType: number, 
    updated: string, 
    userId: string, 
    userKey: string, 
    userName: string, 
    userPassword: string
  }

  const [noticeKey, setNoticeKey] = useState<string>('')

  // 피보호자 정보
  const [wardInfo, setWardInfo] = useState<wardState>(
    {
      accountNo: '', 
      created: '', 
      subscriptionType: 0, 
      updated: '', 
      userId: '', 
      userKey: '', 
      userName: '', 
      userPassword: ''
    }
  )

  const [myAc, setMyAc] = useState('')

  const mediaGo = async () =>{
    try{
      const transNo = 78164
      const type = 'TEXT'
      const content = '미디어'
      const data = {
          file:null
        }
      console.log('요청')
      // const answer = await mediaPost(transNo, type, content, data)
      // console.log(answer)
    }catch(error){
      console.log('미디어보내고싶어요')
      console.log(error)
    }
  }
  useEffect(() => {

    // 구독 관계 있는지 확인
    const subCheck = async() => {
      try{
        const response = await subProtectCheck()
        console.log('##')
        console.log("subProtectCheck response data : " + response.data)
        console.log("부모의 통장 : " + response.data['targetUser'].accountNo)
        const checking = response.data
        // console.log(checking)
        // console.log(typeof checking)
        if (!checking || !checking.targetUser){
          setFlag(false) // 없으면 등록 화면 보여주기
        } else{
          const Info = response.data.targetUser;
          console.log("## 등록인 정보 ##")
          console.log(Info)
          setWardBank(response.data['targetUser'].accountNo)
          setWardInfo(Info)
          setFlag(true) // 있으면 관계 보여주기
          setNoticeKey(response.data['protectUser'].userKey)
          setMainBank(response.data['protectUser'].accountNo)
        }
      } catch(error){
        console.log("subProtectCheck Error : " + error)
      }
    }
    subCheck() // 구독 관계 요청

      const mainRequest = async() => {
        try{
          const response = await getAccountList();
            console.log("## : getAccountList : ##" )
            console.log(response.data.REC[0].accountNo)
            const mainGo = response.data.REC[0].accountNo
            await AsyncStorage.setItem("mainAccount", mainGo);
            setMainAccount('1')
            setMyAc(mainGo)
        }
        catch(error){

            console.log(error)
            setMainAccount('2')
        }
    }
    mainRequest()
    console.log(wardInfo)
    console.log("loging check : " + logFlag)

    return () => {}
    },[]);

    const accountGo = async() => {
      try{
    
          const JsonData = {
            "accountTypeUniqueNo": "001-1-e7e3f77e997c46"
          }
            const response = await createAccount(JsonData);
            console.log("after createAccount in 자식")
        console.log(response.data)
        console.log("after createAccount in 자식, Account number : " + response.data.REC.accountNo);
        
        const findUserKey = await AsyncStorage.getItem("myKey");
        
        let cleanedUserKey = findUserKey!.replace(/"/g, ''); // 백슬래시를 제거
        console.log(cleanedUserKey);

        console.log("after createAccount in 자식, UserKey : " + findUserKey)

        const JsonDataTwo = { userKey: cleanedUserKey, accountNo: response.data.REC.accountNo };
        console.log("BEFORE PUTTING accoutPATCH ")
        console.log(JsonDataTwo)
        const resTwo = await accountPatch(JsonDataTwo);
        console.log(resTwo.data)

            Toast.show({
              type: 'success',
              text1: '계좌 생성 성공!',
            })
        router.replace('/family/familyMain')
      }
      catch(error){
          console.log(error)
          Toast.show({
              type: 'error',
              text1: '실패',
            })
      }
    }
    const moneyAdd = async() => {
      try{
          const myMoney = await AsyncStorage.getItem("mainAccount");
          console.log(myMoney)
          // const myAcc = myAc.toSring()
          // console.log(typeof myAc)
          // console.log(typeof myAcc)
          const JsonData = {
            "accountNo": myMoney,
            "transactionBalance":10000000,
            "transactionSummary": "string"
          }
            const response = await addMoney(JsonData);
            console.log(response.data)
            Toast.show({
              type: 'success',
              text1: '입금 성공!',
            })
          // router.push('/family copy/familyMain')
      }
      catch(error){
          console.log(error)
          Toast.show({
              type: 'error',
              text1: '실패',
            })
      }
    }
  // 임시 피보호자 정보
  // const wardInfo= {
  //   accountNo: null , 
  //   created: "2024-10-07T18:27:43.507606", 
  //   subscriptionType: 2, 
  //   updated: "2024-10-07T18:27:43.507646", 
  //   userId: "kkkkkk", 
  //   userKey: "e3ebc95d-99ad-4314-8e34-9703423a1885", 
  //   userName: "kkkkkk", 
  //   userPassword: "111111"}

  // 임시 피보호자 정보
  // const wardInfo= { directoryId : 1, userKey: '1', accountNo: '123456789', institutionCode: 1, name: '엄마' }

  // 대표 계좌 보여줄 지 확인하기
  const [mainAccount, setMainAccount] = useState('2')

  return (
    <SafeAreaView>
      {/* <Header /> */}
      <SafeAreaView>
        <View className="h-16 my-5 bg-blue-400 dark:bg-blue-100 flex-row justify-between items-center pt-3 px-2">
          <View className="w-12 h-12"></View>
          <Image source={smallLogo} className="w-12 h-12" />

          <Link className='flex-1 items-end' 
              href={
                  {pathname:'/family/reqSendMoney' , params:{helloKey:noticeKey}}
                  }>
            <TouchableOpacity
              className="w-12 h-12 pt-2 pr-16"
              onPress={() => router.push('/family/reqSendMoney')} >
              <Image source={mail}  />
            </TouchableOpacity>
          </Link>

        </View>
      </SafeAreaView>

      <View className="bg-gray-200 flex justify-center items-center">
        {(mainAccount=='1')? (        
          <Link className='h-6 rounded-3xl justify-center m-4 text-center font-bold' 
             href={
                {pathname:'/family/totalAccount'}
                }>한국은행 {myAc}</Link>) 
                :<Link className='h-6 rounded-3xl justify-center m-4 text-center font-bold' 
                href={
                   {pathname:'/family/totalAccount'}
                   }>계좌 등록하기</Link>}

        {/* <TouchableOpacity 
          className='w-48 h-8 mx-1 rounded justify-center bg-gray-500'
          onPress={() => router.push('/family copy/reqSendMoney')} 
          >
          <Text className='text-white text-center font-bold'>알림함</Text></TouchableOpacity> */}
      </View>
      <View className="flex-1">
        <View className=" flex-row">
        <TouchableOpacity 
                className="w-28 bg-green-800 h-8 rounded-3xl justify-center items-center"
                onPress={mediaGo}>
                    <Text className='text-white'>미디어</Text>
                </TouchableOpacity>
          <TouchableOpacity 
                className="mb-4 w-28 bg-blue-500 h-8 rounded-3xl justify-center items-center"
                onPress={accountGo}>
                    <Text className='text-white'>계좌생성</Text>
          </TouchableOpacity>
          <TouchableOpacity 
                className="mb-4 w-28 bg-blue-500 h-8 rounded-3xl justify-center items-center"
                onPress={moneyAdd}>
                    <Text className='text-white'>입금</Text>
            </TouchableOpacity>
        </View>

      </View>
      {/* 피보호자 존재 - 메인 레이아웃 / 아니면 추가할 수 있는 레이아웃 구성 */}
      {(flag==true) ? (
        <View>
          {/* 보호자 Card*/}
          <View>
            <View className='justify-center items-center'>
              <View className='h-8'></View>
              <View className="w-56 h-56 m-4 pt-8 pb-4 bg-gray-200 flex justify-center items-center rounded-3xl">
                <View className='border bg-white'>
                <Image className="w-32 h-32 bg-teal-400 mt-4" source={require('../../assets/smile.png')}></Image>
                </View>
                
                <Link className='w-32 h-8 pt-1 rounded-3xl justify-center items-center bg-teal-100 my-4 text-center rounded-3xl font-bold' 
                  href={
                      {pathname:'/family/dealHistory', 
                        params:{accounting:wardInfo.accountNo, banking:wardBank, naming:wardInfo.userName}}
                      }>{wardInfo.userName}</Link> 
              </View>
              <TouchableOpacity 
                  className='w-48 h-12 m-5 rounded-3xl justify-center bg-gray-300'
                  onPress={() => router.push('/family/MoneyThreshHold')} 
                  >
                    <Text className='text-center text-base font-bold'>금액 한도 설정</Text></TouchableOpacity>
                <TouchableOpacity 
                  className='w-48 h-12 m-5 rounded-3xl justify-center bg-gray-300'
                  onPress={() => router.push('/family/DirectoryList')} 
                  >
                <Text className='text-center text-base font-bold'>부모 대상 송금 관리</Text></TouchableOpacity>
                <TouchableOpacity 
                  className='w-24 h-8 m-5 rounded-3xl justify-center bg-gray-300'
                  onPress={logoutTry} 
                  >
                <Text className='text-center'>로그아웃</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View>
          {/* <LinkToAddWard /> */}
          <View className='justify-center items-center'>
            <View className='h-28'></View>
            <View className="w-56 h-56 m-4 pt-8 pb-4 bg-gray-200 flex justify-center items-center rounded-3xl">
              <View className='border bg-white'>
              <Image className="w-32 h-32 bg-teal-400 mt-4" source={require('../../assets/smile.png')}></Image>
              </View>
              <TouchableOpacity className='m-2 py-1 px-4 bg-sky-400 rounded-3xl' onPress={() => router.push('/family/addWard')}>
                  <Text className='text-white'>피보호자 등록 신청</Text>
              </TouchableOpacity>
          </View>
          <TouchableOpacity 
                  className='w-24 h-8 m-5 rounded-3xl justify-center bg-gray-300'
                  onPress={() => router.push('/')} 
                  >
              <Text className='text-center'>로그아웃</Text>
              </TouchableOpacity>

          </View>
        </View>
          )}
    </SafeAreaView>
  );
};

export default FamilyMain;
