import React, { ReactNode, } from "react";
import { Modal as ModalView, Text, TouchableOpacity, View } from "react-native";
import styles from "./style";
import { ScrollView } from "react-native-gesture-handler";

interface BaseScreenProps {
    children: ReactNode;
    show: boolean;
    setShow: (status: boolean) => void;
    mensageClose?: string;
    secundaryButton?: {
        text: string;
        function: Function
    };
};

export default function Modal({ children, show, setShow, mensageClose, secundaryButton }: BaseScreenProps) {
    return (
        <ModalView
            transparent={true}
            animationType="fade"
            visible={show}
            onRequestClose={() => setShow(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <ScrollView style={styles.modalScroll}>
                        {children}
                    </ScrollView>
                    <View style={styles.buttonsContainer}>
                        {secundaryButton && <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => secundaryButton.function}
                        >
                            <Text style={styles.buttonText}>
                                {secundaryButton.text}
                            </Text>
                        </TouchableOpacity>
                        }
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setShow(false)}
                        >
                            <Text style={styles.buttonText}>
                                {mensageClose ?? 'Fechar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ModalView>
    );
};