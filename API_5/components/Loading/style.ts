import { StyleSheet } from "react-native";
import { cores, fonts } from "../../styles";

const styles = StyleSheet.create({
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
        color: cores.cor9,
        width: 'auto',
        ...fonts.title
    }
});

export { cores };
export default styles;