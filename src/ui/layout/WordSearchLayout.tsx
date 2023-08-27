import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native";
import SearchPage from "../SearchPage";

const WordSearchLayout = () => {
    const nestNav = createNativeStackNavigator();
    return <SafeAreaView style={{ flex: 1 }}>
        <nestNav.Navigator>
            <nestNav.Screen
                name="WordSearch"
                options={{
                    headerShown: true
                }}
                component={SearchPage} />
        </nestNav.Navigator>
    </SafeAreaView>
}

export default WordSearchLayout;