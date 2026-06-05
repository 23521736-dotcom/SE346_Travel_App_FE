import { formatDate, getTimeValue } from '@/lib/service/PromotionShedule';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useTheme } from '../context/ThemeContext';
import getAddLocationStyles from '../screens/owner/AddLocationScreen.style';
import getEditorStyles from './PromotionEditor.style';

interface EditorProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const PromotionEditor: React.FC<EditorProps> = ({ initialData, onSave, onCancel }) => {
  const { colors: themeColors } = useTheme();
  const styles = useMemo(() => getAddLocationStyles(themeColors), [themeColors]);
  const PromotionEditorStyles = useMemo(() => getEditorStyles(themeColors), [themeColors]);

  const [title, setTitle] = useState(initialData?.title || '');
  const [startDate, setStartDate] = useState(initialData?.schedule?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.schedule?.endDate || '');
  const [endTime, setEndTime] = useState(initialData?.schedule?.endTime || '');
  const [startTime, setStartTime] = useState(initialData?.schedule?.startTime || '');
  const [selectedDays, setSelectedDays] = useState(initialData?.schedule?.days || []);
  const [specificTime, setSpecificTime] = useState(initialData?.schedule?.specificTime || false);

  const days = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'S'];

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activePicker, setActivePicker] = useState<'start' | 'end'>('start');

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [activeTimePicker, setActiveTimePicker] = useState<'start' | 'end'>('start');

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d: string) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const showDatePicker = (type: 'start' | 'end') => {
    setActivePicker(type);
    setDatePickerVisibility(true);
  };

  const handleConfirm = (date: Date) => {
    const formattedDate = formatDate(date);
    if (activePicker === 'start') {
      setStartDate(formattedDate);
    } else {
      setEndDate(formattedDate);
    }
    setDatePickerVisibility(false);
  };

  const showTimePicker = (type: 'start' | 'end') => {
    setActiveTimePicker(type);
    setTimePickerVisibility(true);
  };

  const handleConfirmTime = (date: Date) => {
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    if (activeTimePicker === 'start') {
      setStartTime(formattedTime);
    } else {
      setEndTime(formattedTime);
    }
    setTimePickerVisibility(false);
  };

  const parseDateString = (dateStr: string): Date | null => {
    if (!dateStr) return null;

    const monthMap: { [key: string]: number } = {
      "Jan": 0, "Feb": 1, "Mar": 2, "Apr": 3, "May": 4, "Jun": 5,
      "Jul": 6, "Aug": 7, "Sep": 8, "Oct": 9, "Nov": 10, "Dec": 11
    };

    try {
      const parts = dateStr.replace(',', '').split(' ');
      if (parts.length < 3) return null;
      const monthName = parts[0];
      const day = parseInt(parts[1]);
      const year = parseInt(parts[2]);
      const monthIndex = monthMap[monthName];
      if (monthIndex === undefined || isNaN(day) || isNaN(year)) {
        return null;
      }
      return new Date(year, monthIndex, day);
    } catch (error) {
      console.error("Error parsing date:", error);
      return null;
    }
  };

  const handleCancel = () => {
    setTitle('');
    setStartDate('');
    setEndDate('');
    setStartTime('');
    setEndTime('')
    setSelectedDays([]);
    setSpecificTime(false);
    onCancel();
  }

  const handleSave = () => {
    if (!title.trim()) {
      alert("Please enter a title.");
      return;
    }
    if (!startDate || !endDate || selectedDays.length === 0) {
      alert("Please select Start Date, End Date, and at least one Repeat day.");
      return;
    }
    if (specificTime && (!startTime || !endTime)) {
      alert("Please select both Start Time and End Time.");
      return;
    }
    const startD = parseDateString(startDate);
    const endD = parseDateString(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if ((startD?.getTime() ?? 0) < today.getTime()) {
      alert("The start day is in the past now.");
      return;
    }
    if ((startD?.getTime() ?? 0) > (endD?.getTime() ?? 0)) {
      alert("Start Date must be earlier than End Date.");
      return;
    }
    if (specificTime) {
      if (!startTime || !endTime) {
        alert("Please select both Start Time and End Time.");
        return;
      }
      const startV = getTimeValue(startTime);
      const endV = getTimeValue(endTime);
      if (startV >= endV) {
        alert("Start Time must be earlier than End Time.");
        return;
      }
    }

    const finalData = {
      title,
      schedule: {
        startDate,
        endDate,
        days: selectedDays,
        startTime,
        endTime,
        specificTime,
      }
    };
    onSave(finalData);
  }

  return (
    <View style={[styles.card, { borderColor: themeColors.primary, borderWidth: 1.5 }]}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="pricetag" size={20} color={themeColors.primary} />
          <Text style={{ fontWeight: 'bold', marginLeft: 8, color: themeColors.primary }}>
            {initialData ? 'Edit Offer' : 'Create New Offer'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleCancel()}>
          <Text style={{ color: themeColors.textSecondary }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>title</Text>
      <TextInput
        style={[styles.input, { height: 60, textAlignVertical: 'top', color: themeColors.textPrimary }]}
        placeholder="e.g. Get 20% off on all lunch menu"
        placeholderTextColor={themeColors.textMuted}
        multiline
        value={title}
        onChangeText={setTitle}
      />

      <View style={PromotionEditorStyles.dateRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={PromotionEditorStyles.dateInputBox}
            onPress={() => showDatePicker('start')}
          >
            <Text style={{ fontSize: 12, color: themeColors.textPrimary }}>{startDate}</Text>
            <Ionicons name="calendar-outline" size={16} color={themeColors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>End Date</Text>
          <TouchableOpacity
            style={PromotionEditorStyles.dateInputBox}
            onPress={() => showDatePicker('end')}
          >
            <Text style={{ fontSize: 12, color: themeColors.textPrimary }}>{endDate}</Text>
            <Ionicons name="calendar-outline" size={16} color={themeColors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.label}>Repeat On</Text>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleDay(day)}
            style={[
              PromotionEditorStyles.dayCircle,
              selectedDays.includes(day) && PromotionEditorStyles.dayCircleActive
            ]}
          >
            <Text style={{
              fontSize: 10,
              color: selectedDays.includes(day) ? 'white' : themeColors.textPrimary
            }}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Active Time</Text>
      <View style={PromotionEditorStyles.timeToggleContainer}>
        <TouchableOpacity
          onPress={() => setSpecificTime(false)}
          style={[PromotionEditorStyles.timeToggleButton, !specificTime && PromotionEditorStyles.timeToggleButtonActive]}
        >
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: !specificTime ? themeColors.primary : themeColors.textSecondary }}>All day</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSpecificTime(true)}
          style={[PromotionEditorStyles.timeToggleButton, specificTime && PromotionEditorStyles.timeToggleButtonActive]}
        >
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: specificTime ? themeColors.primary : themeColors.textSecondary }}>Specific</Text>
        </TouchableOpacity>
      </View>

      {specificTime && (
        <View style={PromotionEditorStyles.dateRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
              style={PromotionEditorStyles.dateInputBox}
              onPress={() => showTimePicker('start')}
            >
              <Text style={{ fontSize: 12, color: themeColors.textPrimary }}>{startTime}</Text>
              <Ionicons name="time-outline" size={16} color={themeColors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
              style={PromotionEditorStyles.dateInputBox}
              onPress={() => showTimePicker('end')}
            >
              <Text style={{ fontSize: 12, color: themeColors.textPrimary }}>{endTime}</Text>
              <Ionicons name="time-outline" size={16} color={themeColors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { marginTop: 16 }]}
        onPress={() => handleSave()}
      >
        <Text style={styles.buttonText}>Publish Offer</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisibility(false)}
        is24Hour={false}
      />

    </View>
  );
};

export default PromotionEditor;