import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Button } from 'react-native';
import * as Font from 'expo-font';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

interface AudioControlProps {
  currentSegment: number;
  segmentsLength: number;
  handleScrollChange: (value: number) => void;
  workTitle: string | null;
  author: string | null;
  isPlaying: boolean;
  handlePlayPause: () => void;
}

const AudioControl: React.FC<AudioControlProps> = ({
  currentSegment,
  segmentsLength,
  handleScrollChange,
  workTitle,
  author,
  isPlaying,
  handlePlayPause,
}) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'wantedSansBold': require('../assets/font/WantedSans-Bold.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View>
          <Text style={styles.workTitle}>{workTitle}</Text>
          <Text style={styles.author}>{author}</Text>
        </View>
        <TouchableOpacity onPress={handlePlayPause}>
          {isPlaying ? (
            <FontAwesome5 name="pause" size={20} color="white" />
          ) : (
            <FontAwesome5 name="play" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>새로운 작품 검색</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  workTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'wantedSansBold',
    fontWeight: 'bold',
    marginBottom: 3,
  },
  author: {
    color: '#787B83',
    fontFamily: 'wantedSansRegular',
    fontSize: 16,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '98%',
    height: 48,
    borderRadius: 30,
    padding: 12,
    backgroundColor: '#1B1E1F',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'wantedSansRegular',
    color: 'white',
    fontSize: 15,
  },
});

export default AudioControl;
