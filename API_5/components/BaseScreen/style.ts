import { StyleSheet } from "react-native";
import { cores } from "../../styles";

const styles = StyleSheet.create({
    mainContainer: {
        display: 'flex',
        height: "100%",
        backgroundColor: cores.cor3,
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