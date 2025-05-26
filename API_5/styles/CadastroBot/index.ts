import { StyleSheet } from "react-native";
import { cor2, cor3, cor9 } from "../colors";
import { fonts } from "../fonts";

const stylesCadastroBot = StyleSheet.create({
    title: {
        alignSelf: "flex-start",
        color: cor9,
        marginBottom: 25,
        textAlign: "left",
        ...fonts.title
    },
    input: {
        alignItems: "center",
        backgroundColor: cor3,
        borderColor: cor9,
        borderRadius: 5,
        borderWidth: 1,
        color: cor9,
        height: 50,
        marginBottom: 20,
        padding: 15,
        width: "100%",
        ...fonts.text
    },
    button: {
        alignItems: "center",
        backgroundColor: cor2,
        borderColor: cor9,
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        minWidth: 'auto',
        width: "60%"
    },
    buttonText: {
        color: cor9,
        ...fonts.text4
    },
    errorText: {
        color: cor9,
        marginBottom: 20,
        textAlign: "center",
        ...fonts.text2
    },
});

export default stylesCadastroBot;