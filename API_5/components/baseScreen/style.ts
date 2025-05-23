import { StyleSheet } from "react-native";
import { cores, fontsLoaded, fonts } from "../../styles";

const styles = StyleSheet.create({
    container: {
        backgroundColor: cores.cor1,
        minHeight: "100%"
    },
    divContainer: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        padding: 24
    },
    textReload: {
        color: cores.cor2,
        width: 'auto',
        ...fonts.title
    },
});

export { fontsLoaded };
export default styles;