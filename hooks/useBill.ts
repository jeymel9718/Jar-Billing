import { database } from "@/firebase/database";
import { Invoice } from "@/utils/types";
import { useEffect, useState } from "react";

export function useBill(dispatch: any, key: string, setDate: any, type: 'price' | 'invoice') {
  const [ref, setRef] = useState<any>();

  useEffect(() => {
    if (key === "new") {
      const newRef = database.getNewRef(type);
      setRef(newRef);
      dispatch({ type: "id", payload: newRef.key });
      database.readOnce(`counters/${type}s`)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const orderId: number = snapshot.val();
            dispatch({ type: "orderId", payload: `${orderId + 1}` });
          }
        })
        .catch((error) => {
          console.info("Error:", error);
        });
    } else {
      database.readOnce(`${type}/${key}`).then((snapshot) => {
        if (snapshot.exists()) {
          const currentPrice: Invoice = snapshot.val();
          Object.keys(currentPrice).forEach((key) => {
            const priceKey = key as keyof Invoice;
            if (key === "date") {
              setDate(new Date(currentPrice[key]));
            } else {
              dispatch({ type: priceKey, payload: currentPrice[priceKey] });
            }
          });
        }
      });
    }
  }, [key]);

  return ref;
}