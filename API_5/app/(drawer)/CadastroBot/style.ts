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
        padding: 20
    },
    title: {
        fontSize: 25,
        fontFamily: "Roboto_400Regular",
        color: "#fff",
        marginBottom: 25,
        textAlign: "left",
        alignSelf: "flex-start"
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
        marginBottom: 20
    },
    button: {
        width: "60%",
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#F4F4F4",
        alignItems: "center",
        backgroundColor: "#212121",
        fontFamily: "Roboto_400Regular"
    },
    buttonText: {
        color: "#fff",
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
        borderWidth: 1
    },
    modalText: {
        fontSize: 18,
        fontFamily: "Roboto_400Regular",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center"
    },
    errorText: {
        color: "white"
    },
    successText: {
        color: "green"
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
    fullScreenModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.7)"
    },
    loadingText: {
        fontSize: 18,
        fontFamily: "Roboto_400Regular",
        color: "#fff",
        marginTop: 15
    }
});

export default styles;