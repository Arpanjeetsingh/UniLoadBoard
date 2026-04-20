import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { fetchLoadById } from "@/lib/api";
import { LoadDetailCard } from "@/components/LoadDetailCard";
import { BrokerContactSection } from "@/components/BrokerContactSection";
import { DirectShipperSection } from "@/components/DirectShipperSection";

interface PageProps {
  params: { id: string };
}

export default async function LoadDetailPage({ params }: PageProps) {
  let load;
  try {
    load = await fetchLoadById(params.id);
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/90 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-6 py-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to load board
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-6 space-y-4">
        <LoadDetailCard load={load} />

        {load.broker ? (
          <BrokerContactSection broker={load.broker} />
        ) : (
          <DirectShipperSection source={load.source} notes={load.notes} />
        )}
      </main>
    </div>
  );
}
