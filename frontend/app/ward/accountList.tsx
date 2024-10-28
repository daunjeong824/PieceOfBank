import { Link } from "expo-router";
import { View, Text, Image, ImageBackground, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import WardAllAccount from "../../src/ui/components/WardAllAccount";
import smallLogo from "../../src/assets/SmallLogo.png";
import Header from "../../src/ui/components/Header";
import CancelButton from "../../src/ui/components/CancelButton";

const careAccountList = () => {

    // 화면 가로고정
    useEffect(() => {
        const screenChange = async() => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };
        screenChange();
        return () => {
            ScreenOrientation.unlockAsync()
        }
        },[]);
    return (
        <ImageBackground source={require('../../src/assets/POBbackGround.png')}
        className="flex-1">
            <Header />
        <View className='flex-1 justify-center items-center'>
            <Text className='text-2xl text-white font-bold my-2'>전체 계좌 목록</Text>

            <WardAllAccount />
        </View>
        </ImageBackground>
      );
}

export default careAccountList;