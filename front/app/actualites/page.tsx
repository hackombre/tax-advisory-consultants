import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CategoryHero from "@/components/CategoryHero";
import PostList from "@/components/PostList";
import { getPostsByCategory } from "@/lib/posts";

export const metadata = {
  title: "Actualités — Tax Advisory Consultants",
};

export default function ActualitesPage() {
  const posts = getPostsByCategory("actualite");

  return (
    <div className="min-h-screen bg-white text-navy">
      <Header />
      <CategoryHero category="actualite" />
      <main className="mx-auto max-w-6xl px-6 py-16">
        <PostList posts={posts} basePath="/actualites" category="actualite" />
      </main>
      <Footer />
    </div>
  );
}
