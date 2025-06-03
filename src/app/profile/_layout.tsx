import { Slot, useRouter } from "expo-router";

export default function ProfileLayout() {
  const router = useRouter();

  return (
    <>
      <Slot />
    </>
  );
}
