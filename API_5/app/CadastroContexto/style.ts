import { StyleSheet } from "react-native";
import { cores, fonts } from "../../styles";

const styles = StyleSheet.create({
    activeToggle: {
        backgroundColor: cores.cor8,
        borderRadius: 5,
        marginHorizontal: 5,
        padding: 10
    },
    activeToggleText: {
        color: cores.cor2,
        ...fonts.text4
    },
    button: {
        backgroundColor: cores.cor2,
        borderColor: cores.cor9,
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        minWidth: 'auto',
        width: "60%"
    },
    buttonText: {
        color: cores.cor9,
        textAlign: 'center',
        ...fonts.text4
    },
    btnBack: {
        alignItems: "flex-start",
        padding: 15
    },
    modalText: {
        color: cores.cor8,
        marginBottom: 20,
        textAlign: "center",
        ...fonts.text2
    },
    title: {
        color: cores.cor9,
        marginBottom: 20,
        textAlign: "center",
        ...fonts.title
    },
    toggle: {
        backgroundColor: cores.cor5,
        borderRadius: 5,
        marginHorizontal: 5,
        padding: 10,
    },
    toggleContainer: {
        display: 'flex',
        flexDirection: "row",
        flexWrap: 'wrap',
        justifyContent: "space-evenly",
        gap: 20,
        marginBottom: 20,
        width: '100%'
    },
    toggleText: {
        color: cores.cor7,
        ...fonts.text4
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
    }
});

export { cores };
export default styles;