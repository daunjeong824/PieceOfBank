// 보호자 UI - Header
import React from "react";
import { View, Image, Text, SafeAreaView } from "react-native";
import smallLogo from "../../assets/SmallLogo.png";

// Store -> 보호자 메인페이지인 경우, <Link>Message</Link> 띄울 수 있게..

const Header = () => {
  return (
    <SafeAreaView>
    <View className="h-16 my-5 bg-blue-400 dark:bg-blue-100 justify-center items-center">
      <Image source={smallLogo} className="w-12 h-12" />
      {/* <Text>hello my Header</Text> */}
    </View>
    </SafeAreaView>

  );
};

export default Header;
