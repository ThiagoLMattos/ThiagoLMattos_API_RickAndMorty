import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.logo}
            />
            <Text>rick and morty wow carregando...</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },

})
export default LoadingScreen;