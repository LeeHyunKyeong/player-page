import { Text, View, Image, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native";

const KaKaoLoginPage: React.FC = () => {
  return(
    <SafeAreaView style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>마이 도슨트</Text>
        <Text style={styles.subText}>AI 도슨트의 맞춤형 해설로</Text>
        <Text style={styles.subText}>간편한 작품 관람을 시작해 보세요.</Text>
      </View>

      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/docent_logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      <View style={styles.kakaoContainer}>
        <TouchableOpacity style={styles.button}>
          <View style={styles.buttonContent}>
            <Image 
              source={require('../assets/kakao.png')}
              style={styles.kakaoLogo}
              resizeMode="contain"
            />
            <Text style={styles.buttonText}>카카오로 시작하기</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.termsText}>
          로그인(가입) 시 이용약관 및 개인정보 취급 방침에 동의하는 것으로 간주됩니다.
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default KaKaoLoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#0C0D0F',
  },
  textContainer: {
    position: 'absolute',
    top: 120,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    fontFamily: 'WantedSansSemiBold',
    color: '#FFFFFF',
  },
  subText: {
    fontSize: 16,
    fontFamily: 'WantedSansRegular',
    color: '#FFFFFF',
    lineHeight: 20,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  logo: {
    width: 210,
    height: 210,
  },
  button: {
    width: '95%',
    borderRadius: 30,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  buttonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  kakaoContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  kakaoLogo: {
    width: 24,
    height: 24,
    marginRight: 4,
  },
  buttonText: {
    fontSize: 16,
    color: '#0c0d0f',
    fontFamily: 'WantedSansSemiBold',
  },
  termsText: {
    fontSize: 15,
    fontFamily: 'WantedSansRegular',
    marginTop: 16,
    color: '#484C52',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});