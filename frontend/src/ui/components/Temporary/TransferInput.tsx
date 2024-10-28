import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import CancelButton from '../CancelButton';

interface existsInfo {
    onChange: (inputBalance:string) => void;
    name: string | string[]
}

const TransferInput = ({ onChange, name } : existsInfo) => { 

    const [inputBalance, setInputBalance] = useState<string>(''); // 금액

    const router = useRouter()

    const existCheck = () =>{
        onChange(inputBalance)
    }

     return(
        <View>
        <View className='mt-16 mb-8 p-2 h-32 rounded-3xl bg-gray-300'>
            <Text className='text-xl m-2 text-center mt-4 font-bold'>{name}님에게</Text>
            <Text className='text-xl m-2 text-center mt-4 font-bold'>얼마를 보낼까요?</Text>
        </View>

        <View className='m-2 p-2'>
            <SafeAreaView>
                <View className='flex-row justify-center items-center'>
                    <TextInput className='my-3 rounded-3xl w-60 h-12 bg-gray-200 ' keyboardType='numeric' onChangeText={(balance) => setInputBalance(balance)} />
                    <Text className='my-2 text-xl font-bold'>원</Text>
                </View>
            </SafeAreaView>
        </View>
        <View className='flex-row m-2 justify-center items-center'>
          <TouchableOpacity 
          className='m-2 py-2 px-4 bg-red-400 rounded-3xl bg-sky-500'
          onPress={existCheck} 
          >
          <Text className='text-white text-center font-bold'>다음 단계</Text></TouchableOpacity>
          <CancelButton />
        </View>
        </View>

    )



}

export default TransferInput
