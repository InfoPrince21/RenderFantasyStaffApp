import React, { useState, useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { light as lightTheme } from "@eva-design/eva";
import { ThemeContextProvider } from "./theme-context";
import { supabase } from "./supabaseClient";
import * as Platform from "react-native";

import {
  HomeScreen,
  TeamsScreen,
  PlayersScreen,
  CaptainsScreen,
  PlayerRankingsScreen,
  TeamRankingsScreen,
  AwardsScreen,
  RedeemPointsScreen,
  ChatRoomScreen,
  QuizMeScreen,
  StudyGuideScreen,
  DraftRoomScreen,
  RecordsScreen,
  ProfileScreen,
  LoginScreen,
  ForgotPasswordScreen,
  SignUpScreen,
  ConfirmSignUpScreen,
  ResetPasswordScreen,
  EditProfileScreen,
} from "./screens";
import { fetchPlayers } from "./features/players/playersSlice";
import { fetchTeams } from "./features/teams/teamsSlice";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MyDrawerTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#003366",
    background: "#ffffff",
    card: "#ffffff",
    text: "#001A40",
    border: "#ffffff",
    notification: "#25BEB9",
    activeTintColor: "#FFFFFF",
    activeBackgroundColor: "#136C6F",
    inactiveTintColor: "#A7E5E3",
    inactiveBackgroundColor: "#003366",
  },
};

const customLightTheme = {
  ...lightTheme,
  "color-primary-100": "#CCD6E4",
  "color-primary-200": "#99ADC9",
  "color-primary-300": "#6684AE",
  "color-primary-400": "#336B93",
  "color-primary-500": "#003366",
  "color-primary-600": "#2A9DF4",
  "color-primary-700": "#00224D",
  "color-primary-800": "#001A40",
  "color-primary-900": "#001334",
};

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyProfile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Teams" component={TeamsScreen} />
      <Drawer.Screen name="Players" component={PlayersScreen} />
      <Drawer.Screen name="Captains" component={CaptainsScreen} />
      <Drawer.Screen name="DraftRoom" component={DraftRoomScreen} />
      <Drawer.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Drawer.Screen name="PlayerRankings" component={PlayerRankingsScreen} />
      <Drawer.Screen name="TeamRankings" component={TeamRankingsScreen} />
      <Drawer.Screen name="Awards" component={AwardsScreen} />
      <Drawer.Screen name="RedeemPoints" component={RedeemPointsScreen} />
      <Drawer.Screen name="QuizMe" component={QuizMeScreen} />
      <Drawer.Screen name="StudyGuide" component={StudyGuideScreen} />
      <Drawer.Screen name="Records" component={RecordsScreen} />
      <Drawer.Screen name="Profile" component={ProfileNavigator} />
    </Drawer.Navigator>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setUserEmail(session?.user?.email || null);
      }
    );

    return () => authListener?.unsubscribe();
  }, [supabase]);

  return (
    <>
      <Provider store={store}>
        <ThemeContextProvider>
          <ApplicationProvider {...eva} theme={customLightTheme}>
            <NavigationContainer theme={MyDrawerTheme}>
              {isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />}
            </NavigationContainer>
          </ApplicationProvider>
        </ThemeContextProvider>
      </Provider>
    </>
  );
}

export default App;
