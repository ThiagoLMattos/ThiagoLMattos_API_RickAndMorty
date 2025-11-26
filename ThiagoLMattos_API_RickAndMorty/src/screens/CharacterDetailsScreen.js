import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';

// cores
const COLORS = {
  primary: '#97ce4c',
  secondary: '#00b5cc',
  background: '#1e1e1e',
  cardBg: '#2a2a2a',
  text: '#ffffff',
  textSecondary: '#b0b0b0',
  alive: '#97ce4c',
  dead: '#ff4444',
  unknown: '#ffa500',
};

// traducões
const TRANSLATIONS = {
  status: {
    Alive: 'Vivo',
    Dead: 'Morto',
    unknown: 'Desconhecido',
  },
  gender: {
    Male: 'Masculino',
    Female: 'Feminino',
    Genderless: 'Sem Gênero',
    unknown: 'Desconhecido',
  },
  species: {
    Human: 'Humano',
    Alien: 'Alienígena',
    Humanoid: 'Humanóide',
    Robot: 'Robô',
    Cronenberg: 'Cronenberg',
    Animal: 'Animal',
    Disease: 'Doença',
    'Mythological Creature': 'Criatura Mitológica',
    Poopybutthole: 'Poopybutthole',
    unknown: 'Desconhecido',
  },
  labels: {
    status: 'Status',
    species: 'Espécie',
    gender: 'Gênero',
    origin: 'Origem',
    location: 'Localização Atual',
    episodes: 'Aparições',
    created: 'Adicionado em',
  },
};

const CharacterDetailsScreen = ({ route, navigation }) => {
  const { character } = route.params;
  const [episodesExpanded, setEpisodesExpanded] = useState(false);
  const [totalEpisodes, setTotalEpisodes] = useState(51);
  const [flashAnim] = useState(new Animated.Value(0));

  // sincronizar numeros de episodios da api (atualmente o maximo é 51, mas em caso da API ser atualizada, manter a sincronização)
  React.useEffect(() => {
    const fetchTotalEpisodes = async () => {
      try {
        const response = await fetch('https://rickandmortyapi.com/api/episode');
        const data = await response.json();
        setTotalEpisodes(data.info.count);
      } catch (error) {
        console.error('Error fetching total episodes:', error);
      }
    };
    fetchTotalEpisodes();
  }, []);

  const getStatusColor = (status) => {
    if (status === 'Alive') return COLORS.alive;
    if (status === 'Dead') return COLORS.dead;
    return COLORS.unknown;
  };

  const translateStatus = (status) => {
    if (!status) return 'Desconhecido';
    return TRANSLATIONS.status[status] || status;
  };

  const translateGender = (gender) => {
    if (!gender) return 'Desconhecido';
    return TRANSLATIONS.gender[gender] || gender;
  };

  const translateSpecies = (species) => {
    if (!species) return 'Desconhecido';
    return TRANSLATIONS.species[species] || species;
  };

  // formata a data para o comum do brasil
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // separa os personagens pela quantidade de episodios aparecidos
  const getCharacterType = (episodeCount) => {
    if (episodeCount >= 45) {
      return { label: 'Personagem Principal', color: COLORS.primary };
    } else if (episodeCount >= 15) {
      return { label: 'Personagem Secundário', color: COLORS.unknown };
    } else {
      return { label: 'Personagem Terciário', color: COLORS.textSecondary };
    }
  };

  // faz o fundo ter a cor dos status do personagem
  const getBackgroundTint = (status) => {
    if (status === 'Alive') return COLORS.alive;
    if (status === 'Dead') return COLORS.dead;
    return COLORS.unknown;
  };

  // separa os episodios de aparição (presentes na url) para mostrar
  const getEpisodeNumbers = () => {
    return character.episode.map(url => {
      const episodeNum = url.split('/').pop();
      return `#${episodeNum}`;
    });
  };

  const characterType = getCharacterType(character.episode.length);
  const episodeNumbers = getEpisodeNumbers();
  const TOTAL_EPISODES = totalEpisodes;

  // botão de voltar 
  const handleBackPress = () => {
    // animação do portal
    Animated.sequence([
      Animated.timing(flashAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(flashAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // timer pra dar tempo da animação
    setTimeout(() => {
      navigation.goBack();
    }, 200);
  };

  return (
    <ScrollView style={styles.container}>
      {/* animacao */}
      <Animated.View
        style={[
          styles.portalFlash,
          {
            opacity: flashAnim,
          },
        ]}
        pointerEvents="none"
      />

      {/* bg */}
      <View style={styles.portalBackground}>
        <View style={[styles.statusTint, { backgroundColor: getBackgroundTint(character.status) }]} />
        <View style={styles.portalCircle1} />
        <View style={styles.portalCircle2} />
      </View>

      {/* botao de voltar */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.8}
      >
        <Text style={styles.backButtonText}>‹ Voltar</Text>
      </TouchableOpacity>

      {/* imagem do personagem */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: character.image }} style={styles.image} />
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(character.status) }]} />
      </View>

      {/* DETALHES */}
      <View style={styles.detailsContainer}>
        {/* nome */}
        <Text style={styles.name}>{character.name}</Text>

        {/* status */}
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(character.status) }]}>
          <Text style={styles.statusBadgeText}>
            {translateStatus(character.status)}
          </Text>
        </View>

        {/* tipo */}
        <View style={[styles.typeBadge, { borderColor: characterType.color }]}>
          <Text style={[styles.typeBadgeText, { color: characterType.color }]}>
            {characterType.label}
          </Text>
        </View>

        {/* INFORMAÇÃO */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>📋 Informações Básicas</Text>

        {/*especie*/}
          <View style={styles.infoRow}>
            <Text style={styles.label}>{TRANSLATIONS.labels.species}</Text>
            <Text style={styles.value}>{translateSpecies(character.species)}</Text>
          </View>

        {/*genero*/}
          <View style={styles.infoRow}>
            <Text style={styles.label}>{TRANSLATIONS.labels.gender}</Text>
            <Text style={styles.value}>{translateGender(character.gender)}</Text>
          </View>
        </View>

        {/* LOCALIZAÇÃO */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>🌍 Localização</Text>

        {/* origem*/}
          <View style={styles.infoRow}>
            <Text style={styles.label}>{TRANSLATIONS.labels.origin}</Text>
            <Text style={styles.value} numberOfLines={2}>
              {character.origin.name || 'Desconhecido'}
            </Text>
          </View>

        {/* utlima aparicao*/}
          <View style={styles.infoRow}>
            <Text style={styles.label}>{TRANSLATIONS.labels.location}</Text>
            <Text style={styles.value} numberOfLines={2}>
              {character.location.name || 'Desconhecido'}
            </Text>
          </View>
        </View>

        {/* EPISÓDIOS */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>📺 Aparições</Text>

          <View style={styles.episodeContainer}>
            <Text style={styles.episodeNumber}>{character.episode.length}</Text>
            <Text style={styles.episodeText}>
              de {TOTAL_EPISODES} {character.episode.length === 1 ? 'episódio' : 'episódios'}
            </Text>
          </View>

          {/* barrinha de progressão */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(character.episode.length / TOTAL_EPISODES) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.progressText}>
            {((character.episode.length / TOTAL_EPISODES) * 100).toFixed(0)}% da série
          </Text>

          {/* lista de episodios (pegos da url) */}
          <TouchableOpacity
            style={styles.expandButton}
            onPress={() => setEpisodesExpanded(!episodesExpanded)}
            activeOpacity={0.7}
          >
            <Text style={styles.expandButtonText}>
              {episodesExpanded ? '▲ Esconder episódios' : '▼ Ver todos os episódios'}
            </Text>
          </TouchableOpacity>

          {episodesExpanded && (
            <View style={styles.episodeListContainer}>
              <Text style={styles.episodeListText}>
                {episodeNumbers.join(', ')}
              </Text>
            </View>
          )}
        </View>

        {/* data de criação */}
        <View style={styles.footerInfo}>
          <Text style={styles.footerText}>
            {TRANSLATIONS.labels.created}: {formatDate(character.created)}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  portalFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.primary,
    zIndex: 9999,
  },
  portalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  statusTint: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: COLORS.cardBg,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  portalCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: COLORS.secondary,
    opacity: 0.05,
  },
  portalCircle2: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: COLORS.primary,
    opacity: 0.04,
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 20,
    position: 'relative',
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 5,
    borderColor: COLORS.primary,
  },
  statusDot: {
    position: 'absolute',
    bottom: 30,
    right: '28%',
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  detailsContainer: {
    padding: 20,
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: 15,
  },
  statusBadge: {
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 25,
  },
  statusBadgeText: {
    color: COLORS.background,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  typeBadge: {
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.background,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
    flex: 1,
  },
  value: {
    fontSize: 15,
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  episodeContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  episodeNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  episodeText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  progressBarContainer: {
    width: '100%',
    height: 8,
    backgroundColor: COLORS.background,
    borderRadius: 4,
    overflow: 'hidden',
    marginTop: 15,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  progressText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 8,
  },
  expandButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    alignItems: 'center',
  },
  expandButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  episodeListContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: COLORS.background,
    borderRadius: 8,
  },
  episodeListText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 22,
  },
  footerInfo: {
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBg,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default CharacterDetailsScreen;