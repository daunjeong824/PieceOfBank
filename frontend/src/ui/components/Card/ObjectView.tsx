import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import CancelButton from '../CancelButton';
import { createDirectory } from '../../../services/api';
import * as ImagePicker from 'expo-image-picker';
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { directory } from "../../../types/directory";

interface DirectoryObjectInfo {
    data : directory,
}

const ObjectInput = ({data} : DirectoryObjectInfo) => { 

    const [name, setName] = useState('')
    const [account, setAccount] = useState('')
    //const [imageUri, setImageUri] = useState<string | null>(null);
    const [code, setCode] = useState<string>("00100");
    const [userKey, setUserKey] = useState<string | null>(null);

    const [phone, setPhone] = useState('')
    const [bank, setBank] = useState('')
    

    const router = useRouter()
    const myUserKey = useSelector((state: RootState) => state.getUserKey.userKey);

    // ※ 세부 정보를 불러오는 api는 없음??
    
    useEffect(() => {
        setName(data.name);
        setAccount(data.accountNo);
        //setImageUri(data.url);
        setUserKey(data.userKey);

    }, [])
    
     return(
        <View className='justify-center items-center p-4'>
          <Text className='mt-12 mb-8 bg-gray-300 px-3 py-2 w-48 rounded-3xl text-xl text-center font-semibold'>대상자 설정</Text>
        <SafeAreaView className='bg-gray-200 rounded-3xl px-6 py-4'>
          <Text className="my-2 ml-2 font-semibold">이름</Text>
          <View className='flex-row'>
                     <Text className="my-2 ml-2 font-medium">{name}</Text>
          </View>

          <Text className="my-2 ml-2 font-semibold">연락처</Text>
          <View className='flex-row'>
          <Text className="my-2 ml-2 font-medium">{phone}</Text>
          </View>

          <Text className="my-2 ml-2 font-semibold">은행</Text>
          <View className='flex-row'>
                     <Text className="my-2 ml-2 font-medium">{bank}</Text>
          </View>

          <Text className="my-2 ml-2 font-semibold">계좌번호</Text>
          <View className='flex-row'>
            <Text className="my-2 ml-2 font-medium">{account}</Text>
          </View>

        </SafeAreaView>
        <View className='flex-row mt-2'>
            <CancelButton />
        </View>
      </View>

    )



}

export default ObjectInput
