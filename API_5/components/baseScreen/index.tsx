import React, { ReactNode, useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import styles, { cores } from "./style";
import { StatusBar } from "react-native";
import * as Font from 'expo-font';

interface BaseScreenProps {
    children: ReactNode;
    header?: ReactNode;
    loading?: {
        status: boolean;
        set: (status: boolean) => void;
    };
    textReloading?: {
        text: string;
        set: (text: string) => void;
    }
};

export default function BaseScreen({ children, header, loading, textReloading }: BaseScreenProps) {
    const [Loaded, setLoaded] = useState(false);
    const [textLoading, setTextLoading] = useState<string | null>(null);

    useEffect(() => {
        const loadFonts = async () => {
            setTextLoading("Carregando fontes...")
            await Font.loadAsync({
                Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
            });
            setLoaded(true);
        };
        loadFonts();
    }, []);

    useEffect(() => {
        if (loading) {
            setLoaded(!loading.status)
        }
        if (textReloading) {
            setTextLoading(textReloading.text)
        }
    }, [loading, textReloading])

    useEffect(() => {
        if (Loaded) {
            setTextLoading(null)
        }
    }, [Loaded])

    return (
        <ScrollView style={styles.container}>
            <StatusBar hidden />
            {header}
            {Loaded ?
                <View style={styles.divContainer}>
                    {children}
                </View> :
                <View style={styles.divContainer}>
                    <ActivityIndicator size='large' color={cores.cor9} style={styles.iconLoading} />
                    {textLoading &&
                        <Text style={styles.textReload}>{textLoading}</Text>
                    }
                </View>
            }
        </ScrollView>
    );
};