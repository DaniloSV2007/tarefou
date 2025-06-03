import ProfileMenu from "@/components/Profile/ProfileMenu";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Divider,
  FAB,
  Icon,
  ProgressBar,
  Text,
  useTheme,
} from "react-native-paper";

export default function ProfileLogged() {
  const [todayProgress, setTodayProgress] = useState(0);
  const [weekProgress, setWeekProgress] = useState(0);

  const theme = useAppTheme();

  const router = useRouter();

  const [internalScrollEnabled, setInternalScrollEnabled] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  function handleScrollListener(
    event: NativeSyntheticEvent<NativeScrollEvent>
  ) {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 5;

    setInternalScrollEnabled((prev) => {
      if (prev !== isAtBottom) return isAtBottom;
      return prev;
    });
  }

  const handleOuterScroll = useCallback(
    Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
      useNativeDriver: false,
      listener: handleScrollListener,
    }),
    []
  );

  const avatarScale = scrollY.interpolate({
    inputRange: [0, 130],
    outputRange: [1, 0.75],
    extrapolate: "clamp",
  });

  const viewFontSize = scrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [30, 20],
    extrapolate: "clamp",
  });

  const opacityIcon = scrollY.interpolate({
    inputRange: [0, 30],
    outputRange: [1.0, 0.0],
    extrapolate: "clamp",
  });

  const cardTopMargin = scrollY.interpolate({
    inputRange: [0, 250],
    outputRange: [-10, -30],
    extrapolate: "clamp",
  });

  const cardLeftMargin = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [0, -60],
    extrapolate: "clamp",
  });

  const cardFont = scrollY.interpolate({
    inputRange: [0, 250],
    outputRange: [50, 35],
    extrapolate: "clamp",
  });

  const titleBoxHeight = scrollY.interpolate({
    inputRange: [0, 250],
    outputRange: [50, 20],
    extrapolate: "clamp",
  });

  useEffect(() => {
    setTodayProgress(80);
    setWeekProgress(67);
  }, []);

  return (
    <>
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <View style={styles.nameBox}>
          <Animated.View style={{ transform: [{ scale: avatarScale }] }}>
            <Avatar.Text label="DS" size={150} />
            <TouchableOpacity activeOpacity={0}>
              <FAB icon={"pencil"} style={styles.editButton} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.Text
            style={{
              color: theme.colors.onBackground,
              width: "94%",
              fontSize: 24,
              marginTop: -10,
              margin: -20,
              opacity: 0.8,
            }}
          >
            Admin
          </Animated.Text>
          <Animated.Text
            style={{
              fontWeight: "bold",
              color: theme.colors.onBackground,
              fontSize: viewFontSize,
            }}
          >
            Danilo Souza Voiski
          </Animated.Text>
        </View>
        <Animated.ScrollView
          style={{ width: "100%" }}
          contentContainerStyle={{ paddingTop: 270 }}
          onScroll={handleOuterScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.statisticsCardView}>
            <Card
              style={[
                styles.statisticsCard,
                {
                  backgroundColor: theme.custom.cardColor,
                },
              ]}
            >
              <Animated.View
                style={{
                  flexDirection: "row",
                  marginLeft: 15,
                  height: titleBoxHeight,
                  marginBottom: 5,
                }}
              >
                <Animated.View style={{ opacity: opacityIcon }}>
                  <Icon
                    size={50}
                    color={theme.colors.onBackground}
                    source={"google-analytics"}
                  />
                </Animated.View>
                <Animated.Text
                  style={[
                    styles.cardTitle,
                    {
                      marginTop: cardTopMargin,
                      marginLeft: cardLeftMargin,
                      fontSize: cardFont,
                      color: theme.colors.onBackground,
                    },
                  ]}
                >
                  Statistics
                </Animated.Text>
              </Animated.View>

              <Divider />

              <Card.Content style={{ gap: 5, marginTop: 10, maxHeight: "99%" }}>
                <ScrollView
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                  scrollEnabled={internalScrollEnabled}
                >
                  <Text
                    style={[
                      styles.cardText,
                      { color: theme.colors.onBackground },
                    ]}
                    variant="bodyMedium"
                  >
                    Members number: 2
                  </Text>
                  <Text
                    style={[
                      styles.cardText,
                      { color: theme.colors.onBackground },
                    ]}
                    variant="bodyMedium"
                  >
                    Total members score: 2430
                  </Text>
                  <Text
                    style={[
                      styles.cardText,
                      { color: theme.colors.onBackground },
                    ]}
                    variant="bodyMedium"
                  >
                    Today progress:
                  </Text>
                  <View
                    style={{
                      width: "80%",
                      paddingVertical: 5,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <View style={{ width: "80%" }}>
                      <ProgressBar
                        progress={todayProgress / 100}
                        color="#337eff"
                        fillStyle={{ borderRadius: 20 }}
                        style={{
                          height: 6,
                          borderRadius: 20,
                          backgroundColor: theme.colors.surface,
                        }}
                      />
                    </View>
                    <Text
                      style={[
                        styles.cardText,
                        { color: theme.colors.onBackground },
                      ]}
                    >
                      {todayProgress / 10}/10
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.cardText,
                      { color: theme.colors.onBackground },
                    ]}
                    variant="bodyMedium"
                  >
                    Week progress:
                  </Text>
                  <View
                    style={{
                      width: "80%",
                      paddingVertical: 5,
                      alignItems: "center",
                      flexDirection: "row",
                      gap: 10,
                    }}
                  >
                    <View style={{ width: "80%" }}>
                      <ProgressBar
                        progress={weekProgress / 100}
                        color="#337eff"
                        fillStyle={{ borderRadius: 20 }}
                        style={{
                          height: 6,
                          borderRadius: 20,
                          backgroundColor: theme.colors.surface,
                        }}
                      />
                    </View>
                    <Text
                      style={[
                        styles.cardText,
                        { color: theme.colors.onBackground },
                      ]}
                    >
                      {weekProgress}%
                    </Text>
                    <Button
                      children="Teste"
                      onPress={() => router.push("/profile/appinfo")}
                    />
                  </View>
                  <View
                    style={{
                      maxHeight: 200,
                    }}
                  ></View>
                  {Array.from({ length: 30 }).map((_, index) => (
                    <Text
                      key={index}
                      variant="headlineLarge"
                      style={[
                        styles.cardText,
                        { color: theme.colors.onBackground },
                      ]}
                    >
                      Linha de conteúdo {index + 1}
                    </Text>
                  ))}
                </ScrollView>
              </Card.Content>
            </Card>
          </View>
        </Animated.ScrollView>
      </View>
    </>
  );
}

const useTema = () => useTheme();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  nameBox: {
    flexDirection: "column",
    alignItems: "center",
    gap: 20,
    marginTop: 30,
    paddingHorizontal: 20,
    position: "absolute",
    top: 0,
  },
  icon: {
    justifyContent: "center",
    marginLeft: 20,
  },
  editButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderRadius: 99,
    backgroundColor: "#337eff",
    color: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  statisticsCardView: {
    flex: 1,
    width: "100%",
    height: 669,
  },
  cardTitle: {
    fontSize: 60,
    padding: 2,
    color: "white",
  },
  cardText: {
    fontSize: 22,
    height: 30,
    color: "white",
  },
  statisticsCard: {
    padding: 30,
    borderRadius: 30,
    height: "100%",
    borderBottomEndRadius: 0,
    borderBottomLeftRadius: 0,
  },
});
