import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { StyleSheet } from "react-native";

export const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 20,
        backgroundColor: '#1c1c1e'
    },
    header: {
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff'
    },
    addBtn: {
        borderColor: '#fff',
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    addBtnText: {
        color: '#fff',
        fontSize: 16
    },
    item: {
        backgroundColor: '#2c2c2e',
        padding: 14,
        borderRadius: 8,
        marginBottom: 12,
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    nome: {
        fontSize: 16,
        color: '#fff'
    },
    actions: {
        flexDirection: 'row',
        gap: 12
    },
    iconBtn: {
        backgroundColor: '#3a3a3c',
        padding: 8,
        borderRadius: 6,
        marginLeft: 8
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1c1c1e'
    }
});

export default styles;