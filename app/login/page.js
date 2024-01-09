"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import axios from "axios";
export default function Signup() {
  const [status, responsestatus] = useState("");
  const router = useRouter();
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      let response = await axios.post("http://localhost:3001/api/user/signin", {
        email: emailRef.current.value,
        password: passwordRef.current.value,
      });
      let Token = response.data.user.token;
      // Store the token securely
      localStorage.setItem("authToken", Token);
      responsestatus(response.data.message);
      emailRef.current.value = " ";
      passwordRef.current.value = " ";
      return router.push("/");
    } catch (error) {
      if (error.response.status === 401) {
        responsestatus(error.response.data.message);
        // Display the error message to the user
      } else {
        console.log("An error occurred:", error);
      }
    }
  };
  return (
    <main>
      <header className={styles.header}>
        <div className={styles.logowrapper}>
          <Link href="/" className={styles.logotext} scroll={false}>
            CONCOR
          </Link>
        </div>
        <div className={styles.navwrapper}>
          <Link href="/" className={styles.navlinks} scroll={false}>
            Home
          </Link>
          <Link href="/login" className={styles.navlinks} scroll={false}>
            Log in
          </Link>

          <button
            type="button"
            onClick={() => router.push("/signup")}
            className={styles.signupbutton}
          >
            Create account{" "}
          </button>
        </div>
      </header>

      <div className={styles.formwrapper}>
        <h4 className={styles.registertitle}>Login</h4>
        <form className={styles.signupform}>
          <div className={styles.signupdetails}>
            <label>Email</label>
            <input
              ref={emailRef}
              className={styles.input}
              type="text"
              name="email"
            ></input>
            {/* <p>{emailerror}</p> */}
          </div>
          <div className={styles.signupdetails}>
            <label>Password</label>
            <input
              ref={passwordRef}
              className={styles.input}
              type="text"
              name="password"
            ></input>
            {/* <p>{passworderror}</p> */}
          </div>
          <div className={styles.submitdetails}>
            <button
              type="submit"
              onClick={handleClick}
              className={styles.signupbutton}
            >
              Submit
            </button>
            <p>{status}</p>
          </div>
        </form>
      </div>
    </main>
  );
}
