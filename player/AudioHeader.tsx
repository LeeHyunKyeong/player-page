import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

const AudioHeader: React.FC = () => {

  const handleGoHome = () => {
  };

  return (
    <View>
      <TouchableOpacity style={styles.button} onPress={handleGoHome}>
        <Image source={require('../assets/docent_logo.png')} style={styles.logo} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  logo: {
    width: 32,
    height: 32,
  },
});

export default AudioHeader;
