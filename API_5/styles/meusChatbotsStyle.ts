import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { StyleSheet } from "react-native";


export const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
});

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#282828", padding: 20 },
    title: { fontSize: 24, color: "#fff", textAlign: "center", marginVertical: 10 },
    itemContainer: {
        backgroundColor: "#444",
        padding: 15,
        borderRadius: 5,
        marginBottom: 10,
    },
    itemHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    itemTitle: { fontSize: 20, color: "#fff", fontWeight: "bold" },
    itemFrases: { fontSize: 16, color: "#ccc", marginTop: 5 },
    itemDetails: { marginTop: 10, borderTopWidth: 1, borderTopColor: "#666", paddingTop: 10 },
    itemText: { fontSize: 14, color: "#ccc", marginTop: 3 },
    emptyText: { fontSize: 18, color: "gray", textAlign: "center", marginTop: 20 },


    editButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#282828",
        padding: 8,
        borderRadius: 5,
        marginTop: 10,
        marginRight: 15, // Adiciona espaço horizontal entre os botões
        alignSelf: "flex-start",
        paddingHorizontal: 15,
        minWidth: 120,
        minHeight: 40,
        justifyContent: "center",
    },


    editButtonText: { color: "#fff", marginLeft: 5, fontSize: 14 },
    modalTitle: {
        fontSize: 20,
        color: "#fff", // Cor do texto do título
        marginBottom: 10,
    },
    input: {
        width: "100%",
        backgroundColor: "#555", // Cor de fundo do campo de entrada
        color: "#fff", // Cor do texto no campo de entrada
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",

    },
    saveButton: {
        flex: 1,
        backgroundColor: "#282828", // Cor verde para o botão "Salvar"
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
        alignItems: "center",
        maxWidth: 100, // Limita a largura do botão "Salvar"
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "#3E3E3E", // Cor vermelha para o botão "Cancelar"
        padding: 10,
        borderRadius: 5,
        marginLeft: 5,
        alignItems: "center",
        // maxWidth: 100, // Limita a largura do botão "Cancelar"
    },
    buttonText: {
        color: "#fff", // Cor do texto dos botões
        fontSize: 16,
    },
    contextItem: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: "#555",
        borderRadius: 5,
    },
    contextQuestion: {
        fontSize: 16,
        color: "#fff",
        marginBottom: 5,
    },
    contextAnswer: {
        fontSize: 16,
        color: "#fff",
        marginTop: 10,
        marginBottom: 5,
    },
    scrollContainer: {
        maxHeight: 300,
        marginBottom: 10,
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        flexWrap: "wrap",
        marginTop: 10,
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "#282828",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#fff"
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        justifyContent: "center",
        alignItems: "center"
    },
    contextInput: {
        width: "100%",
        borderColor: "#fff",
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
        borderRadius: 5,
        color: "#fff",
        padding: 10
    },
    button: {
        backgroundColor: "#F5F5F5",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginVertical: 10,
        width: "100%"
    },
    actionButtonText: {
        color: "#212121",
        fontSize: 16
    },
    closeButton: {
        padding: 10,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: "#fff",
        backgroundColor: "#282828",
        alignItems: "center",
        width: "100%"
    },
    closeButtonText: {
        color: "#fff",
        fontSize: 16
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default styles;