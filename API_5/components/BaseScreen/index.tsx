import React, { ReactNode, useEffect, useState, version } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import styles from "./style";
import { StatusBar } from "react-native";
import * as Font from 'expo-font';
import Loading from "../Loading";

interface BaseScreenProps {
    alternative?: boolean;
    children: ReactNode;
    header?: ReactNode;
};

export default function BaseScreen({ alternative, children, header }: BaseScreenProps) {
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


    return (
        <SafeAreaView style={styles.mainContainer}>
            <StatusBar hidden />
            {header}
            {alternative ?
                <View style={styles.container}>
                    {Loaded ?
                        children :
                        <Loading textLoading="Carregando fontes" />
                    }
                </View> :
                <ScrollView style={styles.container}>
                    {Loaded ?
                        <View style={styles.divContainer}>
                            {children}
                        </View> :
                        <Loading textLoading="Carregando fontes" />
                    }
                </ScrollView>
            }
        </SafeAreaView>
    );
};

export { Loading };