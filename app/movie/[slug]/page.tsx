import { MovieDetails } from "@/components/movie-details"

interface MoviePageProps {
  params: Promise<{ slug: string }>
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { slug } = await params

  // This will be handled client-side since we're using localStorage
  return <MoviePageClient slug={slug} />
}

function MoviePageClient({ slug }: { slug: string }) {
  return <MovieDetails slug={slug} />
}

export async function generateMetadata({ params }: MoviePageProps) {
  const { slug } = await params

  return {
    title: `Movie - ${slug}`,
    description: "Watch and download movies",
  }
}
