import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  TextInput,
} from 'react-native';

const CharacterList = ({ navigation }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCharacters();
  }, []);

  const fetchCharacters = async (query = '') => {
    try {
      setLoading(true);
      const url = query 
        ? `https://rickandmortyapi.com/api/character/?name=${query}`
        : 'https://rickandmortyapi.com/api/character';
      
      const response = await fetch(url);
      const data = await response.json();
      setCharacters(data.results || []);
    } catch (error) {
      console.error('Error fetching characters:', error);
      setCharacters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    fetchCharacters(text);
  };

  const renderCharacterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.characterCard}
      onPress={() => navigation.navigate('CharacterDetail', { character: item })}
    >
      <Image source={{ uri: item.image }} style={styles.characterImage} />
      <View style={styles.characterInfo}>
        <Text style={styles.characterName}>{item.name}</Text>
        <Text style={styles.characterSpecies}>{item.species}</Text>
        <Text style={[
          styles.characterStatus,
          { color: item.status === 'Alive' ? '#11a83b' : item.status === 'Dead' ? '#ff4444' : '#888' }
        ]}>
          {item.status} - {item.gender}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#11a83b" />
        <Text>Loading characters...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search characters..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      <FlatList
        data={characters}
        renderItem={renderCharacterItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No characters found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  characterCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  characterInfo: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  characterName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  characterSpecies: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  characterStatus: {
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#666',
  },
});

export default CharacterList;