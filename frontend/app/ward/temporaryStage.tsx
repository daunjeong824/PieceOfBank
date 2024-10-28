// /* 임시 파일 - 요청 테스트용 */

// import { Link, useRouter } from "expo-router";
// import { View, Text, ImageBackground, TextInput, SafeAreaView, Image, TouchableOpacity } from 'react-native';
// import React, { useState } from 'react';
// import { styled } from 'nativewind';
// import { createAccount, registUser, createUser, loginUser, getAccount, addMoney,
//    accountTransfer, getAccountList, getHistoryList, getDirectory, notifyList,
//    notifyPost} from "../../src/services/api";
// import Toast from "react-native-toast-message";
// // import { launchImageLibrary, ImageLibraryOptions, ImagePickerResponse  } from 'react-native-image-picker';
// import * as MediaLibrary from 'expo-media-library';
// import * as ImagePicker from 'expo-image-picker';
// import axios from "axios";
// import * as FileSystem from 'expo-file-system';

// // MainPage

// export default function LoginScreen() {

//   const router = useRouter()

//   const [imageUri, setImageUri] = useState<string | null>(null);

//   const [userInfo, setUserInfo] = useState({ name: '', email: '' });

//   // 로그인 요청 보낼 정보
//   const [id, setId] = useState('');
//   const [password, setPassword] = useState('');


//   const selectImage = async () => {
//       // 권한 요청
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
//       if (status !== 'granted') {
//         console.log('미디어 라이브러리 권한이 부여되지 않았습니다.');
//         return;
//       }
    
//       let result = await ImagePicker.launchImageLibraryAsync({
//         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//         allowsEditing: true,
//         aspect: [4, 3],
//         quality: 1,
//       });
    
//       if (!result.canceled) {
//         setImageUri(result.assets[0].uri);
//       }
//     };

//     const uploadImage = async () => {
//       if (!imageUri) return;
  
//       const formData = new FormData();
//       formData.append('file', {
//         uri: imageUri,
//         name: 'photo.jpg',
//         type: 'image/jpeg', // 이미지 타입을 확인하세요
//       } as any);
  
//       try {
//         const response = await axios.post('http://your-server-url/upload', formData, {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         });
//         console.log(response.data);
//       } catch (error) {
//         console.error('이미지 업로드 오류:', error);
//       }
//     };

//     // const uploadImage = async () => {
//     //   if (!imageUri) return;
  
//     //   // 이미지 파일을 Base64로 인코딩
//     //   const base64String = await FileSystem.readAsStringAsync(imageUri, {
//     //     encoding: FileSystem.EncodingType.Base64,
//     //   });
  
//     //   try {
//     //     const response = await axios.post('http://your-server-url/upload', {
//     //       image: base64String,
//     //     }, {
//     //       headers: {
//     //         'Content-Type': 'application/json',
//     //       },
//     //     });
  
//     //     console.log('서버 응답:', response.data);
//     //   } catch (error) {
//     //     console.error('이미지 업로드 오류:', error);
//     //   }
//     // };
    
  
//   /* 이메일 가입 */
//   const emails = async () => {
//     try {
//       const JsonData = {
//         email: "lunch3@gmail.com",
//       }
//       const response = await createUser(JsonData);
//       console.log(response)
//       const emailCookie = response.data.split(':')[1]
//       console.log(emailCookie)
//     }
//     catch (error) {
//       console.log(`에러: ${error}`)
//     }
//   }
//   /* 회원 등록 */

//   const registTry = async () => {
//     try {
//       const JsonData = {
//         userId:'tttt123@naver.com',
//         userName: "tttt123",
//         userPassword: "345678",
//         userSubscriptionType: 0,
        
//       }
//       const response = await registUser(JsonData);
//       console.log(response)

//     }
//     catch (error) {
//       console.log(`에러: ${error}`)
//     }
//   }

// /* 로그인 실행 */
// const loginTry = async() => {
//   try {
//     const JsonData = {
//       userName: "싸피",
//       password: "345678",
//     }
//     const response = await loginUser(JsonData);
//     console.log(response)
//     Toast.show({
//       type: 'success',
//       text1: '로그인 성공!',
//       text2: '로그인에 성공하였습니다'
//     })
//     router.push('/mainpage')
//   }
//   catch (error) {
//     Toast.show({
//       type: 'error',
//       text1: '로그인 실패!',
//       text2: '입력 정보를 다시 확인해주세요'
//     })
//     console.log(`에러: ${error}`)
//   }
// } 

// /* 계좌 생성 */
// const accountTry = async() => {
//   try {
//     const JsonData = {
//       accountTypeUniqueNo: "001-1-e7e3f77e997c46"
//     }
//     const response = await createAccount(JsonData);
//     console.log(response)
//   }
//   catch (error) {
//     console.log(`에러: ${error}`)
//   }
// } 

// /* 계좌 단건 조회 */
// const accountView = async() => {
//   try {
//     const JsonData = {
//       accountNo: "0019730654868483"
//     }
//     const response = await getAccount(JsonData);
//     console.log(response)
//   }
//   catch (error) {
//     console.log(`에러: ${error}`)
//   }
// } 

// /* 입금 */
// const addBalance = async() => {
//   try {
//     const JsonData = {
//       "accountNo": "0011474303166137",
//       "transactionBalance": 100000000,
//     }
//     const response = await addMoney(JsonData);
//     console.log(response)
//   }
//   catch (error) {
//     console.log(`에러: ${error}`)
//   }
// } 

// /* 이체이체 */
// const moneyGo = async() => {
//   try {
//     const JsonData = {
//       depositAccountNo: "0019197589758057",
//       transactionBalance: 10,
//       withdrawalAccountNo: "0019730654868483",
//       depositTransactionSummary: "string",
//       withdrawalTransactionSummary: "string"
//     }
//     const response = await accountTransfer(JsonData);

//     console.log(response)
//   }
//   catch (error) {
//     console.log(`에러: ${error}`)
//   }
// } 

// /* 계좌 전체 목록 */
// const accountList = async() => {
//   try {
//     const response = await getAccountList();
//     const abc = response.data.REC// 계좌목록

//     // console.log(abc[0][1])
//     // console.log(abc.length)
//     console.log(response)
//   }
//   catch (error) {
//     console.log(`에러: ${error}`)
//   }
// } 

// /* 거래 목록 */
// const transferList = async() => {
//   try {
//     const JsonData = {
//       "accountNo": "0012224552208245",
//       "startDate": "20240101",
//       "endDate": "20241231",
//       "transactionType": "A",
//       "orderByType": "ASC"
//     }
//     const response = await getHistoryList(JsonData);
//     const moneyList = response.data
//     console.log(moneyList)
//   }
//   catch (error) {
//     console.log(`에러: ${error}`)
//   }
// } 

// /* 디렉토리 조회 */
// const directoryView = async() => {
//   try {
//     // const JsonData = {
//     //   "accountNo": "0012224552208245",
//     //   "startDate": "20240101",
//     //   "endDate": "20241231",
//     //   "transactionType": "A",
//     //   "orderByType": "ASC"
//     // }
//     const JsonData = {
//       userKey: '1bf84ad8-160e-4b31-b6ae-73ea4064cfad'
//     }
//     const response = await getDirectory(JsonData);
//     console.log(response)
//   }
//   catch (error) {
//     console.log(`에러: ${error}`)
//   }
// } 

// // 알림 전체 조회
// const notifyView = async() =>{
//   try{
//     const data = {
//       'receiverKey':'987e6543-e21b-12d3-a456-426614174000'
//     }
//     const response = await notifyList(data);
//     console.log(response)
//   }
//   catch(error){
//     console.log(`에러: ${error}`)
//   }
// }

// // 알림 보내기
// const notifySend = async() =>{
//   try{
//     const data = {
//       'token':'-vZKS-Jfsp2waLzNaRpQ4j',
//       'title':'알림',
//       'body':'송금'
//     }
//     const response = await notifyPost(data);
//     console.log(response)
//   }
//   catch(error){
//     console.log(`에러: ${error}`)
//   }
// }


// /* */
//   return (




//       <View className='flex-1 justify-center items-center'>
//         <SafeAreaView>



//         <TouchableOpacity 
//             className="mb-4 w-28 bg-blue-500 h-8 rounded-3xl justify-center items-center"
//             onPress={selectImage}>
//                 <Text className='text-white'>사진</Text>
//         </TouchableOpacity>







//           <Text className='my-2'>아이디</Text>
//           <TextInput className='my-1 w-60 bg-white border-gray-500 rounded-2xl' 
//             onChangeText={(id) => setId(id)}>
//           </TextInput>
//           <Text className='my-2'>비밀번호</Text>
//           <TextInput className='my-1 w-60 bg-white border-gray-500 rounded-2xl' 
//             secureTextEntry={true} 
//             keyboardType='numeric'
//             onChangeText={(password) => setPassword(password)}>
//           </TextInput>
//         </SafeAreaView>
//         <TouchableOpacity 
//             className="my-4 w-28 bg-blue-500 h-8 rounded-3xl justify-center items-center"
//             onPress={loginTry}>
//                 <Text className='text-white'>로그인</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//             className="mb-4 w-28 bg-blue-500 h-8 rounded-3xl justify-center items-center"
//             onPress={() => router.push('/signup/page1')}>
//                 <Text className='text-white'>회원가입</Text>
//         </TouchableOpacity>
//         <View className='flex-row'>
//           <Link className='my-2 text-xl' href={'/ward/main'}>피보호자</Link>
//           <Text className='my-2 text-xl'> | </Text>
//           <Link className="my-2 text-xl" href={`/family copy/familyMain`}>보호자</Link>
//         </View>



// {/* 
//         <TouchableOpacity 
//             className="mb-4 w-28 bg-blue-500 h-8 rounded-3xl justify-center items-center"
//             onPress={test}>
//                 <Text className='text-white'>회원가입</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//             className="mb-4 w-28 bg-blue-500 h-8 rounded-3xl justify-center items-center"
//             onPress={loginTry}>
//                 <Text className='text-white'>로그인</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//             className="mb-4 w-28 bg-blue-500 h-8 rounded-3xl justify-center items-center"
//             onPress={accountTry}>
//                 <Text className='text-white'>계좌생성</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//             className="mb-4 w-28 bg-blue-500 h-8 rounded-3xl justify-center items-center"
//             onPress={accountList}>
//                 <Text className='text-white'>계좌단건조회</Text>
//         </TouchableOpacity>

//         <TouchableOpacity 
//             className="mb-4 w-28 bg-blue-500 h-8 rounded-3xl justify-center items-center"
//             onPress={directoryView}>
//                 <Text className='text-white'>입금</Text>
//         </TouchableOpacity> */}

//       </View>
//   );
// }