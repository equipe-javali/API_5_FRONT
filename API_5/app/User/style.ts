import { StyleSheet } from "react-native";
import { cores, fonts } from "../../styles";

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: cores.cor3,
        borderColor: cores.cor8,
        borderRadius: 10,
        borderWidth: 1,
        marginVertical: 20,
        maxWidth: "100%",
        paddingHorizontal: 50,
        paddingVertical: 12,
        width: 150
    },
    buttonContainer: {
        alignItems: 'center',
        display: "flex",
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        width: '100%'
    },
    buttonText: {
        color: cores.cor8,
        textAlign: 'center',
        ...fonts.bigBotton
    },
    cancelButton: {
        alignItems: 'center',
        backgroundColor: cores.cor3,
        borderColor: cores.cor6,
        borderRadius: 10,
        borderWidth: 1,
        marginVertical: 20,
        maxWidth: "100%",
        paddingHorizontal: 50,
        paddingVertical: 12,
        width: 150
    },
    cancelButtonText: {
        color: cores.cor6,
        textAlign: 'center',
        ...fonts.bigBotton
    },
    input: {
        alignItems: 'center',
        backgroundColor: cores.cor3,
        borderColor: cores.cor8,
        borderRadius: 5,
        borderWidth: 1.1,
        color: cores.cor9,
        marginBottom: 12,
        maxWidth: '100%',
        paddingHorizontal: 10,
        paddingVertical: 5,
        width: 400,
        ...fonts.text
    },
    invalido: {
        color: cores.cor7
    },
    modalText: {
        color: cores.cor9,
        marginBottom: 20,
        textAlign: "center",
        ...fonts.text
    },
    senhaDicasContainer: {
        marginTop: 10,
        marginBottom: 10
    },
    senhaDica: {
        fontSize: 14,
        fontFamily: 'Roboto'
    },
    valido: {
        color: cores.cor10
    }
});

export { cores };
export default styles;