import { formatDate, formatPromotionDate, getTimeValue, parsePromotionDate, toPromotionApiDateTime } from '@/lib/service/PromotionShedule';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker"; // Import bộ chọn ngày
import { colors } from '../common/colors';
import { styles } from '../screens/owner/AddLocationScreen.style';
import { PromotionEditorStyles } from './PromotionEditor.style';

interface EditorProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const PromotionEditor: React.FC<EditorProps> = ({ initialData, onSave, onCancel }) => {

  const [title, setTitle] = useState(initialData?.title || '');
  const [startDate, setStartDate] = useState(formatPromotionDate(initialData?.schedule?.startDate || ''));
  const [endDate, setEndDate] = useState(formatPromotionDate(initialData?.schedule?.endDate || ''));
  const [endTime, setEndTime] = useState(initialData?.schedule?.endTime || '');
  const [startTime, setStartTime] = useState(initialData?.schedule?.startTime || '');
  const [selectedDays, setSelectedDays] = useState(initialData?.schedule?.days || []);
  const [specificTime, setSpecificTime] = useState(initialData?.schedule?.specificTime || false); // All day / Specific

  const days = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'S'];

  // State quản lý việc đóng/mở Calendar và chọn Time
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [activePicker, setActivePicker] = useState<'start' | 'end'>('start'); // qd chọn Start Date hay End Date

  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [activeTimePicker, setActiveTimePicker] = useState<'start' | 'end'>('start');

  // --- LOGIC 1: XỬ LÝ CHỌN THỨ (REPEAT ON) ---
  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d: string) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]); // Thêm vào mảng
    }
  };

  // --- LOGIC 2: XỬ LÝ CHỌN NGÀY & FORMAT ---
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

  // --- LOGIC CHỌN GIỜ ---
  const showTimePicker = (type: 'start' | 'end') => {
    setActiveTimePicker(type);
    setTimePickerVisibility(true);
  };

  const handleConfirmTime = (date: Date) => {
    // Format: "5:00 PM"
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
    const parsedDate = parsePromotionDate(dateStr);
    if (parsedDate) return parsedDate;

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

      // Kiểm tra xem dữ liệu sau khi tách có hợp lệ không
      if (monthIndex === undefined || isNaN(day) || isNaN(year)) {
        return null;
      }

      return new Date(year, monthIndex, day);
    } catch (error) {
      console.error("Lỗi khi parse ngày tháng:", error);
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
    if (!startD || !endD) {
      alert("Please select valid Start Date and End Date.");
      return;
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đưa về 0h sáng để chỉ so sánh ngày
    // 2. Kiểm tra ngày bắt đầu không được ở quá khứ
    if ((startD?.getTime() ?? 0) < today.getTime()) {
      alert("The start day is in the past now.");
      return;
    }
    // 3. Kiểm tra Start Date <= End Date
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
        startDate: toPromotionApiDateTime(startDate),
        endDate: toPromotionApiDateTime(endDate),
        days: selectedDays,
        startTime,
        endTime,
        specificTime,
      }
    };

    onSave(finalData);
  }

  return (
    <View style={[styles.card, { borderColor: colors.primary, borderWidth: 1.5 }]}>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Ionicons name="pricetag" size={20} color={colors.primary} />
          <Text style={{ fontWeight: 'bold', marginLeft: 8, color: colors.primary }}>
            {initialData ? 'Edit Offer' : 'Create New Offer'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => handleCancel()}>
          <Text style={{ color: colors.textSecondary }}>Cancel</Text>
        </TouchableOpacity>
      </View>

      {/* title */}
      <Text style={styles.label}>title</Text>
      <TextInput
        style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
        placeholder="e.g. Get 20% off on all lunch menu"
        multiline
        value={title}
        onChangeText={setTitle}
      />

      {/* Date Selection */}
      <View style={PromotionEditorStyles.dateRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>Start Date</Text>
          <TouchableOpacity
            style={PromotionEditorStyles.dateInputBox}
            onPress={() => showDatePicker('start')}
          >
            <Text style={{ fontSize: 12 }}>{startDate}</Text>
            <Ionicons name="calendar-outline" size={16} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.label}>End Date</Text>
          <TouchableOpacity
            style={PromotionEditorStyles.dateInputBox}
            onPress={() => showDatePicker('end')}
          >
            <Text style={{ fontSize: 12 }}>{endDate}</Text>
            <Ionicons name="calendar-outline" size={16} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Repeat On  */}
      <Text style={styles.label}>Repeat On</Text>
      <View style={{ flexDirection: 'row', marginBottom: 16 }}>
        {days.map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleDay(day)} // Thêm hàm toggle
            style={[
              PromotionEditorStyles.dayCircle,
              selectedDays.includes(day) && PromotionEditorStyles.dayCircleActive
            ]}
          >
            <Text style={{
              fontSize: 10,
              color: selectedDays.includes(day) ? 'white' : colors.textPrimary
            }}>
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Time Toggle */}
      <Text style={styles.label}>Active Time</Text>
      <View style={PromotionEditorStyles.timeToggleContainer}>
        <TouchableOpacity
          //key={}
          onPress={() => setSpecificTime(false)}
          style={[PromotionEditorStyles.timeToggleButton, !specificTime && PromotionEditorStyles.timeToggleButtonActive]}
        >
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: !specificTime ? colors.primary : colors.textSecondary }}>All day</Text>
        </TouchableOpacity>

        <TouchableOpacity
          //key={mode}
          onPress={() => setSpecificTime(true)}
          style={[PromotionEditorStyles.timeToggleButton, specificTime && PromotionEditorStyles.timeToggleButtonActive]}
        >
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: specificTime ? colors.primary : colors.textSecondary }}>Specific</Text>
        </TouchableOpacity>
      </View>

      {/* Time */}
      {specificTime && (
        <View style={PromotionEditorStyles.dateRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.label}>Start Time</Text>
            <TouchableOpacity
              style={PromotionEditorStyles.dateInputBox}
              onPress={() => showTimePicker('start')}
            >
              <Text style={{ fontSize: 12 }}>{startTime}</Text>
              <Ionicons name="time-outline" size={16} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.label}>End Time</Text>
            <TouchableOpacity
              style={PromotionEditorStyles.dateInputBox}
              onPress={() => showTimePicker('end')}
            >
              <Text style={{ fontSize: 12 }}>{endTime}</Text>
              <Ionicons name="time-outline" size={16} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* <Text style={PromotionEditorStyles.helperText}>
        {getScheduleString(scheduleData)}
      </Text> */}

      {/* Publish Button */}
      <TouchableOpacity
        style={[styles.button, { marginTop: 16 }]}
        onPress={() => handleSave()}
      >
        <Text style={styles.buttonText}>Publish Offer</Text>
      </TouchableOpacity>


      {/* Modal hiển thị Calendar */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
        onConfirm={handleConfirm}
        onCancel={() => setDatePickerVisibility(false)}
      />

      {/* Modal chọn Giờ  */}
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisibility(false)}
        is24Hour={false} // Hiển thị AM/PM
      />

    </View>
  );
};

export default PromotionEditor; 
