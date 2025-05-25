import React, { ReactNode, } from "react";
import { Modal as ModalView, Text, TouchableOpacity, View } from "react-native";
import styles, { cores } from "./style";
import { ScrollView } from "react-native-gesture-handler";
import { ActivityIndicator } from "react-native";

interface BaseScreenProps {
    children: ReactNode;
    show: boolean;
    setShow: (status: boolean) => void;
    secundaryButton?: () => void;
    title?: string;
    loading?: boolean;
    setLoading?: (status: boolean) => void;
};

export default function Modal({ children, loading, setLoading, setShow, show, secundaryButton, title }: BaseScreenProps) {
    return (
        <ModalView
            transparent={true}
            animationType="fade"
            visible={show}
            onRequestClose={() => setShow(false)}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    <ScrollView style={styles.modalScroll}>
                        {children}
                    </ScrollView>
                    {loading && <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color={cores.cor9} />
                    </View>}
                    <View style={styles.buttonsContainer}>
                        {secundaryButton && <TouchableOpacity
                            style={styles.saveButton}
                            onPress={secundaryButton}
                        >
                            <Text style={styles.buttonText}>
                                Salvar
                            </Text>
                        </TouchableOpacity>}
                        <TouchableOpacity
                            style={secundaryButton ? styles.cancelButton : styles.closeButton}
                            onPress={() => setShow(false)}
                        >
                            <Text style={styles.buttonText}>
                                {secundaryButton ? 'Voltar' : 'Fechar'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ModalView>
    );
};