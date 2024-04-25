import React, { useState, useEffect, useCallback } from "react";
import { Provider as ReduxProvider } from "react-redux";
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import {
  Provider as PaperProvider,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import { store } from "./redux/store.js";
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
} from "./screens";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const MyTheme = {
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: "#005f73",
    accent: "#e9d8a6",
    background: "#001219",
    surface: "#0a9396",
    text: "#94d2bd",
    onSurface: "#eee",
    disabled: "#555",
    placeholder: "#ccc",
    backdrop: "#333",
  },
};

// Create a matching navigation theme
const NavigationTheme = {
  ...NavigationDefaultTheme,
  colors: {
    ...NavigationDefaultTheme.colors,
    primary: "#0077b6", // A vibrant, deeper blue for primary actions
    background: "#fafafa", // Off-white, almost gray, soft on the eyes
    card: "#ffffff", // Pure white for cards to maintain clear distinction from the background
    text: "#003566", // Navy blue for text, offers good readability
    border: "#bbbbbb", // Soft gray for borders to subtly define spaces without harsh contrasts
    notification: "#ef476f", // Bright fuchsia for notifications to pop against the softer background
  },
};

function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="ConfirmSignUp" component={ConfirmSignUpScreen} />
      <Stack.Screen name="NextStep" component={NextStepScreen} />
      <Stack.Screen name="SetupProfile" component={SetupProfileScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name="ProfileStack" component={ProfileScreen} />
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
      <Drawer.Screen name="Profile" component={ProfileNavigator} />
    </Drawer.Navigator>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthState = useCallback(async (event, session) => {
    setIsAuthenticated(!!session);
  }, []);

  useEffect(() => {
    const { data: authListener } =
      supabase.auth.onAuthStateChange(checkAuthState);
    return () => {
      authListener.unsubscribe();
    };
  }, [checkAuthState]);

  return (
    <PaperProvider theme={MyTheme}>
      <ReduxProvider store={store}>
        <NavigationContainer theme={NavigationTheme}>
          {isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />}
        </NavigationContainer>
      </ReduxProvider>
    </PaperProvider>
  );
}

export default App;
