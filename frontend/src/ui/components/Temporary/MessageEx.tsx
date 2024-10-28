import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, ImageBackground, TextInput, SafeAreaView, Alert, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Toast from "react-native-toast-message";

interface textInfo {
    onChange: (text:string) => void;
}

const MessageEx = ({onChange} : textInfo) => {

    const [sample, setSample] = useState('')

    const router = useRouter()

    const selectCheck = () =>{
        onChange(sample)
    }
    
    return(
        <View className='flex-1 items-center bg-sky-200'>
        <Text className='text-2xl mt-24 font-bold'>메세지 샘플</Text>
        <SafeAreaView className='mt-8'>
            <TouchableOpacity 
                    className='w-48 h-12 m-3 rounded justify-center bg-white rounded-3xl border'
                    onPress={() => setSample('감사합니다')} 
                    >
            <Text className='text-center font-bold'>감사합니다</Text></TouchableOpacity>
            <TouchableOpacity 
                    className='w-48 h-12 m-3 rounded justify-center bg-white rounded-3xl border'
                    onPress={() => setSample('행복하세요')} 
                    >
            <Text className='text-center font-bold'>행복하세요</Text></TouchableOpacity>
            <TouchableOpacity 
                    className='w-48 h-12 m-3 rounded justify-center bg-white rounded-3xl border'
                    onPress={() => setSample('좋은 하루 되세요')} 
                    >
            <Text className='text-center font-bold'>좋은 하루 되세요</Text></TouchableOpacity>
            <TouchableOpacity 
                    className='w-48 h-12 m-3 rounded justify-center bg-white rounded-3xl border'
                    onPress={() => setSample('보고싶어요')} 
                    >
            <Text className='text-center font-bold'>보고싶어요</Text></TouchableOpacity>
        {/* <TextInput className='bg-white w-64 h-32 rounded-lg px-2' onChangeText={(sample) => setSample(sample)}></TextInput> */}
        </SafeAreaView>
                    <View className='flex-row my-3'>
                        <TouchableOpacity className='m-2 py-2 px-4 bg-sky-400 rounded-3xl w-24' onPress={selectCheck}>
                                <Text className='text-white text-center'>선택하기</Text>
                                </TouchableOpacity>
                        <TouchableOpacity className='m-2 py-2 px-4 bg-red-400 rounded-3xl w-24' onPress={() => router.back()}>
                        <Text className='text-white text-center'>취소</Text>
                        </TouchableOpacity>
                    </View>
            {/* <TouchableOpacity 
                    className='w-48 h-8 mx-1 rounded justify-center bg-sky-500'
                    onPress={selectCheck} 
                    >
                    <Text className='text-white text-center font-bold'>선택하기</Text></TouchableOpacity> */}
        {/* <Link className='w-32 p-2 rounded-3xl justify-center items-center font-bold bg-sky-300 m-2 text-center text-2xl text-white' 
            href={{pathname:'/family copy/familyMain'}}>보내기</Link> */}
    </View>
    )
}

export default MessageEx