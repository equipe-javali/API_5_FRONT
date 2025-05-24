import { StyleSheet } from "react-native";
import { cores, fonts } from "../../styles";

const styles = StyleSheet.create({
    buttonText: {
        color: cores.cor7,
        textAlign: 'center',
        ...fonts.bigBotton
    },
    closeButton: {
        alignItems: "center",
        backgroundColor: cores.cor1,
        borderColor: cores.cor8,
        borderRadius: 5,
        borderWidth: 1,
        minWidth: 100,
        padding: 10
    },
    buttonsContainer: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 20,
        justifyContent: 'space-evenly',
        width: '100%'
    },
    modalContainer: {
        alignItems: "center",
        backgroundColor: cores.cor1,
        borderColor: cores.cor8,
        borderRadius: 10,
        borderWidth: 1,
        padding: 20,
        width: "80%"
    },
    modalOverlay: {
        marginTop: 'auto',
        display:'flex',
        alignItems: "center",
        backgroundColor: cores.cor12,
        flex: 1,
        justifyContent: "center"
    },
    modalScroll: {
        maxHeight: 400,
        width: '100%'
    }
});

export { cores };
export default styles;