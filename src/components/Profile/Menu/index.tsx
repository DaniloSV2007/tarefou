import { useAuth } from "@/context/AuthContext";
import { useAppTheme } from "@/hooks/useAppTheme";
import { useRouter } from "expo-router";
import {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useMemo,
  useCallback,
} from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Divider,
  Icon,
  Portal,
  Text,
  TouchableRipple,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ConfirmLogout from "./ConfirmLogout";
import { useTranslation } from "react-i18next";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

export type Ref = BottomSheetModal;

export interface MenuProps {
  close: () => void | void;
  children?: React.ReactNode;
}

const Menu = forwardRef<Ref, MenuProps>(function ProfileMenu(
  { close, children },
  ref
) {
  const router = useRouter();
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  const { t } = useTranslation();

  const snapPoints = useMemo(() => ["23%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    []
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: theme.custom.cardColor,
        paddingBottom: insets.bottom,
        borderTopStartRadius: 32,
        borderTopEndRadius: 32,
      }}
      handleIndicatorStyle={{
        height: 8,
        backgroundColor: theme.colors.onBackground,
      }}
      handleStyle={{ padding: 12 }}
    >
      <BottomSheetView>
        <Divider
          style={{ backgroundColor: theme.colors.surface, height: 0.5 }}
        />
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

export default Menu;
