'use client';

import AddToCartButton from '@/components/AddToCartButton';
import Container from '@/components/Container';
import { Locale } from '@/lib/i18n/config';
import { getProductPageTranslations } from '@/lib/i18n/translations';
import { ShopifyProductFlattened } from '@/lib/types/shopify';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import useEmblaCarousel from 'embla-carousel-react';
import { useCallback, useEffect, useState } from 'react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get price
  const price = parseFloat(product.priceRange.maxVariantPrice.amount);

  const hasMultipleImages = product.images.length > 1;

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

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
          {/* Images Column - Carousel on mobile, Sticky scrollable on desktop */}
          <div className="flex-1 w-full lg:w-auto lg:sticky lg:top-[calc(var(--header-height)+2rem)] lg:self-start lg:max-h-[calc(100vh-var(--header-height)-2rem)] lg:overflow-y-auto">
            {/* Mobile Carousel (< lg) */}
            <div className="lg:hidden relative">
              <div className="overflow-hidden -mx-4 px-4" ref={emblaRef}>
                <div className="flex touch-pan-y -ml-4">
                  {product.images.map((image, index) => (
                    <div
                      key={image.url || `product-image-${index}`}
                      className="flex-[0_0_100%] min-w-0 pl-4"
                    >
                      <div className="aspect-3/2 rounded-2xl overflow-hidden bg-foreground/5 relative">
                        <Image
                          src={image.url}
                          alt={image.altText || `${product.title} - Image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="100vw"
                          priority={index === 0}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {hasMultipleImages && (
                  <>
                    <button
                      onClick={scrollPrev}
                      className="cursor-pointer absolute left-2 top-1/2 -translate-y-1/2 p-2 hover:opacity-70 transition-opacity z-10"
                      aria-label="Previous image"
                    >
                      <svg className="w-5 h-5 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                      </svg>
                    </button>
                    <button
                      onClick={scrollNext}
                      className="cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:opacity-70 transition-opacity z-10"
                      aria-label="Next image"
                    >
                      <svg className="w-5 h-5 drop-shadow-lg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Dots Indicator */}
              {hasMultipleImages && (
                <div className="flex justify-center gap-1.5 mt-6 mb-8">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => scrollTo(index)}
                      className={classNames(
                        "h-1 rounded-full transition-all duration-300",
                        index === selectedIndex
                          ? "bg-foreground w-8"
                          : "bg-foreground/25 w-1 hover:bg-foreground/40"
                      )}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Desktop Stacked Images (≥ lg) */}
            <div className="hidden lg:block space-y-6">
              {product.images.map((image, index) => (
                <div
                  key={image.url || `product-image-${index}`}
                  className="aspect-3/2 rounded-2xl overflow-hidden bg-foreground/5 relative"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />
                </div>
              ))}
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
