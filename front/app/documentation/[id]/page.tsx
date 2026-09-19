import { notFound } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostDetail from "@/components/PostDetail";
import { getPostById } from "@/lib/posts";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DocumentationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = getPostById(id);

  if (
    !post ||
    post.category !== "documentation"
  ) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-navy">
      <Header alwaysSolid />

      <PostDetail
        post={post}
        basePath="/documentation"
      />

      <Footer />
    </div>
  );
}
