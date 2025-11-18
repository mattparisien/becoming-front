import Container from "@/components/Container";
import ContactFormModule from "@/components/modules/ContactForm";
import ProductsModule from "@/components/modules/Products";
import TextModule from "@/components/modules/Text";
import { SanityModule, SanityPage } from "@/lib/types/sanity";
import { notFound } from "next/navigation";
import { ComponentType } from "react";

// Module registry - maps Sanity _type to component paths
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const moduleComponents: Record<string, ComponentType<any>> = {
    textBlock: TextModule,
    products: ProductsModule,
    contactForm: ContactFormModule,
};

interface PageComponentProps {
    page: SanityPage;
}

export default function PageComponent({ page }: PageComponentProps) {

    const modules = page?.modules || [];

    if (!page || modules.length === 0) return notFound();

    return (
        <section className="pt-8 flex items-center justify-center">
            <Container className="w-full">
                {modules.map((module: SanityModule, index: number) => {
                    const ModuleComponent = moduleComponents[module._type];

                    if (!ModuleComponent) {
                        console.warn(`No component found for module type: ${module._type}`);
                        return null;
                    }

                    return <ModuleComponent key={module._key || index} {...module} />;
                })}
            </Container>
        </section>
    );
}