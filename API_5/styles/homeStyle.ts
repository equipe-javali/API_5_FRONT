import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { StyleSheet } from "react-native";


export const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#282828',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 50
    },
    grid: {
        width: '100%',
        paddingHorizontal: 20
    },
    link: {
        width: '100%',
        marginBottom: 15
    },
    card: {
        backgroundColor: '#212121',
        width: '100%',
        height: 120,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    cardText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 5,
        textAlign: 'center'
    }
});

export default styles;