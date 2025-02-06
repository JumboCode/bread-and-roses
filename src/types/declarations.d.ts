declare module "js-cookie" {
  interface CookieAttributes {
    expires?: number | Date;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: "strict" | "lax" | "none";
  }

  interface CookiesStatic {
    set(key: string, value: string, options?: CookieAttributes): void;
    get(key: string): string | undefined;
    remove(key: string): void;
  }

  const Cookies: CookiesStatic;
  export = Cookies;
}
