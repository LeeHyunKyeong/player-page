import { StyleSheet, Text, View, ScrollView, Button, SafeAreaView, Animated } from 'react-native';
import AudioHeader from './player/AudioHeader';
import AudioControl from './player/AudioControl';
import ThreeButtons from './player/ThreeButtons';
import artworkData from './artworkdata.json';
import { useState, useEffect, useRef } from 'react';
import * as Font from 'expo-font';
import * as Speech from 'expo-speech';

interface TextSegment {
  text: string;
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [author, setAuthor] = useState<string | null>(null);
  const [workTitle, setWorkTitle] = useState<string | null>(null);
  const [segments, setSegments] = useState<TextSegment[]>([]);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [segmentHeights, setSegmentHeights] = useState<number[]>([]); // 각 문단의 높이를 저장할 배열

  const [isPlaying, setIsPlaying] = useState(false);
  const [rateIndex, setRateIndex] = useState(0);
  const playbackRates = [1, 1.1, 1.2, 1.3, 1.4];
  const displayRates = [1, 1.25, 1.5, 1.75, 2]; //화면에 표시할 값
  const currentRate = playbackRates[rateIndex]; 
  const [highlighted, setHighlighted] = useState(true);
  const scrollViewRef = useRef<ScrollView | null>(null);

  // 각 문단의 레이아웃을 측정해서 높이를 저장하는 함수
  const onLayout = (event: any, index: number) => {
    const { height } = event.nativeEvent.layout; //높이를 추출
    setSegmentHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = height; // 해당 인덱스에 높이 값을 저장
      return newHeights;
    });
  };

  //마지막 문단 뒤에 빈 View의 높이를 계산하기 위한 onLayout 핸들러
  const onLastViewLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setSegmentHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights.push(height); // 마지막 View 높이 추가
      return newHeights;
    });
  };

  useEffect(() => {
    if (scrollViewRef.current && segmentHeights[currentSegment] !== undefined) {
      const yOffset = segmentHeights.slice(0, currentSegment).reduce((acc, height) => acc + height, 0);
      scrollViewRef.current.scrollTo({ y: yOffset - 80, animated: true });
    }
  }, [currentSegment, segmentHeights]);

  // const scrolling = useRef(new Animated.Value(0)).current;
  // const onScroll = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
  //   const position = e.nativeEvent.contentOffset.y;
  //   scrolling.setValue(position);
  //   console.log('Scroll Position:', position);
  // };

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        wantedSansRegular: require('./assets/font/WantedSans-Regular.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  useEffect(() => {
    setAuthor(artworkData.author);
    setWorkTitle(artworkData.workTitle);
    const workIntro = artworkData.workIntro;
    const authorIntro = artworkData.authorIntro;
    const workBackground = artworkData.workBackground;
    const appreciationPoint = artworkData.appreciationPoint;
    const history = artworkData.history;

    const text = `
    작품소개
    ${workIntro}
    작가소개
    ${authorIntro}
    작품배경
    ${workBackground}
    감상포인트
    ${appreciationPoint}
    미술사
    ${history}
    `

    // 문단 단위로 나누고 배열로 변환
    const segments = text
      .split(/\n+/) // 줄 바꿈을 기준으로 나누기 (한 문단씩 처리)
      .map((sentence): { text: string } => ({
        text: sentence.trim(),
      }))
      .filter((segment) => segment.text); //빈 문장은 필터링

    setSegments(segments);
  }, [artworkData]);

  const playSegmentFromIndex = (index: number) => {
    if (index < segments.length) {
      Speech.speak(segments[index].text, {
        rate: currentRate,
        onDone: () => {
          setIsPlaying(false);
          playSegmentFromIndex(index + 1);
        },
      });
      setCurrentSegment(index);  //현재 문단 번호를 업데이트
    } else {
      setIsPlaying(false);  //더 이상 문단이 없으면 재생 상태를 false로 설정
    }
  };

  const handleSegmentClick = (index: number) => {
    setCurrentSegment(index);
    if (isPlaying) { //재생중이었다
      Speech.stop(); //멈추고
      playSegmentFromIndex(index);
    } else { //재생중이 아니었다
      playSegmentFromIndex(index);
      setIsPlaying(true);
    }
  };

  const handlePlayPause = () => {
    //처음에 isplaying=false
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } 
    else { //false일 때
      playSegmentFromIndex(currentSegment);
      setIsPlaying(true);
    }
  };

  const togglePlaybackRate = () => {
    const nextIndex = (rateIndex + 1) % playbackRates.length;
    setRateIndex(nextIndex);
  };

  return (
    <SafeAreaView style={styles.container}>
      <AudioHeader />
      <Animated.ScrollView
        ref={scrollViewRef}
        // scrollEventThrottle={500}
        // onScroll={Animated.event(
        //   [{ nativeEvent: { contentOffset: { y: scrolling } } }],
        //   { useNativeDriver: false, listener: onScroll }
        // )}
      >
        {segments.map((segment, index) => (
          <Text
            key={index}
            onLayout={(event) => onLayout(event, index)}
            onPress={() => handleSegmentClick(index)} //문단 클릭 시 해당 문단으로 이동
            style={[
              styles.segment,
              highlighted
                ? index === currentSegment
                  ? styles.nonHighlightedText
                  : styles.highlightedText
                : styles.nonHighlightedText,
            ]}
          >
            {segment.text}
          </Text>
        ))}
        <View onLayout={onLastViewLayout} style={{ height: 150 }} />
      </Animated.ScrollView>

      <View style={styles.fixedButtonsContainer}>
        <ThreeButtons
          highlighted={highlighted}
          toggleHighlight={() => setHighlighted(!highlighted)}
          togglePlaybackRate={togglePlaybackRate}
          rateIndex={rateIndex}
          displayRates={displayRates}
        />
      </View>

      <AudioControl
        currentSegment={currentSegment}
        segmentsLength={segments.length}
        handleScrollChange={(value) => setCurrentSegment(value)}
        workTitle={workTitle}
        author={author}
        isPlaying={isPlaying}
        handlePlayPause={handlePlayPause}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0C0D0F',
  },
  segment: {
    fontSize: 20,
    fontFamily: 'wantedSansRegular',
    paddingHorizontal: 20,
    lineHeight: 30,
  },
  nonHighlightedText: {
    color: '#FFFFFF',
  },
  highlightedText: {
    color: '#495057',
  },
  fixedButtonsContainer: {
    position: 'absolute',
    bottom: 180, // AudioControl 바로 위에 고정
    right: 0,
    zIndex: 10,
  },
});