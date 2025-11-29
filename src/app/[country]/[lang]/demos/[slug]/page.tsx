import DemoComponent from "./component";
import type { Metadata, ResolvingMetadata } from "next";
import { fetchSanityData } from "@/hooks/useServerSideSanityQuery";
import { DEMO_QUERY } from "@/lib/sanity/queries";
import { notFound } from "next/navigation";
import { Demo } from "@/lib/types/demo";
import { generateRouteMetadata } from "@/lib/helpers/metadata";


type ParamsShape = { country: string; lang: string; slug: string; };
type Props = { params: Promise<ParamsShape> };

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { country, lang, slug } = await params;
    const parentMeta = await parent;

    // Generate base metadata using helper
    const metadata = await generateRouteMetadata(
        { country, lang, slug: [slug], type: "demo" },
        parentMeta
    );

    // Override for demos: no indexing, no canonical
    return {
        ...metadata,
        robots: {
            index: false,
            follow: false,
            googleBot: {
                index: false,
                follow: false,
                noimageindex: true,
            },
        },
        // Remove canonical and alternates for demos
        alternates: undefined,
    };
}

export default async function DemoPage({ params }: Props) {

    const { lang, slug } = await params;
    const demo = await fetchSanityData<Demo | null>(DEMO_QUERY, { params: { slug, language: lang } });
    
    if (!demo) {
        notFound();
    }

    // Map demo to required component props; fallback pluginJSON blank
    return <DemoComponent {...demo} />;
}
