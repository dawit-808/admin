import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import classes from "./Auth.module.css";

function Auth() {
  const [mode, setMode] = useState("login");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isLogin = mode === "login";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? "http://localhost:5000/auth/login"
      : "http://localhost:5000/auth/register";

    try {
      setError(""); // clear any old error

      const payload = isLogin
        ? { email, password }
        : { fullName, email, password, role: "admin" };

      const res = await axios.post(url, payload);

      if (isLogin) {
        localStorage.setItem("token", res.data.token);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.token}`;
        navigate("/");
      } else {
        setMode("login");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
    }
  };

  return (
    <div className={classes.authWrapper}>
      <div className={classes.card}>
        <h2 className={classes.title}>
          {isLogin ? "Admin Login" : "Register Admin"}
        </h2>
        {error && <div className={classes.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              className={classes.input}
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <input
            className={classes.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className={classes.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className={classes.button} type="submit">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className={classes.toggle}>
          {isLogin ? (
            <>
              Don’t have an account?{" "}
              <span onClick={() => setMode("register")}>Register</span>
            </>
          ) : (
            <>
              Already registered?{" "}
              <span onClick={() => setMode("login")}>Login</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}

export default Auth;
