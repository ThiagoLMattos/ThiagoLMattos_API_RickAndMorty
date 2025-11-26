import { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Animated,
} from 'react-native';

// variaveis pra deixar o codigo mais facil (eu fiquei mt confuso fazendo)
const API_URL = 'https://rickandmortyapi.com/api/character'; 

// Cores do tema Rick and Morty 🎨
const COLORS = {
  primary: '#97ce4c', // Verde do Rick and Morty
  secondary: '#00b5cc', // Azul portal
  background: '#1e1e1e', // Preto
  cardBg: '#2a2a2a', // Cinza escuro
  text: '#ffffff', // Branco
  textSecondary: '#b0b0b0', // Cinza claro
  alive: '#97ce4c', // Verde pra vivo
  dead: '#ff4444', // Vermelho pra morto
  unknown: '#ffa500', // Laranja pra desconhecido
};

// Traduções para português 🇧🇷
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
};

const CharacterList = ({ navigation }) => {
  // muitos useState pq é mt bom
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flashAnim] = useState(new Animated.Value(0)); // animação do flash de portal
  const [page, setPage] = useState(1); // página atual
  const [hasMore, setHasMore] = useState(true); // tem mais personagens pra carregar?
  const [loadingMore, setLoadingMore] = useState(false); // carregando mais personagens?

  // eu inicio a função assim que carregar a tela (a função ta embaixo)
  useEffect(() => {
    fetchCharacters();
  }, []);

  // chamar a api
  const fetchCharacters = async (query = '', pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      
      const url = query 
        ? `${API_URL}/?name=${query}&page=${pageNum}`
        : `${API_URL}/?page=${pageNum}`;
      
      const response = await fetch(url); // chama a api
      const data = await response.json(); // chama os dados
      
      if (pageNum === 1) {
        setCharacters(data.results || []); // primeira página, substitui tudo
      } else {
        setCharacters(prev => [...prev, ...(data.results || [])]); // adiciona mais personagens
      }
      
      // verifica se tem mais páginas
      setHasMore(!!data.info?.next);
      
    } catch (error) {
      console.error('Error fetching characters:', error); // se der erro (não vai) avisa
      if (pageNum === 1) {
        setCharacters([]); // se der erro (não vai) limpa os dados
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // pegar a corzinha (ta la em cima)
  const getStatusColor = (status) => {
    if (status === 'Alive') return COLORS.alive;
    if (status === 'Dead') return COLORS.dead;
    return COLORS.unknown;
  };

  // carregar mais personagens quando chegar no final da lista
  const loadMoreCharacters = () => {
    if (!loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchCharacters('', nextPage);
    }
  };

  // traduzir o status pro português
  const translateStatus = (status) => {
    if (!status) return 'Desconhecido';
    return TRANSLATIONS.status[status] || status;
  };

  // traduzir o gênero pro português
  const translateGender = (gender) => {
    if (!gender) return 'Desconhecido';
    return TRANSLATIONS.gender[gender] || gender;
  };

  // traduzir a espécie pro português
  const translateSpecies = (species) => {
    if (!species) return 'Desconhecido';
    return TRANSLATIONS.species[species] || species;
  };

  // ir pra tela de detalhes com efeito de portal
  const handleCharacterPress = (character) => {
    // Animar o flash de portal
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

    // Navegar depois de um delay pra dar tempo do flash
    setTimeout(() => {
      navigation.navigate('CharacterDetails', { character });
    }, 200);
  };

  // funçao pra carregar o personagem
  const renderCharacterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.characterCard}
      onPress={() => handleCharacterPress(item)} // isso daq faz ficar escurinho quando segura
      activeOpacity={0.8}
    >
      {/* Container da imagem com o ponto de status */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.image }}  // pega a imagem
          style={styles.characterImage} 
        />
        {/* Bolinha colorida indicando o status */}
        <View style={[styles.statusDot, { backgroundColor: getStatusColor(item.status) }]} />
      </View>
      
      <View style={styles.characterInfo}>
        <Text style={styles.characterName} numberOfLines={1}>
          {item.name || 'Desconhecido'}
        </Text>
        
        {/* Linha da espécie */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Espécie:</Text>
          <Text style={styles.characterSpecies}>{translateSpecies(item.species)}</Text>
        </View>
        
        {/* Linha do status */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Status:</Text>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {translateStatus(item.status)}
          </Text>
        </View>

        {/* Linha do gênero */}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Gênero:</Text>
          <Text style={styles.genderText}>{translateGender(item.gender)}</Text>
        </View>
      </View>

      {/* Setinha pra mostrar que é clicável */}
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}>›</Text>
      </View>
    </TouchableOpacity>
  );

  // footer da lista (loading mais personagens)
  const renderFooter = () => {
    if (!loadingMore) return null;
    
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.primary} />
        <Text style={styles.footerText}>Carregando mais personagens...</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.portalLoader}>
          <ActivityIndicator size="large" color={COLORS.primary} /> {/* MINHA tela de loading se tiver demorando pra carregar */}
        </View>
        <Text style={styles.loadingText}>Carregando personagens...</Text>
        <Text style={styles.loadingSubtext}>Abrindo portal interdimensional 🌀</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Flash de portal quando clica */}
      <Animated.View
        style={[
          styles.portalFlash,
          {
            opacity: flashAnim,
          },
        ]}
        pointerEvents="none"
      />

      {/* Efeito de portal no fundo */}
      <View style={styles.portalBackground}>
        <View style={styles.portalCircle1} />
        <View style={styles.portalCircle2} />
        <View style={styles.portalCircle3} />
      </View>

      {/* Header com título */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Rick and Morty</Text>
        <Text style={styles.headerSubtitle}>Multiverso de Personagens</Text>
      </View>

      {/* lista dos personagens */}
      <FlatList
        data={characters}
        renderItem={renderCharacterItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContainer,
          characters.length === 0 && styles.emptyListContainer
        ]}
        onEndReached={loadMoreCharacters} // quando chegar no final, carrega mais
        onEndReachedThreshold={0.5} // começa a carregar quando tiver 50% do final
        ListFooterComponent={renderFooter} // mostra o loading no final
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🛸</Text>
            <Text style={styles.emptyText}>
              Nenhum personagem encontrado
            </Text>
            <Text style={styles.emptySubtext}>
              Ops! Algo deu errado
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    position: 'relative',
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
  portalCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
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
    opacity: 0.03,
  },
  portalCircle3: {
    position: 'absolute',
    top: '40%',
    right: -200,
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: COLORS.secondary,
    opacity: 0.04,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  portalLoader: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.secondary,
    opacity: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  loadingSubtext: {
    marginTop: 5,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 15,
  },
  characterCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    padding: 15,
    marginBottom: 15,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
  },
  characterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: COLORS.primary,
  },
  statusDot: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: COLORS.cardBg,
  },
  characterInfo: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginRight: 6,
    fontWeight: '600',
  },
  characterSpecies: {
    fontSize: 13,
    color: COLORS.text,
  },
  statusText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  genderText: {
    fontSize: 13,
    color: COLORS.text,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  arrow: {
    fontSize: 30,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});

export default CharacterList;