import { StyleSheet, View } from "react-native";
import { IconButton, Menu, MenuProps } from "react-native-paper";
import { HeaderButtonProps } from "@react-navigation/native-stack/src/types";
import { useState } from "react";

type HeaderMenuProps = {
  headerProps: HeaderButtonProps;
  onSave: () => void;
  onShare: () => void;
  onPreview: () => void;
  onPaid?: () => void;
};

export default function HeaderMenu({
  headerProps,
  onSave,
  onShare,
  onPreview,
  onPaid,
}: HeaderMenuProps) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <View {...headerProps} style={styles.container}>
      <IconButton onPress={onSave} icon="content-save" />
      <Menu
        style={styles.menu}
        anchor={
          <IconButton icon="dots-vertical" onPress={() => setShowMenu(true)} />
        }
        visible={showMenu}
        onDismiss={() => setShowMenu(false)}
      >
        <Menu.Item
          leadingIcon="content-save"
          title="Guardar"
          onPress={onSave}
        />
        <Menu.Item
          leadingIcon="file-eye"
          title="Vista previa"
          onPress={onPreview}
        />
        <Menu.Item
          leadingIcon="share-variant"
          title="Enviar"
          onPress={onShare}
        />
        {onPaid && (
          <Menu.Item
            leadingIcon="checkbox-marked"
            title="Marcar como pagada"
            onPress={onPaid}
          />
        )}
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
  },
  menu: {
    marginTop: 30,
  },
});
