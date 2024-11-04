// import Divider from "@mui/material/Divider";

import Image from "next/image"
import logo1 from "../../public/logo1.png"

export default function LoginForm() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Image src={logo1} alt="Logo"/>
      <div
        className="p-6"
        style={{
          border: "1px solid #D0D5DD",
          borderRadius: "20px",
          boxShadow: "0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "0px",
          width: "500px",
        }}
      >
        <div className="flex flex-col items-center">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                color: "#9A0F28",
                fontSize: "36px",
                fontWeight: 600,
                fontFamily: "Kepler Std",
              }}
            >
              Welcome back!
            </div>
            <div
              style={{
                color: "#667085",
                fontSize: "18px",
                fontWeight: 400,
              }}
            >
              Please enter your details.
            </div>
          </div>
          <hr style={{ width: "100%", borderTop: "1px solid #D0D5DD" }} />

          <div>
            <form>
              <label htmlFor="email">Email: </label>
              <input type="text" id="email" name="email" />
              <br />
              <label htmlFor="password">Password: </label>
              <input type="password" id="password" name="password" />
              <br />
              <label htmlFor="remember">Remember me </label>
              <input type="checkbox" id="remember" name="remember" />
              <br />
              <input type="submit" value="Sign in" />
              <div style={{ color: "#667085", fontSize: "14px" }}>
              Don't have an account?{" "}
              <span style={{ color: "#145A5A", fontWeight: 600 }}>Sign up here</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
