import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SearchPage from '../SearchPage';
import MathPage from '../MathPage';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Octicons } from '@expo/vector-icons'; 
const BottomTab = () => {
    const Tab = createBottomTabNavigator();
    return <Tab.Navigator>
        <Tab.Screen options={
            {
                tabBarIcon: ({ color, size }) => (
                    <Ionicons name="language" color={color} size={size} />
                ),
            }
        } name="Word" component={SearchPage} />
        <Tab.Screen options={
            {
                tabBarIcon: ({ color, size }) => (
                    <Octicons name="number" color={color} size={size} />
                )
            }
        } name="Math" component={MathPage} />
    </Tab.Navigator>
}

export default BottomTab;