import { Link } from "expo-router";
import { View, Text, ImageBackground, TextInput, SafeAreaView, TouchableOpacity, Image, FlatList, StyleSheet, ScrollView, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import Checkbox from 'expo-checkbox';
import Toast from "react-native-toast-message";
import CancelButton from "./CancelButton";
import { account } from "../../types/account";
import { getAccountList, accountPatch } from "../../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WardAllAccount = () => {

    const router = useRouter();

    // 임시 대표 계좌 정보
    const [mainAccount, setMainAccount] = useState('');

    // 계좌 목록 정보
    const [accountList, setAccountList] = useState<account[]>([])

    // 계좌 목록 요청 보내기
    const accountRequest = async() => {
        try {
          const response = await getAccountList();
          const answer = response.data.REC // 계좌목록
        //   console.log(response.data.REC)
          setAccountList(answer)
        }
        catch (error) {
          console.log(`에러: ${error}`)
        }
      } 

    // 처음 접속 시 실행
    useEffect(() => {
        accountRequest() // 계좌 목록 요청
    }, [])

    // 체크박스 표시
    const [accountChecked, setAccountChecked] = useState(Array(accountList.length).fill(false));

    // 체크박스 변경 - 중복 없이 하나만 체크되도록 설정 (나머지는 체크박스 false로)
    const checkChange = (index:number) => {
        const updateCheck = [...accountChecked]
        updateCheck[index] = true
        for (let i = 0; i < accountList.length; i++){
        if (i == index){
            updateCheck[i] = true
            setMainAccount(accountList[i]['accountNo'])
        }
        else {
            updateCheck[i] = false
        }
        }
        setAccountChecked(updateCheck)
    }

    // ★ 메인 계좌 등록 요청 (요청 구현해야 함)
    const mainSelect = async() => {
        try{
            
            const keyGet = await AsyncStorage.getItem("myKey")
            const myKey = JSON.parse(keyGet!)
            console.log(myKey)
            console.log(typeof myKey)

            const JsonData = {
                'userKey':myKey,
                'accountNo':mainAccount
            }
            const requests = await accountPatch(JsonData)
            console.log(mainAccount)
            // console.log(accountChecked)
            console.log(requests)
            Toast.show({
                type: 'success',
                text1: '대표 계좌 등록이 완료되었습니다',
                text2: ':happy:'
              })
            router.push('/ward/main')
        }catch(error){
            console.log(error)
        }
       
    
    }

     return (
        <View className='flex-1 w-4/5'>
            <ScrollView className='flex-1'>
                <View className='justify-center items-center'>
                {accountList.map((list, index) => (
                    <View key={index} className='w-5/6 h-12 p-3 m-2 flex-row items-center bg-gray-300 justify-between rounded-2xl'>
                        <Text className='pl-4'>{list.bankName}</Text>
                        <Text>{list.accountNo}</Text>
                        <View className='mx-2'>
                            <TouchableOpacity 
                            className={`w-24 h-8 rounded-xl justify-center ${accountChecked[index] ? 'bg-sky-500' : 'bg-gray-500'}`}
                            onPress={() => checkChange(index)} 
                            >
                                <View className='flex-row justify-center'>
                                <Text className='text-white text-center font-bold'>대표 계좌</Text>
                                <Text className={`text-white text-center font-bold ${accountChecked[index] ? ' text-yellow-300' : 'text-gray-400'}`}> ★ </Text>
                                </View>
                            </TouchableOpacity>
                        </View>      
                    </View>
             
                ))}
                <View className='justify-center items-center flex-row'>
                <TouchableOpacity className='m-2 py-2 px-4 bg-sky-400 rounded-3xl w-40' onPress={mainSelect}>
                    <Text className='text-white text-center'>대표 계좌 등록하기</Text>
                    </TouchableOpacity>
                    <CancelButton />
                </View>
                </View>

            </ScrollView>
        </View>

         
       );
}

export default WardAllAccount


    // 임시 전체 계좌 정보
    // interface AccountItem {
    //     id: string;
    //     bank: string;
    //     number: string;
    //   }
    // 임시 전체 계좌 정보
//     interface AccountItems {
// "accountBalance": 0, 
// "accountCreatedDate": "20241003", 
// "accountExpiryDate": "20291003", 
// "accountName": "한국은행 수시입출금 상품", 
// "accountNo": "0011474303166137", 
// "accountTypeCode": "1", 
// "accountTypeName": "수시입출금", 
// "bankCode": "001", 
// "bankName": "한국은행", 
// "currency": "KRW", 
// "dailyTransferLimit": 500000000, 
// "lastTransactionDate": "", 
// "oneTimeTransferLimit": 100000000, 
// "username": null
//       }
    // 임시 전체 계좌
    // const accountList : AccountItem [] = [{id:'1', bank:'신한은행', number:'11111111111'}, {id:'2', bank:'하나은행', number:'2222222222'}, {id:'3', bank:'국민은행', number:'33333333333'}]
