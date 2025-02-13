import Stripe from 'stripe';
import { supabase } from './supabase';

// Stripe instance'ı oluştur
const stripeSecretKey = process.env.VITE_STRIPE_SECRET_KEY;
export const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  : null;

export interface PlanFeature {
  name: string;
  included: boolean;
  limit?: number;
}

export interface SubscriptionPlanDetails {
  id: string;
  name: string;
  price: string;
  priceId: string; // Stripe Price ID
  description: string;
  features: PlanFeature[];
  maxImageCount: number;
  maxVideoLength: number;
  priority: number;
}

export const subscriptionPlans = {
  free: {
    id: 'free',
    name: 'Ücretsiz',
    price: '0 ₺',
    priceId: '', // Ücretsiz plan için Stripe Price ID gerekmez
    description: 'Temel özelliklerle başlayın',
    features: [
      { name: 'Resim oluşturma', included: true, limit: 5 },
      { name: 'AI sohbet desteği', included: true },
      { name: 'Standart çözünürlük', included: true },
      { name: 'Topluluk desteği', included: true },
      { name: 'Video oluşturma', included: false },
      { name: 'API erişimi', included: false },
    ],
    maxImageCount: 5,
    maxVideoLength: 0,
    priority: 0,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: '149 ₺',
    priceId: process.env.VITE_STRIPE_PREMIUM_PRICE_ID || '',
    description: 'Profesyonel içerik üreticileri için',
    features: [
      { name: 'Resim oluşturma', included: true, limit: 1000 },
      { name: 'Gelişmiş AI sohbet', included: true },
      { name: 'HD çözünürlük', included: true },
      { name: 'Video oluşturma', included: true, limit: 5 },
      { name: 'Öncelikli destek', included: true },
      { name: 'Reklamsız deneyim', included: true },
      { name: 'API erişimi', included: false },
    ],
    maxImageCount: 1000,
    maxVideoLength: 5,
    priority: 1,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: '299 ₺',
    priceId: process.env.VITE_STRIPE_PRO_PRICE_ID || '',
    description: 'Stüdyolar ve profesyonel ekipler için',
    features: [
      { name: 'Resim oluşturma', included: true },
      { name: 'Özel AI asistan', included: true },
      { name: '4K çözünürlük', included: true },
      { name: 'Video oluşturma', included: true },
      { name: '7/24 öncelikli destek', included: true },
      { name: 'API erişimi', included: true },
      { name: 'Özel eğitim desteği', included: true },
    ],
    maxImageCount: Infinity,
    maxVideoLength: Infinity,
    priority: 2,
  },
} as const;

export type SubscriptionPlan = keyof typeof subscriptionPlans;

interface CreateCheckoutSessionOptions {
  priceId: string;
  customerId?: string;
  userId: string;
  returnUrl: string;
}

export const createCheckoutSession = async ({
  priceId,
  customerId,
  userId,
  returnUrl,
}: CreateCheckoutSessionOptions): Promise<string> => {
  if (!stripe) {
    throw new Error('Ödeme sistemi şu anda devre dışı. Lütfen daha sonra tekrar deneyin.');
  }

  try {
    // Kullanıcı bilgilerini kontrol et
    const { data: user } = await supabase.auth.getUser();
    if (!user || user.user?.id !== userId) {
      throw new Error('Yetkisiz işlem');
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${returnUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${returnUrl}?canceled=true`,
      metadata: {
        userId,
      },
      allow_promotion_codes: true,
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
    });

    if (!session.url) {
      throw new Error('Ödeme sayfası oluşturulamadı');
    }

    return session.url;
  } catch (error) {
    console.error('Checkout session error:', error);
    throw new Error('Ödeme sayfası oluşturulurken bir hata oluştu');
  }
};

interface CreatePortalSessionOptions {
  customerId: string;
  userId: string;
  returnUrl: string;
}

export const createPortalSession = async ({
  customerId,
  userId,
  returnUrl,
}: CreatePortalSessionOptions): Promise<string> => {
  if (!stripe) {
    throw new Error('Ödeme sistemi şu anda devre dışı. Lütfen daha sonra tekrar deneyin.');
  }

  try {
    // Kullanıcı bilgilerini kontrol et
    const { data: user } = await supabase.auth.getUser();
    if (!user || user.user?.id !== userId) {
      throw new Error('Yetkisiz işlem');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });

    return session.url;
  } catch (error) {
    console.error('Portal session error:', error);
    throw new Error('Müşteri portali oluşturulurken bir hata oluştu');
  }
};
