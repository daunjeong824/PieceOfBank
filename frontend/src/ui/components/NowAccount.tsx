import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAccountList } from '../../services/api';
// import { mediaPost, createAccount, logoutUser, getAccountList } from "../../src/services/api";


const NowAccount = () => {
    interface NowAccount {
        id: string;
        bank: string;
        accountNo: string;
    }

    const router = useRouter()

    const [mainAc, setMainAc] = useState('')

    // 계좌 등록 여부 확인
    const [bankExist, setBankExist] = useState(false)

        // 화면 가로고정
        useEffect(() => {

            const mainRequest = async() => {
                try{
                    const response = await getAccountList();
                    console.log('@#$@$@')
                    console.log(response.data.REC[0].accountNo)
                    const mainGo = response.data.REC[0].accountNo
                    await AsyncStorage.setItem("mainAccount", mainGo);
                    setMainAc(mainGo)
                    setBankExist(true)
                }
                catch(error){
                    console.log(error)
                    setBankExist(false)
                }
            }
            mainRequest()
            
            return () => {
            
            }
            },[]);

     // 임시 리스트 (은행 정보)
     const nowBank: NowAccount = {id:'1', accountNo:'1234567890', bank:'하나은행'}

        return(
            <View className='flex-1'>
                <Link className='text-xl justify-center items-center text-center' href={'/ward/accountList'}>
                    {(bankExist == false
                    ?<Text className='font-semibold'>대표 계좌를 설정해주세요!</Text> 
                    :<Text className='font-semibold'>한국은행 {mainAc}</Text>)}        
                </Link>
            </View>
        )



}

export default NowAccount