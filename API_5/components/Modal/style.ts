import { StyleSheet } from "react-native";
import { cores, fonts } from "../../styles";

const styles = StyleSheet.create({
    buttonText: {
        color: cores.cor8,
        gap: 10,
        textAlign: 'center',
        ...fonts.bigBotton
    },
    saveButton: {
        alignItems: "center",
        borderRadius: 5,
        backgroundColor: cores.cor3,
        flex: 1,
        minWidth: 80,
        padding: 10
    },
    cancelButton: {
        alignItems: "center",
        backgroundColor: cores.cor4,
        borderRadius: 5,
        flex: 1,
        minWidth: '55%',
        padding: 10
    },
    closeButton: {
        alignItems: "center",
        backgroundColor: cores.cor1,
        borderColor: cores.cor9,
        borderWidth: 1,
        borderRadius: 5,
        flex: 1,
        minWidth: 100,
        padding: 10,
        width: '55%',
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
    loadingOverlay: {
        alignItems: "center",
        backgroundColor: cores.cor14,
        justifyContent: "center",
        ...StyleSheet.absoluteFillObject
    },
    modalContainer: {
        alignItems: "center",
        backgroundColor: cores.cor1,
        borderColor: cores.cor9,
        borderRadius: 10,
        borderWidth: 1,
        padding: 20,
        width: "80%"
    },
    modalOverlay: {
        alignItems: "center",
        backgroundColor: cores.cor13,
        display: 'flex',
        flex: 1,
        justifyContent: "center",
        marginTop: 'auto'
    },
    modalScroll: {
        maxHeight: 400,
        width: '100%'
    },
    title: {
        color: cores.cor9,
        marginVertical: 10,
        textAlign: "center",
        ...fonts.title
    }
});

export { cores };
export default styles;