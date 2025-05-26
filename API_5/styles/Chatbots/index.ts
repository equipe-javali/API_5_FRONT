import { StyleSheet } from "react-native";
import { cor4, cor5, cor6, cor7, cor9 } from "../colors";
import { fonts } from "../fonts";


const stylesChatbots = StyleSheet.create({
    buttonRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        marginTop: 10
    },
    contextInput: {
        borderColor: cor9,
        borderRadius: 5,
        borderWidth: 1,
        color: cor9,
        marginBottom: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        width: "100%"
    },
    editButton: {
        alignItems: "center",
        alignSelf: "flex-start",
        backgroundColor: cor6,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "center",
        marginTop: 10,
        marginRight: 15,
        minWidth: 120,
        minHeight: 40,
        paddingHorizontal: 15,
        paddingVertical: 8
    },
    editButtonText: {
        color: cor9,
        fontSize: 14,
        marginLeft: 5
    },
    emptyText: {
        color: cor6,
        fontSize: 18,
        marginTop: 20,
        textAlign: "center"
    },
    input: {
        backgroundColor: cor5,
        borderRadius: 5,
        color: cor9,
        marginBottom: 10,
        padding: 10,
        width: "100%"
    },
    itemContainer: {
        backgroundColor: cor4,
        borderRadius: 5,
        marginBottom: 10,
        padding: 15
    },
    itemHeader: {
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
    },
    itemTitle: {
        color: cor9,
        ...fonts.text2
    },
    itemFrases: {
        color: cor7,
        fontSize: 16,
        marginTop: 5
    },
    itemDetails: {
        borderTopWidth: 1,
        borderTopColor: cor5,
        marginTop: 10,
        paddingTop: 10
    },
    itemText: {
        color: cor7,
        fontSize: 14,
        marginTop: 3
    }
});

export default stylesChatbots;