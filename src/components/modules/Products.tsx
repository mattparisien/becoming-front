'use client';

import { ShopifyProductFlattened } from "@/lib/types/shopify";
import { useMemo } from "react";
import MasonryGrid, { MasonryGridItem } from "../MasonryGrid";

interface ProductsProps {
    products?: ShopifyProductFlattened[];
    layout?: string;
}

const ProductsModule = ({ products }: ProductsProps) => {

    const masonryGridItems : MasonryGridItem[] = useMemo(() => {
        if (!products) return [];
        return products.map(product => ({
            id: product.id,
            title: product.title,
            subtitle: `${product.priceRange.maxVariantPrice.amount} ${product.priceRange.maxVariantPrice.currencyCode}`,
            slug: product.collectionHandle
                ? `/${product.collectionHandle}/${product.handle}`
                : `/${product.handle}`,
            media: {
                src: product.media.src,
                mediaType: product.media.mediaType as 'image' | 'video',
                mimeType: product.media.mimeType || ''
            }
        }));
    }, [products]);

    if (!products || products.length === 0) {
        return <div>No products found</div>;
    }

    return (
        <div className="w-full">
            <MasonryGrid items={masonryGridItems} />
        </div>
    );
}

export default ProductsModule;
