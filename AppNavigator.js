import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ClientScreen from './screens/ClientScreen';
import BookABusScreen from './screens/BookABusScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import AdminMainScreen from './screens/admin/AdminMainScreen';
import BookingRequestsScreen from './screens/admin/BookingRequestsScreen';
import VehiclesScreen from './screens/admin/VehiclesScreen';
import DriversScreen from './screens/admin/DriversScreen';
import WorkScheduleScreen from './screens/admin/WorkScheduleScreen';
import AddTripScreen from './screens/admin/AddTripScreen';
import EditUsersScreen from './screens/admin/EditUsersScreen';
import EditDriversScreen from './screens/admin/EditDriversScreen';
import { AuthProvider } from './contexts/AuthContext';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStackScreen = () => (
  <Stack.Navigator>
    <Stack.Screen name="ClientScreen" component={ClientScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BookABus" component={BookABusScreen} />
  </Stack.Navigator>
);

const ProfileStackScreen = () => (
  <Stack.Navigator>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
  </Stack.Navigator>
);

const SearchStackScreen = () => (
  <Stack.Navigator>
    <Stack.Screen name="SearchScreen" component={SearchScreen} />
  </Stack.Navigator>
);

const AppTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;

        if (route.name === 'Home') {
          iconName = 'home-outline';
        } else if (route.name === 'Search') {
          iconName = 'search-outline';
        } else if (route.name === 'Profile') {
          iconName = 'person-outline';
        }

        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: 'tomato',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Home" component={HomeStackScreen} />
    <Tab.Screen name="Search" component={SearchStackScreen} />
    <Tab.Screen name="Profile" component={ProfileStackScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="WelcomeScreen">
      <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="BookABusScreen" component={BookABusScreen} />
      <Stack.Screen name="ClientScreen" component={ClientScreen} options={{ headerShown: false }} />
      <Stack.Screen name="AdminScreen" component={AdminMainScreen} options={{ headerShown: false }} />
      <Stack.Screen name="BookingRequestsScreen" component={BookingRequestsScreen} />
      <Stack.Screen name="VehiclesScreen" component={VehiclesScreen} />
      <Stack.Screen name="DriversScreen" component={DriversScreen} />
      <Stack.Screen name="WorkScheduleScreen" component={WorkScheduleScreen} />
      <Stack.Screen name="AddTripScreen" component={AddTripScreen} />
      <Stack.Screen name="EditUsersScreen" component={EditUsersScreen} />
      <Stack.Screen name="EditDriversScreen" component={EditDriversScreen} />
      <Stack.Screen name="AppTabs" component={AppTabs} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
);

const App = () => (
  <AuthProvider>
    <AppNavigator />
  </AuthProvider>
);

export default App;
