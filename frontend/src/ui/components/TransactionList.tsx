import { View, Text, Button, ImageBackground, Alert, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Pressable } from 'react-native';
import { useRouter, Link, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getHistoryList } from '../../services/api';
import AsyncStorage from "@react-native-async-storage/async-storage";

interface sendInfo{
    account:string | string[],
    bank:string | string[],
    name:string | string[],
}
const TransactionList = ({account, bank, name} : sendInfo) => {
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
     // 임시 리스트 (거래) - 요청 받아와야 함
    //  const transferList: TransferItem [] = 
    //  [            
    //     {
    //     transactionUniqueNo: 19211,
    //     transactionDate: "20240929",
    //     transactionTime: "000706",
    //     transactionType: "1",
    //     transactionTypeName: "입금",
    //     transactionAccountNo: "",
    //     transactionBalance: 1000000000,
    //     transactionAfterBalance: 1000000000,
    //     transactionSummary: "(수시입출금) : 입금",
    //     transactionMemo: ""
    // },
    // {
    //     transactionUniqueNo: 19212,
    //     transactionDate: "20240929",
    //     transactionTime: "000819",
    //     transactionType: "2",
    //     transactionTypeName: "출금(이체)",
    //     transactionAccountNo: "0019197589758057",
    //     transactionBalance: 10000,
    //     transactionAfterBalance: 999990000,
    //     transactionSummary: "",
    //     transactionMemo: ""
    // }
    // ,
    // {
    //     transactionUniqueNo: 19213,
    //     transactionDate: "20240929",
    //     transactionTime: "000819",
    //     transactionType: "2",
    //     transactionTypeName: "출금(이체)",
    //     transactionAccountNo: "0019197589758057",
    //     transactionBalance: 10000,
    //     transactionAfterBalance: 999990000,
    //     transactionSummary: "",
    //     transactionMemo: ""
    // }
    // ,
    // {
    //     transactionUniqueNo: 19214,
    //     transactionDate: "20240929",
    //     transactionTime: "000819",
    //     transactionType: "2",
    //     transactionTypeName: "출금(이체)",
    //     transactionAccountNo: "0019197589325758057",
    //     transactionBalance: 10000,
    //     transactionAfterBalance: 999990000,
    //     transactionSummary: "",
    //     transactionMemo: ""
    // }
// ]
    const [transferList, setTransferList] = useState<TransferItem[]>([])
    const [dealList, setDealList] = useState<TransferItem[]>([])

    // const {account, bank, name} = useLocalSearchParams()

    // 보호자 확인하는 요청 - 보호자 있을 
    const [relation, setRelation] = useState('1')
    

    /* 거래 목록 조회 */
    const listView = async() => {
    try {
        const accountMy = await AsyncStorage.getItem("mainAccount");
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
        setDealList(listData)
        console.log(listData)
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
        const screenChange = async() => {
            await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        };
        screenChange();
        /* 전체 거래 내역 조회 요청 추가하기 */
        listView()
        // 연락처 대상으로 거래 내역 필터링
        const checkList = transferList.filter(value => value.transactionAccountNo == account)
        setDealList(checkList)

        const mediaList = []

        // for (let i=0; i<checkList.length; i++) {
        //     if (checkList[i].transactionAccountNo == account){
        //         console.log('~~~~')
        //         transferList[i].transactionUniqueNo// 미디어 조회 할 때 필요한 거래 번호
        //         // 미디어 확인 버튼 생성에 필요한 배열에 한 번 넣고 - 만들기
        //         // 미디어에 요청 보낼 함수 작성하기
        //         // 미디어 조건에 list.transactionUniqueNo 와 미디어 확인 배열 안 요소가 일치하면 - 버튼 보여주기
        //         // 버튼 클릭 시 거래와 일치시키려면
        //         // 응답값에 transactionUniqueNo가 없으면 - 인덱스 순으로 보여주면 될 것 같음 (순서대로 데이터가 오니까)
        //         // 응답값에 번호가 있으면 일치 확인해서?

        //         // 개별 연락처 기록으로 보려면
        //         // 전체 기록에서 한 번 필터링 해야함
        //         // 연락처의 이름, 계좌번호 받아오기
        //         // 일치하는 계좌번호로 1차로 거른 후 배열에 넣기
        //     }

        // }
        // for (let i=0; i<transferList.length; i++) {
        //     if (transferList[i].transactionAccountNo == "0019197589758057"){
        //         console.log('~~~~')
        //         transferList[i].transactionUniqueNo// 미디어 조회 할 때 필요한 거래 번호
        //         // 미디어 확인 버튼 생성에 필요한 배열에 한 번 넣고 - 만들기
        //         // 미디어에 요청 보낼 함수 작성하기
        //         // 미디어 조건에 list.transactionUniqueNo 와 미디어 확인 배열 안 요소가 일치하면 - 버튼 보여주기
        //         // 버튼 클릭 시 거래와 일치시키려면
        //         // 응답값에 transactionUniqueNo가 없으면 - 인덱스 순으로 보여주면 될 것 같음 (순서대로 데이터가 오니까)
        //         // 응답값에 번호가 있으면 일치 확인해서?

        //         // 개별 연락처 기록으로 보려면
        //         // 전체 기록에서 한 번 필터링 해야함
        //         // 연락처의 이름, 계좌번호 받아오기
        //         // 일치하는 계좌번호로 1차로 거른 후 배열에 넣기
        //     }

        // }
    },[])
    
     return(
        <View className='bg-gray-200 flex-1 w-4/5 rounded-2xl'>
            <ScrollView className='flex-1'>
            {dealList.map((list, index) => (
                <View key={index} className={`${list.transactionType == '1' ? 'items-start' : 'items-end'} flex-1 justify-center m-2`}>
                    <View className={`${list.transactionType == '1' ? 'bg-white' : 'bg-yellow-300'} w-3/5 h-32 my-2 p-2 rounded-xl justify-center`}> 
                        <Text className='text-xl text-center font-bold'>
                            {list.transactionDate.slice(0,4)}년 {list.transactionDate.slice(4,6)}월 {list.transactionDate.slice(6,8)}일{' '}
                             {list.transactionTime.slice(0,2)}:{list.transactionTime.slice(2,4)}
                        </Text>
                        <Text className='text-xl text-center'>{list.transactionBalance}원 {list.transactionTypeName}</Text>
                        <Text className='text-xl text-center'>잔액 {list.transactionAfterBalance}원</Text>
{/* 
                        { list.media ?
                        (<TouchableOpacity 
                            className='w-5/6 h-8 m-3 rounded justify-center items-center bg-sky-500'
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
                        <View className='bg-sky-200 font-3xl w-2/4 h-3/4'>
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

export default TransactionList
