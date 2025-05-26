import { useFonts, Roboto_400Regular, Roboto_700Bold } from "@expo-google-fonts/roboto";
import { StyleSheet } from "react-native";


export const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#282828'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#444',
        padding: 16
    },
    backButton: {
        padding: 8
    },
    headerTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center'
    },
    placeholder: {
        width: 40
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        color: '#ccc',
        fontSize: 16,
        marginTop: 12
    },
    chatContainer: {
        backgroundColor: 'red',
        height: '100%',
        flex: 1,
    },
    messagesContainer: {
        padding: 10,
        paddingBottom: 16
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
        marginVertical: 4,
        maxWidth: '80%',
        borderWidth: 1
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#282828',
        borderColor: '#B8B8B8'
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#212121',
        borderColor: '#333'
    },
    messageText: {
        color: '#F5F5F5',
        fontSize: 16
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: '#333',
        borderTopWidth: 1,
        borderTopColor: '#444'
    },
    input: {
        flex: 1,
        backgroundColor: '#222',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        color: '#fff',
        marginRight: 8
    },
    sendButton: {
        backgroundColor: '#007bff',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sectionHeaderContainer: {
        alignItems: 'center',
        marginVertical: 8
    },
    sectionHeader: {
        backgroundColor: '#555',
        color: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 8,
        fontSize: 12
    },
    dateLabel: {
        fontSize: 10,
        color: '#888',
        marginBottom: 4,
        alignSelf: 'flex-end'
    }
});

export default styles;