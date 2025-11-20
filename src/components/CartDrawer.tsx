'use client';

import { type Locale } from '@/lib/i18n/config';
import { getCartDrawerTranslations } from '@/lib/i18n/translations';
import { useCartStore } from '@/store/cartStore';
import classNames from 'classnames';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Button from './ui/Button';
import Image from 'next/image';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { lang } = useParams();
  const t = getCartDrawerTranslations(lang as Locale);

  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getTotalItems = useCartStore((state) => state.getTotalItems);
  const checkout = useCartStore((state) => state.checkout);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleCheckout = async () => {
    setIsCheckingOut(true);

    try {
      await checkout();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout. Please try again.');
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={classNames(
          'fixed inset-0 bg-foreground/20 backdrop-blur-sm text-foreground z-80 transition-opacity duration-300',
          {
            'opacity-100': isOpen,
            'opacity-0 pointer-events-none': !isOpen,
          }
        )}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={classNames(
          'fixed top-0 right-0 h-full w-full md:w-[500px] bg-background z-90 transform transition-transform duration-500 ease-power2-in-out shadow-2xl rounded-tl-2xl rounded-bl-2xl',
          {
            'translate-x-0': isOpen,
            'translate-x-full': !isOpen,
          }
        )}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="border-b border-foreground/10 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-serif text-foreground">{t.cart} ({getTotalItems()})</h2>
              <button
                onClick={onClose}
                className="text-2xl cursor-pointer text-foreground"
                aria-label={t.closeCart}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <p className="text-xl text-foreground/60 mb-4">{t.cartIsEmpty}</p>
                <Button onClick={onClose} size="md">
                  {t.continueShopping}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 p-4 bg-foreground/5 rounded-xl"
                  >
                    {/* Item Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-foreground/10 flex-shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/30">
                          {t.noImage}
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className='flex items-start justify-between text-md'>

                        <h3 className="mb-2 truncate text-foreground">{item.name}</h3>
                        <span className="text-foreground">
                          ${item.price.toFixed(2)}
                        </span>
                      </div>


                      {/* Quantity Controls */}
                      <div className="flex items-end justify-between mb-2">
                        <div className='flex items-center justify-between gap-3 text-foreground'>
                          <button
                            onClick={() => {
                              if (item.quantity > 1) {
                                updateQuantity(item.id, item.quantity - 1);
                              }
                            }}
                            disabled={item.quantity <= 1}
                            className="leading-[1.1] cursor-pointer text-foreground hover:text-foreground disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-lg"
                            aria-label={t.decreaseQuantity}
                          >
                            −
                          </button>
                          <span className="font-sans text-sm text-foreground text-center leading-[1.1]">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="leading-[1.1] cursor-pointer text-foreground hover:text-foreground transition-colors text-lg"
                            aria-label={t.increaseQuantity}
                          >
                            +
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-foreground cursor-pointer font-sans text-sm text-fg transition-colors underline"
                        >
                          {t.remove}
                        </button>
                      </div>


                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t border-foreground/10 p-6 space-y-4">
              <div className="flex items-center justify-between text-xl">
                <span className="text-foreground">{t.total}</span>
                <span className="text-foreground font-serif text-2xl">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              <Button size="lg" fullWidth onClick={handleCheckout} disabled={isCheckingOut}>
                {isCheckingOut ? t.processing : t.checkout}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
