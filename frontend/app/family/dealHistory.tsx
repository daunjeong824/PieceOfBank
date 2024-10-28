import { Link, useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Image, ImageBackground, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import smallLogo from "../../src/assets/SmallLogo.png";
import FamilyTransaction from "../../src/ui/components/Temporary/FamilyTransaction";
import CancelButton from "../../src/ui/components/CancelButton";


const DealHistory = () => {
    const router = useRouter()

    const params = useLocalSearchParams()
    const {accounting, banking, naming} = params

    return(
      <View className='flex-1'>
        <View className='flex-1 justify-center items-center'>
        <Text className='text-lg bg-gray-300 p-2 m-3 w-60 rounded-2xl text-center font-bold'>{naming}와의 기록</Text>
        <FamilyTransaction />
        <View className='flex-row m-2'>
          {/* <Link className='w-32 p-2 rounded-3xl justify-center items-center font-bold bg-sky-300 m-2 text-center text-2xl text-white' 
            href={{pathname:'/family copy/sendMoney'}}>송금하기</Link> */}
          <Link className='m-2 py-2 px-4 bg-red-400 rounded-3xl bg-sky-500'
          href={{pathname:'/family/sendMoney', params:{sendAccount: accounting, sendBank: banking, sendName: naming}}}>
            <Text className='text-white text-center font-bold'>송금하기</Text>
          </Link>
          {/* <TouchableOpacity 
          className='m-2 py-2 px-4 bg-red-400 rounded-3xl bg-sky-500'
          onPress={() => router.push('/family copy/sendMoney')} 
          >
          <Text className='text-white text-center font-bold'>송금하기</Text></TouchableOpacity> */}
          <CancelButton />
        </View>

        <View className='h-40'></View>
      </View>
      </View>

    )
}

export default DealHistory;