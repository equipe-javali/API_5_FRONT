import React, { ReactNode, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import styles from "./style";
import { StatusBar } from "react-native";
import * as Font from 'expo-font';
import Loading from "../Loading";

interface BaseScreenProps {
    children: ReactNode;
    header?: ReactNode;
};

export default function BaseScreen({ children, header }: BaseScreenProps) {
    const [Loaded, setLoaded] = useState(false);

    useEffect(() => {
        const loadFonts = async () => {
            await Font.loadAsync({
                Roboto: require('../../assets/fonts/Roboto-Regular.ttf'),
            });
            setLoaded(true);
        };
        loadFonts();
    }, []);

    useEffect(() => {
        if (Loaded) {
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
                <Loading textLoading="fontes" />
            }
        </ScrollView>
    );
};

export { Loading };