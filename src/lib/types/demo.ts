import { ShopifyProduct } from "./shopify";

export interface Demo { title: string; slug: string; pluginJSON: string, shopifyProduct: Partial<ShopifyProduct> }