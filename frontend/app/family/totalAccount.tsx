import { Link } from "expo-router";
import { View, Text, ImageBackground, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import FamilyAccountList from "../../src/ui/components/Temporary/AccountList";

const TotalAccount = () => {

    return (
        <View className='flex-1'>
        <View className='flex-1 justify-center items-center'>
            <Text className="w-60 p-2 bg-gray-300 rounded-3xl text-center justfiy-center items-center m-5 text-lg font-bold">전체 계좌 목록</Text>
            <FamilyAccountList />
        </View>
        </View>

      );
}

// export const config = {
//     screenOptions:{
//         headerShown:false,
//     }
// }

export default TotalAccount;