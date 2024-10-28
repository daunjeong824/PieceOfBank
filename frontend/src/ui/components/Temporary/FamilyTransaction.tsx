import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getHistoryList } from '../../../services/api';

const FamilyTransaction = () => {
    interface TransferItem {
        transactionUniqueNo: number,
        transactionDate: string,
        transactionTime: string,
        transactionType: string,
        transactionTypeName: string,
        transactionAccountNo: string,
        transactionBalance: number,
        transactionAfterBalance: number,
        transactionSummary: string,
        transactionMemo: string
    }
     // 임시 리스트 (거래)
    //  const transferList: TransferItem [] = [{id:'1', type:'1', name:'9월 1일'}, {id:'2', type:'1', name:'9월 2일'}, {id:'3', type:'2', name:'9월 3일', media:'사진'}, {id:'4', type:'1',name:'9월 4일'}, {id:'5', type:'2',name:'9월 5일', media:'사진'}]
    const [transferList, setTransferList] = useState<TransferItem[]>([])

    /* 거래 목록 조회 */
    const listView = async() => {
        try {
            const accountMy = await AsyncStorage.getItem("mainAccount");
            // console.log(accountMy)
            const JsonData = {
            "accountNo": accountMy,
            "startDate": "20240101",
            "endDate": "20241231",
            "transactionType": "A",
            "orderByType": "ASC"
            }
            const response = await getHistoryList(JsonData);
            const listData = response.data.REC.list
            // console.log(response.data.REC.list)
            setTransferList(listData)
        }
        catch (error) {
            console.log(`에러: ${error}`)
        }
        } 

    const [modals, setModals] = useState(false)
    const ModalOpen = () => {
        setModals(!modals)
        console.log('!!')
    } 

    useEffect(() => {
        listView()
    },[])
    
     return(
        <View className='bg-gray-300 rounded-3xl flex-1 w-4/5'>
            <ScrollView className='flex-1'>
            {transferList.map((list, index) => (
                <View key={index} className={`${list.transactionType == '1' ? 'items-start' : 'items-end'} flex-1 justify-center m-2`}>
                    <View className={`${list.transactionType == '1' ? 'bg-white' : 'bg-yellow-300'} w-3/5 h-32 my-2 p-2 rounded-xl `}> 
                        <Text className='text-xl text-center font-bold'>
                            {list.transactionDate.slice(0,4)}년 {list.transactionDate.slice(4,6)}월 {list.transactionDate.slice(6,8)}일{' '}
                             {list.transactionTime.slice(0,2)}:{list.transactionTime.slice(2,4)}
                        </Text>
                        <Text className='text-xl text-center'>{list.transactionBalance}원 {list.transactionTypeName}</Text>
                        <Text className='text-xl text-center'>잔액 {list.transactionAfterBalance}원</Text>
                        {/* { list.media ?
                        (<TouchableOpacity 
                            className='w-5/6 h-12 m-3 rounded justify-center items-center bg-sky-500'
                            onPress={ModalOpen}>
                            <Text className='text-white text-center font-bold'>메세지를 확인해보세요!</Text>
                        </TouchableOpacity>)
                        : null
                        } */}
                    </View>
                    {/* <Text className={`${list.type == '1' ? 'bg-white' : 'bg-yellow-300'} flex-row w-2/5 h-40 my-2 p-2 rounded-xl `}>{list.name}</Text>
                    <TouchableOpacity className='w-16 h-8 mx-1 rounded justify-center bg-red-500'>
                    <Text className='text-white text-center font-bold'>메세지를 확인해보세요!</Text></TouchableOpacity> */}
                </View>
                ))}
                <Modal visible={modals}
                transparent={true}>
                    <View className='flex-1 justify-center items-center' style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}>
                        <View className='bg-sky-200 font-3xl w-3/4 h-2/4'>
                            <View className='w-40 h-40'></View>
                            <Text className='text-center'>모달 내용</Text>
                        </View>
                        <Pressable onPress={ModalOpen} className='bg-blue-500 m-3 p-2 w-20 items-center rounded-xl'>
                            <Text className='font-bold color-white'>닫기</Text>
                        </Pressable>
                    </View>
                </Modal>
            </ScrollView>
        </View>
    )



}

export default FamilyTransaction