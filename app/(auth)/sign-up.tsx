import { Octicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
  Alert,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

function SignUpScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSecure, setIsSecure] = useState(true);

  async function signUpWithEmail() {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password: password.trim(),
    });
    if (data) {
      Alert.alert("Sign Up Successful");
      setEmail("");
      setPassword("");
      AsyncStorage.setItem("session", JSON.stringify(data.session));

      return console.log("Sign Up Successful", data);
    }

    if (error) {
      Alert.alert("Error SignIn up");
      return console.log("Error", error);
    }
  }
  return (
    <SafeAreaView className="flex-1 ">
      <View style={styles.inputView}>
        <TextInput
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Enter email"
          style={styles.input}
          autoCorrect={false}
        />
      </View>
      <View style={styles.inputView}>
        <TextInput
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          style={styles.input}
          secureTextEntry={isSecure}
          autoCorrect={false}
        />
        {isSecure ? (
          <TouchableOpacity onPress={() => setIsSecure(false)}>
            <Octicons name="eye-closed" size={20} color="grey" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setIsSecure(true)}>
            <Octicons name="eye" size={20} color="grey" />
          </TouchableOpacity>
        )}
      </View>

      <Pressable
        onPress={() => signUpWithEmail()}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignContent: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ fontSize: 28, color: "white" }}>Sign Up</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputView: {
    backgroundColor: "white",
    borderRadius: 16,
    borderCurve: "continuous",
    marginTop: 16,
    marginLeft: "5%",
    marginRight: "5%",
    shadowColor: "blue",
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.9,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  input: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    fontSize: 16,
    flex: 1,
  },

  regMemberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "7%",
  },
});

export default SignUpScreen;
