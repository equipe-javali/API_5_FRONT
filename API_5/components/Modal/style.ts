import { StyleSheet } from "react-native";
import { cores, fonts } from "../../styles";

const styleDefault = StyleSheet.create({
    button: {
        alignItems: "center",
        borderRadius: 5,
        flex: 1,
        padding: 10
    }
});

const styles = StyleSheet.create({
    buttonText: {
        color: cores.cor7,
        gap: 10,
        textAlign: 'center',
        ...fonts.bigBotton
    },
    saveButton: {
        backgroundColor: cores.cor2,
        minWidth: 'auto',
        ...styleDefault.button
    },
    cancelButton: {
        backgroundColor: cores.cor4,
        minWidth: '55%',
        ...styleDefault.button
    },
    closeButton: {
        backgroundColor: cores.cor1,
        borderColor: cores.cor8,
        borderWidth: 1,
        minWidth: 100,
        width: '55%',
        ...styleDefault.button
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
        backgroundColor: cores.cor13,
        justifyContent: "center",
        ...StyleSheet.absoluteFillObject
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
        alignItems: "center",
        backgroundColor: cores.cor12,
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
        color: cores.cor8,
        marginVertical: 10,
        textAlign: "center",
        ...fonts.title
    }
});

export { cores };
export default styles;