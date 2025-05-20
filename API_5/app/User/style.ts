import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { StyleSheet } from "react-native";

export const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#282828",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    input: {
        padding: 15,
        color: "#F4F4F4",
        width: "100%",
        height: 50,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fff",
        alignItems: "center",
        backgroundColor: "#282828",
        fontFamily: "Roboto_400Regular",
        fontSize: 18,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12, // espaço entre os botões
        marginTop: 20,
    },

    button: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#f4f4f4",
        alignItems: "center",
        backgroundColor: "#212121",
        fontFamily: "Roboto_400Regular",
    },
    cancelButton: {
        flex: 1,
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#555",
        alignItems: "center",
        backgroundColor: "#2c2c2c",
        fontFamily: "Roboto_400Regular",
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
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#282828",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
    },
    modalText: {
        fontSize: 18,
        fontFamily: "Roboto_400Regular",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center",
    },
    errorText: {
        color: "white",
    },
    successText: {
        color: "green",
    },
    closeButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#282828",
        alignItems: "center",
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Roboto_400Regular",
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    text: {
        fontSize: 25,
        marginBottom: 25,
        color: '#FFFFFF',
        textAlign: "left",
        alignSelf: "flex-start",
        fontFamily: "Roboto_400Regular",
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
    returnButton: {
        padding: 10,
        marginRight: 10,
    },
    senhaDicasContainer: {
        width: '100%',
        marginBottom: 10,
    },
    senhaDica: {
        fontSize: 14,
        color: '#fff',
        marginBottom: 2,
        fontFamily: 'Roboto_400Regular',
    },
    valido: {
        color: 'lightgreen',
    },
    invalido: {
        color: 'gray',
    },

});

export default styles;