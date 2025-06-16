import React from 'react';
import {Text, View} from 'react-native';
import {useLocalSearchParams} from 'expo-router';
import styles from "@/assets/styles/[id]Screen.styles";

export default function FlashcardDetails() {
    const {id} = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Flashcard Details</Text>
            <Text style={styles.subtitle}>ID: {id}</Text>
            <Text style={styles.text}>This page is under development.</Text>
        </View>
    );
}

