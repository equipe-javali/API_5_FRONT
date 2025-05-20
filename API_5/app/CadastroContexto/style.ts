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
        justifyContent: "space-between"
    },
    middle: {
        flex: 1,
        justifyContent: "center"
    },
    title: {
        fontSize: 24,
        color: "#fff",
        marginBottom: 20,
        textAlign: "center"
    },
    toggleContainer: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20
    },
    toggle: {
        padding: 10,
        backgroundColor: "#555",
        marginHorizontal: 5,
        borderRadius: 5
    },
    activeToggle: {
        padding: 10,
        backgroundColor: "#F5F5F5",
        marginHorizontal: 5,
        borderRadius: 5
    },
    toggleText: {
        color: "#212121"
    },
    input: {
        height: 40,
        borderColor: "#fff",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        color: "#fff"
    },
    button: {
        backgroundColor: "#F5F5F5",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 5
    },
    buttonText: {
        color: "#212121",
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
        marginBottom: 20,
        textAlign: "center",
        color: "#fff"
    },
    errorText: {
        color: "#F4F4F4"
    },
    successText: {
        color: "#F4F4F4"
    },
    closeButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#F5F5F5",
        alignItems: "center"
    },
    closeButtonText: {
        color: "#212121",
        fontSize: 16
    },
    btnBack: {
        alignItems: "flex-start"
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center"
    }
});

export default styles;