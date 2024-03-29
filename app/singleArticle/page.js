"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

// export default function Page() {
//   return;
// }
export default function ({ searchParams }) {
  const router = useRouter();
  const [articles, fetchArticles] = useState("");
  const [Token, fetchedToken] = useState("");
  const articleId = searchParams.id;

  // fetch data from backend using axios

  useEffect(() => {
    const fetchData = async (req, res) => {
      const token = localStorage.getItem("authToken");
      fetchedToken(token);
      try {
        const response = await axios.get(
          `http://localhost:3001/api/articles/article/${articleId}`
        );
        // console.log(response.data);
        fetchArticles(response.data);
      } catch (error) {
        console.error("Axios error:", error);
        // res.setCode(401).json(error);
      }
    };
    fetchData();
  }, []);

  const LogoutButton = async (e) => {
    try {
      const token = localStorage.removeItem("authToken");
      fetchedToken(token);
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
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
          {Token ? (
            <Link
              href="/postArticles"
              className={styles.navlinks}
              scroll={false}
            >
              Post
            </Link>
          ) : (
            <Link href="/login" className={styles.navlinks} scroll={false}>
              Log in
            </Link>
          )}

          {Token ? (
            <button
              type="button"
              onClick={LogoutButton}
              className={styles.createaccountbutton}
            >
              logout
            </button>
          ) : (
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className={styles.createaccountbutton}
            >
              Create account{" "}
            </button>
          )}
        </div>
      </header>
      <div className={styles.outerwrapper}>
        <div className={styles.articleswrapper}>
          {articles ? (
            <>
              <div key={articles._id} className={styles.articleBox}>
                <article>
                  <div className={styles.authorContainer}>
                    <img
                      className={styles.authorImage}
                      src={articles.author.imageUrl}
                      alt="Profile Image"
                    />
                    <p className={styles.authorname}>
                      {articles.author.username}
                    </p>
                  </div>
                  <div className={styles.titleContainer}>
                    <p className={styles.title}>{articles.title}</p>
                  </div>
                  <div className={styles.tagsContainer}>
                    {articles.taglist.map((tags) => {
                      return <span> #{tags} </span>;
                    })}
                  </div>

                  <div className={styles.bodyContainer}>
                    <p className={styles.body}>{articles.body}</p>
                  </div>
                  <div className={styles.comments_likes}>
                    <p className={styles.likesText}>
                      <span className={styles.heartImage}>
                        <img src="/heart-regular.svg" />
                      </span>
                      like
                    </p>
                    <p className={styles.commentText}>
                      <span>
                        <img
                          className={styles.commentImage}
                          src="/comment-regular.svg"
                        />
                      </span>
                      Comment
                    </p>
                  </div>
                </article>
              </div>
            </>
          ) : (
            <>
              <p>loading...</p>
            </>
          )}
        </div>
        <div className={styles.populartagscontainer}>
          <aside>
            <h1>#discuss</h1>
            <p>Discussion threads targeting the whole community</p>
            {/* change as per content dynamic */}
            <div>
              <h3>Hot 🔥 Topics</h3>
              <div>
                <span>1</span>comments
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
