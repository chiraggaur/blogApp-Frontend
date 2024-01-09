"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useRef, useCallback, useState } from "react";
import axios from "axios";
export default function Signup() {
  const [status, articleResponse] = useState("");
  const router = useRouter();
  const titleRef = useRef("");
  const descriptionRef = useRef("");
  const bodyRef = useRef("");
  const tagListRef = useRef("");

  const postArticle = useCallback(async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
      // Redirect to the login page if the token is not present
      router.push("/login");
    }
    try {
      const response = await axios.post(
        `http://localhost:3001/api/articles/addarticle`,
        {
          title: titleRef.current.value,
          description: descriptionRef.current.value,
          body: bodyRef.current.value,
          taglist: tagListRef.current.value.split(","),
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      articleResponse(response.data.message);
      titleRef.current.value = "";
      descriptionRef.current.value = "";
      bodyRef.current.value = "";
      tagListRef.current.value = "";
      return router.push("/");
    } catch (error) {
      if (error.response.status === 401) {
        articleResponse(error.response.data.message);
        // Display the error message to the user
      } else {
        console.log("An error occurred:", error);
      }
    }
  }, []);

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
        <h4 className={styles.registertitle}>Post Article</h4>
        <form className={styles.signupform}>
          <div className={styles.signupdetails}>
            <label>Title</label>
            <input
              ref={titleRef}
              className={styles.input}
              type="text"
              name="title"
            ></input>
          </div>
          <div className={styles.signupdetails}>
            <label>description</label>
            <input
              ref={descriptionRef}
              className={styles.input}
              type="text"
              name="description"
            ></input>
          </div>

          <div className={styles.signupdetails}>
            <label>Taglist</label>
            <input
              ref={tagListRef}
              className={styles.input}
              type="text"
              name="taglist"
            ></input>
          </div>

          <div className={styles.signupdetails}>
            <label>Body</label>
            <textarea
              ref={bodyRef}
              className={styles.bodyInput}
              type="text"
              name="body"
            ></textarea>
          </div>

          <div className={styles.submitdetails}>
            <button
              onClick={postArticle}
              type="submit"
              className={styles.signupbutton}
            >
              Post
            </button>
          </div>
          <p>{status}</p>
        </form>
      </div>
    </main>
  );
}
