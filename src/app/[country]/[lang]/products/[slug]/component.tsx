'use client';

import AddToCartButton from '@/components/AddToCartButton';
import Container from '@/components/Container';
import { Locale } from '@/lib/i18n/config';
import { getProductPageTranslations } from '@/lib/i18n/translations';
import { ShopifyProductFlattened } from '@/lib/types/shopify';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import classNames from 'classnames';
import TextModule from '@/components/modules/Text';
import { PortableTextBlock } from '@portabletext/types';

type ProductPageComponentProps = ShopifyProductFlattened & {
  additionalInfo?: {
    content: PortableTextBlock[];
  };
}

const ProductPageComponent = ({ additionalInfo, ...product }: ProductPageComponentProps) => {
  const { lang } = useParams();
  const t = getProductPageTranslations(lang as Locale);

  // Get price
  const price = parseFloat(product.priceRange.maxVariantPrice.amount);

  // Check if media is video
  const isVideo = product.media.mediaType === 'video';

  return (
    <div className="min-h-screen">
      <Container hasVerticalGutters>
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-foreground/60">
          <Link href="/shop" className="hover:text-foreground transition-colors">
            {t.shop}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.title}</span>
        </nav>

        {/* Plugin Details */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Media Column - Sticky on desktop */}
          <div className="flex-1 w-full lg:w-auto lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start">
            <div className="aspect-3/2 rounded-2xl overflow-hidden bg-foreground/5 relative">
              {isVideo ? (
                <video
                  src={product.media.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <Image
                  src={product.media.src}
                  alt={product.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              )}
            </div>
          </div>

          {/* Info Column - Sticky */}
          <div className="flex-1 lg:max-w-xl">
            <div className="space-y-6">
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl 2xl:text-7xl font-light text-foreground font-serif">
                {product.title}
              </h1>

              {/* Description */}
              {product.descriptionHtml && (
                <div className='font-sans font-normal text-lg text-foreground/70 leading-relaxed [&_a]:underline'>
                  <div
                    dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
                  />
                  <div className=' font-sans text-lg text-foreground/70 pt-2 underline'>
                    <a href={`/demos/${product.handle}`} target="_blank" rel="noopener noreferrer">{t.demoLink}</a>
                  </div>
                </div>
              )}

              {/* Price */}
              <div className="pt-6 border-t border-foreground/10">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="font-serif font-light text-5xl font-bold text-foreground">
                    ${price.toFixed(2)} <span className='text-foreground/20 font-serif'>{product.priceRange.maxVariantPrice.currencyCode}</span>
                  </span>
                </div>
                <p className="text-sm text-foreground/60 font-sans">{t.oneTimePurchase}</p>
              </div>

              {/* Add to Cart Button */}
              <div className='mb-8'>
                <AddToCartButton product={product} />
              </div>

              {/* Features List */}
              <div className={classNames("space-y-4", {
                "pt-6 border-t border-foreground/10": additionalInfo && additionalInfo.content.length,
              })}>
                {additionalInfo && additionalInfo.content.length && <TextModule
                  headingFont='serif'
                  content={additionalInfo.content}
                  alignment="left"
                />}
                {/* <h3 className="text-2xl font-serif text-foreground">{t.whatsIncluded}</h3>
                  <ul className="space-y-3 text-foreground/70">
                    <li className="flex items-start gap-3">
                      <span className="text-foreground font-bold">✓</span>
                      <span>{t.lifetimeAccess}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-foreground font-bold">✓</span>
                      <span>{t.regularUpdates}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-foreground font-bold">✓</span>
                      <span>{t.premiumSupport}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-foreground font-bold">✓</span>
                      <span>{t.easyInstallation}</span>
                    </li>
                  </ul> */}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default ProductPageComponent;
