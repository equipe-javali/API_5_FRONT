import { StyleSheet } from 'react-native';
import { cores, fonts } from '../../styles';

const styles = StyleSheet.create({
    backButton: {
        padding: 8
    },
    botMessage: {
        alignSelf: 'flex-start',
        backgroundColor: cores.cor2,
        borderColor: cores.cor4
    },
    chatContainer: {
        height: '100%',
        flex: 1,
    },
    dateLabel: {
        alignSelf: 'flex-end',
        color: cores.cor6,
        marginBottom: 4,
        ...fonts.text5
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: cores.cor2,
        padding: 16
    },
    headerTitle: {
        color: cores.cor9,
        flex: 1,
        textAlign: 'center',
        ...fonts.title
    },
    input: {
        backgroundColor: cores.cor2,
        borderRadius: 20,
        color: cores.cor9,
        flex: 1,
        marginRight: 8,
        paddingHorizontal: 16,
        paddingVertical: 8,
        ...fonts.text5
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 8,
        backgroundColor: cores.cor3,
        borderTopWidth: 1,
        borderTopColor: cores.cor4
    },
    messageBubble: {
        padding: 12,
        borderRadius: 16,
        marginVertical: 4,
        maxWidth: '80%',
        borderWidth: 1
    },
    messagesContainer: {
        padding: 10,
        paddingBottom: 16
    },
    messageText: {
        color: cores.cor8,
        ...fonts.text4
    },
    placeholder: {
        width: 40
    },
    sendButton: {
        alignItems: 'center',
        backgroundColor: cores.cor11,
        borderRadius: 44,
        height: 44,
        justifyContent: 'center',
        width: 44,
    },
    sectionHeader: {
        backgroundColor: cores.cor5,
        borderRadius: 8,
        color: cores.cor9,
        paddingHorizontal: 12,
        paddingVertical: 4,
        ...fonts.text5
    },
    sectionHeaderContainer: {
        alignItems: 'center',
        marginVertical: 8
    },
    userMessage: {
        alignSelf: 'flex-end',
        backgroundColor: cores.cor3,
        borderColor: cores.cor6
    }
});

export { cores };
export default styles;