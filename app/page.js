"use client";
import Link from "next/link";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

// export default function Page() {
//   return;
// }
export default function Page() {
  const router = useRouter();
  const [articles, fetchArticles] = useState("");
  const [Token, fetchedToken] = useState("");
  const [status, loginStatus] = useState("");
  const [sorted, sortArticles] = useState("");

  // fetch data from backend using axios

  useEffect(() => {
    const fetchData = async (req, res) => {
      const token = localStorage.getItem("authToken");
      fetchedToken(token);
      try {
        const response = await axios.get(
          `http://localhost:3001/api/articles/listarticles?sort=${sorted}`
        );
        // console.log(response.data[0].author);
        fetchArticles(response.data);
      } catch (error) {
        console.error("Axios error:", error);
        // res.setCode(401).json(error);
      }
    };
    fetchData();
  }, [sorted]);

  const LogoutButton = async (e) => {
    try {
      const token = localStorage.removeItem("authToken");
      fetchedToken(token);
      router.push("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  const handleComment = () => {
    const token = localStorage.getItem("authToken");
    fetchedToken(token);
    if (!Token) {
      loginStatus("login/createAccount");
    }
    // Navigate to the article route with elm._id as a query parameter
  };
  const handleStatus = () => {
    // Navigate to the article route with elm._id as a query parameter
    router.push("/login");
  };

  const sortByNewest = () => {
    // Navigate to the article route with elm._id as a query parameter
    sortArticles("newest");
  };

  const sortByOldest = () => {
    // Navigate to the article route with elm._id as a query parameter
    sortArticles("oldest");
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
        <div className={styles.filterWrapper}>
          <button onClick={sortByNewest} className={styles.filterButton}>
            Newest
          </button>
          <button onClick={sortByOldest} className={styles.filterButton}>
            Oldest
          </button>
        </div>
        <div className={styles.articleswrapper}>
          {articles ? (
            articles.map((elm) => {
              return (
                <>
                  <div key={elm._id} className={styles.articleBox}>
                    <article>
                      <div className={styles.authorContainer}>
                        <img
                          className={styles.authorImage}
                          src={elm.author.imageUrl}
                          alt="Profile Image"
                        />
                        <p className={styles.authorname}>
                          {elm.author.username}
                        </p>
                      </div>
                      <div className={styles.titleContainer}>
                        <Link
                          href={{
                            pathname: "/singleArticle",
                            query: {
                              id: elm._id,
                            },
                          }}
                          className={styles.titleLink}
                        >
                          <p className={styles.title}>{elm.title}</p>
                        </Link>
                      </div>
                      <div className={styles.tagsContainer}>
                        {elm.tagList ? (
                          <p>
                            {elm.tagList.map((tags) => {
                              <span>{tags}</span>;
                            })}
                          </p>
                        ) : (
                          <p>{elm.tagList}</p>
                        )}
                      </div>
                      <div className={styles.comments_likes}>
                        <p className={styles.likesText}>
                          <span className={styles.heartImage}>
                            <img src="/heart-regular.svg" />
                          </span>
                          like
                        </p>
                        <p
                          className={styles.commentText}
                          onClick={handleComment}
                        >
                          <span>
                            <img
                              className={styles.commentImage}
                              src="/comment-regular.svg"
                            />
                          </span>
                          Comment
                        </p>
                      </div>
                      <p className={styles.loginStatus} onClick={handleStatus}>
                        {status}
                      </p>
                    </article>
                  </div>
                </>
              );
            })
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
