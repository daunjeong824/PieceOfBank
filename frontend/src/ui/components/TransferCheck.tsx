import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import React, { useState } from 'react';
import CancelButton from './CancelButton';

interface secondInfo{
    onChange: (value:string) => void
    balance: string
}
const TransferCheck = ({ onChange, balance }: secondInfo) => {

    const secondCheck = () =>{
        onChange('')
    }

     return(
        <View className='flex-1 flex-row h-5/6'>
            <View className='flex-1 justfiy-center items-center basis-3/5 m-2'>
                <Text className='text-2xl m-2 text-center my-4 font-semibold'>거래 확인</Text>
                <Text className='text-2xl m-2 text-center my-4 font-semibold'>{balance}원을 보내겠습니까?</Text>
                <View className='flex-row'>
                    <TouchableOpacity className='m-2 py-2 px-4 bg-sky-400 rounded-3xl w-24' onPress={secondCheck}>
                    <Text className='text-white text-center'>네</Text>
                    </TouchableOpacity>
                    <CancelButton />
                </View>

            </View>
        </View>
    )

}

export default TransferCheck
