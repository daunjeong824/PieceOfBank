import { Link } from "expo-router";
import { TouchableOpacity, View, Image, Text } from "react-native";

const LinkToAddWard = () => {

    return (
        <TouchableOpacity
            className="bg-gray-200 w-[120px] sm:w-[90px] lg:w-[150px] h-[120px] sm:h-[90px] lg:h-[150px]
                 m-1
            ">
            <Link href="/family/AddWard" className="flex justify-center items-center">
                <Image source={require('../../assets/emptyImage.png')}
                    className = "" />
                <Text>보호자 카드</Text>
            </Link>
        </TouchableOpacity>
    );
}

export default LinkToAddWard;