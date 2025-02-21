"use client"; // Mark this as a client component

import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n";

export default function TranslationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
