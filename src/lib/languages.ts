import Cookies from "js-cookie";

// Set the language in the cookie
export const setLanguageCookie = (language: string) => {
  Cookies.set("language", language, { expires: 30 }); // Cookie expires in 30 days
};

// Get the language from the cookie
export const getLanguageFromCookie = (): string => {
  return Cookies.get("language") || "en";
};
