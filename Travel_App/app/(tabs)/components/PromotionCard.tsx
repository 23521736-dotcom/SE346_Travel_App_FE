import { getScheduleString } from '@/lib/service/PromotionShedule';
import { type PromotionItem } from '@/lib/types/promotion';
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import getStyles from "../screens/owner/AddLocationScreen.style";

interface PromotionProps {
  item: PromotionItem;
  onToggle: (id: string) => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

const PromotionCard: React.FC<PromotionProps> = ({ item, onToggle, onEdit, onDelete }) => {
  const { colors: themeColors } = useTheme();
  const styles = useMemo(() => getStyles(themeColors), [themeColors]);

  return (
    <View style={[styles.promoCard, { borderLeftColor: item.isActive ? themeColors.primary : themeColors.border }]}>
      <View style={{ flex: 1 }}>
        {/* Badge Trạng thái */}
        <View style={[
          styles.promoBadge,
          { backgroundColor: item.isActive ? themeColors.primaryLight : themeColors.background }
        ]}>
          <Text style={{ color: item.isActive ? themeColors.primary : themeColors.textMuted, fontSize: 10, fontWeight: 'bold' }}>
            {item.isActive ? "Active" : "Inactive"}
          </Text>
        </View>

        {/* Nội dung Promotion */}
        <Text
          numberOfLines={2} // Tránh text quá dài làm vỡ layout
          style={[
            { fontWeight: 'bold', fontSize: 14, marginTop: 4, color: themeColors.textPrimary },
            !item.isActive && { color: themeColors.textMuted, textDecorationLine: 'line-through' }
          ]}
        >
          {item.title}
        </Text>

        <Text style={{ fontSize: 10, color: themeColors.textMuted, marginTop: 4 }}>
          {getScheduleString(item.schedule)}
        </Text>
      </View>

      <View style={{ alignItems: 'flex-end', justifyContent: 'space-between', paddingLeft: 10 }}>
        {/* Toggle Switch */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onToggle(item.id)}
          style={[
            styles.toggleContainer,
            {
              backgroundColor: item.isActive ? themeColors.primary : themeColors.border,
              alignItems: item.isActive ? 'flex-end' : 'flex-start'
            }
          ]}
        >
          <View style={styles.toggleCircle} />
        </TouchableOpacity>

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', marginTop: 15 }}>
          <TouchableOpacity onPress={onEdit} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="pencil-outline" size={20} color={themeColors.textSecondary} style={{ marginRight: 15 }} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onDelete(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="trash-outline" size={20} color={themeColors.danger} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PromotionCard;