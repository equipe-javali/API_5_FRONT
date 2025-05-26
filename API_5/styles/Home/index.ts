import { StyleSheet } from "react-native";
import { cor2, cor9 } from "../colors";
import { fonts } from "../fonts";

const stylesHome = StyleSheet.create({
    card: {
        alignItems: 'center',
        backgroundColor: cor2,
        borderRadius: 10,
        display: 'flex',
        gap: 10,
        height: 120,
        justifyContent: 'center',
        width: '100%',
    },
    cardContainers: {
        alignItems: 'center',
        display: 'flex',
        gap: 10,
        justifyContent: 'center',
    },
    cardText: {
        color: cor9,
        ...fonts.text2
    }
});

export default stylesHome;