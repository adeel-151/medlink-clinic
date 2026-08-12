import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiUser } from "react-icons/fi";

// Force dynamic rendering if we want real-time updates without building
export const revalidate = 60; // revalidate every 60 seconds

export default async function BlogPage() {
  let dbArticles: any[] = [];
  try {
    dbArticles = await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { email: true, doctor: true } } },
    });
  } catch (error) {
    console.error("Failed to fetch articles:", error);
  }

  // Fallback data if DB is empty
  const displayArticles = dbArticles.length > 0 ? dbArticles.map(a => ({
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.content.substring(0, 100) + "...",
    image: a.image || "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2670&auto=format&fit=crop",
    authorName: a.author?.doctor ? `Dr. ${a.author.doctor.firstName} ${a.author.doctor.lastName}` : "Admin",
    date: new Date(a.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  })) : [
    {
      id: "1",
      title: "Understanding Heart Health in 2026",
      slug: "understanding-heart-health",
      excerpt: "Learn about the latest advancements in cardiology and how to maintain a healthy heart.",
      image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=2670&auto=format&fit=crop",
      authorName: "Dr. Sarah Mitchell",
      date: "Aug 10, 2026"
    },
    {
      id: "2",
      title: "Pediatric Care: What New Parents Need to Know",
      slug: "pediatric-care-new-parents",
      excerpt: "A comprehensive guide for new parents on essential pediatric care and milestones.",
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?q=80&w=2670&auto=format&fit=crop",
      authorName: "Dr. Emily Rodriguez",
      date: "Aug 05, 2026"
    },
    {
      id: "3",
      title: "The Future of Neurological Treatments",
      slug: "future-neurological-treatments",
      excerpt: "Discover the cutting-edge treatments that are transforming neurology today.",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2671&auto=format&fit=crop",
      authorName: "Dr. Michael Chen",
      date: "Jul 28, 2026"
    }
  ];

  return (
    <>
      <Navbar />

      <main className="pt-24 pb-20 min-h-screen bg-slate-50">
        <div className="max-w-1280 mx-auto px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-teal-700 font-bold text-sm tracking-wider uppercase mb-3 block">
              Health & Wellness
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
              Clinic Blog
            </h1>
            <p className="text-slate-600 text-lg">
              Stay updated with the latest health tips, medical news, and insights from our experts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayArticles.map((article) => (
              <Link href={`/blog/${article.slug}`} key={article.id} className="premium-card flex flex-col h-full group overflow-hidden">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img 
                    src={article.image} 
                    alt={article.title} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5"><FiCalendar className="text-teal-600" /> {article.date}</span>
                    <span className="flex items-center gap-1.5"><FiUser className="text-teal-600" /> {article.authorName}</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-teal-700 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-600 mb-6 flex-grow line-clamp-3">
                    {article.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-teal-700 mt-auto">
                    Read Article <FiArrowRight size={16} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
