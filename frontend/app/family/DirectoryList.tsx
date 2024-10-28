import { View, Text, SafeAreaView, TextInput, Button, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import CancelButton from "../../src/ui/components/CancelButton";
import ListInput from "../../src/ui/components/Temporary/ListInput";
import { getDirectory } from "../../src/services/api";
import { directory } from "../../src/types/directory";

const DirectoryList = () => {
  const [oneLimit, setOneLimit] = useState<string>("");
  const [todayLimit, setTodayLimit] = useState<string>("");
  const [directoryList, setDirectoryList] = useState<directory[]>([]);
  const router = useRouter();

  /*
  ★★★★★★추가해야 할 내용★★★★★★
  1. 부모 송금 대상 불러오는 기능
  */

  // 2. x표 누르면 삭제하는 기능

  /* 알림팝업 Logic */
  const handleBtn = () => {
    Toast.show({
      type: "success",
      text1: "Hello",
      text2: "This is some something 👋",
    });
  };

  useEffect(() => {
    // 1. 부모 대상 송금 불러오는 기능
    // 부모 기준으로 등록된 연락처를 가져온다.(directory/find)
    const handleGetDirectory = async () => {
      try {
        const response = await getDirectory();
        setDirectoryList(response.data); // 수정할 코드
      } catch (error) {
        console.error("연락처 불러오는 도중 Error : " + error);
      }
    };

    handleGetDirectory();
  }, []);

  return (
    <View className="flex-1">
      <View className="flex-1">
        <View className="justify-center items-center bg-gray-300 rounded-3xl mt-12 p-3 mx-12 mb-5">
          <Text className="text-xl text-center font-semibold mb-2">부모 송금 대상 관리</Text>
          <Text className="text-center text-gray-500">최대 5명까지 설정 가능합니다</Text>
        </View>
        <ListInput data={directoryList} />
      </View>
    </View>
  );
};

export default DirectoryList;
