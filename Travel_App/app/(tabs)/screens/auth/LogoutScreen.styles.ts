import { StyleSheet } from "react-native";
import { getCommonStyles } from "../../common/styles";
import { ThemeType } from "../../common/theme";

const getStyles = (colors: ThemeType) => StyleSheet.create({
  ...getCommonStyles(colors),

  containerChild: {
    margin: 10,
    justifyContent: 'center',
    rowGap: 10
  },

  buttonLogOut: {
    backgroundColor: colors.dangerSoft,
    paddingVertical: 15,
    width: 350,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },

  buttonLogOutText: {
    color: colors.danger,
    fontSize: 18,
    fontWeight: 'bold',
  },

  titleText: {
    fontSize: 35,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
  },

  descriptionText: {
    color: colors.textMuted,
    fontSize: 17,
    textAlign: 'center',
  }
});

export default getStyles;