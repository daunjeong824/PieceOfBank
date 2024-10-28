import { View, Text, SafeAreaView, TextInput, Button, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import Toast from 'react-native-toast-message';
import ObjectInput from "../../src/ui/components/Card/ObjectInput";
import { directory } from "../../src/types/directory";
import * as ImagePicker from 'expo-image-picker';
import ObjectView from "../../src/ui/components/Card/ObjectView";
import { useRouter, useLocalSearchParams } from "expo-router";
import CancelButton from "../../src/ui/components/CancelButton";

interface DirectoryObjectInfo {
    data : directory,
}

const UpdateDirectoryObject = () => { 

    const { original_name, original_code, original_account, original_uri, original_userKey } = useLocalSearchParams();
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [bank, setBank] = useState('')
    const [account, setAccount] = useState('')
    const [imageUri, setImageUri] = useState<string | null>(null);
    
    const router = useRouter()
   
  /* 이미지 선택 */
  const selectImage = async () => {
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // 접근 권한 요청 알림
  
    // 권한 없을 경우 종료시킴
    if (status !== 'granted') {
      console.log('미디어 권한이 부여되지 않았습니다.');
      return;
    } 
  
    // 이미지 선택기 열기
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // 선택 유형 이미지로 제한
      allowsEditing: true, // 이미지 편집 허용
      aspect: [4, 3], // 편집할 이미지 비율 설정
      quality: 1, // 편집할 이미지 품질 설정
    });
  
    // 이미지 선택 완료하면 IamgeUri에 저장됨
    if (!result.canceled) {
        setImageUri(result.assets[0].uri);
    } 
    };
    
    const handleDirectoryUpdate = async () => {
        try {
            const formData = new FormData();

            formData.append('file', {
                uri: imageUri, // 이미지의 URI
                name: 'image.jpg', // 파일 이름
                type: 'image/jpeg', // 파일 타입
              } as any);

            formData.append("name", name);
            formData.append("phone", phone);
            formData.append("bank", bank);
            formData.append("account", account);
            
            console.log("### Update는 구현 예정 중입니다 ###")
        } catch (error) {
            
      }
  }

    useEffect(() => { 
        const or_name: string = original_name as string;
        const or_account: string = original_account as string;
        const or_code: string = original_code as string;
        const or_userKey: string = original_userKey as string;
        const or_uri: string = original_uri as string;

        setName(or_name);
        setAccount(or_account);
        setImageUri(or_uri);

    }, []);
    
     return(
        <View className='justify-center items-center p-4'>
          <Text className='mt-12 mb-8 bg-gray-300 px-3 py-2 w-48 rounded-3xl text-xl text-center font-semibold'>대상자 설정</Text>
        <SafeAreaView className='bg-gray-200 rounded-3xl px-6 py-4'>
          <Text className="my-2 ml-2 font-semibold">이름</Text>
          <View className='flex-row'>
                     <TextInput className="my-1 w-56 bg-white rounded-3xl py-1"
                         onChangeText={(name) => setName(name)}
                         value={name}
                     ></TextInput>
          </View>

          <Text className="my-2 ml-2 font-semibold">연락처</Text>
          <View className='flex-row'>
          <TextInput
            className="my-1 w-56 bg-white rounded-3xl py-1"
            keyboardType='numeric'
                         onChangeText={(phone) => setPhone(phone)}
                        value={phone}
                     ></TextInput>
          </View>

          <Text className="my-2 ml-2 font-semibold">은행</Text>
          <View className='flex-row'>
          <TextInput
            className="my-1 w-56 bg-white rounded-3xl py-1"
                         onChangeText={(bank) => setBank(bank)}
                     value={bank}
                     ></TextInput>
          </View>

          <Text className="my-2 ml-2 font-semibold">계좌번호</Text>
          <View className='flex-row'>
          <TextInput
            className="my-1 w-56 bg-white rounded-3xl py-1"
            keyboardType='numeric'
                         onChangeText={(account) => setAccount(account)}
                     value={account}
                     ></TextInput>
          </View>

        </SafeAreaView>
        <View className='flex-row mt-2'>
          <TouchableOpacity 
            className='m-2 py-2 px-4 bg-red-400 rounded-3xl bg-sky-500'
            onPress={handleDirectoryUpdate} 
            >
            <Text className='text-white text-center font-bold'>설정 완료</Text></TouchableOpacity>
            <CancelButton />
        </View>

      </View>

    )

}

export default UpdateDirectoryObject;