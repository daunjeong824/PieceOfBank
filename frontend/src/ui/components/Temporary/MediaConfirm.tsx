import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import React, { useState } from 'react';
import CancelButton from '../CancelButton';

interface mediaCheck {
  onChange: () => void;
  mediaNo?: number
}

const MediaConfirm = ({ onChange, mediaNo }: mediaCheck) => {
    const router = useRouter();
    // const thirdCheck = () => {
    //     // onChange()
    //     router.push('/family copy/media/selectMedia', {numbering:mediaNo})
    // }

     return(
        <View className='flex-1 items-center'>
                <View className='bg-gray-300 rounded-xl w-3/4 p-2 mt-28'>
                  <Text className='text-3xl my-5 text-center font-bold'>송금 완료!</Text>
                  <Text className='text-2xl text-center '>이체가 완료되었습니다</Text>
                  <Text className='text-2xl text-center '>추가로 미디어 컨텐츠를</Text>
                  <Text className='text-2xl text-center mb-5'>보내시겠습니까?</Text>
                </View>
                <View className='m-5'>
                </View>
            <View className='flex-row'>
            <Link className='w-40 p-2 rounded-3xl border m-2 font-semibold text-center text-xl bg-white'
          href={{pathname:'/family/media/selectMedia', params:{mediaNo:mediaNo}}}>
            송금하기
          </Link>
            {/* <TouchableOpacity className='m-2 py-2 px-4 bg-sky-400 rounded-3xl w-20' onPress={thirdCheck}>
                    <Text className='text-white text-center'>네</Text>
                    </TouchableOpacity> */}
            <TouchableOpacity className='m-2 py-2 px-4 bg-red-400 rounded-3xl w-20' onPress={() => router.back()}>
            <Text className='text-white text-center'>아니오</Text>
            </TouchableOpacity>
            </View>

        </View>

    )



}

export default MediaConfirm