import { database } from '@/firebase/database';
import { sortEvents } from '@/utils/functions';
import { Event } from '@/utils/types';
import { useEffect, useState } from "react";

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  useEffect(() => {
    // Sync with Firebase
    const unsubscribe = database.read("planner/events", (snapshot) => {
      if (snapshot.exists()) {
        const data: Event[] = [];
        snapshot.forEach((child) => {
          const childData = child.val();
          data.push({
            id: childData.id,
            name: childData.name,
            date: new Date(childData.date),
            duration: childData.duration
          });
        });
        setEvents(sortEvents(data));
      }
    });

    return () => unsubscribe();
  }, []);

  return events;
}