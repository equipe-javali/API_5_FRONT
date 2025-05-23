import React, { ReactNode, useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import styles from "./style";
import { StatusBar } from "react-native";
import * as Font from 'expo-font';

interface BaseScreenProps {
    children: ReactNode;
    header?: ReactNode;
};

export default function BaseScreen({ children, header }: BaseScreenProps) {
    const [fontLoaded, setFontLoaded] = useState(false);
    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
            });
            setFontLoaded(true);
        };
        loadFonts();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <StatusBar hidden />
            {header}
            {fontLoaded ?
                <View style={styles.divContainer}>
                    {children}
                </View> :
                <Text style={styles.textReload}>Carregando fontes...</Text>
            }
        </ScrollView>
    );
};