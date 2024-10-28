import { Link, useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, ImageBackground, TextInput, SafeAreaView, Alert, Button, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Toast from "react-native-toast-message";
import { mediaPost } from "../../../src/services/api";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import * as FileSystem from 'expo-file-system';
import Header from "../../../src/ui/components/Header";

const videoMedia = () => {
    const [video, setVideo] = useState('')
    const { mediaNo } = useLocalSearchParams()
    const [videoUri, setVideoUri] = useState<string | null>(null);

    /* 비디오 선택 */
    const selectVideo = async () => {
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync(); // 접근 권한 요청 알림
  
    // 권한 없을 경우 종료시킴
    if (status !== 'granted') {
      console.log('미디어 권한이 부여되지 않았습니다.');
      return;
    } 
  
    // 이미지 선택기 열기
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos, // 선택 유형 비디오로 제한
      allowsEditing: true, // 이미지 편집 허용
      aspect: [4, 3], // 편집할 이미지 비율 설정
      quality: 1, // 편집할 이미지 품질 설정
    });
  
    // 이미지 선택 완료하면 IamgeUri에 저장됨
    if (!result.canceled) {
      setVideoUri(result.assets[0].uri);
    } 
  };

    const router = useRouter()

    const videoPost = async() => {
        if (!videoUri) return; // 이미지 정보 있는지 확인

        // 이미지 파일을 Base64로 인코딩
        const videoData = await FileSystem.readAsStringAsync(videoUri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        try{
            const transNo = Number(mediaNo)
            const type = 'VIDEO'
            const content = '컨텐츠'
            const JsonData = {
                file:videoData
              }
              const response = await mediaPost(transNo, type, content, JsonData);
              console.log(response)
              Toast.show({
                type: 'success',
                text1: '미디어 보내기 성공!',
                text2: '미디어가 정상적으로 보내졌습니다'
              })
            router.push('/family/familyMain')
        }
        catch(error){
            console.log(error)
            Toast.show({
                type: 'error',
                text1: '미디어 보내기 실패',
                text2: '전송에 실패했습니다. 다시 확인해주세요.'
              })
        }
    }

    return(
        <View className='flex-1'>
          <Header />
            <View className='flex-1 justify-center items-center'>
            <View className='mt-16 mb-16 p-2 h-16 w-56 rounded-3xl bg-gray-300'>
                    <Text className='text-xl m-2 text-center font-bold'>이미지를 선택해주세요</Text>
            </View>
            <SafeAreaView>
            <Text className='my-2'>동영상 내용</Text>
            <TouchableOpacity className='m-2 py-2 px-4 bg-sky-400 rounded-3xl w-20 h-20' onPress={selectVideo}>
                        <Text className='text-white text-center'>이미지 선택</Text>
            </TouchableOpacity>
            </SafeAreaView>
            <View className='flex-row my-3'>
                <TouchableOpacity className='m-2 py-2 px-4 bg-sky-400 rounded-3xl w-20' onPress={videoPost}>
                        <Text className='text-white text-center'>보내기</Text>
                </TouchableOpacity>
                <TouchableOpacity className='m-2 py-2 px-4 bg-red-400 rounded-3xl w-20' onPress={() => router.push('/family/familyMain')}>
                <Text className='text-white text-center'>취소</Text>
                </TouchableOpacity>
                </View>
        </View>
        </View>

    )
}

export default videoMedia;


/* 나중에 비디오 보여줄 때


expo install expo-av

import { Video } from 'expo-av';

    const base64Video = 'data:video/mp4;base64, ...';

    <View>
      <Video
        source={{ uri: base64Video }} // Base64 문자열을 URI로 설정
        style={{ width: '100%', height: 300 }}
        useNativeControls // 기본 비디오 컨트롤 사용
        resizeMode="contain" // 비디오의 비율을 유지
        isLooping // 루프 재생
      />
    </View>

*/