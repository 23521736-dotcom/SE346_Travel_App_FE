import { StyleSheet } from "react-native";
import { commonStyles } from "../../common/styles";

const styles = StyleSheet.create({
  ...commonStyles,

  background: {
    flex: 1,
    backgroundColor: '#121418',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 12, 16, 0.6)',
  },
  container: {
    marginHorizontal: 20,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderRadius: 28,
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    marginHorizontal: 0,
    marginVertical: 0,
    paddingHorizontal: 18,
    borderRadius: 16,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Vẫn giữ độ sâu (inset) nhưng màu tối hơn
    borderWidth: 1.5,
    borderColor: 'rgba(148, 163, 184, 0.3)', // Viền xám bạc thay vì xanh lơ rực rỡ
  },
  button: {
    backgroundColor: '#1cb0f6',
    paddingVertical: 17,
    width: '90%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1cb0f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#0a1a24',
    fontSize: 17,
    fontWeight: '800',
  },
  linkText: {
    color: '#1cb0f6',
    fontWeight: '700',
  },
  containerChild: {
    margin: 10,
    marginTop: 10,
    justifyContent: 'center',
    rowGap: 10
  },
  lineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  text: {
    color: '#9ca3af',
    fontSize: 15,
    marginHorizontal: 10,
  },
  containerGG_Apple: {
    flexDirection: 'row',
    columnGap: 20,
  },
  buttonGG_Apple: {
    borderRadius: 16,
    backgroundColor: '#1e2329',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  containerImageGG_Apple: {
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center'
  },
  buttonGG_AppleText: { 
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default styles;
