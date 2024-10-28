import { Link } from "expo-router";
import { View, Text, Image, ImageBackground, TouchableOpacity } from 'react-native';

// MainPage

export default function MainScreen() {
  return (
    <ImageBackground source={require('../src/assets/POBbackGround.png')} style={{ flex: 1 }}>
      <View className='flex-1 justify-center items-center'>
        <Text className='text-3xl m-4'>메인 페이지</Text>
        <View className="w-56 h-56 m-4 bg-white justify-center items-center rounded-3xl">
          <Image className="w-36 h-36 bg-teal-400" source={require('../assets/favicon.png')}></Image>
          <View className="h-4"></View>
          <TouchableOpacity className='w-28 h-8 rounded-3xl justify-center bg-sky-200' onPress={() => console.log('냠')}>
            <Text className='text-center rounded-3xl font-bold'>엄마</Text></TouchableOpacity>    
        </View>
        <Link href={'/profile'}>이동하기</Link>
        <Link href={'/'}>로그아웃</Link>
      </View>
    </ImageBackground>
  );
}