import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import React, { useState } from 'react';

const TransferOk = () => {

    // 송금 제한 기준 체크
    const limitCheck : number = 2
    
    // 기준 이하 - 정상 송금
    if (limitCheck == 1) {
        return(
            <View className='flex-1 flex-row h-5/6'>
                <View className='flex-1 justfiy-center items-center basis-4/5 m-2 p-2 bg-gray-300 h-72'>
                        <Text className='text-2xl'>송금이 완료되었습니다</Text>
                        <Link className='my-2 bg-blue-500 text-white rounded-3xl m-3 p-4' href={'/ward/main'}>메인으로</Link>
                </View>
            </View>
        )
    }
    // 기준 이하 - 보류 상태
    else {
        return(
            <View className='flex-1 flex-row h-5/6'>
                <View className='flex-1 justfiy-center items-center basis-4/5 m-2 p-2 bg-pink-300 h-72'>
                        <Text className='text-2xl'>송금 보류</Text>
                        <Text className='text-2xl'>한도 제한으로 송금이 보류되었습니다</Text>
                        <Text className='text-2xl'>보호자의 승인 결과를 확인해주세요</Text>
                        <Link className='my-2 bg-blue-500 text-white rounded-3xl m-3 p-4' href={'/ward/main'}>메인으로</Link>
                </View>
            </View>
        )
    }




}

export default TransferOk