import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { SectionMarker } from "./SectionMarker";
import { portfolioCopy, type Language, type Post } from "./content";

const POST_COUNT = 5;

export function RecentPosts({ language }: { language: Language }) {
  const copy = portfolioCopy[language].posts;
  const [posts, setPosts] = useState<Post[] | "loading" | "failed">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/posts", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`posts answered ${response.status}`);
        return response.json() as Promise<{ posts: Post[] }>;
      })
      .then((data) => setPosts(data.posts))
      .catch(() => {
        if (!controller.signal.aborted) setPosts("failed");
      });
    return () => controller.abort();
  }, []);

  const dateFormat = new Intl.DateTimeFormat(language === "pt" ? "pt-BR" : "en", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <section id="posts" className="section-wrap section-spacing">
      <div className="section-heading">
        <div>
          <SectionMarker number="04" label={copy.label} />
          <h2>
            {copy.title1}
            <br />
            <em>{copy.title2}</em>
          </h2>
        </div>
        <p>{copy.subtitle}</p>
      </div>
      {posts === "failed" ? (
        <p className="post-unavailable">{copy.unavailable}</p>
      ) : (
        <ol className="post-list" aria-busy={posts === "loading"}>
          {posts === "loading"
            ? // Empty rows hold the space, so the page below doesn't jump when the posts arrive.
              Array.from({ length: POST_COUNT }, (_, i) => (
                <li key={i} aria-hidden="true">
                  <div className="post-row">
                    <div className="post-thumb" />
                  </div>
                </li>
              ))
            : posts.map((post) => (
                <li key={post.link}>
                  <a className="post-row" href={post.link} target="_blank" rel="noreferrer">
                    <div className="post-thumb">{post.image && <img src={post.image} alt="" loading="lazy" decoding="async" />}</div>
                    <div className="post-text">
                      <time dateTime={post.date}>{dateFormat.format(new Date(post.date))}</time>
                      <h3 lang="pt-BR">{post.title}</h3>
                      {post.excerpt && <p lang="pt-BR">{post.excerpt}</p>}
                    </div>
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                </li>
              ))}
        </ol>
      )}
      <a className="text-link post-all" href="https://medium.com/@tudoemsimas" target="_blank" rel="noreferrer">
        {copy.all} <ArrowUpRight size={14} />
      </a>
    </section>
  );
}
