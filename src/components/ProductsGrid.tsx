
'use client'

import { useMemo } from "react";
import { Product } from "@/lib/sanity/schema-types";
import MasonryGrid from "./MasonryGrid";
import { useParams } from "next/navigation";

interface ProductsGridProps {
    products?: Product[];
}


const ProductsGrid = ({ products }: ProductsGridProps) => {
    const params = useParams();
    const locale = params?.locale as string || 'en'; // Fallback to 'en' if no locale
    
    const masonryGridItems = useMemo(() => {
        return products?.map(product => ({
            id: product._id,
            title: product.store?.title || "Untitled",
            subtitle: product.store?.priceRange?.maxVariantPrice?.toString() || "",
            slug: `/${locale}/products/${product.store?.slug?.current || ""}`,
            media: {
                src: product.store?.previewImageUrl || "",
                mediaType: 'image' as const,
                mimeType: 'image/jpeg'
            }
        })) || [];
    }, [products, locale]);


    if (!products || products.length === 0) {
        return <div>No products found</div>;
    }

    return (
        <div className="w-full">
            <MasonryGrid items={masonryGridItems} />
        </div>
    );
}

export default ProductsGrid;