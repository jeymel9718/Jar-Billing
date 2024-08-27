import { useEffect, useMemo, useState } from "react";
import * as Calendar from "expo-calendar";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { database } from "@/firebase/database";
import { Event } from "@/utils/types";
import {
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { ThemedView } from "@/components/ThemedView";
import { useEvents } from "@/hooks/useEvents";

export default function CalendarScreen() {
  const [newEvent, setNewEvent] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [duration, setDuration] = useState("1");

  const onChangeDate = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };

  const onChangeTime = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    const selectedTime = selectedDate || date;
    setDate(selectedTime);
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChangeDate,
      mode: "date",
      is24Hour: true,
    });
  };

  const showTimePicker = () => {
    DateTimePickerAndroid.open({
      value: date,
      onChange: onChangeTime,
      mode: "time",
      is24Hour: false,
    });
  };

  const events = useEvents();

  useEffect(() => {
    // Request Calendar permissions
    (async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        // Create or access a calendar
        const calendars = await Calendar.getCalendarsAsync(
          Calendar.EntityTypes.EVENT
        );
        const defaultCalendar = calendars.find(
          (calendar) => calendar.name === "Jar-Calendar"
        );
        if (!defaultCalendar) {
          await Calendar.createCalendarAsync({
            title: "Jar-Diseño L&M",
            color: "blue",
            entityType: Calendar.EntityTypes.EVENT,
            source: { name: "Expo", isLocalAccount: true, type: "" },
            name: "Jar-Calendar",
            ownerAccount: "personal",
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
          });
        }
      }
    })();
  }, []);

  const addEventToFirebase = async (event: Event) => {
    const newEventRef = database.getNewRef(`planner/events`);
    event.id = newEventRef.key;
    await database.pushData(newEventRef, {
      id: event.id,
      name: event.name,
      date: event.date.toLocaleString(),
      duration: event.duration
    });
  };

  const addEventToCalendar = async (event: Event) => {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const defaultCalendar = calendars.find(
      (calendar) => calendar.name === "Jar-Calendar"
    );
    if (defaultCalendar) {
      const previousDay = new Date(event.date);
      const endDate = new Date(event.date);
      endDate.setHours(event.date.getHours() + event.duration);
      previousDay.setDate(event.date.getDate() - 1)
      await Calendar.createEventAsync(defaultCalendar.id, {
        alarms: [{absoluteDate: previousDay.toString(), relativeOffset: -15}],
        title: event.name,
        startDate: event.date,
        endDate: endDate,
        timeZone: "GMT-6",
      });
    }
  };

  const handleAddEvent = async () => {
    if (newEvent) {
      const event = {
        id: "",
        name: newEvent,
        date: date,
        duration: parseInt(duration),
      };
      await addEventToFirebase(event);
      await addEventToCalendar(event);
      setNewEvent("");
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Text style={styles.title}>Planificador</Text>
      <TextInput
        label="Cita"
        placeholder="Nombre de la cita"
        value={newEvent}
        onChangeText={setNewEvent}
      />
      <View style={styles.buttonContainers}>
        <Button onPress={showDatePicker}>{date.toLocaleDateString()}</Button>
        <Button onPress={showTimePicker}>
          {date.getHours()}:{date.getMinutes()}
        </Button>
        <TextInput
          keyboardType="numeric"
          label="Duración"
          value={duration}
          onChangeText={setDuration}
          style={styles.durationInput}
        />
      </View>
      <Button
        onPress={handleAddEvent}
        disabled={newEvent === ""}
        mode="elevated"
      >
        Agregar cita
      </Button>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text>{item.name}</Text>
            <Text>{item.date.toLocaleString()}</Text>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  buttonContainers: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "space-around",
    alignItems: 'center',
  },
  durationInput: {
    margin: 5,
  },
  eventItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
});
