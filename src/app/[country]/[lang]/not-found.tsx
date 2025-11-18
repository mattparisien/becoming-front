'use client'

import Container from "@/components/Container";
import Button from "@/components/ui/Button";
import { useSanityQuery } from "@/hooks/useSanityQuery";
import { DEFAULT_LOCALE } from "@/lib/constants";
import { PAGE_NOT_FOUND_QUERY } from "@/lib/sanity/queries";
import { NotFoundPage } from "@/lib/sanity/schema-types";
import { Metadata } from "next";
import { useParams } from "next/navigation";

export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: 'The page you are looking for does not exist.',
    robots: {
        index: false,
        follow: false,
    },
};



const PageNotFound = () => {
    const { lang } = useParams();

    const { data } = useSanityQuery<NotFoundPage>(PAGE_NOT_FOUND_QUERY, {
        params: {
            language: lang || DEFAULT_LOCALE // Fallback to 'en' if no lang
        }
    });


    const buttonLink = data?.buttonLink?.[0];
    let href = '/';

    if (buttonLink && 'slug' in buttonLink && typeof buttonLink.slug === 'string') {
        href = buttonLink.slug;
    } else if (buttonLink && 'url' in buttonLink && typeof buttonLink.url === 'string') {
        href = buttonLink.url;
    }

    return data && <Container>
        <div className="flex flex-col items-center justify-center min-h-screen-minus-header">
            <h1 className="mb-5 sm:mb-8 text-center text-5xl sm:text-[5rem] md:text-[6rem] lg:text-[6rem] xl:text-[8rem] leading-none font-serif font-light">
                {data?.title || '404'}
            </h1>
            <p className="text-md sm:text-lg md:text-xl mb-10 font-sans text-center">
                {data?.body || 'The page you are looking for does not exist.'}
            </p>
            <Button as="link" href={href} variant="primary" size="lg">
                {data?.buttonLabel || 'Go to Home'}
            </Button>
        </div>
    </Container>
}

export default PageNotFound;