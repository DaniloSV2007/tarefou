import { useThemeContext } from "@/context/ThemeContext";
import { forwardRef, useMemo, useCallback } from "react";

import { Divider } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import React from "react";

export type Ref = BottomSheetModal;

export interface MenuProps {
  close: () => void | void;
  children?: React.ReactNode;
}

const Menu = forwardRef<Ref, MenuProps>(function ProfileMenu(
  { children },
  ref,
) {
  const { theme } = useThemeContext();
  const insets = useSafeAreaInsets();

  const childrenCount = React.Children.toArray(children).filter(Boolean).length;
  const multCount = childrenCount * 5;
  const snapPoints = useMemo(() => [`${8 + multCount}%`], [childrenCount]);

  const renderBackdrop = useCallback(
    // eslint-disable-next-line
    (props: any) => (
      <BottomSheetBackdrop
        appearsOnIndex={1}
        disappearsOnIndex={-1}
        {...props}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={1}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      backgroundStyle={{
        backgroundColor: theme.colors.cardColor,
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
