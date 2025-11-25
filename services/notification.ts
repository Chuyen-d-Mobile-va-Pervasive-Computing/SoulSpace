import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCHEDULED_KEY_PREFIX = 'scheduled_notifications_for:';

async function _getScheduledIds(reminderId: string): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(`${SCHEDULED_KEY_PREFIX}${reminderId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function _setScheduledIds(reminderId: string, ids: string[]) {
  try {
    await AsyncStorage.setItem(`${SCHEDULED_KEY_PREFIX}${reminderId}`, JSON.stringify(ids));
  } catch {
  }
}

export async function setupNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('reminders', {
      name: 'Nhắc hẹn',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#7F56D9',
    });
  }
}

export async function scheduleReminder(reminder: {
  _id: string;
  title: string;
  message?: string;
  time_of_day: string;
  repeat_type: 'once' | 'daily' | 'custom';
  repeat_days?: number[];
}) {    
    const [hours, minutes] = reminder.time_of_day.split(':').map(Number);

    try {
      const prevIds = await _getScheduledIds(reminder._id);
      for (const id of prevIds) {
        try {
          await Notifications.cancelScheduledNotificationAsync(id);
        } catch (e) {
        }
      }
    } catch (e) {
  }

  const content = {
    title: reminder.title,
    body: reminder.message || 'Đã đến giờ nhắc hẹn!',
    sound: true,
    data: { reminder },
  };

  const newScheduledIds: string[] = [];

  // ============== CASE ONCE ==============
  if (reminder.repeat_type === 'once') {
  const now = new Date();
  const fireDate = new Date();
  fireDate.setHours(hours, minutes, 0, 0);

  if (fireDate.getTime() <= now.getTime()) {
    fireDate.setMinutes(fireDate.getMinutes() + 1);
  }

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content,
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: fireDate },
    });
    newScheduledIds.push(id);
  } catch (e) {
    console.warn('Failed to schedule once reminder', e);
  }

  await _setScheduledIds(reminder._id, newScheduledIds);
  return;
}

  // ============== CASE DAILY ==============
  if (reminder.repeat_type === 'daily') {
    const trigger = {
      hour: hours,
      minute: minutes,
      second: 0,
      repeats: true,
    } as any;

    try {
      const id = await Notifications.scheduleNotificationAsync({ content, trigger });
      newScheduledIds.push(id);
    } catch (e) {
      console.warn('Failed to schedule daily reminder', e);
    }

    await _setScheduledIds(reminder._id, newScheduledIds);
    return;
  }

  // ============== CASE CUSTOM ==============
  if (reminder.repeat_type === 'custom' && reminder.repeat_days && reminder.repeat_days.length > 0) {
    for (const day of reminder.repeat_days) {
      const expoWeekday = day === 6 ? 7 : day + 1; // 0=CN → 7, 1=T2 → 1, ...
      const trigger = {
        weekday: expoWeekday,
        hour: hours,
        minute: minutes,
        second: 0,
        repeats: true,
      } as any;

      try {
        const id = await Notifications.scheduleNotificationAsync({ content, trigger });
        newScheduledIds.push(id);
      } catch (e) {
        console.warn('Failed to schedule custom weekday reminder', e);
      }
    }

    await _setScheduledIds(reminder._id, newScheduledIds);
    return;
  }

  // Fallback: custom nhưng không chọn ngày → daily
  try {
    const trigger = {
      hour: hours,
      minute: minutes,
      repeats: true,
    } as any;
    const id = await Notifications.scheduleNotificationAsync({ content, trigger });
    newScheduledIds.push(id);
  } catch (e) {
    console.warn('Failed to schedule fallback daily reminder', e);
  }

  await _setScheduledIds(reminder._id, newScheduledIds);
}

// Hủy reminder
export async function cancelReminder(reminderId: string) {
  try {
    const ids = await _getScheduledIds(reminderId);
    for (const id of ids) {
      try {
        await Notifications.cancelScheduledNotificationAsync(id);
      } catch {
      }
    }
    await AsyncStorage.removeItem(`${SCHEDULED_KEY_PREFIX}${reminderId}`);
  } catch (e) {
    console.warn('Failed to cancel reminder', e);
  }
}

export async function cancelAllReminders() {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn('Failed to cancel all reminders', e);
  }
}

export async function getUnreadCount() {
  const raw = await AsyncStorage.getItem("UNREAD_REMINDERS");
  if (!raw) return 0;
  return JSON.parse(raw).length;
}