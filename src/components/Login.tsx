import Divider from "@mui/material/Divider";

export default function LoginForm() {
  return (
    <div
      className="p-6"
      style={{
        border: "1px solid #D0D5DD",
        borderRadius: "20px",
        width: "500px",
        boxShadow: "0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814",
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
            <label for="email">Email: </label>
            <input type="text" id="email" name="email" />
            <br />
            <label for="password">Password: </label>
            <input type="text" id="password" name="password" />
            <br />
            <label for="remember">Remember me</label>
            <input type="checkbox" id="remember" name="remember" />
            <br />
            <input type="submit" value="Sign in" />
          </form>
        </div>
      </div>
      <div style={{ color: "#667085", fontSize: "14px" }}>
        Don't have an account?{" "}
        <span style={{ color: "#145A5A", fontWeight: 600 }}>Sign up here</span>
      </div>
    </div>
  );
}
