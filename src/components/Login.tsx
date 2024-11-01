
export default function LoginForm() {
  return (
    <div style={{ border: "1px solid black", borderRadius: "20px", display: "flex", flexDirection: "column", alignItems: "center", padding: '24px'}}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
        <div style={{color: "#9A0F28", fontSize: "36px"}}>Welcome back!</div>
        <div style={{color: "#667085", fontSize: "18px"}}>Please enter your details.</div>
      </div>
      <hr style={{width: "100%", borderTop: "1px solid red"}}/>

      <div>
        {/* <form>
          <label for="email">Email: </label><input type="text" id="email" name="email"><br/>
          <label for="password">Password: </label><input type="text" id="password" name="password"><br/>
          <label for="remember">Remember me</label><input type="checkbox" id="remember" name="remember"><br/>
          <input type="submit" value="Sign in">
        </form> */}
        </div>
    </div>
  );
}
