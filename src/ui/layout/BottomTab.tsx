import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchPage from '../SearchPage';
import MathPage from '../MathPage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Octicons } from '@expo/vector-icons';
import MathSettingPage from '../MathSettingPage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MathLayout from './MathLayout';
import { useEffect } from 'react';
import { EventArg, useNavigation } from '@react-navigation/native';
import { INavPageProps } from '../../models/Word';
import { SafeAreaView } from 'react-native';
const BottomTab = (props: INavPageProps<any>) => {
    const Tab = createBottomTabNavigator();
    const navigation = useNavigation();
    const toggleSearchBar = (e: EventArg<string, any>) => {
        console.log("toggleSearchBar", e.target);
        navigation?.setOptions({
            //headerShown: (e?.target && e.target.indexOf("Word")>-1) ?? false,
        })

    }
    return <SafeAreaView style={{flex:1}}>
        <Tab.Navigator>
            <Tab.Screen
                options={
                    {

                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="language" color={color} size={size} />
                        ),
                    }
                }
                name="Word"
                listeners={{
                    tabPress: (e) => {
                        toggleSearchBar(e);
                    }
                }}
                component={SearchPage} />
            <Tab.Screen
                options={
                    {
                        headerShown: false,
                        tabBarIcon: ({ color, size }) => (
                            <Octicons name="number" color={color} size={size} />
                        )
                    }
                }
                listeners={{
                    tabPress: (e) => {
                        toggleSearchBar(e);
                    }
                }}
                name="MathLayout"
                component={MathLayout} />
        </Tab.Navigator>
    </SafeAreaView>

}

export default BottomTab;