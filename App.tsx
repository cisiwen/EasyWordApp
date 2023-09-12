import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import SearchPage from './src/ui/SearchPage';
import WordDetailPage from './src/ui/WordDetailPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import BottomTab from './src/ui/layout/BottomTab';
import { MD3DarkTheme, MD3LightTheme, PaperProvider } from 'react-native-paper';
import MathPageGame from './src/ui/MathPageGame';
import {
  ThemeProvider,
  DarkTheme,
  DefaultTheme,
  useTheme,
} from "@react-navigation/native";
const Stack = createNativeStackNavigator();

function MyStack() {
  return (
    <ThemeProvider value={DarkTheme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" options={
            {
             
              statusBarStyle: "dark",
              headerShown: false
            }
          } component={BottomTab} />
          <Stack.Screen name="WordDetail" options={{
            headerShown: true,
            headerTitle: "",
            headerShadowVisible: false,
            headerTransparent: true,
            gestureEnabled: true,
            gestureDirection: "vertical",
            animation: "slide_from_bottom"
          }} component={WordDetailPage} />
          <Stack.Screen name="MathPageGame" component={MathPageGame}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}
export default MyStack
