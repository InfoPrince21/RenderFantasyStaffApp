const ForgotPasswordScreen = ({ navigation }) => {
  const [username, setUsername] = useState("");

  async function handleResetPassword() {
    try {
      await Auth.forgotPassword(username);
      navigation.navigate("ResetPasswordScreen", { username });
    } catch (error) {
      console.error("error resetting password:", error);
    }
  }

  return (
    <View>
      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <Button title="Reset Password" onPress={handleResetPassword} />
    </View>
  );
};

export default ForgotPasswordScreen;