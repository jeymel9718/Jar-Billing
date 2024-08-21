import { database } from "@/firebase/database";
import { ItemProps } from "@/utils/types";
import { useEffect, useState } from "react";

export function useBillItems(dispatch: any, billType: string, id: string) {
  const [items, setItems] = useState<ItemProps[]>([]);

  useEffect(() => {
    if (id === "") {
      return;
    }

    const readReference = database.read(`${billType}-items/${id}`, (snapshot) => {
      if (snapshot.exists()) {
        const data: ItemProps[] = [];
        let amount = 0;
        Object.values(snapshot.val()).forEach((child) => {
          const tmpItem = child as ItemProps;
          amount += parseInt(tmpItem.price);
          data.push(tmpItem);
        });
        setItems(data);
        dispatch({ type: "subTotal", payload: amount.toString() });
      }
    });

    return () => database.stopRead(`${billType}-items/${id}`, readReference);
  }, [id]);

  return items;
}