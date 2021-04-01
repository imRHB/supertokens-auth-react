import React from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import ThirdPartyEmailPassword from "supertokens-auth-react/recipe/thirdpartyemailpassword";
import dynamic from "next/dynamic";

const ThirdPartyEmailPasswordAuthNoSSR = dynamic(
    () => Promise.resolve().then(() => ThirdPartyEmailPassword.ThirdPartyEmailPasswordAuth),
    {
        ssr: false
    }
);

export default function Home() {
    async function logoutClicked() {
        await ThirdPartyEmailPassword.signOut();
        window.location.href = "/auth";
    }

    async function fetchUserData() {
        const res = await fetch("/api/user"); // TODO use relative path.
        const json = await res.json();
        alert(JSON.stringify(json));
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>SuperTokens 💫</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">Next.js!</a>
                </h1>
                <ThirdPartyEmailPasswordAuthNoSSR>
                    <p className={styles.description}>You are authenticated with SuperTokens!</p>

                    <div
                        style={{
                            display: "flex",
                            height: "70px",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            paddingLeft: "75px",
                            paddingRight: "75px"
                        }}>
                        <div
                            onClick={logoutClicked}
                            style={{
                                display: "flex",
                                width: "116px",
                                height: "42px",
                                backgroundColor: "#000000",
                                borderRadius: "10px",
                                cursor: "pointer",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                fontWeight: "bold"
                            }}>
                            SIGN OUT
                        </div>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            height: "70px",
                            alignItems: "center",
                            justifyContent: "flex-end",
                            paddingLeft: "75px",
                            paddingRight: "75px"
                        }}>
                        <div
                            onClick={fetchUserData}
                            style={{
                                display: "flex",
                                width: "150px",
                                height: "42px",
                                backgroundColor: "rgb(247 54 54)",
                                borderRadius: "10px",
                                cursor: "pointer",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                fontWeight: "bold"
                            }}>
                            FETCH USER API
                        </div>
                    </div>
                    <p>
                        <a
                            href="https://github.com/supertokens/supertokens-nextjs-demo"
                            rel="noreferer"
                            target="_blank">
                            View the code on GitHub
                        </a>
                    </p>
                </ThirdPartyEmailPasswordAuthNoSSR>

                <div className={styles.grid}>
                    <a href="https://supertokens.io/docs/emailpassword/introduction" className={styles.card}>
                        <h3>SuperTokens &rarr;</h3>
                        <p>Find in-depth information about SuperTokens.io features and API.</p>
                    </a>

                    <a className={styles.card}>
                        <h3>SSR with SuperTokens</h3>
                        <p>
                            These sections are rendered server side, before verifying if there was a SuperTokens
                            Session.
                        </p>
                    </a>

                    <a href="https://nextjs.org/docs" className={styles.card}>
                        <h3>Documentation &rarr;</h3>
                        <p>Find in-depth information about Next.js features and API.</p>
                    </a>

                    <a href="https://nextjs.org/learn" className={styles.card}>
                        <h3>Learn &rarr;</h3>
                        <p>Learn about Next.js in an interactive course with quizzes!</p>
                    </a>

                    <a href="https://github.com/vercel/next.js/tree/master/examples" className={styles.card}>
                        <h3>Examples &rarr;</h3>
                        <p>Discover and deploy boilerplate example Next.js projects.</p>
                    </a>

                    <a
                        href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                        className={styles.card}>
                        <h3>Deploy &rarr;</h3>
                        <p>Instantly deploy your Next.js site to a public URL with Vercel.</p>
                    </a>
                </div>
            </main>

            <footer className={styles.footer}>
                <a
                    href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
                    target="_blank"
                    rel="noopener noreferrer">
                    Powered by <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
                </a>
            </footer>
        </div>
    );
}
