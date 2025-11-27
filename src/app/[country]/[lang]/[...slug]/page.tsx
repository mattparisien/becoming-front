import PageComponent from "./component";
import type { Metadata, ResolvingMetadata } from "next";
import { generateRouteMetadata } from "@/lib/helpers/metadata";
import { fetchPage } from "@/hooks/fetchPage";
import { notFound } from "next/navigation";
import { getAllPageParams } from "@/lib/helpers/staticParams";


type ParamsShape = { country: string; lang: string; slug: string[]; };
type Props = { params: Promise<ParamsShape> };

export async function generateStaticParams(): Promise<ParamsShape[]> {
    return getAllPageParams();
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { country, lang, slug } = await params;
    const parentMeta = await parent;

    console.log('generateMetadata called with:', { country, lang, slug });

    return generateRouteMetadata({ country, lang, slug, type: "page" }, parentMeta);
}

export default async function Page({ params }: Props) {

    const { lang, country, slug } = await params;

    
    // If slug has more than one segment, it's an invalid route
    if (slug.length > 1) {
        notFound();
    }
    
    // Get the first (and only) segment
    const slugString = slug[0];
    
    const page = await fetchPage({
        lang,
        country,
        slug: slugString
    });
    

    if (!page) {
        notFound();
    }

    return (
        <PageComponent page={page} />
    );
}
