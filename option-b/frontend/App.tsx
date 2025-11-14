import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text } from 'react-native';

const Stack = createNativeStackNavigator();

function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-zinc-900">
      <Text className="text-white text-2xl font-semibold">Agrawal Frankie Food App</Text>
      <Text className="text-zinc-300 mt-2">React Native + Expo scaffold</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={Home} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
