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
        width: 300
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
    chatbotBadge: {
        borderRadius: 5,
        paddingVertical: 5,
        paddingHorizontal: 10
    },
    chatbotBadgeText: {
        color: cores.cor9,
        ...fonts.text5
    },
    chatbotCard: {
        backgroundColor: cores.cor4,
        borderRadius: 5,
        flex: 1,
        marginBottom: 10,
        padding: 15
    },
    chatbotDescription: {
        color: cores.cor7,
        marginTop: 5,
        ...fonts.text4
    },
    chatbotHeader: {
        alignItems: "center",
        flexDirection: "row",
        flexWrap: 'wrap',
        gap: 5,
        justifyContent: "space-between"
    },
    chatbotName: {
        color: cores.cor9,
        ...fonts.title
    },
    chatAction: {
        alignSelf: "flex-start",
        alignItems: "center",
        backgroundColor: "#007BFF",
        borderRadius: 5,
        flexDirection: "row",
        marginTop: 10,
        padding: 8
    },
    chatActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    chatActionText: {
        color: cores.cor9,
        fontSize: 14,
        marginLeft: 5
    },
    chatContainer: {
        width: '100%'
    },
    emptyContainer: {
        alignItems: "center",
        flex: 1,
        justifyContent: "center"
    },
    emptyText: {
        color: cores.cor9,
        textAlign: "center",
        marginTop: 20,
        ...fonts.text2
    },
    header: {
        alignItems: "center",
        backgroundColor: cores.cor2,
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    headerIconPlaceholder: {
        alignItems: "center",
        height: 32,
        justifyContent: "center",
        width: 32
    },
    headerTitle: {
        color: cores.cor9,
        marginHorizontal: 'auto',
        ...fonts.title
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
    image: {
        maxHeight: 150,
        maxWidth: 275,
        width: "100%"
    },
    logoutButton: {
        padding: 8
    },
    modalText: {
        color: cores.cor9,
        marginBottom: 20,
        textAlign: "center",
        ...fonts.text
    },
    registerContainer: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%'
    },
    registerLink: {
        color: cores.cor6,
        textDecorationLine: 'underline',
        ...fonts.text3
    },
    registerText: {
        color: cores.cor8,
        ...fonts.text3
    },
    senhaDicasContainer: {
        marginTop: 10,
        marginBottom: 10
    },
    senhaDica: {
        fontSize: 14,
        fontFamily: 'Roboto'
    },
    titleScreen: {
        color: cores.cor9,
        marginHorizontal: 'auto',
        marginBottom: 10,
        ...fonts.title
    },
    valido: {
        color: cores.cor10
    }
});

export { cores };
export default styles;