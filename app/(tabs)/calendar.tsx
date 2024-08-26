import { useEffect, useState } from "react";
import * as Calendar from "expo-calendar";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { database } from "@/firebase/database";
import { Event } from "@/utils/types";
import { child } from "firebase/database";

export default function CalendarScreen() {
  const [events, setEvents] = useState<Event[]>([]);
  const [newEvent, setNewEvent] = useState("");

  useEffect(() => {
    // Sync with Firebase
    const unsubscribe = database.read("planner/events", (snapshot) => {
      if (snapshot.exists()) {
        const data: Event[] = [];
        snapshot.forEach((child) => {
          const childData = child.val();
          data.push({id: childData.id, name: childData.name, date: new Date(childData.date)});
        })
        setEvents(data);
      }
    });

    return () => unsubscribe();
  }, []);

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
          (calendar) => calendar.source.name === "Default"
        );
        if (!defaultCalendar) {
          await Calendar.createCalendarAsync({
            title: "Expo Planner",
            color: "blue",
            entityType: Calendar.EntityTypes.EVENT,
            source: { name: "Expo", isLocalAccount: true, type: ""},
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
          });
        }
      }
    })();
  }, []);

  const addEventToFirebase = async (event: Event) => {
    const newEventRef = database.getNewRef(`planner/events`);
    event.id = newEventRef.key;
    await database.pushData(newEventRef, {id: event.id, name: event.name, date: event.date.toDateString()});
  };

  const addEventToCalendar = async (event: Event) => {
    const calendars = await Calendar.getCalendarsAsync(
      Calendar.EntityTypes.EVENT
    );
    const defaultCalendar = calendars.find(
      (calendar) => calendar.source.name === "Default"
    );

    if (defaultCalendar) {
      await Calendar.createEventAsync(defaultCalendar.id, {
        title: event.name,
        startDate: event.date,
        endDate: new Date(event.date.getTime() + 60 * 60 * 1000), // 1 hour duration
        timeZone: "GMT",
      });
    }
  };

  const handleAddEvent = async () => {
    if (newEvent) {
      const event = {
        id: "",
        name: newEvent,
        date: new Date(),
      };
      await addEventToFirebase(event);
      await addEventToCalendar(event);
      setNewEvent("");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planner</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter event name"
        value={newEvent}
        onChangeText={setNewEvent}
      />
      <Button onPress={handleAddEvent} >Add Event</Button>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text>{item.name}</Text>
            <Text>{item.date.toString()}</Text>
          </View>
        )}
      />
    </View>
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
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  eventItem: {
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
});
