import { StyleSheet } from "react-native";
import { getCommonStyles } from "../../common/styles";
import { ThemeType } from "../../common/theme";

const getStyles = (colors: ThemeType) => StyleSheet.create({
  ...getCommonStyles(colors),

  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    marginHorizontal: 20,
    paddingHorizontal: 22,
    paddingVertical: 24,
    borderRadius: 28,
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: colors.shadow,
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
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
    borderWidth: 1.5,
    borderColor: 'rgba(148, 163, 184, 0.3)',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 17,
    width: '90%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '800',
  },
  linkText: {
    color: colors.primary,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
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
    borderColor: 'rgba(255,255,255,0.1)',
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

export default getStyles;
