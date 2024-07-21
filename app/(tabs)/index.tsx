import { Image, StyleSheet, Platform, Dimensions } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HStack } from '@/components/ui/hstack';
import { Box } from '@/components/ui/box';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@/components/ui/text';

const windowDimensions = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">¡Bienvenido!</ThemedText>
        <HelloWave />
      </ThemedView>
      <HStack space="2xl">
        <Box className="shadow-md rounded-xl bg-lime-200 p-2 justify-between" style={styles.boxContainer}>
          <Ionicons size={20} name="reader"/>
          <Text bold={true}>Agregar nueva cotización</Text>
        </Box>
        <Box className="shadow-md rounded-xl bg-lime-200 p-2 justify-between" style={styles.boxContainer}>
          <Ionicons size={20} name="receipt"/>
          <Text bold={true}>Agregar nueva factura</Text>
        </Box>
      </HStack>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  boxContainer: {
    width: windowDimensions.width*0.38,
    height: windowDimensions.height*0.12,
  }
});
