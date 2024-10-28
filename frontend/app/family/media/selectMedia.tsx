import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, ImageBackground, TextInput, SafeAreaView, Alert, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Toast from "react-native-toast-message";
import Header from "../../../src/ui/components/Header";

const selectMedia = () => {

    const router = useRouter();
    const { mediaNo } = useLocalSearchParams()
    return(
      <View className='flex-1'>
        <Header />
        <View className='flex-1 items-center'>
        <View className='mt-16 mb-16 p-2 h-16 w-48 rounded-3xl bg-gray-300'>
            <Text className='text-xl m-2 text-center font-bold'>어떻게 보낼까요?</Text>
        </View>
            <Link className='w-44 p-2 rounded-3xl justify-center items-center font-bold bg-pink-300 m-2 text-center text-2xl text-white' 
          href={{pathname:'/family/media/videoMedia', params:{mediaNo:mediaNo}}}>동영상</Link>
          <Link className='w-44 p-2 rounded-3xl justify-center items-center font-bold bg-pink-300 m-2 text-center text-2xl text-white' 
          href={{pathname:'/family/media/imageMedia', params:{mediaNo:mediaNo}}}>이미지</Link>
            <Link className='w-44 p-2 rounded-3xl justify-center items-center font-bold bg-sky-300 m-2 text-center text-2xl text-white' 
          href={{pathname:'/family/media/textMedia', params:{mediaNo:mediaNo}}}>텍스트</Link>
        </View>
      </View>

    )
}

export default selectMedia;