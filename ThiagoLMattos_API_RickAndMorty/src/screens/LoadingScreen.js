import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Image } from 'react-native';

// cores
const COLORS = {
    primary: '#A9D5EB',
    secondary: '#ffffff',
    thirdiary: '#f0e14a',
    background: '#1e1e1e',
    text: '#ffffff',
    green: '#97ce4c',
};

// palavras de loading
const LOADING_PHRASES = [
    'Abrindo portal interdimensional...',
    'Calibrando pistola de portais...',
    'Procurando pela dimensão C-137...',
    'Wubba Lubba Dub Dub!',
    'Carregando Plumbus...',
    'Evitando Cronenbergs...',
    'Sincronizando multiverso...',
    'Ligando para Bird Person...',
    'Preparando Pickle Rick...',
    'Visitando a Cidadela...',
    'Me dá MB Rafael...',
];

const LoadingScreen = ({ onFinish }) => {
    // animações
    const portalSpin = useRef(new Animated.Value(0)).current;
    const textRotate = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const [currentPhrase, setCurrentPhrase] = useState(LOADING_PHRASES[0]);

    useEffect(() => {
        // fade
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start();

        // animação de giro do portal 
        Animated.loop(
            Animated.timing(portalSpin, {
                toValue: 1,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // animação de giro do texto
        Animated.loop(
            Animated.timing(textRotate, {
                toValue: 1,
                duration: 10000,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        ).start();

        // muda a frase aleatoria a cada 1.5 segundos
        const phraseInterval = setInterval(() => {
            const randomPhrase = LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)];
            setCurrentPhrase(randomPhrase);
        }, 1500);

        // termina depois de 10 segundos
        const finishTimer = setTimeout(() => {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start(() => {
                if (onFinish) onFinish();
            });
        }, 10000);

        return () => {
            clearInterval(phraseInterval);
            clearTimeout(finishTimer);
        };
    }, []);

    // interpolação (construção de um novo conjunto de dados a partir de um conjunto discreto de dados pontuais (descrição wikipedia)) de rotação do portal
    const portalRotation = portalSpin.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    // as letras que vao girar em volta do portal
    const letters = 'RICK AND MORTY '.split(''); // espaço no final para espaçamento
    const radius = 140; // distancia das letras
    const extraGap = 20; // ajuste do espaçamento
    const step = (360 - extraGap) / letters.length; // angulo entre cada letra

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            {/* circulos do background */}
            <View style={styles.backgroundCircle1} />
            <View style={styles.backgroundCircle2} />

            <View style={styles.portalWithTextContainer}>
                {/* imagem do portal */}
                <Animated.View
                    style={[
                        styles.portalContainer,
                        { transform: [{ rotate: portalRotation }] },
                    ]}
                >
                    <Image
                        source={{ uri: 'https://rick-and-morty-api-woad.vercel.app/assets/img/portal.png' }}
                        style={styles.portalImage}
                        resizeMode="contain"
                    />
                </Animated.View>

                {/* letras */}
                <View style={styles.textCircle}>
                    {letters.map((ch, i) => {
                        // ch = current character, i = index
                        const baseAngle = i * step
                        // rotação da letra (começa no ângulo base e gira 360 graus)
                        const rotate = textRotate.interpolate({
                            inputRange: [0, 1],
                            outputRange: [`${baseAngle}deg`, `${baseAngle + 360}deg`],
                        });
                        // rotação inversa para manter a letra na posição correta
                        const inverse = textRotate.interpolate({
                            inputRange: [0, 1],
                            outputRange: [`-${baseAngle}deg`, `-${baseAngle + 360}deg`],
                        });

                        // coloração das letras pelo índice
                        const color =
                            i <= 3 ? COLORS.primary :
                                (i >= 4 && i <= 7) ? COLORS.secondary :
                                    COLORS.thirdiary;

                        return (
                            <Animated.Text
                                key={i}
                                style={[
                                    styles.letter,
                                    { color },
                                    {
                                        transform: [
                                            { rotate },              // rotaciona a letra em volta do centro
                                            { translateY: -radius }, // afasta a letra do centro
                                            { rotate: inverse },     // rotaciona a letra de volta para ficar legível
                                        ],
                                    },
                                ]}
                            >
                                {ch} {/* espaço extra para melhor espaçamento */}
                            </Animated.Text>
                        );
                    })}
                </View>
            </View>

            {/* frases aleatorias */}
            <View style={styles.phraseContainer}>
                <Text style={styles.phraseText}>{currentPhrase}</Text>
                <View style={styles.dotsContainer}>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.dot}>•</Text>
                </View>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    backgroundCircle1: {
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: COLORS.secondary,
        opacity: 0.05,
    },
    backgroundCircle2: {
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: COLORS.secondary,
        opacity: 0.08,
    },
    portalWithTextContainer: {
        width: 350,
        height: 350,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    portalContainer: {
        width: 250,
        height: 250,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    portalImage: {
        width: '100%',
        height: '100%',
    },
    textCircle: {
        position: 'absolute',
        width: 350,
        height: 350,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        width: 28,
    },
    phraseContainer: {
        position: 'absolute',
        bottom: 100,
        alignItems: 'center',
    },
    phraseText: {
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 10,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    dot: {
        fontSize: 20,
        color: COLORS.green,
    },
});

export default LoadingScreen;