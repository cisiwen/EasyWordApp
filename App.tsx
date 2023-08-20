import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import SearchPage from './src/ui/SearchPage';
import WordDetailPage from './src/ui/WordDetailPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './src/ui/layout/BottomTab';
import { PaperProvider } from 'react-native-paper';
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" options={
            {
              headerShown: false
            }
          } component={BottomTab} />
          <Stack.Screen name="WordDetail" component={WordDetailPage} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
export default MyStack
