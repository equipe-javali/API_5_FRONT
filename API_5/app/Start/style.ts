import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { StyleSheet } from "react-native";

export const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
});

const styles = StyleSheet.create({
    containerHome: {
        flex: 1,
        backgroundColor: "#282828",
        paddingHorizontal: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2E2E2E',
        padding: 24,
    },
    content: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 24,
        color: "#fff",
        textAlign: "center",
        marginVertical: 10
    },
    itemContainer: {
        backgroundColor: "#444",
        padding: 15,
        borderRadius: 5,
        marginBottom: 10
    },
    itemHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    itemTitle: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold"
    },
    itemFrases: {
        fontSize: 16,
        color: "#ccc",
        marginTop: 5
    },
    itemDetails: {
        marginTop: 10,
        borderTopWidth: 1,
        borderTopColor: "#666",
        paddingTop: 10
    },
    itemText: {
        fontSize: 14,
        color: "#ccc",
        marginTop: 3
    },
    emptyText: {
        fontSize: 18,
        color: "gray",
        textAlign: "center",
        marginTop: 20
    },
    chatButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007BFF",
        padding: 8,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: "flex-start",
    },
    chatButtonText: {
        color: "#fff",
        marginLeft: 5,
        fontSize: 14
    },
    chatbotCard: {
        backgroundColor: "#444",
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    chatbotHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    chatbotName: {
        fontSize: 20,
        color: "#fff",
        fontWeight: "bold",
    },
    chatbotBadge: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    chatbotBadgeText: {
        color: "#fff",
        fontSize: 14,
    },
    chatbotDescription: {
        fontSize: 16,
        color: "#ccc",
        marginTop: 5,
    },
    chatActions: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    chatActionText: {
        color: "#fff",
        marginLeft: 5,
        fontSize: 14,
    },
    fab: {
        position: "absolute",
        bottom: 20,
        right: 20,
        backgroundColor: "#007BFF",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        elevation: 5,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonHome: {
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: "center",
        minWidth: 150,
    },
    button: {
        borderWidth: 1,
        borderColor: '#F5F5F5',
        backgroundColor: '#282828',
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 50,
        marginTop: 20,
        minWidth: 150,
        alignItems: 'center',
    },
    buttonTextHome: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    buttonText: {
        color: '#F5F5F5',
        fontSize: 24,
        fontFamily: 'Roboto',
        textAlign: 'center',
    },
    chatAction: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#007BFF",
        padding: 8,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: "flex-start",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#1e1e1e",
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: -20,
        marginBottom: 10,
        marginTop: 0
    },
    headerTitle: {
        flex: 1,
        color: "#fff",
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    logoutButton: {
        padding: 8,
    },
    headerIconPlaceholder: {
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
    },
    input: {
        paddingHorizontal: 24,
        paddingVertical: 10,
        fontSize: 24,
        width: '100%',
        borderColor: '#F5F5F5',
        borderWidth: 1,
        marginBottom: 12,
        borderRadius: 5,
        color: '#111',
        backgroundColor: '#F5F5F5',
        fontFamily: 'Roboto',
    },
    image: {
        width: 250,
        height: 150,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#000",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff",
    },
    modalText: {
        fontSize: 18,
        fontFamily: "Roboto_400Regular",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center",
    },
    closeButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#000",
        alignItems: "center",
        minWidth: 100,
    },
    registerContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    registerText: {
        color: '#F5F5F5',
        fontSize: 16,
        fontFamily: 'Roboto',
    },
    registerLink: {
        color: '#B8B8B8',
        fontSize: 16,
        fontFamily: 'Roboto',
        textDecorationLine: 'underline'
    },
    errorText: {
        color: "white"
    },
    successText: {
        color: "white"
    },
    senhaDicasContainer: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10
    },
    senhaDica: {
        fontSize: 14,
        fontFamily: 'Roboto'
    },
    valido: {
        color: 'lightgreen'
    },
    invalido: {
        color: 'gray'
    }
});

export default styles;