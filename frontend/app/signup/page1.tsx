import { View, Text, Button, ImageBackground, TextInput, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import Checkbox from 'expo-checkbox';
import Signup from '../../src/ui/components/Signup';

export default function page1(){
  const router = useRouter();

  return (
    <ImageBackground source={require('../../src/assets/POBbackGround.png')} className='flex-1'>
      <Signup />
    </ImageBackground>

  );
}
