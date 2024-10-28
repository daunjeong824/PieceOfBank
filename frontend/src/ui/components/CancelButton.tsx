import { useRouter} from 'expo-router';
import { View, Text, ImageBackground, TextInput, SafeAreaView, TouchableOpacity } from 'react-native';
import React from 'react';

const CancelButton = () => {
    const router = useRouter()

    return(
        <TouchableOpacity className='m-2 py-2 px-4 bg-red-400 rounded-3xl' onPress={() => router.back()}>
            <Text className='text-white'>뒤로 가기</Text>
        </TouchableOpacity>
    )
}

export default CancelButton