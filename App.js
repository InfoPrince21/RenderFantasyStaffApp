import React, { useState, useEffect, useCallback } from "react";
import { Provider as ReduxProvider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import * as eva from "@eva-design/eva";

import { store } from "./redux/store";
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
  ResetPasswordScreen,
  EditProfileScreen,
} from "./screens";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const customTheme = {
  ...eva.light,
  // Define your colors based on the logo colors
};

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
      <Stack.Screen name="NextStep" component={NextStepScreen} />
      <Stack.Screen name="SetupProfile" component={SetupProfileScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      {/* Add other screens for your auth flow here */}
    </Stack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MyProfile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      {/* Add other screens related to profile here */}
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
      <Drawer.Screen name="PlayerRankings" component={PlayerRankingsScreen} />
      <Drawer.Screen name="TeamRankings" component={TeamRankingsScreen} />
      <Drawer.Screen name="Awards" component={AwardsScreen} />
      <Drawer.Screen name="RedeemPoints" component={RedeemPointsScreen} />
      <Drawer.Screen name="ChatRoom" component={ChatRoomScreen} />
      <Drawer.Screen name="QuizMe" component={QuizMeScreen} />
      <Drawer.Screen name="StudyGuide" component={StudyGuideScreen} />
      <Drawer.Screen name="GameHistory" component={GameHistoryScreen} />
      <Drawer.Screen name="Records" component={RecordsScreen} />
      <Drawer.Screen name="Profile" component={ProfileNavigator} />
      {/* Add other screens for your drawer navigation here */}
    </Drawer.Navigator>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthState = useCallback(async () => {
    const session = supabase.auth.session();
    setIsAuthenticated(!!session);
  }, []);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );

    checkAuthState();

    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, [checkAuthState]);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={customTheme}>
        <ReduxProvider store={store}>
          <NavigationContainer>
            {isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />}
          </NavigationContainer>
        </ReduxProvider>
      </ApplicationProvider>
    </>
  );
}

export default App;
