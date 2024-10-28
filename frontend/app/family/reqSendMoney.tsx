import { Link } from "expo-router";
import { View, Text, ImageBackground, TextInput, SafeAreaView, Alert, TouchableOpacity, Button, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import Checkbox from 'expo-checkbox';
import { useRouter } from 'expo-router';
import Toast from "react-native-toast-message";
import CancelButton from "../../src/ui/components/CancelButton";
import { notifyList } from "../../src/services/api";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { transferApproval, transferRefusal, notifyUpdate, notifyDelete } from "../../src/services/api";

const ReqSendMoney = () => {
    const [mainConnect, setMainConnect] = useState('');
    const [mainAccount, setMainAccount] = useState('');

    const [updateView, setUpdateView] = useState(false)

    const params = useLocalSearchParams()
    const {accounting, banking, naming} = params
    
    interface notifyItem {
        created: string, 
        notificationId: number, 
        notificationStatus: string, 
        notificationType: string, 
        readAt: any, 
        receiverKey: string, 
        senderKey: string
        }

    // 계좌 목록 정보
    const [noticeList, setNoticeList] = useState<notifyItem[]>([])
    const router = useRouter()

    // 알림 전체 조회
    const notifyView = async() =>{
        const keyGet = await AsyncStorage.getItem("myKey");

        const myKey = JSON.parse(keyGet!)
        // const bankGet = await AsyncStorage.getItem("mainAccount");
        // const myBank = JSON.parse(bankGet!)
        // setMainAccount(myBank)
        console.log(myKey)
        try{
            const data = {
                'receiverKey':myKey
                }
                const response = await notifyList(data);
                console.log(response.data)
                 setNoticeList(response.data || [])
                setNoticeList(response.data)
        }
        catch(error){
            console.log(`에러: ${error}`)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log('화면')
                await notifyView();
            } catch (error) {
                console.error("컴포넌트 마운트 중 오류 발생: ", error);
            }
        };
    
        fetchData();
    }, [updateView]);
    // 요청 수락
    const checkAccept = (index:number) => {
        for (let i = 0; i < noticeList.length; i++){
        if (i == index){
            const numId = noticeList[i]['notificationId']
            // 요청 보내기
            
            const checkRequest = async () => {
                const JsonData = {
                    senderKey: noticeList[i]['senderKey'],
                    receiverKey: noticeList[i]['receiverKey'],
                    accountNo:accounting,
                }

                const response = await transferApproval(JsonData)


                console.log('##')
                console.log(response)
                const answer =await notifyDelete(numId)
                console.log('%%')
                console.log(answer)
            }
            checkRequest()
            Toast.show({
                type: 'success',
                text1: `요청을 허가했습니다`,
                text2: '계좌 이체가 완료되었습니다'
              })
            setUpdateView(prev => !prev)
            // router.push('family/familyMain')

            }
        }
        }

    // 요청 거절
    const checkReject = (index:number) => {
        for (let i = 0; i < noticeList.length; i++){
        if (i == index){
            const numId = noticeList[i]['notificationId']
            // 요청 보내기
            const checkRequest = async () => {
                const response = await transferRefusal()
                await transferRefusal()
                // notifyDelete(numId)
            }
            checkRequest()
            Toast.show({
                type: 'info',
                text1: `요청을 거부했습니다`,
                text2: '계좌 이체가 거부되었습니다'
              })
            }
            setUpdateView(prev => !prev)
        }
        }




    return (
        <View className='flex-1'>
            <View className='justify-center items-center bg-gray-300 rounded-3xl mt-12 p-2 mx-20 mb-5'>
                <Text className='text-xl text-center font-semibold'>알림 내역</Text>
            </View>
        <View className='justify-center items-center h-3/4'>
            <ScrollView className='flex-1'>
            {noticeList.map((list, index) => (
                <View key={list.notificationId} className='w-80 p-2 m-2 flex-row bg-gray-300 rounded-3xl h-24 items-center justify-between'>
                    <View className='mx-2'>
                        <Text className='font-bold'>일자 : {list.created.slice(0,4)}년
                        {list.created.slice(5,7)}월
                        {list.created.slice(8,10)}일
                        {list.created.slice(11,13)}시
                        {list.created.slice(14,16)}분
                        </Text>
                        <Text className='font-bold mt-2'>알림 내용 : {list.notificationType}</Text>
                        {/* <Text className='font-bold'>금액 : {list.money}</Text> */}
                    </View>
                    <View className=' mx-2'>
                        {list.notificationType == '한도 초과 알림'
                        ?(<View>
                            <TouchableOpacity className='w-16 h-8 mx-1 my-1 rounded-3xl justify-center bg-sky-500'
                            onPress={() => checkAccept(index)} 
                            >
                            <Text className='text-white text-center font-bold'>승인</Text></TouchableOpacity>
                            <TouchableOpacity className='w-16 h-8 mx-1 rounded-3xl justify-center bg-red-400'
                            onPress={() => checkReject(index)}
                            >
                            <Text className='text-white text-center font-bold'>거부</Text></TouchableOpacity>
                        </View>)
                        :(<View>
                            <TouchableOpacity className='w-16 h-8 mx-1 rounded-3xl justify-center bg-red-400'
                            onPress={() => checkReject(index)}
                            >
                            <Text className='text-white text-center font-bold'>확인</Text></TouchableOpacity>
                        </View>)
                        }

                    </View>
                </View>
            ))}        
                <View className='flex-row justify-center'>
                    <CancelButton />
                </View>    
          </ScrollView>

        </View>
        </View>

      );
}

export default ReqSendMoney;