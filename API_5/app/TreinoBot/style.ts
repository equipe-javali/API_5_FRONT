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
        padding: 20,
        justifyContent: "center",
        alignItems: "center"
    },
    title: {
        fontSize: 24,
        color: "#fff",
        marginBottom: 20,
        textAlign: "center"
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center"
    },
    buttonText: {
        color: "#fff",
        fontSize: 16
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
        borderColor: "#fff"
    },
    modalText: {
        fontSize: 18,
        marginBottom: 10
    },
    errorText: {
        color: "red"
    },
    successText: {
        color: "green"
    },
    closeButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#007BFF",
        alignItems: "center"
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16
    }
});

export default styles;