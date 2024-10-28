import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, ImageBackground, TextInput, SafeAreaView, Alert, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Toast from "react-native-toast-message";
import MessageEx from "../../../src/ui/components/Temporary/MessageEx";
import { mediaPost } from "../../../src/services/api";
import Header from "../../../src/ui/components/Header";

const textMedia = () => {

    const router = useRouter()
    const [message, setMessage] = useState('')

    const [useEx, setUseEx] = useState('1')
    const { mediaNo } = useLocalSearchParams()
    
    /* 샘플로 텍스트 내용 변경 */
    const textChange = (text:string) => {
        setMessage(text)
        setUseEx('1')
        }
    
    const textPost = async() => {
        try{
            const transNo = Number(mediaNo)
            const type = 'TEXT'
            const content = message
            const data = {
                file:null
              }
            console.log(`transNo ${transNo}`)
            const answer = await mediaPost(transNo, type, content, data)
            console.log(answer)
              Toast.show({
                type: 'success',
                text1: '미디어 보내기 성공!',
                text2: '미디어가 정상적으로 보내졌습니다'
              })
            router.push('/family/familyMain')
        }
        catch(error){
            console.log(error)
            Toast.show({
                type: 'error',
                text1: '미디어 보내기 실패',
                text2: '전송에 실패했습니다. 다시 확인해주세요.'
              })
        }
    }

    if (useEx == '1'){
        return(
            <View className='flex-1'>
                <Header />
                <View className='flex-1 items-center'>
                <View className='mt-16 mb-16 p-2 h-16 w-56 rounded-3xl bg-gray-300'>
                    <Text className='text-xl m-2 text-center font-bold'>메세지를 작성해주세요</Text>
                </View>
                    <SafeAreaView className='w-72 h-60 border-2 border-gray-200 rounded-3xl bg-white'>
                    <Text className='my-4 text-center text-xl font-bold'>보낼 메세지</Text>
                    <Text className='my-1 text-center text-gray-400'>최대 50자까지 가능합니다</Text>
                    <TextInput className='bg-white w-64 h-32 rounded-lg text-center' onChangeText={(message) => setMessage(message)}>
                        {message}
                    </TextInput>
                    </SafeAreaView>
                <Text className='my-2 text-center text-gray-400'>메세지 작성이 어렵다면?</Text>
                <TouchableOpacity 
                    className='w-48 h-8 mx-1 my-1 rounded-3xl justify-center bg-white border'
                    onPress={() => setUseEx('2')} 
                    >
                    <Text className='text-center font-bold'>추천 메세지</Text></TouchableOpacity>
                    <View className='flex-row my-3'>
                    <TouchableOpacity className='m-2 py-2 px-4 bg-sky-400 rounded-3xl w-20' onPress={textPost}>
                            <Text className='text-white text-center'>보내기</Text>
                            </TouchableOpacity>
                    <TouchableOpacity className='m-2 py-2 px-4 bg-red-400 rounded-3xl w-20' onPress={() => router.push('/family/familyMain')}>
                    <Text className='text-white text-center'>취소</Text>
                    </TouchableOpacity>
                    </View>
                    {/* <Link className='w-32 p-2 rounded-3xl justify-center items-center font-bold bg-sky-300 m-2 text-center text-2xl text-white' 
                        href={{pathname:'/family copy/familyMain'}}>보내기</Link> */}
                </View>
            </View>

        )
    } 
    // 팝업 메세지 보여주기
    else if (useEx == '2'){
        return(
            <MessageEx onChange={textChange}/>
        )
    }

}

export default textMedia;