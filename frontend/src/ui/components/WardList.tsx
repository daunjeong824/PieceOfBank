import { Link } from "expo-router";
import { View, Text, ImageBackground, TextInput, SafeAreaView, TouchableOpacity, Image, FlatList, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as ScreenOrientation from 'expo-screen-orientation';
import { subTargetCheck, subProtectCheck, getDirectory } from "../../services/api";
import { directory } from "../../types/directory";

const WardListForm = () => {

    const router = useRouter();

    // interface DirectoryItem {
    //     directoryId : number,
    //     userKey: string,
    //     accountNo: string,
    //     institutionCode: number,
    //     name: string
    // }

    // 보호자 연결 상태 확인 - 1 : 연결 전 (보호자 요청 수락 페이지) / 2 : 연결 후 (기본 메인)
    const [connect, setConnect] = useState(false);
    const [careList, setCareList] = useState<directory[]>([]);

    // 금액 한도 - 1회 / 하루
    const [countLimit, setCountLimit] = useState(0)
    const [allLimit, setAllLimit] = useState(0)

    // 부모키, 자식키
    const [firstKey, setFirstKey] = useState('')
    const [secondKey, setSecondKey] = useState('')

    useEffect(() => {

        // 구독 관계 있는지 확인
        const subCheck = async() => {
            try{
            const response = await subTargetCheck()
            // const checking = response.data
            // console.log('@')
            // console.log(response.data)
            if (response.data == null){
                setConnect(false) // 없으면 등록 화면 보여주기
            } else{
                setConnect(true) // 있으면 관계 보여주기
                setCountLimit(response.data.oneTimeTransferLimit)
                setAllLimit(response.data.dailyTransferLimit)
                setFirstKey(response.data.targetUser.userKey)
                setSecondKey(response.data.protectUser.userKey)
            }
            } catch(error){
            console.log(error)
            }
        }
        subCheck() // 구독 관계 요청
        
        return () => {}
        },[]);
    
     // 현재 페이지 기준
     const [nowPage, setNowPage] = useState(0)

     // 한 페이지에 보여줄 카드 수
     const pageNum = 3
 
     // 다음 페이지로 이동
     const nextPage = (value: number) => {
         if ((nowPage+1) * pageNum < allList.length){
             setNowPage(nowPage + 1)
         }
         }
         
     // 이전 페이지로 이동
     const prevPage = (value: number) => {
         if (nowPage > 0) {
             setNowPage(nowPage-1)
         }
     }

    useEffect(() => {
        const fetchDirectory = async () => {
            const response = await getDirectory();
            console.log("directory get data")
            console.log(response.data);
            
            setCareList(response.data);
            
            console.log("LIST!!")
            console.log(careList)
         }

        fetchDirectory();
    }, []);
 
    // 임시 리스트 (전체 연락처)
     
     // 임시 리스트 (고정 카드: 전체 기록 카드)
     const addList: directory = {userKey: "99", accountNo: "", institutionCode: 0, name: "전체 기록", url: "string"}
 
     // 임시 리스트 (전체 연락처 + 고정)
     const allList : directory [] = (connect==true) 
                                        ? [...careList, addList] 
                                        : [{userKey: "9999", accountNo: "", institutionCode: 0, name: "관계 맺기", url: "string"},
                                            addList
                                        ]

     // 버튼 클릭시 이동 - false면 관계 등록 페이지 true면 거래 내역 확인 페이지
     const connectAdd = connect == true
     ? '/ward/transaction' 
     : '/ward/addFamily'
        
     // 이름 클릭 시 이동~~
    //  const addStatus = (item:any) => {
    //   if (connect == 2){
    //     router.push({
    //         pathname: '/ward/transaction',
    //         params: {item}
            
    //   })
    //   } else{
    //     router.push('/ward/addFamily')
    //   } 
    //  }
 
     // 카드 출력
     const careView = ({item}:{item:directory}) => 
         (

         <View className="w-40 h-40 m-4 bg-white justify-center items-center rounded-3xl">
             <Image className="w-[120px] sm:w-[90px] lg:w-[150px] h-[120px] sm:h-[90px] lg:h-[150px]" source={require('../../../assets/smile.png')}></Image>
             {/* <Image className="w-28 h-28 bg-teal-400 mt-4" source={require('../../../assets/smile.png')}></Image> */}
             {
                (connect == false)
                ?
                    (item.name == '전체 기록')
                    ?             
                    <Link className='w-20 h-6 rounded-3xl justify-center bg-sky-200 m-2 text-center rounded-3xl' 
                    href={
                       {pathname: '/ward/transaction', params:{account:item.accountNo, bank:item.institutionCode, name:item.name,
                        count:countLimit, allCount:allLimit, firKey:firstKey, secKey:secondKey
                       }}
                       }>{item.name}</Link>
                    :             
                    <Link className='w-20 h-6 rounded-3xl justify-center bg-sky-200 m-2 text-center rounded-3xl' 
                    href={
                       {pathname:'/ward/addFamily' , params:{account:item.accountNo, bank:item.institutionCode, name:item.name,
                        count:countLimit, allCount:allLimit, firKey:firstKey, secKey:secondKey}}
                       }>{item.name}</Link>
                 
                :             
                    <Link className='w-20 h-6 rounded-3xl justify-center bg-sky-200 m-2 text-center rounded-3xl' 
                    href={
                    {pathname:connectAdd, params:{account:item.accountNo, bank:item.institutionCode, name:item.name,
                        count:countLimit, allCount:allLimit, firKey:firstKey, secKey:secondKey}}
                    }>{item.name}</Link>
             }
             

            {/* <TouchableOpacity 
                 className='w-12 h-12'
                 onPress={() => addStatus(item)}>
            <Text className='text-center rounded-3xl font-bold text-xl'>{item.name}</Text></TouchableOpacity>    */}
         </View>

        )
 
     // 한 페이지에 보여 줄 카드 리스트 잘라서 보여주기
     const pageList = allList.slice(nowPage * pageNum, (nowPage+1) * pageNum);

     return (

           <View className='flex-row'>
            
            {/* 화살표 이전(<) 버튼 */}
             <View>
                 <TouchableOpacity 
                 className={`w-10 h-10 rounded-3xl justify-center ml-4 mt-24 border-2 ${nowPage === 0? 'bg-gray-500' : 'bg-white'}`} 
                 onPress={() => prevPage(nowPage)} 
                 disabled={nowPage === 0}>
                     <Text className='text-center rounded-3xl font-bold text-3xl'>&lt;</Text></TouchableOpacity>   
             </View>

             {/* 연락처 카드 컴포넌트 */}
             <FlatList 
             data={pageList}
             renderItem={careView}
             keyExtractor={item => item.userKey}
             horizontal={true}
             contentContainerStyle={styles.container}
            // 스타일 className으로 적용 x
             />

             {/* 화살표 다음(>) 버튼 */}
             <View>
                 <TouchableOpacity 
                 className={`w-10 h-10 rounded-3xl justify-center mr-4 mt-24 border-2 ${(nowPage + 1) * pageNum >= allList.length ? 'bg-gray-500' : 'bg-white'}`}
                 onPress={() => nextPage(nowPage)} 
                 disabled={(nowPage + 1) * pageNum >= allList.length}>
                     <Text className='text-center rounded-3xl font-bold text-3xl'>&gt;</Text></TouchableOpacity>   
             </View>
           </View>
         
       );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },})

export default WardListForm