import { Link, useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, ImageBackground, TextInput, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import TransactionList from "../../src/ui/components/TransactionList";
import NowAccount from "../../src/ui/components/NowAccount";
import Header from "../../src/ui/components/Header";
import smallLogo from "../../src/assets/SmallLogo.png";


const careTransaction = () => {
    
    const router = useRouter()

    // 카드 리스트에서 전달받은 이름, 계좌번호, 은행
    const {account, bank, name, count, allCount, firKey, secKey} = useLocalSearchParams()
    const accounts = account 
    const banks = bank
    const names = name
    const counts = count
    const allCounts = allCount
    const thirdKey = firKey
    const fourthKey = secKey
    
    // 화면 가로고정
    useEffect(() => {
        const screenChange = async() => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };
        screenChange();
        console.log(accounts)
        console.log
        // return () => {
        //     ScreenOrientation.unlockAsync()
        // }
        },[]);

    return (
      <ImageBackground source={require('../../src/assets/POBbackGround.png')}
      className="flex-1">
           <View className="h-16 bg-blue-400 dark:bg-blue-100 flex flex-row justify-start items-center">
            <Image source={smallLogo} className="w-12 h-12" />
              <View className='flex-1 justify-start items-center'>
              <Text className='text-2xl text-white font-bold'>{name}의 거래내역</Text>
            </View>
          </View>
        <View className='flex-1 justify-center items-center'>
      <View className='flex-row items-center w-full justify-between h-20'>
        <View className='flex-1 items-center'>
          <Link className='w-40 p-2 rounded-3xl border m-2 font-semibold text-center text-xl bg-white'
          href={{pathname:'/ward/transfer', params:{nowAccount: account, nowBank: bank, nowName: name,
           countLimit:counts, allLimit:allCounts, mymyKey:thirdKey, youyouKey:fourthKey}}}>
            송금하기
          </Link>
        </View>
        <TouchableOpacity 
        className='m-2 p-1 border rounded-full w-8 h-8 bg-white justify-center items-center'
        onPress={() => router.back()}>
          <Text>X</Text>
        </TouchableOpacity>
      </View>

          <TransactionList account={accounts} bank={banks} name={names}/>
          <View className='h-4'></View>
        </View>
      </ImageBackground>

      );
}

export default careTransaction;