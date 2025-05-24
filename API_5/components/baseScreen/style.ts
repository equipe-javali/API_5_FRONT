import { StyleSheet } from "react-native";
import { cores, fonts } from "../../styles";

const styles = StyleSheet.create({
    container: {
        backgroundColor: cores.cor2,
        minHeight: "100%"
    },
    divContainer: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        padding: 24
    },
    iconLoading: {
        marginTop: 50
    },
    textReload: {
        color: cores.cor8,
        width: 'auto',
        ...fonts.title
    },
});

export { cores };
export default styles;