import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { StyleSheet } from "react-native";

export const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
});

export const cores = {
    cor1: "#000000",
    cor2: "#282828",
    cor3: "#1e1e1e",
    cor4: "#444444",
    cor5: "#ADADAD",
    cor6: "#cccccc",
    cor7: "#F5F5F5",
    cor8: "#ffffff",
    cor9: "#90ee90",
    cor10: "#007BFF",
    cor11: "#FF9500"
}

export const fonts = StyleSheet.create({
    title: {
        fontSize: 24,
        fontFamily: 'Roboto_700Bold'
    },
    bigBotton: {
        fontSize: 24,
        fontFamily: 'Roboto_400Regular'
    },
    text: {
        fontSize: 20,
        fontFamily: 'Roboto_400Regular'
    },
    text2: {
        fontSize: 18,
        fontFamily: 'Roboto_700Bold'
    },
    text3: {
        fontSize: 16,
        fontFamily: 'Roboto_700Bold'
    },
    text4: {
        fontSize: 16,
        fontFamily: 'Roboto_400Regular'
    },
    text5: {
        fontSize: 14,
        fontFamily: 'Roboto_400Regular'
    },
})