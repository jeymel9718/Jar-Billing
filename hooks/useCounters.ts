import { database } from "@/firebase/database";
import { useEffect, useState } from "react";

export function useCounters(type: string) {
  const [counter, setCounter] = useState<number>(-1);
  useEffect(() => {
    database
      .readOnce(`counters/${type}s`)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const orderId: number = snapshot.val();
          setCounter(orderId);
        }
      })
      .catch((error) => {
        console.info("Error:", error);
      });
  }, [type]);

  return counter;
}
