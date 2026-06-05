import { StyleSheet } from "react-native";
import { getCommonStyles } from "../../common/styles";
import { ThemeType } from "../../common/theme";

const getStyles = (colors: ThemeType) => StyleSheet.create({
  ...getCommonStyles(colors),

    avatarContainer : {
        width: 160,
        height: 160,
    },
  
    avatarBorder: {
        borderWidth: 3,
        borderColor: colors.primary,
        width: 150,
        height: 150,
        borderRadius: 70,
        overflow: "hidden",
        position: 'relative',
    },
  
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 50,
        borderRadius: 70,
        position: 'absolute',
        bottom: 5,
        right: 10,
        zIndex: 10,
        elevation: 10,
        shadowColor: colors.primary,
        shadowOpacity: 0.5, 
        shadowRadius: 10,
        shadowOffset: {width: 0, height: 4},
    },
  
    containerChild: {
        margin: 10,
        marginTop: 10,
        justifyContent: 'center',
        rowGap: 10
    },
      
});

export default getStyles;
