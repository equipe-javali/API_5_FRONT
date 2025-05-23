import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { StyleSheet } from "react-native";

export const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
});

export const cores = {
    cor1: "#282828",
    cor2: "#fff",
    cor3: "#000",
    cor4: "#F5F5F5",
    cor5: "#282828",
    cor6: "#ADADAD",
    cor7: "#1e1e1e",
    cor8: "#555"
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
    }
})