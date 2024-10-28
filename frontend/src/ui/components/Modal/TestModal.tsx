import { Button, View } from "react-native";

interface ModalProps {
    show: boolean;
    onClose: () => void;
  }

const TestModal = ({ show, onClose }: ModalProps) => {



    const handleClose = () => {

        onClose();
    }

    if (!show) {
        return null;
    }
    
    return (
        <View className="">
            
            <Button title="123" onPress={handleClose}></Button>
        </View>
    );
};

export default TestModal;