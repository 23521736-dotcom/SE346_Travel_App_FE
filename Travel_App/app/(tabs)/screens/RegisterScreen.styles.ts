import { StyleSheet } from "react-native";
import { commonStyles } from "../common/styles";
import { colors } from "../common/colors";

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
  screenContent: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 14,
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 18,
  },
  headerIcon: {
    height: 70,
    width: 70,
    marginBottom: 4,
  },
  headerTitle: {
    fontWeight: '800',
    fontSize: 30,
    textAlign: 'center',
    color: '#ffffff',
  },
  headerSubtitle: {
    marginTop: 3,
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 15,
  },
  container: {
    marginHorizontal: 20,
    paddingHorizontal: 20,
    paddingVertical: 19,
    borderRadius: 24,
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
    height: 49,
    marginHorizontal: 0,
    marginBottom: 11,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.4)', // Vẫn giữ độ sâu (inset) nhưng màu tối hơn
    borderWidth: 1.5,
    borderColor: 'rgba(148, 163, 184, 0.3)', // Viền xám bạc thay vì xanh lơ rực rỡ
  },
  roleSection: {
    marginTop: 3,
  },
  roleTitle: {
    color: '#e5e7eb',
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 10,
  },
  roleOptions: {
    flexDirection: 'row',
    columnGap: 10,
  },
  roleCard: {
    flex: 1,
    minHeight: 76,
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderWidth: 1.5,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  roleCardActive: {
    backgroundColor: 'rgba(28, 176, 246, 0.12)',
    borderColor: '#1cb0f6',
  },
  roleName: {
    color: '#e5e7eb',
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  roleNameActive: {
    color: '#ffffff',
  },
  roleDescription: {
    color: '#94a3b8',
    fontSize: 11,
    lineHeight: 15,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1cb0f6',
    paddingVertical: 13,
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
    fontSize: 16,
    fontWeight: '800',
  },
  linkText: {
    color: '#1cb0f6',
    fontWeight: '700',
  },
  containerChild: {
    marginTop: 13,
    alignItems: 'center',
    justifyContent: 'center',
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
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 30,
    marginTop: 13,
  },
  socialSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 13,
  },
  containerGG_Apple: {
    flexDirection: 'row',
    columnGap: 20,
    marginTop: 12,
  },
  buttonGG_Apple: {
    borderRadius: 16,
    backgroundColor: '#1e2329',
    alignItems: 'center',
    justifyContent: 'center',
    width: 140,
    height: 42,
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
    fontSize: 14,
    fontWeight: '700',
  },
  loginFooterText: {
    color: '#ccc2c2',
    fontSize: 15,
    marginTop: 18,
    marginBottom: 0,
  },
  checkbox: {
    marginRight: 10,
    width: 20,
    height: 20,
    borderRadius: 5,
    borderColor: colors.border,
  },
});

export default styles;
