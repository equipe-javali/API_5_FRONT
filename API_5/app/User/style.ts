import { StyleSheet } from "react-native";
import { cores, fonts } from "../../styles";

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: cores.cor3,
        borderColor: cores.cor8,
        borderRadius: 10,
        borderWidth: 1,
        maxWidth: "100%",
        paddingHorizontal: 50,
        paddingVertical: 12,
        width: 200
    },
    buttonContainer: {
        alignItems: 'center',
        gap: 20,
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
        maxWidth: "100%",
        paddingHorizontal: 50,
        paddingVertical: 12,
        width: 200
    },
    cancelButtonText: {
        color: cores.cor6,
        textAlign: 'center',
        ...fonts.bigBotton
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3a3a3c',
        borderRadius: 15,
        paddingHorizontal: 10,
        paddingVertical: 5,
        margin: 5
    },
    chipText: {
        color: cores.cor9,
        marginRight: 5,
        fontSize: 14,
        fontFamily: "Roboto_400Regular"
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: "#282828",
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 5
    },
    dropdownButtonText: {
        color: cores.cor9,
        fontSize: 16,
        fontFamily: "Roboto_400Regular"
    },
    dropdownList: {
        backgroundColor: '#333',
        borderWidth: 1,
        borderColor: '#444',
        borderRadius: 5,
        marginTop: 5,
        width: '100%',
        zIndex: 1000,
        position: 'absolute',
        top: 80
    },
    dropdownItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#444'
    },
    dropdownItemText: {
        color: cores.cor9,
        fontSize: 16,
        fontFamily: "Roboto_400Regular"
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
        width: '100%',
        ...fonts.text
    },
    invalido: {
        color: cores.cor7
    },
    labelText: {
        color: cores.cor9,
        fontSize: 16,
        marginBottom: 8,
        fontFamily: "Roboto_400Regular"
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
    title: {
        color: cores.cor9,
        marginHorizontal: 'auto',
        ...fonts.title
    },
    valido: {
        color: cores.cor10
    }
});

export { cores };
export default styles;