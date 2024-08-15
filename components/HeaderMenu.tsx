import { StyleSheet, View } from "react-native";
import { IconButton, Menu, MenuProps } from "react-native-paper";
import { HeaderButtonProps } from "@react-navigation/native-stack/src/types";

type HeaderMenuProps = {
  headerProps: HeaderButtonProps;
  onSave: () => void;
  onShare: () => void;
  onPreview: () => void;
  visible: any;
  anchor: any;
  onDismiss: () => void;
};

export default function HeaderMenu({
  headerProps,
  onSave,
  onShare,
  onPreview,
  ...rest
}: HeaderMenuProps) {
  return (
    <View {...headerProps} style={styles.container}>
      <IconButton onPress={onSave} icon="content-save" />
      <Menu style={styles.menu} {...rest}>
        <Menu.Item leadingIcon="content-save" title="Guardar" onPress={onSave} />
        <Menu.Item leadingIcon="file-eye" title="Vista previa" onPress={onPreview} />
        <Menu.Item leadingIcon="share-variant" title="Enviar" onPress={onShare} />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  menu: {
    marginTop: 30,
  }
});