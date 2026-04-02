import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { supabase } from "../supabaseClient";  
import "../styles/login.css";

export default function Login() {
  const navigate = useNavigate();
  const [active, setActive] = useState(false);

  const [signInData, setSignInData] = useState({
    email: "",
    password: "",
  });

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSignInChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignUpChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    const email = signInData.email.trim();
    const password = signInData.password.trim();

    if (!email || !password) {
      alert("All fields are required");
      return;
    }

    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email,
    //   password,
    // });

    // if (error) {
    //   alert(error.message);
    //   return;
    // }

    alert("Login successful ✅");
    navigate("/home");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const name = signUpData.name.trim();
    const email = signUpData.email.trim();
    const password = signUpData.password.trim();

    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    // const { data, error } = await supabase.auth.signUp({
    //   email,
    //   password,
    //   options: {
    //     data: {
    //       full_name: name,
    //     },
    //   },
    // });

    // if (error) {
    //   alert(error.message);
    //   return;
    // }

    alert("Signup successful ✅");
    navigate("/home");
  };

  const googleSignUp = () => {
    alert("Google Sign Up clicked");
  };

  return (
    <div className="login-page">
      <div className={`container ${active ? "active" : ""}`} id="container">
        <div className="form-container sign-up">
          <form id="signupForm" onSubmit={handleSignUp}>
            <h1>Create Account</h1>

            <span>Use your email for registration</span>

            <input
              type="email"
              name="email"
              placeholder="📧 Email"
              value={signUpData.email}
              onChange={handleSignUpChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="🔒 Password"
              value={signUpData.password}
              onChange={handleSignUpChange}
              required
            />

            <input
              type="text"
              name="name"
              placeholder="👤 Full Name"
              value={signUpData.name}
              onChange={handleSignUpChange}
              required
            />

            <button type="submit">Sign Up</button>

            <p style={{ margin: "15px 0" }}>— OR —</p>

            <button
              type="button"
              className="google-btn"
              onClick={googleSignUp}
            >
              Continue with Google (Quick Secure Login)
            </button>
          </form>
        </div>

        <div className="form-container sign-in">
          <form id="signinForm" onSubmit={handleSignIn}>
            <div className="title">
              <h1>Welcome to SafeRide AI</h1>
              <p style={{ fontSize: "13px", opacity: 0.7 }}>
                Real-time AI monitoring for safer journeys
              </p>
            </div>

            <h2>Sign In</h2>

            <span>Use your email and password</span>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signInData.email}
              onChange={handleSignInChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signInData.password}
              onChange={handleSignInChange}
              required
            />

            <label style={{ fontSize: "12px", marginTop: "5px" }}>
              <input type="checkbox" /> Remember Me
            </label>

            <a href="#">Forgot Your Password?</a>
            <button type="submit">Sign In</button>

            <p style={{ fontSize: "12px", marginTop: "10px" }}>
              🔍 AI monitors your ride in real-time for safety
            </p>
          </form>
        </div>

        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome to SafeRide AI</h1>
              <p>AI-powered safety for smarter rides 🚗</p>
              <button
                type="button"
                className="hidden"
                onClick={() => setActive(false)}
              >
                Sign In
              </button>
            </div>

            <div className="toggle-panel toggle-right">
              <h1>Join SafeRide AI 🚗</h1>

              <p>Create an account to experience AI-powered ride safety</p>

              <p style={{ fontSize: "12px", marginTop: "10px", opacity: 0.8 }}>
                🤖 Smart alerts • 📍 Live tracking • 🚨 Emergency detection
              </p>

              <button
                type="button"
                className="hidden"
                onClick={() => setActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}