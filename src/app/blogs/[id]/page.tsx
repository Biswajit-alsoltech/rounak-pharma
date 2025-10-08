"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import parse from "html-react-parser";
import Navbar from "@/components/Navbar"; // ✅ Corrected import path
import Footer from "@/components/Footer";

type BloggerEntry = {
  id: { $t: string };
  title: { $t: string };
  content: { $t: string };
  published: { $t: string };
};

type BloggerResponse = {
  feed: {
    entry?: BloggerEntry[];
  };
};

const ArticleSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse">
    <div className="h-10 bg-gray-300 rounded-md w-3/4 mb-6"></div>
    <div className="h-6 bg-gray-300 rounded-md w-1/3 mb-10"></div>
    <div className="space-y-4">
      <div className="h-5 bg-gray-300 rounded-md w-full"></div>
      <div className="h-5 bg-gray-300 rounded-md w-full"></div>
      <div className="h-5 bg-gray-300 rounded-md w-5/6"></div>
    </div>
  </div>
);


const NotFoundState = () => {
  const router = useRouter();
  return (
    <div className="flex-grow flex flex-col items-center justify-center text-center px-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Post Not Found</h2>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, we couldn’t find the article you’re looking for. It might have
        been moved or deleted.
      </p>
      <button
        onClick={() => router.push("/blogs")}
        className="rounded-md bg-indigo-600 px-6 py-3 text-white font-semibold shadow-sm hover:bg-indigo-500 transition-transform hover:scale-105"
      >
        &larr; Back to All Posts
      </button>
    </div>
  );
};

export default function BlogDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<BloggerEntry | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      setLoading(true);
      try {

        const response = await axios.get("/api/blogs");
        const allEntries: BloggerEntry[] = response.data.blogs.flatMap(
          (blog: BloggerResponse) => blog.feed.entry || []
        );

        const found = allEntries.find(
          (e) => e.id.$t.split("-").pop() === id
        );

        setPost(found || null);
      } catch (error) {
        console.error("Error fetching post:", error);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {loading ? (
        <ArticleSkeleton />
      ) : !post ? (
        <NotFoundState />
      ) : (
        <article className="w-full max-w-4xl mx-auto px-4 py-20 flex-grow">
          <header className="mb-10 border-b pb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight tracking-tight">
              {post.title.$t}
            </h1>
            <p className="text-gray-500">
              Published on{" "}
              {new Date(post.published.$t).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          <div className="prose prose-lg lg:prose-xl max-w-none">
            {parse(post.content.$t)}
          </div>
        </article>
      )}

      <Footer />
    </main>
  );
}
