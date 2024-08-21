import { database } from "@/firebase/database";
import { useEffect } from "react";
import { Alert } from "react-native";

type Bill = {
  key: string;
  type: string;
}

export function useDiscardChanges(navigation: any, unsaved: boolean, id: string, bill: Bill) {
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      if (!unsaved) {
        return;
      }

      const discardChanges = () => {
        if (bill.key === "new") {
          database.deleteData(`${bill.type}-items/${id}`).then(() => {
            navigation.dispatch(e.data.action);
          });
        } else {
          navigation.dispatch(e.data.action);
        }
      };

      e.preventDefault();
      Alert.alert(
        "Cambios sin guardar",
        "Existen cambios sin guardar. ¿Desea salir sin guardar los cambios?",
        [
          { text: "Seguir editando", style: "cancel", onPress: () => {} },
          {
            text: "Salir",
            style: "destructive",
            onPress: discardChanges,
          },
        ]
      );
    });

    return unsubscribe;
  }, [navigation, id, unsaved]);
}