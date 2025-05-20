import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { StyleSheet } from "react-native";

export const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
});

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1
    },
    container: {
        flex: 1,
        backgroundColor: "#282828",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },
    input: {
        padding: 15,
        color: "#F4F4F4",
        width: "100%",
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#282828",
        fontFamily: "Roboto_400Regular",
        fontSize: 18,
        marginBottom: 20
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 20,
        width: '100%'
    },
    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#f4f4f4",
        alignItems: "center",
        backgroundColor: "#212121"
    },
    cancelButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#555",
        alignItems: "center",
        backgroundColor: "#2c2c2c"
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Roboto_400Regular"
    },
    cancelButtonText: {
        color: "#aaa",
        fontSize: 16,
        fontFamily: "Roboto_400Regular"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#282828",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#444"
    },
    modalText: {
        fontSize: 18,
        fontFamily: "Roboto_400Regular",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center"
    },
    errorText: {
        color: "white",
    },
    successText: {
        color: "white"
    },
    closeButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#282828",
        alignItems: "center"
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Roboto_400Regular"
    },
    text: {
        fontSize: 25,
        marginBottom: 25,
        color: '#FFFFFF',
        textAlign: "left",
        alignSelf: "flex-start",
        fontFamily: "Roboto_400Regular"
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center"
    },
    // Novos estilos para o dropdown
    dropdownContainer: {
        width: '100%',
        marginBottom: 20
    },
    labelText: {
        color: '#F4F4F4',
        fontSize: 16,
        marginBottom: 8,
        fontFamily: "Roboto_400Regular"
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: "#282828",
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 5
    },
    dropdownButtonText: {
        color: '#F4F4F4',
        fontSize: 16,
        fontFamily: "Roboto_400Regular"
    },
    dropdownList: {
        backgroundColor: '#333',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 5,
        marginTop: 5,
        width: '100%',
        zIndex: 1000,
        position: 'absolute',
        top: 80
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444'
    },
    dropdownItemText: {
        color: '#F4F4F4',
        fontSize: 16,
        fontFamily: "Roboto_400Regular"
    },
    // Estilos para os chips de permissões
    chipsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 20,
        width: '100%'
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3a3a3c',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 5
    },
    chipText: {
        color: '#F4F4F4',
        marginRight: 5,
        fontSize: 14,
        fontFamily: "Roboto_400Regular"
    },
    permissoesModalContainer: {
        width: "80%",
        backgroundColor: "#282828",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#444",
        maxHeight: '80%'
    },
    permissoesModalTitle: {
        fontSize: 18,
        color: "#fff",
        fontFamily: "Roboto_700Bold",
        marginBottom: 15,
        textAlign: "center"
    }
});

export default styles;