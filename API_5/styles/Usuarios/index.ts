import { StyleSheet } from "react-native";
import { fonts } from "../fonts";
import { cor3, cor4, cor9 } from "../colors";

const stylesUsuarios = StyleSheet.create({
    actions: {
        display: 'flex',
        flexDirection: 'row',
        gap: 20
    },
    addBtn: {
        borderColor: cor9,
        borderWidth: 1,
        borderRadius: 6,
        paddingVertical: 6,
        paddingHorizontal: 12
    },
    header: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    iconBtn: {
        backgroundColor: cor4,
        borderRadius: 6,
        padding: 8,
    },
    item: {
        alignItems: 'center',
        backgroundColor: cor3,
        borderRadius: 8,
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'space-between',
    },
    texts: {
        color: cor9,
        ...fonts.text4
    },
    titulo: {
        color: cor9,
        ...fonts.title
    },
});

export default stylesUsuarios;