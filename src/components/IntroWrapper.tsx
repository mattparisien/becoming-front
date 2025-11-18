'use client';

import { useIntro } from "@/context/IntroContext";
import IntroScreen from "./IntroScreen";

export default function IntroWrapper() {
  const { isIntroActive } = useIntro();

  if (!isIntroActive) return null;

  return <IntroScreen />;
}
