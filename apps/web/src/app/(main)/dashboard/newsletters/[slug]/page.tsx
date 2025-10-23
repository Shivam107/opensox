import { notFound } from "next/navigation";
import { newsletterIssues } from "@/data/newsletters";
import { NewsletterDetailClient } from "./NewsletterDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;  
}


export default async function NewsletterDetail({ params }: PageProps) {
  const { slug } = await params;  
   const fallback = newsletterIssues.find((issue) => issue.slug === slug);

  if (!fallback) {
    notFound();
  }

  return <NewsletterDetailClient slug={slug} fallback={fallback} />;
}