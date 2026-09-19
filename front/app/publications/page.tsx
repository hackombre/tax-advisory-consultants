import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryHero from "@/components/CategoryHero";
import PostList from "@/components/PostList";
import { getPostsByCategory } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Publications — Tax Advisory Consultants",
};

export default function PublicationsPage() {
  const posts = getPostsByCategory("publication");

  return (
    <div className="min-h-screen bg-white text-navy">
      <Header />

      <CategoryHero category="publication" />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <PostList
          posts={posts}
          basePath="/publications"
          category="publication"
        />
      </main>

      <Footer />
    </div>
  );
}
