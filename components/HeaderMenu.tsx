import { StyleSheet, View } from "react-native";
import { IconButton, Menu, MenuProps } from "react-native-paper";
import { HeaderButtonProps } from "@react-navigation/native-stack/src/types";

type HeaderMenuProps = MenuProps & {
  headerProps: HeaderButtonProps;
  onSave: () => void;
  onDelete: () =>  void;
  onShare: () => void;
  onPreview: () => void;
};

export default function HeaderMenu({
  headerProps,
  onSave,
  onDelete,
  onShare,
  onPreview,
  ...rest
}: HeaderMenuProps) {
  return (
    <View {...headerProps} style={styles.container}>
      <IconButton onPress={onSave} icon="content-save" />
      <Menu {...rest}>
        <Menu.Item leadingIcon="content-save" title="Guardar" onPress={onSave} />
        <Menu.Item leadingIcon="file-eye" title="Vista previa" onPress={onPreview} />
        <Menu.Item leadingIcon="share-variant" title="Enviar" onPress={onShare} />
        <Menu.Item leadingIcon="delete" title="Eliminar" onPress={onDelete} />
      </Menu>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  }
});