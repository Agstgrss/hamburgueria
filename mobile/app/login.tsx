import { useState } from "react";
import { colors, spacing, fontSize } from "@/constants/theme";
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Platform,
  Alert ,
} from "react-native";

import { Input } from "../components/input";
import { Button } from "../components/button";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter} from 'expo-router';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  async function handleLogin() {

    if(!email.trim()  || !password.trim()){
        Alert.alert("Atenção", "Preencha todos os campos!");
        return;
    }

    try{
        setLoading(true);
        await signIn(email, password)
        router.replace("/(authenticated)/dashboard")
    }catch(err){
        Alert.alert("ERRO", "Erro ao fazer o login");
    } finally{
        setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={"padding"}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoText}>Augusto</Text>

          <Text style={[styles.logoText, styles.logoBrand]}>
            Hamburgueria
          </Text>

          <Text style={styles.logoSubtitle}>Garçom app</Text>
        </View>


        <View style={styles.formContainer}>
          <Input
            label="Email"
            placeholder="Digite seu email..."
            placeholderTextColor={colors.gray}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Senha"
            placeholder="Digite sua senha..."
            placeholderTextColor={colors.gray}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Button
            title="Acessar"
            loading={loading}
            onPress={handleLogin}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    flex: 1,
  },
  scrollContent: {
    justifyContent: "center",
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.xl,
  },
  logoText: {
    fontSize: 34,
    fontWeight: "bold",
    color: colors.primary,
  },
  logoBrand: {
    color: colors.brand,
  },
  logoSubtitle: {
    color: colors.primary,
    fontSize: fontSize.lg,
  },
  formContainer: {
    width: "100%",
    gap: spacing.md,
  },
});
