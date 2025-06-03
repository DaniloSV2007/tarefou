import { useThemeContext } from "@/context/ThemeContext";
import { useState } from "react";
import { List } from "react-native-paper";

export default function ThemeSection() {
  const [expanded, setExpanded] = useState(false);
  const { toggleTheme } = useThemeContext();

  const handlePress = () => setExpanded(!expanded);
  return (
    <List.Section>
      <List.Accordion
        title="Theme"
        left={(props) => <List.Icon {...props} icon="theme-light-dark" />}
        expanded={expanded}
        onPress={handlePress}
      >
        <List.Item title="Device Theme" onPress={() => toggleTheme(0)} />
        <List.Item title="Light Theme" onPress={() => toggleTheme(1)} />
        <List.Item title="Dark Theme" onPress={() => toggleTheme(2)} />
      </List.Accordion>
    </List.Section>
  );
}
