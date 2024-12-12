// import { StyleSheet, Text, View, ScrollView, Button, SafeAreaView, Animated } from 'react-native';
// import AudioHeader from './player/AudioHeader';
// import AudioControl from './player/AudioControl';
// import ThreeButtons from './player/ThreeButtons';
// import artworkData from './artworkdata.json';
// import { useState, useEffect, useRef } from 'react';
// import * as Font from 'expo-font';
// import * as Speech from 'expo-speech';

// export default function App() {
//   const [fontsLoaded, setFontsLoaded] = useState(false);
//   const [author, setAuthor] = useState<string | null>(null);
//   const [workTitle, setWorkTitle] = useState<string | null>(null);
//   const [segments, setSegments] = useState<[string, string][]>([]);
//   const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
//   const [segmentHeights, setSegmentHeights] = useState<number[]>([]); // 각 문단의 높이를 저장할 배열
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [rateIndex, setRateIndex] = useState(0);
//   const playbackRates = [1, 1.1, 1.2, 1.3, 1.4];
//   const displayRates = [1, 1.25, 1.5, 1.75, 2]; //화면에 표시할 값
//   const currentRate = playbackRates[rateIndex]; 
//   const [highlighted, setHighlighted] = useState(true);
//   const scrollViewRef = useRef<ScrollView | null>(null);
//   const [workIntro, setWorkIntro] = useState<string | null>();
//   const [authorIntro, setAuthorIntro] = useState<string | null>();
//   const [workBackground, setWorkBackground] = useState<string | null>();
//   const [appreciationPoint, setAppreciationPoint] = useState<string | null>();
//   const [history, setHistory] = useState<string | null>();
//   const [lastBoundaryEvent, setLastBoundaryEvent] = useState({ charIndex: 0 });
//   const [slicedText, setSlicedText] = useState<string | null>();

//   useEffect(() => {
//     async function loadFonts() {
//       await Font.loadAsync({
//         wantedSansRegular: require('./assets/font/WantedSans-Regular.ttf'),
//       });
//       setFontsLoaded(true);
//     }

//     loadFonts();
//   }, []);

//   useEffect(() => {
//     setAuthor(artworkData.author);
//     setWorkTitle(artworkData.workTitle);
//     setWorkIntro(artworkData.workIntro);
//     setAuthorIntro(artworkData.authorIntro);
//     setWorkBackground(artworkData.workBackground);
//     setAppreciationPoint(artworkData.appreciationPoint);
//     setHistory(artworkData.history);

//     // 배열 생성 시 기본값 처리
//     const segments: [string, string][] = [
//         ["작품소개", artworkData.workIntro],
//         ["작가소개", artworkData.authorIntro],
//         ["작품배경", artworkData.workBackground],
//         ["감상포인트", artworkData.appreciationPoint],
//         ["미술사", artworkData.history],
//     ];

//     setSegments(segments);
//   }, [artworkData]);

//   useEffect(() => {
//     console.log("인덱스 바뀜",currentSegmentIndex)
//     Speech.stop();
//     if (scrollViewRef.current && segmentHeights[currentSegmentIndex] !== undefined) {
//       const yOffset = segmentHeights.slice(0, currentSegmentIndex).reduce((acc, height) => acc + height, 0);
//       scrollViewRef.current.scrollTo({ y: yOffset - 80, animated: true });
//     }

//     const newText = segments
//     .slice(currentSegmentIndex)
//     .map(([title, content]) => `${title} ${content?.trim() || ""}`)
//     .join("");

//     setSlicedText(newText);
//     setLastBoundaryEvent({ charIndex: 0 });
//   }, [currentSegmentIndex, segmentHeights]);

//   // 각 문단의 레이아웃을 측정해서 높이를 저장하는 함수
//   const onLayout = (event: any, index: number) => {
//     const { height } = event.nativeEvent.layout; //높이를 추출
//     setSegmentHeights((prevHeights) => {
//       const newHeights = [...prevHeights];
//       newHeights[index] = height; // 해당 인덱스에 높이 값을 저장
//       return newHeights;
//     });
//   };

//   //마지막 문단 뒤에 빈 View의 높이를 계산하기 위한 onLayout 핸들러
//   const onLastViewLayout = (event: any) => {
//     const { height } = event.nativeEvent.layout;
//     setSegmentHeights((prevHeights) => {
//       const newHeights = [...prevHeights];
//       newHeights.push(height); // 마지막 View 높이 추가
//       return newHeights;
//     });
//   };

//   // const scrolling = useRef(new Animated.Value(0)).current;
//   // const onScroll = (e: { nativeEvent: { contentOffset: { y: number } } }) => {
//   //   const position = e.nativeEvent.contentOffset.y;
//   //   scrolling.setValue(position);
//   //   console.log('Scroll Position:', position);
//   // };

//   const handlePlayPause = () => {
//     if (isPlaying) {
//       // 음성을 멈추고
//       Speech.stop(); 
//       setIsPlaying(false);
//     } else {
//       setIsPlaying(true);

//       let currentText = slicedText;
//         if (!currentText) {
//           // slicedText가 없으면 전체 텍스트로 초기화
//           currentText = segments.map(([title, content]) => `${title} ${content}`).join("");
//           setSlicedText(currentText); // 초기화된 텍스트 저장
//         }
//       const startIndex = lastBoundaryEvent.charIndex; // 현재 slicedText에서 멈춘 위치 이후로 자르기
//       const nextText = currentText.slice(startIndex);
  
//       console.log(`재생 텍스트: ${nextText}`);

//       Speech.speak(nextText, {
//         rate: currentRate,
//         onBoundary: (boundaryEvent: any) => {
//           setLastBoundaryEvent({
//             charIndex: startIndex + boundaryEvent.charIndex,
//           });
//         },
//         onDone: () => {
//           setIsPlaying(false);
//         },
//       });
//     }
//   };
  
//   const togglePlaybackRate = () => {
//     const nextIndex = (rateIndex + 1) % playbackRates.length;
//     setRateIndex(nextIndex);
  
//     if (isPlaying) {
//       Speech.stop();
//       handlePlayPause();
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <AudioHeader />
//       <Animated.ScrollView
//         ref={scrollViewRef}
//         // scrollEventThrottle={500}
//         // onScroll={Animated.event(
//         //   [{ nativeEvent: { contentOffset: { y: scrolling } } }],
//         //   { useNativeDriver: false, listener: onScroll }
//         // )}
//       >
//       {segments.map(([title, content], index) => (
//           <Text
//             key={index}
//             onLayout={(event) => onLayout(event, index)}
//             onPress={() => setCurrentSegmentIndex(index)} // 클릭 시 해당 문단으로 이동
//             style={[
//               styles.segment,
//               highlighted
//                 ? index === currentSegmentIndex
//                   ? styles.highlightedText // 하이라이트 활성화 상태에서 현재 문단
//                   : styles.nonHighlightedText // 하이라이트 활성화 상태에서 나머지 문단
//                 : styles.highlightedText, // 하이라이트 비활성화 시 모든 문단 흰색
//             ]}
//           >
//             <Text>{title}</Text>
//             {"\n"}
//             <Text>{content}</Text>
//           </Text>
//         ))}
//         <View onLayout={onLastViewLayout} style={{ height: 150 }} />
//       </Animated.ScrollView>

//       <View style={styles.fixedButtonsContainer}>
//         <ThreeButtons
//           highlighted={highlighted}
//           toggleHighlight={() => setHighlighted(!highlighted)}
//           togglePlaybackRate={togglePlaybackRate}
//           rateIndex={rateIndex}
//           displayRates={displayRates}
//         />
//       </View>

//       <AudioControl
//         workTitle={workTitle}
//         author={author}
//         isPlaying={isPlaying}
//         handlePlayPause={handlePlayPause}
//       />
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#0C0D0F',
//   },
//   segment: {
//     fontSize: 20,
//     fontFamily: 'wantedSansRegular',
//     paddingHorizontal: 20,
//     lineHeight: 30,
//   },
//   highlightedText: {
//     color: '#FFFFFF',
//   },
//   nonHighlightedText: {
//     color: '#495057',
//   },
//   fixedButtonsContainer: {
//     position: 'absolute',
//     bottom: 180, // AudioControl 바로 위에 고정
//     right: 0,
//     zIndex: 10,
//   },
// });

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import * as Speech from 'expo-speech';
import artworkData from './artworkdata.json';

interface TextSegment {
  text: string;
  startTime: number;
}

interface AudioplayerProps {
  artworkData: {
    user_id: number;
    uuid: string;
    author: string;
    workTitle: string;
    location: string;
    workIntro: string;
    authorIntro: string;
    workBackground: string;
    appreciationPoint: string;
    history: string;
    source: string;
    created_at: string;
    keyword: string[];
    playlist_id: number;
  };
}

const ExplanationAudio: React.FC<AudioplayerProps> = () => {
  const [segments, setSegments] = useState<TextSegment[]>([]);
  const [author, setAuthor] = useState<string | null>(null);
  const [workTitle, setWorkTitle] = useState<string | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [currentSegment, setCurrentSegment] = useState<number>(0);
  const [segmentHeights, setSegmentHeights] = useState<number[]>([]); // 각 문단의 높이를 저장할 배열
  const scrollViewRef = useRef<ScrollView | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [rateIndex, setRateIndex] = useState(0);
  const playbackRates = [1, 1.25, 1.5, 1.75, 2];
  const currentRate = playbackRates[rateIndex]; // 현재 재생 속도

  // 각 문단의 레이아웃을 측정해서 높이를 저장하는 함수
  const onLayout = (event: any, index: number) => {
    const { height } = event.nativeEvent.layout; //높이를 추출
    setSegmentHeights((prevHeights) => {
      const newHeights = [...prevHeights];
      newHeights[index] = height; // 해당 인덱스에 높이 값을 저장
      return newHeights;
    });
  };

  const handleScrollChange = (index: any) => {
    const value = Number(index);
    setCurrentSegment(value);
    
    // 구간 이동 시 자동 재생 로직 추가
    if (isPlaying) {
      Speech.stop();
      playSegmentFromIndex(value, currentRate);
    }else{
      playSegmentFromIndex(value, currentRate);
      setIsPlaying(true);
    }
  };

  const playSegmentFromIndex = (index: number, rate: number) => {
    if (index < segments.length) {
      const { text } = segments[index];
      Speech.speak(text, {
        rate,
        onDone: () => playSegmentFromIndex(index + 1, rate),
      });
      setCurrentSegment(index);
    } else {
      setIsPlaying(false);
      setCurrentSegment(0);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      Speech.stop();
      setIsPlaying(false);
    } else {
      playSegmentFromIndex(currentSegment, playbackRates[rateIndex]);
      setIsPlaying(true);
    }
  };

  const togglePlaybackRate = () => {
    const nextIndex = (rateIndex + 1) % playbackRates.length;
    setRateIndex(nextIndex);
    if (isPlaying) {
      Speech.stop();
      playSegmentFromIndex(currentSegment, playbackRates[nextIndex]);
    }else{

    }
  };

  useEffect(() => {
    setAuthor(artworkData.author);
    setWorkTitle(artworkData.workTitle);
    const workIntro = artworkData.workIntro;
    const authorIntro = artworkData.authorIntro;
    const workBackground = artworkData.workBackground;
    const appreciationPoint = artworkData.appreciationPoint;
    const history = artworkData.history;

    setText(`
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
    `);
  }, [artworkData]);

  useEffect(() => {
    if (text) {
      const segments = text
        .split(/\n+/)
        .map((sentence, idx): { text: string; startTime: number } => ({
          text: sentence.trim(),
          startTime: idx * 5,
        }))
        .filter((segment) => segment.text);
      setSegments(segments);
    }
  }, [text]);

  useEffect(() => {
    if (scrollViewRef.current && segmentHeights[currentSegment] !== undefined) {
      const yOffset = segmentHeights.slice(0, currentSegment).reduce((acc, height) => acc + height, 0);
      scrollViewRef.current.scrollTo({ y: yOffset - 80, animated: true });
    }
  }, [currentSegment, segmentHeights]);

  if (!text) return <Text>Loading...</Text>;

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#0C0D0F' }}>
      <View style={{ flex: 1, marginBottom: 16 }}>
        <Text style={{ color: 'white', fontSize: 24, marginBottom: 8 }}>{workTitle}</Text>
        <Text style={{ color: '#787B83', fontSize: 16 }}>{author}</Text>
        {segments.map((segment, index) => (
          <Text
            key={index}
            onLayout={(event) => onLayout(event, index)}
            onPress={() => handleScrollChange(index)} // 클릭 시 해당 문단으로 이동
            style={{
              color: index === currentSegment ? '#FFFFFF' : '#FFFFFF4D',
              marginBottom: 8,
            }}
          >
            {segment.text}
          </Text>
        ))}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button title={`속도: ${playbackRates[rateIndex]}`} onPress={togglePlaybackRate} />
        <Button title={isPlaying ? '일시정지' : '재생'} onPress={handlePlayPause} />
      </View>

    </View>
  );
};

export default ExplanationAudio;