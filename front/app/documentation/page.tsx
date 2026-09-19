import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryHero from "@/components/CategoryHero";
import PostList from "@/components/PostList";
import { getPostsByCategory } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata = {
  title: "Documentation — Tax Advisory Consultants",
};

export default function DocumentationPage() {
  const posts = getPostsByCategory("documentation");

  return (
    <div className="min-h-screen bg-white text-navy">
      <Header />

      <CategoryHero category="documentation" />

      <main className="mx-auto max-w-6xl px-6 py-16">
        <PostList
          posts={posts}
          basePath="/documentation"
          category="documentation"
        />
      </main>

      <Footer />
    </div>
  );
}
