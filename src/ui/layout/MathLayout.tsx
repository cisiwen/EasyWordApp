import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MathPage from "../MathPage";
import MathSettingPage from "../MathSettingPage";
import { useEffect } from "react";
import { INavPageProps } from "../../models/Word";
import { SafeAreaView } from "react-native";

const MathLayout = (props: INavPageProps<any>) => {
    const nestNav = createNativeStackNavigator();
    return <SafeAreaView style={{flex:1}}>
        <nestNav.Navigator>
            <nestNav.Screen 
                name="Math" 
                options={{ 
                    headerShown: true
                }} 
                component={MathPage} />
            <nestNav.Group screenOptions={{ presentation: "modal" }}>
                <nestNav.Screen name="MathSetting" options={
                    {
                        headerTitle: "Setting",
                        headerShadowVisible: false,
                        headerTransparent: true,
                        gestureEnabled: true,
                        gestureDirection: "vertical",
                        animation: "slide_from_bottom"
                    }
                } component={MathSettingPage} />
            </nestNav.Group>
        </nestNav.Navigator>
    </SafeAreaView>
}

export default MathLayout;