"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image"; // ✅ Use Next.js Image component
import Navbar from "@/components/Navbar"; // ✅ Corrected import path
import Footer from "@/components/Footer"; // ✅ Corrected import path

// --- Type Definitions ---
type BloggerEntry = {
    id: { $t: string };
    title: { $t: string };
    link: { rel: string; href: string }[];
    content: { $t: string };
    published: { $t: string };
};

// Add this new type
type BloggerResponse = {
  feed?: {
    entry?: BloggerEntry[];
  };
};

type BlogPost = {
    id: string;
    title: string;
    link: string;
    content: string;
    published: string;
};

// --- Helper Functions ---
const extractImageUrl = (htmlContent: string): string => {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = htmlContent.match(imgRegex);
    // Use a local fallback image for better performance and control
    return match ? match[1] : "/images/blog-fallback.png";
};

const createSnippet = (htmlContent: string, maxLength: number = 110): string => {
    // This removes all HTML tags to create a plain text snippet
    const plainText = htmlContent.replace(/<[^>]*>/g, "").replace(/\s+/g, ' ').trim();
    return plainText.length <= maxLength ? plainText : plainText.substring(0, maxLength) + "...";
};


// --- UI Components ---
const SkeletonCard = () => (
    <div className="animate-pulse rounded-xl bg-white p-4 shadow-lg">
        <div className="h-48 rounded-lg bg-gray-300"></div>
        <div className="mt-4 space-y-3">
            <div className="h-4 w-1/3 rounded bg-gray-300"></div>
            <div className="h-6 w-full rounded bg-gray-300"></div>
            <div className="h-4 w-full rounded bg-gray-300"></div>
            <div className="h-4 w-4/5 rounded bg-gray-300"></div>
        </div>
    </div>
);


const BlogPostCard: React.FC<{ post: BlogPost }> = ({ post }) => {
    const imageUrl = extractImageUrl(post.content);
    const snippet = createSnippet(post.content);
    const formattedDate = new Date(post.published).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <Link
            href={`/blogs/${post.id}`}
            className="group block overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2"
        >
            <div className="relative h-48 w-full overflow-hidden">
                {/* ✅ Replaced <img> with next/image <Image> for optimization */}
                <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized // Recommended for external URLs not configured in next.config.js
                />
            </div>
            <div className="p-6">
                <p className="mb-2 text-sm font-medium text-indigo-500">{formattedDate}</p>
                <h2 className="mb-3 text-xl font-bold text-gray-800 group-hover:text-indigo-600">
                    {post.title || "Untitled Post"}
                </h2>
                <p className="text-gray-600 leading-relaxed">{snippet}</p>
                <div className="mt-4 flex items-center text-sm font-semibold text-indigo-600">
                    Read More →
                </div>
            </div>
        </Link>
    );
};


// --- Main Page Component ---
const BlogPage: React.FC = () => {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    const fetchPosts = useCallback(async () => {
    setStatus("loading");
    try {
        const bloggerUrlsString = process.env.NEXT_PUBLIC_BLOGGER_URL || "";
        const bloggerUrls = bloggerUrlsString.split(",").map(url => url.trim()).filter(Boolean);

        if (!Array.isArray(bloggerUrls) || bloggerUrls.length === 0) {
            throw new Error("Blogger URLs are not configured in the environment variable.");
        }

        const responses = await Promise.all(
            bloggerUrls.map((url: string) => fetch(url).then(res => {
                if (!res.ok) throw new Error(`Failed to fetch from ${url}`);
                return res.json();
            }))
        );

        // ✅ FIX APPLIED HERE
        // Define the type for the response object
        type BloggerResponse = {
            feed?: {
                entry?: BloggerEntry[];
            };
        };

        // Use the new type instead of 'any'
        const allEntries: BloggerEntry[] = responses.flatMap(
            (blog: BloggerResponse) => blog?.feed?.entry || []
        );

        if (allEntries.length === 0) {
            setPosts([]);
            setStatus("success");
            return;
        }

        const formatted = allEntries.map((entry) => ({
            id: entry.id.$t.split("-").pop() || "",
            title: entry.title.$t,
            link: entry.link.find((l) => l.rel === "alternate")?.href || "#",
            content: entry.content?.$t || "",
            published: entry.published.$t,
        }));

        const sortedPosts = formatted.sort(
            (a, b) => new Date(b.published).getTime() - new Date(a.published).getTime()
        );

        setPosts(sortedPosts);
        setStatus("success");
    } catch (err) {
        console.error("Error fetching posts:", err);
        setStatus("error");
    }
}, []);


    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <SkeletonCard key={index} />
                        ))}
                    </div>
                );
            case 'error':
                return (
                    <div className="text-center py-20">
                        <p className="text-xl text-red-500 mb-4">Oops! Something went wrong while fetching blogs.</p>
                        <button
                            onClick={fetchPosts}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-white font-semibold shadow-sm hover:bg-indigo-500 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                );
            case 'success':
                if (posts.length === 0) {
                    return <p className="text-center text-gray-600 py-20 text-xl">No blog posts found.</p>;
                }
                return (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post) => (
                            <BlogPostCard key={post.id} post={post} />
                        ))}
                    </div>
                );
        }
    };

    return (
        <main className="relative flex min-h-screen flex-col items-center bg-gradient-to-b from-gray-50 to-gray-100">
            <Navbar />
            <div className="w-full max-w-7xl container mx-auto px-4 py-12 pt-24">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                        Insights & Articles
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
                        Stay updated with the latest news, trends, and stories from our team.
                    </p>
                </div>
                {renderContent()}
            </div>
            <Footer />
        </main>
    );
};

export default BlogPage;

