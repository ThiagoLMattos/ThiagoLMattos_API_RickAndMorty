import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CharacterDetailsScreen = ({ route }) => {
  const { character } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: character.image }} style={styles.image} />
      
      <View style={styles.detailsContainer}>
        <Text style={styles.name}>{character.name}</Text>
        
        <View style={styles.infoSection}>
          <Text style={styles.label}>Status</Text>
          <Text style={[
            styles.value,
            { color: character.status === 'Alive' ? '#11a83b' : character.status === 'Dead' ? '#ff4444' : '#888' }
          ]}>
            {character.status}
          </Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Species</Text>
          <Text style={styles.value}>{character.species}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{character.gender}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Origin</Text>
          <Text style={styles.value}>{character.origin.name}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Location</Text>
          <Text style={styles.value}>{character.location.name}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Episodes</Text>
          <Text style={styles.value}>{character.episode.length}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.label}>Created</Text>
          <Text style={styles.value}>
            {new Date(character.created).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  image: {
    width: '100%',
    height: 300,
  },
  detailsContainer: {
    padding: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  infoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
});

export default CharacterDetailsScreen;