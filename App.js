import React, { useState, useEffect, useCallback } from "react";
import { store } from "./store/store.js";
import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { supabase } from "./supabaseClient";
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
  GameHistoryScreen,
  RecordsScreen,
  ProfileScreen,
  LoginScreen,
  ForgotPasswordScreen,
  SignUpScreen,
  ConfirmSignUpScreen,
  NextStepScreen,
  SetupProfileScreen,
} from "./screens";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
      <Stack.Screen name="NextStep" component={NextStepScreen} />
      <Stack.Screen name="SetupProfile" component={SetupProfileScreen} />
    </Stack.Navigator>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Profile">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Teams" component={TeamsScreen} />
      <Drawer.Screen name="Players" component={PlayersScreen} />
      <Drawer.Screen name="Captains" component={CaptainsScreen} />
      <Drawer.Screen name="Player Rankings" component={PlayerRankingsScreen} />
      <Drawer.Screen name="Team Rankings" component={TeamRankingsScreen} />
      <Drawer.Screen name="Awards" component={AwardsScreen} />
      <Drawer.Screen name="Redeem Points" component={RedeemPointsScreen} />
      <Drawer.Screen name="Chat Room" component={ChatRoomScreen} />
      <Drawer.Screen name="QuizMe" component={QuizMeScreen} />
      <Drawer.Screen name="StudyGuide" component={StudyGuideScreen} />
      <Drawer.Screen name="Game History" component={GameHistoryScreen} />
      <Drawer.Screen name="Records" component={RecordsScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthState = useCallback(async (event, session) => {
    if (session) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    const { data: authListener } =
      supabase.auth.onAuthStateChange(checkAuthState);

    return () => {
      authListener.unsubscribe();
    };
  }, [checkAuthState]);

  return (
    <Provider store={store}>
      <NavigationContainer>
        {isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </Provider>
  );
}

export default App;
