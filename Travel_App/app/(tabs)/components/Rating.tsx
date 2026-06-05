import { Ionicons } from '@expo/vector-icons';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { ThemeType } from '../common/theme';

const BAR_COLOR_LIGHT = '#E0F0F7';

export const RatingStartBar = ({ ratingValue, size }: { ratingValue: number; size: number }) => {
  return (
    <View style={{ flexDirection: 'row', marginLeft: 5 }}>
      {[1, 2, 3, 4, 5].map((star) => {
        let iconName: any = "star-outline";

        if (ratingValue >= star - 0.2) {
          iconName = "star";
        } else if (ratingValue >= star - 0.6) {
          iconName = "star-half";
        }

        return (
          <Ionicons
            key={star}
            name={iconName}
            size={size}
            color='#FFD700'
          />
        );
      })}
    </View>
  );
};

export const RatingBar = ({ stars, percentage }: { stars: number, percentage: number }) => {
  const { colors: themeColors } = useTheme();
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);

  return (
    <View style={styles.barRowContainer}>
      <View style={styles.starContainer}>
        <Text style={styles.starText}>{stars}</Text>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFilled,
            { width: `${percentage}%` }
          ]}
        />
      </View>

      <View style={styles.percentageContainer}>
        <Text style={styles.percentageText}>{percentage}%</Text>
      </View>
    </View>
  );
};

const getStyles = (colors: ThemeType) => StyleSheet.create({
  mainContainer: {
    width: '80%',
    padding: 10,
    borderRadius: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: colors.surface
  },
  barRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  starContainer: {
    width: 20,
    alignItems: 'flex-start',
    marginRight: 10,
  },
  starText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 15,
    
  },
  progressFilled: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 6,
  },
  percentageContainer: {
    width: 25,
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export const ratingBarStyles = {
  mainContainer: {
    width: '80%',
    padding: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 3,
    backgroundColor: 'rgba(0,0,0,0.6)'
  },
  barRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  starContainer: {
    width: 20,
    alignItems: 'flex-start',
    marginRight: 10,
  },
  starText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: BAR_COLOR_LIGHT,
  },
  progressTrack: {
    flex: 1,
    height: 7,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    marginRight: 15,

  },
  progressFilled: {
    height: '100%',
    backgroundColor: '#00AEEF',
    borderRadius: 6,
  },
  percentageContainer: {
    width: 25,
    alignItems: 'flex-end',
  },
  percentageText: {
    fontSize: 12,
    color: BAR_COLOR_LIGHT,
  },
};

export const calculateRatingStats = (data: any[]) => {
  const totalReviews = data.length;

  const counts: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  data.forEach(item => {
    if (counts[item.Rate] !== undefined) {
      counts[item.Rate]++;
    }
  });

  const stats = [5, 4, 3, 2, 1].map(star => {
    const count = counts[star];
    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;

    return {
      stars: star,
      percentage: Math.round(percentage)
    };
  });

  return stats;
};