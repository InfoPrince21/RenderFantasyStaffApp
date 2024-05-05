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
import { Ionicons as IoniconsNative } from "@expo/vector-icons";
import { Ionicons as IoniconsWeb } from "react-native-vector-icons/Ionicons";
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
import { useDispatch } from "react-redux";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

let Ionicons = IoniconsNative; // Assign the default (native) icon set to Ionicons

// Conditional assignment for web platform
if (Platform.OS === "web") {
  Ionicons = IoniconsWeb;
}

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

    // Further adjustment for clarity and visibility
    activeTintColor: "#FFFFFF", // Bright yellow for selected item text, ensuring high visibility
    activeBackgroundColor: "#136C6F", // Deep teal for the background of the selected item
    inactiveTintColor: "#A7E5E3", // Light teal for text of non-selected items
    inactiveBackgroundColor: "#003366", // Navy blue for background of non-selected items
  },
};

const customLightTheme = {
  ...lightTheme,
  "color-primary-100": "#CCD6E4", // Very light blue, for background elements
  "color-primary-200": "#99ADC9", // Lighter blue, for low emphasis areas
  "color-primary-300": "#6684AE", // Medium blue, for informational elements
  "color-primary-400": "#336B93", // Rich blue, for interactive or highlighted components
  "color-primary-500": "#003366", // Navy blue for primary action items
  "color-primary-600": "#2A9DF4", // Cerulean Blue for active states and focus elements
  "color-primary-700": "#00224D", // Deeper navy blue for text and critical icons
  "color-primary-800": "#001A40", // Very dark navy for headers and emphasized text
  "color-primary-900": "#001334", // Nearly black navy for footer and dense text areas
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
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Teams"
        component={TeamsScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Players"
        component={PlayersScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Captains"
        component={CaptainsScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "shield-checkmark" : "shield-checkmark-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="DraftRoom"
        component={DraftRoomScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "clipboard" : "clipboard-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "chatbubbles" : "chatbubbles-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="PlayerRankings"
        component={PlayerRankingsScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "bar-chart" : "bar-chart-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="TeamRankings"
        component={TeamRankingsScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "podium" : "podium-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Awards"
        component={AwardsScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "ribbon" : "ribbon-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="RedeemPoints"
        component={RedeemPointsScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "gift" : "gift-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="QuizMe"
        component={QuizMeScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "help-circle" : "help-circle-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="StudyGuide"
        component={StudyGuideScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "book" : "book-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Records"
        component={RecordsScreen}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Profile"
        component={ProfileNavigator}
        options={{
          drawerIcon: ({ focused, color, size }) => (
            <Ionicons
              name={focused ? "person-circle" : "person-circle-outline"}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // State to hold the email
  // const dispatch = useDispatch();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
        setUserEmail(session?.user?.email || null); // Update userEmail state
      }
    );
    // dispatch(fetchPlayers());
    // dispatch(fetchTeams());

    return () => authListener?.unsubscribe();
  }, [supabase]);

  return (
    <>
      <Provider store={store}>
        <ThemeContextProvider>
          <ApplicationProvider {...eva} theme={customLightTheme}>
            <NavigationContainer theme={MyDrawerTheme}>
              {isAuthenticated ? (
                <DrawerNavigator/>
              ) : (
                <AuthNavigator />
              )}
            </NavigationContainer>
          </ApplicationProvider>
        </ThemeContextProvider>
      </Provider>
    </>
  );
}

export default App;
