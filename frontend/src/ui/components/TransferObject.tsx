import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { useRouter, Link } from 'expo-router';
import React, { useState } from 'react';
import BankList from './BankList';

interface firstInfo {
    onChange: (inputAccount:string, inputBank:string, inputBalance:string) => void;
}

const TransferObject = ({ onChange } : firstInfo) => {

    const [inputAccount, setInputAccount] = useState<string>(''); // 계좌번호

    const [inputBank, setInputBank] = useState<string>(''); // 은행  

    const [inputBalance, setInputBalance] = useState<string>(''); // 금액


    const firstCheck = () =>{
        onChange(inputAccount, inputBank, inputBalance)
    }

     return(
        <View className='flex-1 flex-row h-5/6'>
        <View className='flex-1 justfiy-center items-center basis-2/6 m-2 bg-gray-200 rounded-2xl'>
            <Text className='font-bold m-1 text-center text-2xl mt-2'>보낼사람</Text>
            <SafeAreaView>
                <View>
                    <Text className='m-2 mt-1 font-semibold'>계좌번호</Text>
                    <TextInput className='my-1 w-64 h-8 bg-white rounded-3xl' keyboardType='numeric' onChangeText={(account) => setInputAccount(account)}/>
                </View>
                <View>
                    <Text className='m-2 mt-1 font-semibold'>은행</Text>
                    <View className='w-64 h-8 rounded-3xl border-white'>
                        <BankList />
                    </View>
                    {/* <TextInput className='my-1 w-64 h-8 bg-white rounded-3xl' onChangeText={(bank) => setInputBank(bank)}/> */}
                </View>
            </SafeAreaView>
        </View>

        <View className='flex-1 justfiy-center items-center basis-2/6 m-2 p-2 bg-gray-200 rounded-2xl'>
            <Text className='text-2xl m-2 text-center my-4 font-semibold'>보낼 금액</Text>
            <SafeAreaView>
                <View className='flex-row justify-center items-center'>
                    <TextInput className='my-1 w-64 h-12 bg-white rounded-3xl' keyboardType='numeric' onChangeText={(balance) => setInputBalance(balance)} />
                    <Text className='my-2 text-2xl mx-4 font-semibold'>원</Text>
                </View>
            </SafeAreaView>
            <TouchableOpacity className='m-2 py-2 px-4 bg-sky-400 rounded-3xl w-24' onPress={firstCheck}>
                <Text className='text-white text-center'>다음</Text>
            </TouchableOpacity>
        </View>
        </View>

    )



}

export default TransferObject
