import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SearchPage from './src/ui/SearchPage';
import WordDetailPage from './src/ui/WordDetailPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={SearchPage} />
        <Stack.Screen name="WordDetail" component={WordDetailPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
export default MyStack
