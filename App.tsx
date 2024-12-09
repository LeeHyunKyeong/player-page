import { StyleSheet, Text, View, ScrollView, Button, SafeAreaView, Animated } from 'react-native';
import AudioHeader from './player/AudioHeader';
import AudioControl from './player/AudioControl';
import ThreeButtons from './player/ThreeButtons';
import artworkData from './artworkdata.json';
import { useState, useEffect, useRef } from 'react';
import * as Font from 'expo-font';
import * as Speech from 'expo-speech';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [author, setAuthor] = useState<string | null>(null);
  const [workTitle, setWorkTitle] = useState<string | null>(null);
  const [segments, setSegments] = useState<[string, string][]>([]);
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

    // 배열 형식으로 저장
    const segments: [string, string][] = [
      ["작품소개", workIntro],
      ["작가소개", authorIntro],
      ["작품배경", workBackground],
      ["감상포인트", appreciationPoint],
      ["미술사", history],
    ];

    setSegments(segments);
  }, [artworkData]);

  const [lastBoundaryEvent, setLastBoundaryEvent] = useState({ charIndex: 0 });
  const [slicedText, setSlicedText] = useState(""); // 상태로 slicedText 관리
  const [isStopped, setIsStopped] = useState(false);

  const handlePlayPause = () => {
    if (isPlaying) {
      // 재생 중이라면 멈춤
      setIsStopped(true); // 멈춤 상태로 설정
      Speech.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      setIsStopped(false); // 재생 중 상태로 설정
  
      let currentText = slicedText;
      if (!currentText) {
        // 처음 시작 시 원본 텍스트로 초기화
        currentText = segments[currentSegment][1]; // 현재 문단 텍스트
        setSlicedText(currentText);
      }
  
      const nextText = currentText.slice(lastBoundaryEvent.charIndex); // 멈춘 위치 이후부터 재생
  
      Speech.speak(nextText, {
        rate: currentRate,
        onBoundary: (boundaryEvent: any) => {
          // 현재 읽고 있는 위치 업데이트
          setLastBoundaryEvent({
            charIndex: lastBoundaryEvent.charIndex + boundaryEvent.charIndex, // 시작점 보정
          });
        },
        onDone: () => {
          // 재생이 완료된 경우에만 실행
          if (!isStopped) {
            console.log("음성 재생 완료");
            if (currentSegment < segments.length - 1) {
              setCurrentSegment((prev) => prev + 1); // 다음 문단으로 이동
              setLastBoundaryEvent({ charIndex: 0 }); // 새 문단 시작점으로 초기화
            } else {
              setIsPlaying(false);
              console.log("모든 문단 재생 완료");
            }
          }
        },
      });
    }
  };
  
  const togglePlaybackRate = () => {
    // 배속을 변경하고 바로 적용
    const nextIndex = (rateIndex + 1) % playbackRates.length;
    setRateIndex(nextIndex);
  
    // 재생 중일 경우 배속을 즉시 변경하여 새로 시작하도록 함
    if (isPlaying) {
      // 현재 텍스트를 멈추고 배속을 새로 적용하여 재생
      Speech.stop(); // 음성 멈추기
      handlePlayPause(); // 변경된 배속으로 텍스트 다시 읽기
    }
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
      {segments.map(([title, content], index) => (
          <Text
            key={index}
            onLayout={(event) => onLayout(event, index)}
            onPress={() => setCurrentSegment(index)} // 클릭 시 해당 문단으로 이동
            style={[
              styles.segment,
              highlighted
                ? index === currentSegment
                  ? styles.highlightedText // 하이라이트 활성화 상태에서 현재 문단
                  : styles.nonHighlightedText // 하이라이트 활성화 상태에서 나머지 문단
                : styles.highlightedText, // 하이라이트 비활성화 시 모든 문단 흰색
            ]}
          >
            <Text>{title}</Text>
            {"\n"}
            <Text>{content}</Text>
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
  highlightedText: {
    color: '#FFFFFF',
  },
  nonHighlightedText: {
    color: '#495057',
  },
  fixedButtonsContainer: {
    position: 'absolute',
    bottom: 180, // AudioControl 바로 위에 고정
    right: 0,
    zIndex: 10,
  },
});