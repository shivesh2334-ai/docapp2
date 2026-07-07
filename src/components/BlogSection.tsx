import Image from "next/image";
import type { BlogPost } from "@/types/doctor";

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-3xl px-5 py-8">
      <h2 className="font-serif text-xl font-semibold text-ink mb-4 underline decoration-pine decoration-2 underline-offset-4">
        Blogs
      </h2>
      <div className="space-y-5">
        {posts.map((post) => (
          <a
            key={post.id}
            href={`/blog/${post.slug}`}
            className="focus-ring flex gap-4 rounded-lg p-1 hover:bg-card transition-colors"
          >
            <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-card">
              {post.cover_image_url && (
                <Image
                  src={post.cover_image_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="112px"
                />
              )}
            </div>
            <div>
              <h3 className="font-serif text-base font-semibold leading-snug text-pine-dark">
                {post.title}
              </h3>
              {post.tags.length > 0 && (
                <p className="mt-1 text-xs text-sage">{post.tags.join(", ")}</p>
              )}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
