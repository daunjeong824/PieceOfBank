import React, { useEffect } from 'react';
import { Slot } from 'expo-router';
import Toast from "react-native-toast-message";

export default function App() {

  return (
    <>
      <Slot />
      <Toast />
    </>
  );
}
