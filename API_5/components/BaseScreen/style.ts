import { StyleSheet } from "react-native";
import { cores } from "../../styles";

const styles = StyleSheet.create({
    mainContainer: {
        backgroundColor: cores.cor3,
        display: 'flex',
        height: "100%"
    },
    container: {
        flex: 1,
    },
    divContainer: {
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        padding: 24
    }
});

export default styles;