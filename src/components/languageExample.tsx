import { useTranslation } from "react-i18next";

export default function Translator() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "es" : "en");
  };

  return (
    <div>
      <p>{t("welcome")}</p>
      <button onClick={toggleLanguage}>{t("button")}</button>
    </div>
  );
}
