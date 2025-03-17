import Cookies from "js-cookie";

export const setRememberMeCookie = (token: string, rememberMe: boolean) => {
  if (rememberMe) {
    Cookies.set("authToken", token, {
      expires: 30,
      secure: true,
      sameSite: "strict",
    });
  } else {
    Cookies.set("authToken", token)
  }
};
