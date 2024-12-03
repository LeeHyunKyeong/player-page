import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface ControlPanelProps {
  togglePlaybackRate: () => void;
  highlighted: boolean;
  toggleHighlight: () => void;
  rateIndex: number;
  displayRates: number[];
}

const ThreeButtons: React.FC<ControlPanelProps> = ({
  togglePlaybackRate,
  highlighted,
  toggleHighlight,
  rateIndex,
  displayRates,
}) => {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked((prev) => !prev);
  };

  return (
    <View style={styles.buttonContainer}>
      <View
        style={styles.button}>
        <TouchableOpacity onPress={toggleHighlight}>
          <FontAwesome5 name="pen" size={18} color={highlighted ? '#FFFFFF' : '#484C52'} />
        </TouchableOpacity>
      </View>

      <View style={styles.button}>
        <TouchableOpacity onPress={togglePlaybackRate}>
          <Text style={styles.buttonText}>
            {Number.isInteger(displayRates[rateIndex]) || displayRates[rateIndex] % 1 === 0.5
              ? displayRates[rateIndex].toFixed(1)
              : displayRates[rateIndex].toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={styles.button}>
        <TouchableOpacity onPress={handleLikeClick}>
          <FontAwesome name="heart" size={21} color={isLiked ? '#FFFFFF' : '#484C52'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 8,
    backgroundColor: '#151718',
    borderWidth: 0.5,
    borderColor: '#2c3032',
  },
  buttonText: {
    fontSize: 14,
    color: '#FFF',
  },
});

export default ThreeButtons;