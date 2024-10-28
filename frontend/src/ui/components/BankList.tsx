import DropDownPicker from "react-native-dropdown-picker";
import { View, Text, Button, TouchableOpacity, ScrollView} from 'react-native';
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

const BankList = () => {
    const [open, setOpen] = useState(false)
    const [value, setValue] = useState(null)
    const [items, setItems] = useState([
        {label:'POB뱅크', value:'apple'},
        {label:'국민은행', value:'banana'},
        {label:'신한은행', value:'orange'},
        {label:'농협', value:'grape'},
        {label:'기업은행', value:'qqq'},
        {label:'시티뱅크', value:'sss'},
        {label:'하나은행', value:'ddd'},
    ])

    return(
        // <SafeAreaView>
        <View className="z-50">
            <DropDownPicker 
                open={open}
                value={value}
                items={items}
                setOpen={setOpen}
                setValue={setValue}
                setItems={setItems}
                containerStyle={{height:40}}
                // maxHeight={60}
                dropDownContainerStyle={{height:80, zIndex:50, top:50,}}
                listMode="SCROLLVIEW"
                scrollViewProps={
                    {
                        // decelerationRate: "fast",
                    showsVerticalScrollIndicator:true,
                    nestedScrollEnabled: true,
                    // scrollEnabled:
                    overScrollMode:"always",
                    disableIntervalMomentum:true,
                    
                    }
                            }
            />
        </View>

        // </SafeAreaView>

    )
}

export default BankList