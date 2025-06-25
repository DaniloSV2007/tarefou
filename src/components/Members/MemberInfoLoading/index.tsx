import { useAppTheme } from "@/hooks/useAppTheme";
import ContentLoader, { Circle, Rect } from "react-content-loader/native";
import { StyleSheet } from "react-native";
import { Card } from "react-native-paper";

type Props = {
  key: any;
};

export default function MemberInfoLoading() {
  const theme = useAppTheme();

  const MembersLoading = () => (
    <ContentLoader
      viewBox="0 0 380 70"
      animate={true}
      speed={2}
      backgroundColor={theme.custom.cardTaskBackground}
      foregroundColor="gray"
      width={476}
      height={218}
    >
      <Circle cx="74" cy="19" r="19" />
      <Rect x="108" y="6" rx="4" ry="4" width="200" height="16" />
      <Rect x="108" y="28" rx="2" ry="2" width="100" height="8" />
      <Rect x="55" y="48" rx="4" ry="4" width="270" height="12" />
      <Rect x="55" y="68" rx="4" ry="4" width="180" height="12" />
      <Rect x="55" y="106" rx="2" ry="2" width="100" height="8" />
      <Rect x="245" y="98" rx="12" ry="12" width="80" height="24" />
    </ContentLoader>
  );

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: theme.custom.cardColor,
          marginBottom: 16,
          paddingTop: 0,
        },
      ]}
    >
      <Card.Content style={{ alignItems: "center", marginTop: -60 }}>
        <MembersLoading />
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    paddingVertical: 12,
    paddingBottom: 0,
    borderRadius: 16,
  },
});
