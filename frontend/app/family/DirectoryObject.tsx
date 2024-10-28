import { View, Text, SafeAreaView, TextInput, Button, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useState } from "react";
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import ObjectInput from "../../src/ui/components/Card/ObjectInput";
import { directory } from "../../src/types/directory";
import ObjectView from "../../src/ui/components/Card/ObjectView";

interface DirectoryObjectInfo {
    data : directory,
}

const DirectoryObject = ({ data } : DirectoryObjectInfo) => {
    const [oneLimit, setOneLimit] = useState<string>("");
    const [todayLimit, setTodayLimit] = useState<string>("");
    const router = useRouter()

  /*
  ★★★★★★추가해야 할 내용★★★★★★
  1. 기본 정보 불러오는 기능

  2. 수정 기능
  */
  
  /* 알림팝업 Logic */

  const handleUpdateDirectory = (data : directory) => {
    router.push({
      pathname: "/family/UpdateDirectoryObject",
      params : {
        name: data.name,
        code: data.institutionCode,
        account: data.accountNo,
        uri: data.url,
        userKey : data.userKey
      }
    })
  }

  const handleBtn = () => {
    Toast.show({
      type: 'success',
      text1: 'Hello',
      text2: 'This is some something 👋'
    })
  }

  return (
    <View className='flex-1'>
      <View className='justify-center items-center p-4'>
        
        {/* 뷰단 빨리 보여주기 */}
        <ObjectView data={data} />

      </View>
      <TouchableOpacity
                  className="m-2 py-2 px-4 bg-red-400 rounded-3xl bg-sky-500"
                  onPress={() => {handleUpdateDirectory(data)}}
                      >
                          <Text className="text-white text-center font-bold ">삭제</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DirectoryObject;