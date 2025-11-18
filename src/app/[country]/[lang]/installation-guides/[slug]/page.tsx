import { fetchInstallationGuide } from "@/hooks/fetchInstallationGuide";
import { checkInstallationGuideAuth } from "@/hooks/useInstallationGuideAuth";
import { generateRouteMetadata } from "@/lib/helpers/metadata";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import InstallationGuideComponent from "./component";
import PasswordProtectForm from "./PasswordForm";


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
        { country, lang, slug: [slug], type: "installationGuide" },
        parentMeta
    );

    // Override for installation guides: no indexing, no canonical
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
        alternates: undefined,
    };
}

export default async function InstallationGuidePage({ params }: Props) {
    const { lang, slug } = await params;

    const installationGuide = await fetchInstallationGuide({
        locale: lang,
        slug
    });

    if (!installationGuide) {
        console.log('not found in installation guide page called!')
        notFound();
    }

    // Extract slug string - the query returns it as a string from product->store.slug.current
    const slugString = (installationGuide as { slug?: string }).slug || slug;

    // Check server-side authentication using hook
    const { isAuthenticated } = await checkInstallationGuideAuth(slugString);

    // If not authenticated and password is required, show password form
    if (!isAuthenticated) {
        return <PasswordProtectForm
            slug={slugString}
            locale={lang}
        />;
    }

    // Only pass content to component if authenticated
    // The query returns title, image, and content which match the component props
    return <InstallationGuideComponent 
        title={(installationGuide as { title?: string }).title}
        image={(installationGuide as { image?: { url?: string } }).image}
        content={(installationGuide as { content?: unknown[] }).content as never}
    />;
}
