import { database } from "@/firebase/database";
import { Invoice } from "@/utils/types";
import { useEffect, useState } from "react";

export function usePrices() {
  const [prices, setPrice] = useState<Invoice[]>([]);
  
  useEffect(() => {
    database.readOnce('price').then((snapshot) => {
        if (snapshot.exists()) {
            const data: Invoice[] = []
            snapshot.forEach((child) => {
                data.push(child.val() as Invoice);
            });
            setPrice(data);
        }
    })
  }, []);

  return prices;
}