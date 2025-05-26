import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import styles, { cores } from "./style";

interface LoadingProps {
    textLoading?: string;
};

export default function Loading({ textLoading }: LoadingProps) {
    return (
        <View style={styles.divContainer}>
            <ActivityIndicator size='large' color={cores.cor9} style={styles.iconLoading} />
            {textLoading &&
                <Text style={styles.textReload}>{textLoading}...</Text>
            }
        </View>
    );
};