import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';

interface existInfo {
    onChange: (inputBalance:string) => void;
    name?: string
}

const DirectoryTransfer = ({ onChange, name } : existInfo) => { 

    const [inputBalance, setInputBalance] = useState<string>(''); // 금액



    const existCheck = () =>{
        onChange(inputBalance)
    }

     return(
        <View className='flex-1 flex-row h-4/6'>
        <View className='flex-1 justfiy-center items-center basis-2/6 m-2 p-2 bg-gray-200 rounded-2xl'>
            <Text className='text-2xl m-2 text-center mt-12 font-semibold'>{name}님에게</Text>
            <Text className='text-2xl m-2 text-center mt-4 font-semibold'>얼마를 보낼까요?</Text>

        </View>

        <View className='flex-1 justfiy-center items-center basis-2/6 m-2 p-2 bg-gray-200 rounded-2xl'>
            <Text className='text-2xl m-2 text-center my-4 font-semibold'>보낼 금액</Text>
            <SafeAreaView>
                <View className='flex-row justify-center items-center'>
                    <TextInput className='my-1 w-64 h-12 bg-white rounded-3xl' keyboardType='numeric' onChangeText={(balance) => setInputBalance(balance)} />
                    <Text className='my-2 text-2xl mx-4 font-semibold'>원</Text>
                </View>
            </SafeAreaView>
            <TouchableOpacity className='m-2 py-2 px-4 bg-sky-400 rounded-3xl w-24' onPress={existCheck}>
                <Text className='text-white text-center'>다음</Text>
            </TouchableOpacity>
        </View>
        </View>

    )



}

export default DirectoryTransfer
