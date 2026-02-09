import { View, TextInput, Text, StyleSheet, TextInputProps } from "react-native";
import { colors, spacing, fontSize, borderRadius } from "@/constants/theme";

interface InputProps extends TextInputProps {
  label?: string;
}

export function Input({ label, style, ...rest }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.gray}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: spacing.md,
  },
  label: {
    marginBottom: spacing.xs,
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: "600",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    fontSize: fontSize.md,
    color: colors.primary,
    backgroundColor: colors.background,
  },
});
