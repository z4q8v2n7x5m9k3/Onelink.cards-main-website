"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { pricingPlans, siteConfig, type Plan } from "@/content/site";
import { Icon } from "@/components/icons";
import { BuyButton } from "@/components/payment/buy-button";
import { Reveal } from "@/components/ui/reveal";
import { PricingBrandMark } from "@/components/ui/brand-mark";
import { SectionBadge } from "@/components/ui/section-badge";
import { cn, formatCurrency } from "@/lib/utils";
import burgerBazaarPremium from "../../../onelink_mockups/hero-burger-bazaar.png";
import velouraPremium from "../../../onelink_mockups/hero-veloura-salon.png";

const primaryCareRows = [
  { id: "3-month", label: "3 Months" },
  { id: "6-month", label: "6 Months" },
  { id: "12-month", label: "12 Months" },
];

type TopPlanId = "essential" | "signature" | "elite";
type DedicatedPlanId = TopPlanId | "enterprise";

export function isDiwaliOfferActive(): boolean {
  const now = new Date();
  const start = new Date("2026-11-02T00:00:00+05:30").getTime();
  const end = new Date("2026-11-10T23:59:59+05:30").getTime();
  const current = now.getTime();
  return current >= start && current <= end;
}

const pricingPresentation: Record<TopPlanId, {
  description: string;
  setupRegular: number;
  setupDiwali: number;
  diwaliSavings: number;
  firstPurchase: Record<string, number>;
  purchaseIncludes: string;
  features: string[];
  recommendedFor: string;
}> = {
  essential: {
    description: "Smart Business Presence",
    setupRegular: 5999,
    setupDiwali: 4999,
    diwaliSavings: 1000,
    firstPurchase: {
      "3-month": 8498,
      "6-month": 10498,
      "12-month": 13998,
    },
    purchaseIncludes: "Includes complete OneLink design, development, hosting, support & updates.",
    features: [
      "Custom OneLink",
      "Business details and content",
      "Call, WhatsApp, Maps & Pay",
      "QR code, gallery and social links",
      "Basic self-editing for business information",
    ],
    recommendedFor: "Businesses that need a professional digital presence and essential customer actions.",
  },
  signature: {
    description: "Smart Business Growth",
    setupRegular: 9999,
    setupDiwali: 7999,
    diwaliSavings: 2000,
    firstPurchase: {
      "3-month": 13998,
      "6-month": 16998,
      "12-month": 22498,
    },
    purchaseIncludes: "Includes complete OneLink design, development, hosting, support & updates.",
    features: [
      "Everything in Essential",
      "Menu, services or portfolio",
      "Booking, enquiries and order requests",
      "Reviews and customer actions",
      "Content admin panel for images, items, prices and offers",
      "Basic analytics",
    ],
    recommendedFor: "Businesses that want more leads, bookings, orders and customer actions.",
  },
  elite: {
    description: "Smart Business Management",
    setupRegular: 16999,
    setupDiwali: 13999,
    diwaliSavings: 3000,
    firstPurchase: {
      "3-month": 23498,
      "6-month": 28498,
      "12-month": 36998,
    },
    purchaseIncludes: "Includes complete OneLink setup, software access, hosting, support & updates.",
    features: [
      "Everything in Signature",
      "Advanced admin dashboard",
      "Bookings, orders and lead management",
      "Pricing and availability controls",
      "Enhanced analytics and staff access",
      "Priority technical support",
    ],
    recommendedFor: "Businesses that need advanced management, operations, and priority support.",
  },
};

const pricingMockups: Record<TopPlanId, { src: string; alt: string }> = {
  essential: {
    src: "/pricing-mockup-vastukar.png",
    alt: "Vastukar Architects OneLink mobile preview",
  },
  signature: {
    src: "/pricing-mockup-burger-bazaar.png",
    alt: "Burger Bazaar OneLink mobile preview",
  },
  elite: {
    src: "/pricing-mockup-new-vision.png",
    alt: "New Vision Diagnostics OneLink mobile preview",
  },
};

const pricingMockupStackOrder: Record<TopPlanId, TopPlanId[]> = {
  essential: ["elite", "signature", "essential"],
  signature: ["essential", "elite", "signature"],
  elite: ["signature", "essential", "elite"],
};

function formatPricingCurrency(amount: number) {
  return formatCurrency(amount);
}

const enterpriseHighlights = [
  "Premium Bespoke Design",
  "Multi-Branch & Location Setup",
  "Multi-Franchise Management",
  "Bulk OneLink Deployment",
  "Custom Admin Dashboards",
  "CRM, POS & Booking Integrations",
  "Custom APIs & Automation",
  "Priority Setup & Support",
];

const premiumMockups = [
  { src: burgerBazaarPremium, alt: "Burger Bazaar OneLink Premium preview" },
  { src: velouraPremium, alt: "Veloura Salon OneLink Premium preview" },
] as const;

const chandigarhSetupOffers: Record<TopPlanId, Record<string, number>> = {
  essential: { "3-month": 3000, "6-month": 3500, "12-month": 2000 },
  signature: { "3-month": 4500, "6-month": 3000, "12-month": 1000 },
  elite: { "3-month": 9000, "6-month": 9000, "12-month": 7000 },
};

type PricingSectionProps = {
  staticReveal?: boolean;
  showLaunchOffer?: boolean;
  dedicatedPage?: boolean;
};

export function PricingSection({
  staticReveal = false,
  dedicatedPage = false,
}: PricingSectionProps) {
  const [dedicatedSelectedPlanId, setDedicatedSelectedPlanId] = useState<DedicatedPlanId>("signature");
  const offerActive = isDiwaliOfferActive();
  const [pricingMode, setPricingMode] = useState<"regular" | "diwali">(offerActive ? "diwali" : "regular");
  const topPlans = pricingPlans.filter((plan) => plan.id !== "enterprise");
  const enterprisePlan = pricingPlans.find((plan) => plan.id === "enterprise");
  const enterpriseHref = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent("Hello OneLink, I want to discuss a OneLink Premium custom build.")}`;
  const isDiwali = pricingMode === "diwali";

  return (
    <section
      id="pricing"
      className={cn(
        "relative scroll-mt-28 overflow-hidden bg-transparent px-5 sm:px-6 lg:px-8",
        dedicatedPage ? "pb-12 pt-3 sm:pb-16 sm:pt-4" : "py-12 sm:py-14 lg:py-16",
      )}
    >
      <div className={cn("pointer-events-none absolute -left-24 top-[26%] h-72 w-72 rounded-full blur-3xl transition-colors duration-500", isDiwali ? "bg-amber-400/[0.08]" : "bg-[#00A9FF]/[0.055]")} aria-hidden />
      <div className={cn("pointer-events-none absolute -right-28 top-[52%] h-80 w-80 rounded-full blur-3xl transition-colors duration-500", isDiwali ? "bg-amber-300/[0.06]" : "bg-[#087cbc]/[0.05]")} aria-hidden />
      <div className="relative mx-auto max-w-7xl">
        <div className={cn("mx-auto max-w-3xl text-center", dedicatedPage ? "mb-4 sm:mb-5" : "mb-8 sm:mb-10")}>
          <Reveal x={-28} y={14} alwaysShow={staticReveal}>
            <SectionBadge label="Pricing" className={cn("-mt-2", dedicatedPage && "border-[#b5d6ed] bg-white px-5 py-2 tracking-[0.18em] shadow-sm")} />
            <h2 className={cn("section-title-gradient font-display font-bold leading-[1.08] tracking-[-0.045em]", dedicatedPage ? "mt-3 text-[28px] sm:text-[32px] lg:text-[36px]" : "mt-4 text-[32px] sm:text-[36px] lg:text-[42px]")}>
              Choose the Right OneLink
            </h2>
            <p className={cn("font-semibold leading-relaxed tracking-[-0.015em] text-[#526173]", dedicatedPage ? "mt-2 text-[14px] sm:text-[15px] lg:text-[16px]" : "mt-3 text-[17px] sm:text-[19px]")}>
              Pay the one-time design fee once, then choose 3, 6 or 12 months of Platform Care.
            </p>
          </Reveal>
        </div>

        {/* Clean, Non-Space-Consuming Pricing Toggle & Offer Badge */}
        <div className="relative mx-auto mb-7 flex flex-col items-center justify-center text-center sm:mb-8">
          <div className={cn(
            "relative inline-flex items-center rounded-full border p-1 shadow-sm transition-all duration-300",
            isDiwali
              ? "border-amber-400/60 bg-white shadow-[0_8px_22px_-8px_rgba(217,119,6,0.22)] ring-1 ring-amber-400/25"
              : "border-slate-200 bg-white shadow-sm"
          )}>
            <button
              type="button"
              onClick={() => setPricingMode("regular")}
              aria-pressed={pricingMode === "regular"}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 sm:px-5 sm:text-sm",
                pricingMode === "regular"
                  ? "bg-[#09223E] text-white shadow-sm"
                  : "text-slate-600 hover:text-[#09223E]"
              )}
            >
              Regular Pricing
            </button>
            <button
              type="button"
              onClick={() => {
                if (offerActive) {
                  setPricingMode("diwali");
                }
              }}
              disabled={!offerActive}
              aria-pressed={pricingMode === "diwali"}
              className={cn(
                "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 sm:px-5 sm:text-sm",
                pricingMode === "diwali"
                  ? "bg-[linear-gradient(135deg,#09223E_0%,#064083_45%,#0077FF_100%)] text-white shadow-sm ring-1 ring-[#00A9FF]/30"
                  : "text-amber-800 hover:text-amber-950",
                !offerActive && "cursor-not-allowed opacity-50"
              )}
            >
              <span>Diwali Special</span>
              {offerActive ? (
                <span className={cn(
                  "ml-1 rounded-full px-2 py-0.5 text-[9.5px] font-black uppercase tracking-wide",
                  pricingMode === "diwali"
                    ? "bg-amber-100 text-amber-950 border border-amber-200"
                    : "bg-amber-100/90 text-amber-900"
                )}>
                  Save up to ₹3,000
                </span>
              ) : (
                <span className="ml-1 rounded-full bg-slate-100 px-1.5 py-0.5 text-[8px] font-bold text-slate-500">Expired</span>
              )}
            </button>
          </div>

          {/* Clean, space-efficient bonus pill (No emojis) */}
          <AnimatePresence>
            {isDiwali ? (
              <motion.div
                key="diwali-compact-badge"
                initial={{ opacity: 0, y: -4, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -4, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2.5 overflow-hidden"
              >
                <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-amber-300/80 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 px-4 py-1.5 text-[11.5px] font-medium text-amber-950 shadow-sm">
                  <span><strong className="font-bold text-amber-950">Diwali Offer:</strong> Save up to ₹3,000</span>
                  <span className="text-amber-400">•</span>
                  <span><strong className="font-bold text-amber-950">Free Custom QR Counter-Card Design</strong></span>
                  <span className="text-amber-800 font-semibold">(Digital artwork · Nov 2–10)</span>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <div className={cn("relative mx-auto", dedicatedPage ? "max-w-[1200px]" : "max-w-7xl")}>
          {dedicatedPage ? (
            <DedicatedPricingSelector plans={topPlans} premiumPlan={enterprisePlan} selectedPlanId={dedicatedSelectedPlanId} onPlanChange={setDedicatedSelectedPlanId} premiumHref={enterpriseHref} isDiwali={isDiwali} />
          ) : (
            <div className="relative mx-auto grid w-full max-w-[42rem] grid-cols-1 items-stretch gap-6 lg:max-w-none lg:grid-cols-3 lg:gap-8">
              {topPlans.map((plan, index) => {
                const isSignature = plan.id === "signature";
                return (
                  <Reveal key={plan.id} delay={index * 0.05} x={index === 0 ? -30 : index === 2 ? 30 : 0} y={18} alwaysShow={staticReveal} className={cn("flex h-full transition-transform", isSignature ? "lg:z-10 lg:-translate-y-2" : "lg:z-0")}>
                    <PricingCard plan={plan} isSignature={isSignature} isDiwali={isDiwali} />
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>

        {dedicatedPage && dedicatedSelectedPlanId !== "enterprise" ? <PricingPackageBuilder key={dedicatedSelectedPlanId} initialPlanId={dedicatedSelectedPlanId} isDiwali={isDiwali} /> : null}

        {dedicatedPage ? <PricingTermsNotice className="mx-auto mt-6 max-w-6xl" /> : null}

        {enterprisePlan && !dedicatedPage ? (
          <>
            <Reveal delay={0.16} x={28} y={14} alwaysShow={staticReveal}>
              <EnterprisePanel href={enterpriseHref} plan={enterprisePlan} />
            </Reveal>
            <Reveal delay={0.2} y={12} alwaysShow={staticReveal}>
              <PricingTermsNotice className="mt-5" />
            </Reveal>
          </>
        ) : null}

      </div>
    </section>
  );
}

function DedicatedPricingOverview({ plans }: { plans: Plan[] }) {
  const quickBillPlans = [
    { label: "3 Months", price: "₹999" },
    { label: "6 Months", price: "₹1,799" },
    { label: "12 Months", price: "₹2,999" },
  ];
  return (
    <div id="plans" className="space-y-7">
      <div className="text-center"><p className="text-[11px] font-extrabold uppercase tracking-[.15em] text-[#087cbc]">Choose your plan</p><p className="mt-2 text-sm font-semibold text-[#526173]">One-time setup + your preferred 3, 6 or 12-month plan.</p><p className="mt-2 text-[11px] font-semibold text-[#718096]">Custom design • Free OneLink URL • Onboarding included • Digital QR included</p></div>
      <div className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-2 rounded-full border border-[#c9deef] bg-white p-1 shadow-sm"><span className="rounded-full px-4 py-2 text-[11px] font-extrabold text-[#526173]">3 Months</span><span className="rounded-full bg-[#eaf6ff] px-4 py-2 text-[11px] font-extrabold text-[#087cbc]">6 Months</span><span className="rounded-full px-4 py-2 text-[11px] font-extrabold text-[#526173]">12 Months — Best Value</span></div>
      <div className="grid items-stretch gap-5 lg:grid-cols-3">
        {plans.map((plan) => <DedicatedLightPlan key={plan.id} plan={plan} />)}
      </div>
      <div className="text-center"><Link href="/pricing/compare" className="text-sm font-extrabold text-[#087cbc] underline decoration-[#00A9FF]/35 underline-offset-4">Compare all features →</Link></div>
      <details className="group overflow-hidden rounded-[20px] border border-[#cfe0f5] bg-white shadow-[0_20px_50px_-38px_rgba(19,61,130,.45)]"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-5 sm:px-7"><span><strong className="block text-lg font-extrabold tracking-[-.025em] text-[#122d67]">Need QuickBill?</strong><span className="mt-1 block text-xs font-semibold text-[#718096]">Simple billing for everyday business.</span></span><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#edf8ec] text-lg font-bold text-[#378a2e] transition group-open:rotate-45">+</span></summary><div className="border-t border-[#e5edf7] px-5 pb-6 pt-5 sm:px-7"><div className="grid items-center gap-6 lg:grid-cols-[1fr_180px]"><div><p className="text-[10px] font-extrabold uppercase tracking-[.13em] text-[#378a2e]">QuickBill pricing</p><div className="mt-3 grid gap-2 sm:grid-cols-3">{quickBillPlans.map((item) => <div key={item.label} className="rounded-[12px] border border-[#dce7f1] bg-[#fbfdff] px-3 py-3"><p className="text-[10px] font-extrabold uppercase tracking-[.07em] text-[#526173]">{item.label}</p><p className="mt-1 text-xl font-extrabold text-[#123d9d]">{item.price}</p></div>)}</div><p className="mt-3 text-xs font-semibold text-[#526173]">One-Time Setup: <strong>₹1,999 + GST</strong></p><p className="mt-1 text-[11px] font-semibold text-[#718096]">QuickBill can be added to Essential or Signature. Included with Elite.</p></div><Image src="/quickbill-pricing-mockup.png" alt="QuickBill preview" width={2764} height={5805} className="mx-auto h-[260px] w-auto object-contain object-top drop-shadow-[0_18px_20px_rgba(30,68,136,.22)]" /></div></div></details>
      <div className="grid gap-3 sm:grid-cols-2"><div className="rounded-[14px] border border-[#dce7f1] bg-white px-4 py-3"><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#526b8e]">Optional add-ons</p><p className="mt-1 text-xs font-semibold text-[#526173]">Extra Content Updates — ₹199 + GST</p><p className="mt-1 text-[11px] font-semibold text-[#718096]">Custom requirements: talk to us.</p></div><div className="rounded-[14px] border border-[#dce7f1] bg-white px-4 py-3 text-[11px] font-semibold leading-5 text-[#718096]">One-Time Setup includes Custom Design • Onboarding • Initial Content Setup • QR Activation.<br />All prices exclude applicable GST.</div></div>
    </div>
  );
}

function DedicatedLightPlan({ plan }: { plan: Plan }) {
  const presentation = pricingPresentation[plan.id as TopPlanId];
  const isSignature = plan.id === "signature";
  const recommended = presentation.recommendedFor;
  const features = presentation.features.slice(0, isSignature ? 7 : 6);
  return <article className={cn("relative flex flex-col rounded-[22px] border p-5 sm:p-6", isSignature ? "border-[#4a9dff] bg-[linear-gradient(145deg,#09223E,#064083 55%,#0077FF)] text-white shadow-[0_30px_65px_-38px_rgba(0,67,155,.7)]" : "border-[#c9deef] bg-white text-[#111821] shadow-[0_20px_48px_-34px_rgba(9,34,62,.35)]")}>{isSignature ? <span className="absolute -top-3 left-5 rounded-full bg-[#123d9d] px-3 py-1 text-[9px] font-extrabold uppercase tracking-[.1em] text-white shadow-sm">Most Popular</span> : null}<p className={cn("text-[10px] font-extrabold uppercase tracking-[.15em]", isSignature ? "text-[#bfe5ff]" : "text-[#087cbc]")}>{plan.name}</p><h3 className="mt-2 text-2xl font-extrabold tracking-[-.04em]">{plan.id === "essential" ? "Show Your Business" : plan.id === "signature" ? "Convert More Customers" : "Automate Your Business"}</h3><p className={cn("mt-3 text-sm font-semibold leading-6", isSignature ? "text-white/78" : "text-[#526173]")}>{plan.id === "essential" ? "Businesses that need a premium digital presence without bookings or backend software." : recommended}</p><p className={cn("mt-5 text-[10px] font-extrabold uppercase tracking-[.13em]", isSignature ? "text-[#bfe5ff]" : "text-[#087cbc]")}>You Get</p><ul className="mt-3 grid flex-1 gap-2.5 text-[12px] font-semibold">{features.map((feature) => <li key={feature} className={cn("flex items-start gap-2", isSignature ? "text-white/88" : "text-[#526173]")}><span className={cn("mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px]", isSignature ? "bg-white/15 text-[#bfe5ff]" : "bg-[#eaf6ff] text-[#087cbc]")}>✓</span>{feature}</li>)}</ul><div className={cn("mt-6 border-t pt-4", isSignature ? "border-white/15" : "border-[#e5edf7]")}><p className="text-[10px] font-extrabold uppercase tracking-[.1em] opacity-70">Setup</p><p className="mt-1 text-3xl font-extrabold tracking-[-.05em]">{formatPricingCurrency(plan.setupAmount)} <span className="text-xs">+ GST</span></p><p className={cn("mt-3 text-xs font-bold", isSignature ? "text-white/82" : "text-[#526173]")}>3M ₹{plan.maintenanceOptions[0].price.toLocaleString("en-IN")} • 6M ₹{plan.maintenanceOptions[1].price.toLocaleString("en-IN")} • 12M ₹{plan.maintenanceOptions[2].price.toLocaleString("en-IN")}</p></div><Link href="/#contact" className={cn("mt-5 inline-flex min-h-11 items-center justify-center rounded-[11px] px-4 text-sm font-extrabold", isSignature ? "bg-white text-[#123d9d]" : "bg-[#09223E] text-white")}>{plan.id === "essential" ? "Get Essential" : plan.id === "signature" ? "Choose Signature" : "Go Elite"}</Link></article>;
}

function QuickBillPricingPromo() {
  const plans = [
    { label: "3 Months", price: "₹999" },
    { label: "6 Months", price: "₹1,799", popular: true },
    { label: "12 Months", price: "₹2,999", value: true },
  ];
  return (
    <section className="relative mx-auto mt-6 max-w-6xl overflow-hidden rounded-[24px] border border-[#d4e4db] bg-[radial-gradient(ellipse_at_top_right,#e0f2e7,transparent_65%),linear-gradient(135deg,#ffffff,#f4f9f7)] px-5 py-5 shadow-[0_16px_42px_-32px_rgba(24,65,48,.3)] sm:px-6 sm:py-6">
      <div className="grid items-center gap-5 md:grid-cols-[minmax(0,1fr)_150px]">
        <div>
          <div className="flex flex-wrap items-center gap-3"><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-[#378a2e]">Also from OneLink</p><span className="rounded-full border border-[#b8dfa9] bg-white/80 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[.08em] text-[#378a2e]">QuickBill</span></div>
          <h3 className="mt-2 text-2xl font-extrabold tracking-[-.045em] text-[#122d67] sm:text-3xl">Create bills. Share instantly. Track payments.</h3>
          <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[#526173]">A simple billing add-on for salons, clinics, cafés and growing businesses.</p>
          <div className="mt-4 rounded-[15px] border border-[#b8cdf0] bg-white/85 px-4 py-3 sm:max-w-[330px]"><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-[#526b8e]">One-time setup</p><p className="mt-1 text-2xl font-extrabold tracking-[-.04em] text-[#123d9d]">₹1,999 <span className="text-[11px] font-extrabold text-[#718096]">+ GST</span></p></div>
          <div className="mt-4 grid max-w-2xl gap-2 sm:grid-cols-3">{plans.map((plan) => <div key={plan.label} className={cn("relative rounded-[13px] border bg-white/85 px-3 py-2.5", plan.popular ? "border-[#70a5ed] shadow-[0_10px_22px_-17px_rgba(20,78,170,.55)]" : "border-[#d8e5f2]")}>
            {plan.popular ? <span className="absolute -top-2 left-2 rounded-full bg-[#123d9d] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[.06em] text-white">Popular</span> : null}
            {plan.value ? <span className="absolute -top-2 left-2 rounded-full bg-[#eaf8e7] px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[.06em] text-[#378a2e]">Best value</span> : null}
            <p className="text-[10px] font-extrabold uppercase tracking-[.08em] text-[#526173]">{plan.label}</p><p className="mt-1 text-lg font-extrabold text-[#123d9d]">{plan.price}</p>
          </div>)}</div>
        </div>
        <div className="relative mx-auto w-full max-w-[125px] md:max-w-[150px]"><Image src="/quickbill-pricing-mockup.png" alt="QuickBill mobile demo" width={2764} height={5805} className="h-auto max-h-[300px] w-full object-contain object-top drop-shadow-[0_18px_22px_rgba(24,65,48,.18)]" /></div>
      </div>
    </section>
  );
}

export function ChandigarhOfferButton({ plans, offerMode, onOfferToggle }: { plans: Plan[]; offerMode: boolean; onOfferToggle: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<TopPlanId>("signature");
  const [selectedCareId, setSelectedCareId] = useState("12-month");
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[1];
  const selectedCare = selectedPlan?.maintenanceOptions.find((option) => option.id === selectedCareId);
  const setupOffer = chandigarhSetupOffers[selectedPlanId][selectedCareId] ?? 0;
  const careAmount = selectedCare?.price ?? 0;
  const finalTotal = setupOffer + careAmount;
  const setupDiscount = (selectedPlan?.setupAmount ?? 0) - setupOffer;
  const claimHref = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent([
    "Hello OneLink, I want to claim the Chandigarh Launch Week setup offer.",
    `Plan: ${selectedPlan?.name ?? "Signature"}`,
    `Platform Care: ${selectedCare?.label ?? "12 Months"}`,
    `Setup Offer: ${formatCurrency(setupOffer)}`,
    `Platform Care: ${formatCurrency(careAmount)}`,
    `Setup Discount: ${formatCurrency(setupDiscount)}`,
    `Total: ${formatCurrency(finalTotal)} + GST`,
  ].join("\n"))}`;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={onOfferToggle}
        aria-pressed={offerMode}
        className="border-shine offer-shine-thin group relative mx-auto mt-4 flex w-full max-w-[760px] items-center justify-between gap-3 overflow-hidden rounded-[15px] border border-[#d9b75a]/55 bg-[linear-gradient(110deg,#081c31_0%,#0a2d50_58%,#0c4778_100%)] px-3.5 py-3 text-left text-white shadow-[0_16px_34px_-24px_rgba(7,42,78,0.72)] transition duration-300 hover:-translate-y-0.5 hover:border-[#e4c66d]/80 hover:shadow-[0_20px_38px_-24px_rgba(7,42,78,0.8)] sm:px-4 sm:py-3.5"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[11px] border border-[#d9b75a]/35 bg-[#d9b75a]/10">
            <span
              className="h-6 w-[18px] bg-[linear-gradient(180deg,#ffe8a2_0%,#d2a63f_100%)]"
              style={{
                WebkitMaskImage: "url(/onelink-logomark.png)",
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskSize: "contain",
                maskImage: "url(/onelink-logomark.png)",
                maskPosition: "center",
                maskRepeat: "no-repeat",
                maskSize: "contain",
              }}
              aria-hidden
            />
          </span>
          <span className="min-w-0">
            <span className="block text-[9px] font-extrabold uppercase tracking-[0.12em] text-[#e4c66d] sm:text-[10px]">{offerMode ? "24-Hour Offer Applied" : "Chandigarh Launch Week"}</span>
            <span className="mt-0.5 block text-[12px] font-bold tracking-[-0.01em] text-white sm:text-[14px]">{offerMode ? "Show Standard Pricing" : "View 24-Hour Setup Offer"}</span>
          </span>
        </span>
        <span className="relative flex shrink-0 items-center gap-2">
          <span className="rounded-full border border-[#d9b75a]/35 bg-[#d9b75a]/10 px-2.5 py-1.5 text-[8px] font-extrabold uppercase tracking-[0.07em] text-[#eed88f] sm:px-3 sm:text-[9px]">{offerMode ? "Active" : "24H Offer"}</span>
          <span className="hidden text-base text-[#eed88f] transition-transform group-hover:translate-x-0.5 sm:block">→</span>
        </span>
      </button>

      {isOpen && typeof document !== "undefined" ? createPortal(
        <div
          className="fixed inset-0 z-[360] flex items-center justify-center bg-[#06182b]/64 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setIsOpen(false);
          }}
        >
          <div role="dialog" aria-modal="true" aria-labelledby="chandigarh-offer-title" className="relative flex max-h-[96dvh] w-[94vw] max-w-[1440px] flex-col overflow-hidden rounded-[26px] border border-white/70 bg-[#f8fbff] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.76)]">
            <div className="flex items-start justify-between gap-4 border-b border-[#dbe7f0] bg-[linear-gradient(135deg,#09223E_0%,#064083_58%,#0077FF_100%)] px-5 py-5 text-left text-white sm:px-8 sm:py-5 lg:px-9">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#ffdf82] sm:text-[11px]">Chandigarh Launch Week</p>
                <h3 id="chandigarh-offer-title" className="mt-1.5 text-[25px] font-extrabold leading-tight tracking-[-0.035em] sm:text-[30px] lg:text-[32px]">24 Hour Setup Offer</h3>
                <p className="mt-1.5 max-w-4xl text-[12px] font-semibold leading-relaxed text-white/76 sm:text-[13px] lg:text-[14px]">Your Platform Care stays unchanged. Confirm within 24 hours and unlock a special discount on your One-Time Setup.</p>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close Chandigarh offer" className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 text-white transition hover:rotate-90 hover:bg-white/20 sm:h-12 sm:w-12">
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto px-4 py-4 text-left sm:px-8 sm:py-5 lg:px-9">
              <div className="grid grid-cols-3 rounded-[16px] border border-[#d5e3ee] bg-[#edf4f9] p-1.5 sm:p-2">
                {plans.map((plan) => {
                  const isSelected = plan.id === selectedPlanId;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id as TopPlanId)}
                      aria-pressed={isSelected}
                      className={cn(
                        "min-h-10 rounded-[11px] px-2 text-[11px] font-extrabold transition sm:min-h-11 sm:text-[13px] lg:text-[14px]",
                        isSelected
                          ? "bg-white text-[#064083] shadow-[0_8px_20px_-14px_rgba(9,34,62,0.55)] ring-1 ring-[#bed8ef]"
                          : "text-[#718096] hover:text-[#334155]",
                      )}
                    >
                      {plan.name}{plan.id === "signature" ? " ★" : ""}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#087cbc]">Selected plan</p>
                  <h4 className="mt-0.5 text-[24px] font-extrabold tracking-[-0.035em] text-[#111821] sm:text-[27px]">{selectedPlan?.name}{selectedPlanId === "signature" ? " ★" : ""}</h4>
                </div>
                <p className="hidden text-right text-[11px] font-bold text-[#718096] sm:block">Choose 3, 6 or 12 months<br />to compare your final price.</p>
              </div>

              <div className="mt-4 grid gap-4 xl:grid-cols-3">
                {primaryCareRows.map((row) => {
                  const rowSetup = chandigarhSetupOffers[selectedPlanId][row.id] ?? 0;
                  const rowCare = selectedPlan?.maintenanceOptions.find((option) => option.id === row.id)?.price ?? 0;
                  const rowTotal = rowSetup + rowCare;
                  const rowRegularTotal = (selectedPlan?.setupAmount ?? 0) + rowCare;
                  const rowSetupDiscount = (selectedPlan?.setupAmount ?? 0) - rowSetup;
                  const rowSetupDiscountPercent = Math.round((rowSetupDiscount / Math.max(selectedPlan?.setupAmount ?? 1, 1)) * 100);
                  const isSelected = selectedCareId === row.id;
                  const isBestValue = row.id === "12-month";
                  const isPopular = row.id === "6-month";
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => setSelectedCareId(row.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "relative flex min-h-[350px] w-full flex-col overflow-hidden rounded-[20px] border p-5 text-left transition xl:min-h-[360px]",
                        isSelected
                          ? "border-[#1686f4] bg-[radial-gradient(circle_at_100%_0%,rgba(0,119,255,0.13),transparent_34%),linear-gradient(160deg,#edf7ff_0%,#ffffff_70%)] shadow-[0_22px_48px_-25px_rgba(0,91,190,0.62)] ring-2 ring-[#1686f4]/15"
                          : "border-[#d7e4ed] bg-white hover:-translate-y-0.5 hover:border-[#a9cce8]",
                      )}
                    >
                      <div className="flex min-h-8 items-center justify-between gap-2">
                        <p className="text-[15px] font-extrabold uppercase tracking-[0.04em] text-[#263446] sm:text-[17px]">{row.label}</p>
                        {isBestValue || isPopular ? (
                          <span className={cn("rounded-full border px-3 py-1.5 text-[9px] font-extrabold uppercase tracking-[0.055em]", isBestValue ? "border-[#ead59d] bg-[#fff8df] text-[#8a6200]" : "border-[#6db8ff] bg-[linear-gradient(135deg,#09223E_0%,#0077FF_100%)] text-white shadow-[0_8px_18px_-10px_rgba(0,82,180,0.8)]")}>
                            {isBestValue ? "Best Value" : "Most Popular"}
                          </span>
                        ) : null}
                      </div>

                      <div className="mt-3 rounded-[16px] border border-[#e2ebf2] bg-[#f4f8fb] px-4 py-3.5 sm:px-5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] font-extrabold uppercase tracking-[0.09em] text-[#526173]">One-Time Setup</p>
                          <span className="rounded-full border border-[#bfe4d3] bg-[#ecf9f2] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.06em] text-[#147a47]">{rowSetupDiscountPercent}% off setup</span>
                        </div>
                        <div className="mt-2.5 grid grid-cols-[1fr_auto_1.15fr] items-end gap-2">
                          <span className="flex min-w-0 flex-col items-start gap-1.5">
                            <span className="rounded-full border border-[#d9e2ea] bg-[#f4f7fa] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#607084]">Before</span>
                            <span className="text-[18px] font-extrabold leading-none text-[#526173] sm:text-[20px]">{formatPricingCurrency(selectedPlan?.setupAmount ?? 0)}</span>
                          </span>
                          <span className="pb-0.5 text-[18px] font-bold text-[#9aa7b5]">→</span>
                          <span className="flex min-w-0 flex-col items-start gap-1.5">
                            <span className="w-fit rounded-full border border-[#e2c66d] bg-[#fff6d4] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#815600]">24H Setup</span>
                            <span className="bg-[linear-gradient(135deg,#064083_0%,#0077FF_100%)] bg-clip-text text-[28px] font-extrabold leading-none tracking-[-0.04em] text-transparent sm:text-[32px]">{formatPricingCurrency(rowSetup)}</span>
                          </span>
                        </div>
                        <p className="mt-2.5 text-[10px] font-bold text-[#138808] sm:text-[11px]">You save {formatPricingCurrency(rowSetupDiscount)} on setup</p>
                      </div>

                      <div className="mt-3 border-t border-[#e4edf3] pt-3">
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.07em] text-[#526173]">{row.label} Platform Care</p>
                        <p className="mt-1 text-[10px] font-semibold text-[#8795a5] sm:text-[11px]">Renews every {row.label.toLowerCase()}</p>
                        <p className="mt-1.5 text-[23px] font-extrabold tracking-[-0.025em] text-[#263446] sm:text-[26px]">{formatPricingCurrency(rowCare)}</p>
                      </div>

                      <div className={cn("mt-auto rounded-[16px] border px-4 py-3 sm:px-5", isSelected ? "border-[#b9ddf7] bg-[#e5f4ff]" : "border-[#e1eaf1] bg-[#f3f7fa]")}>
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.09em] text-[#526173]">Final Total</p>
                        <div className="mt-2 grid grid-cols-[1fr_auto_1.2fr] items-end gap-2">
                          <span className="flex flex-col items-start gap-1.5">
                            <span className="rounded-full border border-[#d9e2ea] bg-[#f4f7fa] px-2 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#607084]">Before</span>
                            <span className="text-[18px] font-extrabold leading-none text-[#526173] sm:text-[20px]">{formatPricingCurrency(rowRegularTotal)}</span>
                          </span>
                          <span className="pb-0.5 text-[18px] font-bold text-[#9aa7b5]">→</span>
                          <span className="flex flex-col items-start gap-1.5">
                            <span className="w-fit rounded-full border border-[#e2c66d] bg-[#fff6d4] px-2.5 py-1 text-[8px] font-extrabold uppercase tracking-[0.08em] text-[#815600]">24H Offer</span>
                            <span className="flex items-end gap-1.5">
                              <span className="bg-[linear-gradient(135deg,#09223E_0%,#0077FF_100%)] bg-clip-text text-[29px] font-extrabold leading-none tracking-[-0.04em] text-transparent sm:text-[34px]">{formatPricingCurrency(rowTotal)}</span>
                              <span className="pb-0.5 text-[8px] font-bold text-[#718096]">+ GST</span>
                            </span>
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

            </div>

            <div className="border-t border-[#cfe0ec] bg-white/96 px-4 py-4 shadow-[0_-14px_36px_-30px_rgba(9,34,62,0.55)] backdrop-blur-xl sm:px-8 sm:py-5 lg:px-10">
              <a href={claimHref} target="_blank" rel="noreferrer" className="group relative mx-auto flex h-13 w-full max-w-[720px] items-center justify-center overflow-hidden rounded-[14px] border border-[#4db6ff]/70 bg-[linear-gradient(135deg,#09223E_0%,#064083_52%,#0077FF_100%)] px-5 text-[13px] font-extrabold text-white shadow-[0_16px_32px_-18px_rgba(0,65,150,0.82)] transition hover:-translate-y-0.5 hover:brightness-110 sm:h-14 sm:text-[16px]">
                Claim Within 24 Hours
              </a>
              <p className="mt-2.5 text-center text-[10px] font-bold text-[#718096] sm:text-[11px]">Your launch price is reserved for 24 hours after your demo.</p>
            </div>
          </div>
        </div>,
        document.body,
      ) : null}
    </>
  );
}

function DedicatedPricingSelector({ plans, premiumPlan, selectedPlanId, onPlanChange, premiumHref, isDiwali = false }: { plans: Plan[]; premiumPlan?: Plan; selectedPlanId: DedicatedPlanId; onPlanChange: (planId: DedicatedPlanId) => void; premiumHref: string; isDiwali?: boolean }) {
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[1];

  return (
    <div>
      <div className="mx-auto mb-5 grid w-full max-w-[850px] grid-cols-4 gap-1 rounded-[16px] border border-[#d5e4ef] bg-white/72 p-1 shadow-[0_18px_42px_-34px_rgba(9,34,62,0.38)] backdrop-blur-xl sm:mb-6 sm:gap-1.5 sm:rounded-[18px] sm:p-1.5">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id;
          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onPlanChange(plan.id as DedicatedPlanId)}
              aria-pressed={isSelected}
              aria-controls="selected-pricing-plan"
              className={cn(
                "relative flex min-h-10 min-w-0 items-center justify-center whitespace-nowrap rounded-[11px] border px-1 py-2 text-[9px] font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A9FF] focus-visible:ring-offset-2 sm:min-h-[48px] sm:rounded-[13px] sm:px-3 sm:text-[13px]",
                isSelected
                  ? "-translate-y-px border-[#8fcff1] bg-[linear-gradient(145deg,#ffffff_0%,#e5f6ff_100%)] text-[#056ea9] shadow-[0_12px_24px_-18px_rgba(0,119,255,0.7)] ring-1 ring-[#00A9FF]/10"
                  : "border-[#e3ebf2] bg-white/55 text-[#607084] hover:-translate-y-px hover:border-[#acd9ee] hover:bg-white hover:text-[#087cbc]",
              )}
            >
              <span>{plan.name}</span>
            </button>
          );
        })}
        <button type="button" onClick={() => onPlanChange("enterprise")} aria-pressed={selectedPlanId === "enterprise"} aria-controls="selected-pricing-plan" className={cn("relative flex min-h-10 min-w-0 items-center justify-center gap-1 whitespace-nowrap rounded-[11px] border px-1 py-2 text-[8px] font-extrabold transition sm:min-h-[48px] sm:gap-2 sm:rounded-[13px] sm:px-3 sm:text-[13px]", selectedPlanId === "enterprise" ? "-translate-y-px border-[#60c8ff] bg-[linear-gradient(135deg,#09223E_0%,#064083_48%,#0077FF_100%)] text-white shadow-[0_16px_30px_-17px_rgba(0,67,155,0.82)] ring-2 ring-[#00A9FF]/20" : "border-[#176ab5] bg-[linear-gradient(135deg,#09223E_0%,#064083_52%,#006bdc_100%)] text-white shadow-[0_12px_24px_-19px_rgba(0,67,155,0.72)] hover:-translate-y-px hover:brightness-110")}>
          <span>OneLink Premium</span>
        </button>
      </div>
      <div id="selected-pricing-plan" key={selectedPlanId}>
        {selectedPlanId === "enterprise" && premiumPlan ? <EnterprisePanel href={premiumHref} plan={premiumPlan} detailed /> : selectedPlan ? <DedicatedPricingPlan plan={selectedPlan} isSignature={selectedPlan.id === "signature"} isDiwali={isDiwali} /> : null}
      </div>
    </div>
  );
}

function DedicatedPricingPlan({ plan, isSignature = false, isDiwali = false }: { plan: Plan; isSignature?: boolean; isDiwali?: boolean }) {
  const tone = getPlanTone(plan);
  const [selectedCare, setSelectedCare] = useState("6-month");
  const [isUpdateInfoOpen, setIsUpdateInfoOpen] = useState(false);
  const presentation = pricingPresentation[plan.id as TopPlanId];

  if (!presentation) return null;

  const regularSetup = presentation.setupRegular;
  const setupAmount = isDiwali ? presentation.setupDiwali : presentation.setupRegular;
  const savings = presentation.diwaliSavings;
  const planCopy = {
    essential: { title: "Smart Business Presence", recommended: presentation.recommendedFor },
    signature: { title: "Smart Business Growth", recommended: presentation.recommendedFor },
    elite: { title: "Smart Business Management", recommended: presentation.recommendedFor },
  }[plan.id as TopPlanId];
  const mockupStack = pricingMockupStackOrder[plan.id as TopPlanId].map((id) => pricingMockups[id]);
  const selectedOption = plan.maintenanceOptions.find((option) => option.id === selectedCare) ?? plan.maintenanceOptions[1];
  const firstPayment = setupAmount + (selectedOption?.price ?? 0);

  return (
    <article className={cn(
      "relative w-full overflow-hidden rounded-[24px] border p-4 shadow-[0_18px_48px_-32px_rgba(9,34,62,0.22)] sm:p-6",
      isSignature
        ? isDiwali
          ? "border-[#f59e0b] bg-[linear-gradient(145deg,#09223E_0%,#064083_52%,#0077FF_100%)] text-white shadow-[0_34px_82px_-45px_rgba(0,67,155,0.82),0_0_24px_rgba(245,158,11,0.2)] ring-1 ring-[#f59e0b]/40"
          : "border-[#4a9dff] bg-[linear-gradient(145deg,#09223E_0%,#064083_52%,#0077FF_100%)] text-white shadow-[0_34px_82px_-45px_rgba(0,67,155,0.82)]"
        : plan.id === "essential"
          ? isDiwali ? "border-[#fde68a] bg-[linear-gradient(145deg,#ffffff_0%,#fffdf5_100%)] text-[#111821]" : "border-[#cfdfeb] bg-[linear-gradient(145deg,#ffffff_0%,#edf6fc_100%)] text-[#111821]"
          : isDiwali ? "border-[#fde68a] bg-[linear-gradient(145deg,#ffffff_0%,#fffdf5_100%)] text-[#111821]" : "border-[#c9dce9] bg-[linear-gradient(145deg,#fafdff_0%,#eaf3fb_100%)] text-[#111821]",
    )}>
      {isSignature ? (
        <span className={cn(
          "mb-3 inline-flex rounded-full px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-white sm:absolute sm:right-6 sm:top-6 sm:mb-0",
          isDiwali
            ? "border border-[#fde68a] bg-amber-500/30 text-amber-200"
            : "border border-white/25 bg-white/12"
        )}>
          Most Popular
        </span>
      ) : null}

      <header className={cn("max-w-none", isSignature && "sm:pr-32")}>
        <p className={cn("text-[10px] font-extrabold uppercase tracking-[0.17em]", isSignature ? "text-[#bfe5ff]" : tone.label)}>{plan.badge}</p>
        <div className="mt-1.5 flex items-center gap-2.5">
          <PricingBrandMark tone={tone.markTone} className="h-9 w-9 rounded-[11px] [&_img]:w-5" />
          <h3 className={cn("text-[24px] font-black tracking-[-0.035em] sm:text-[26px]", isSignature ? "text-white" : "text-[#09223E]")}>{plan.name}</h3>
        </div>
        <h4 className={cn("mt-1.5 text-[20px] font-black leading-tight tracking-[-0.025em] sm:text-[23px]", isSignature ? "text-white" : "text-[#0f172a]")}>{planCopy.title}</h4>
        <div className={cn("mt-3 rounded-[12px] border px-3.5 py-3", isSignature ? "border-white/25 bg-white/10" : "border-[#d4e4ef] bg-white/85")}><p className={cn("text-[10.5px] font-extrabold uppercase tracking-[.13em]", isSignature ? "text-[#bfe5ff]" : "text-[#087cbc]")}>Recommended for</p><p className={cn("mt-1 text-[14px] font-semibold leading-relaxed", isSignature ? "text-white" : "text-[#1e293b]")}>{planCopy.recommended}</p></div>
      </header>

      <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-[0.82fr_1.22fr_1.16fr] lg:items-stretch">
        <section className={cn("rounded-[16px] border p-4 sm:p-5", isSignature ? "border-white/25 bg-white/[0.1]" : "border-[#a9cee8] bg-[#f4faff] shadow-[0_16px_34px_-26px_rgba(9,34,62,0.42)]")}>
          <div className="flex items-center justify-between gap-2">
            <p className={cn("text-[11px] font-extrabold uppercase tracking-[0.12em]", isSignature ? "text-[#bfe5ff]" : "text-[#087cbc]")}>One-Time Setup</p>
            {isDiwali ? (
              <span className="rounded-full border border-amber-300 bg-amber-100 px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.05em] text-amber-950">
                Diwali Special
              </span>
            ) : null}
          </div>

          {isDiwali ? (
            <div className="mt-2.5 flex items-center gap-2">
              <span className={cn("text-[14px] font-bold line-through decoration-red-400 decoration-2 tabular-nums", isSignature ? "text-white/75" : "text-slate-500")}>
                {formatPricingCurrency(regularSetup)}
              </span>
              <span className="rounded-full border border-emerald-300 bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-900">
                Save {formatPricingCurrency(savings)}
              </span>
            </div>
          ) : null}

          <div className={cn("flex flex-wrap items-end gap-2.5", isDiwali ? "mt-1.5" : "mt-3")}>
            <span className={cn("text-[38px] font-black leading-none tracking-[-0.045em] tabular-nums sm:text-[42px]", isSignature ? "text-white" : "text-[#09223E]")}>{formatPricingCurrency(setupAmount)}</span>
            <span className={cn("mb-0.5 rounded-full border px-2.5 py-1 text-[9px] font-black uppercase", isSignature ? "border-white/30 bg-white/20 text-white" : "border-[#bde7fb] bg-[#eef9ff] text-[#087cbc]")}>+ GST</span>
          </div>
          <p className={cn("mt-3 border-t pt-3 text-[11px] font-semibold leading-relaxed", isSignature ? "border-white/20 text-white/95" : "border-[#cfe2ef] text-[#334155]")}>Charged once for complete OneLink setup.</p>
        </section>

        <section className={cn("rounded-[16px] border p-4 sm:p-5", isSignature ? "border-white/20 bg-white/[0.08]" : "border-[#a9cee8] bg-[#f4faff]")}>
          <p className={cn("text-[11.5px] font-extrabold uppercase tracking-[0.13em]", isSignature ? "text-white" : "text-[#09223E]")}>Choose Platform Care</p>
          <p className={cn("mt-1 text-[11px] font-semibold", isSignature ? "text-sky-200" : "text-[#526173]")}>Hosting, support &amp; updates included.</p>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {primaryCareRows.map((row) => {
              const option = plan.maintenanceOptions.find((item) => item.id === row.id);
              const isSelected = selectedCare === row.id;
              const badge = (isSignature && row.id === "6-month") ? "Most Popular" : (row.id === "12-month") ? "Best Value" : null;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => setSelectedCare(row.id)}
                  aria-pressed={isSelected}
                  className={cn(
                    "relative flex min-h-[82px] min-w-0 flex-col items-center justify-center rounded-[12px] border px-1.5 py-2 text-center transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00A9FF] focus-visible:ring-offset-2",
                    isSelected
                      ? "border-[#00A9FF] bg-white text-[#111821] shadow-md ring-2 ring-[#00A9FF]/30"
                      : isSignature ? "border-white/20 bg-white/10 text-white hover:bg-white/20" : "border-[#dce8ef] bg-white text-[#334155] hover:border-[#9fd6f4]",
                  )}
                >
                  {badge ? <span className={cn("mb-1 rounded-full px-1.5 py-0.5 text-[7px] font-black uppercase tracking-[0.03em]", isSelected ? "bg-[#eaf6ff] text-[#087cbc]" : "bg-white/20 text-white")}>{badge}</span> : null}
                  <span className={cn("text-[9.5px] font-black uppercase tracking-[0.05em] sm:text-[10.5px]", isSelected ? "text-[#09223E]" : isSignature ? "text-white" : "text-[#334155]")}>{row.label}</span>
                  <span className={cn("mt-1.5 text-[19px] font-black leading-none tabular-nums sm:text-[22px]", isSelected ? "text-[#087cbc]" : isSignature ? "text-white" : "text-[#09223E]")}>{formatPricingCurrency(option?.price ?? 0)}</span>
                </button>
              );
            })}
          </div>

          <div className={cn("mt-3 rounded-[14px] border p-3.5", isSignature ? "border-white/45 bg-white text-[#111821]" : "border-[#9fc8e5] bg-[#e7f4fd] shadow-[0_14px_30px_-26px_rgba(9,34,62,0.42)]")}>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#087cbc]">Total Package Price</p>
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
              <span className="text-[11px] font-bold text-[#475569]">Setup + {selectedOption?.label} Care</span>
              <span className="flex items-end gap-2"><strong className="text-[30px] font-black leading-none tracking-[-0.045em] text-[#064083] tabular-nums sm:text-[34px]">{formatPricingCurrency(firstPayment)}</strong><small className="pb-0.5 text-[9px] font-black uppercase text-[#087cbc]">+ GST</small></span>
            </div>
          </div>
        </section>

        <aside className={cn("relative min-h-[250px] h-full overflow-hidden rounded-[17px] border md:col-span-2 md:min-h-[260px] lg:col-span-1", isSignature ? "border-white/25 bg-[radial-gradient(circle_at_50%_72%,rgba(0,169,255,0.34),transparent_62%),rgba(255,255,255,0.08)]" : "border-[#9fc8e5] bg-[radial-gradient(circle_at_50%_72%,rgba(0,169,255,0.24),transparent_62%),#e7f4fd]")}>
          <div className="absolute inset-0 overflow-hidden">
            {mockupStack.map((item, index) => (
              <Image
                key={item.src}
                src={item.src}
                alt={item.alt}
                width={700}
                height={1400}
                className={cn(
                  "absolute top-0 h-[235px] w-auto max-w-none object-contain object-top drop-shadow-[0_22px_24px_rgba(9,34,62,0.26)] transition-transform duration-500 sm:h-[250px] md:h-[260px]",
                  index === 0 && "left-[8%] z-10 -rotate-[5deg] scale-[0.76] opacity-65",
                  index === 1 && "right-[8%] z-20 rotate-[5deg] scale-[0.82] opacity-82",
                  index === 2 && "left-1/2 z-30 -translate-x-1/2 scale-100",
                )}
                priority={isSignature && index === 2}
              />
            ))}
          </div>
          <div className={cn("pointer-events-none absolute inset-x-0 bottom-0 z-40 h-16 bg-gradient-to-t to-transparent", isSignature ? "from-[#09223E]" : "from-[#e7f4fd]")} />
        </aside>
      </div>
      <section className={cn("mt-4 rounded-[17px] border p-4 sm:p-5", isSignature ? "border-white/20 bg-white/[0.08]" : "border-[#d4e4ef] bg-white/85")}>
        <p className={cn("text-[11.5px] font-extrabold uppercase tracking-[.13em]", isSignature ? "text-[#bfe5ff]" : "text-[#087cbc]")}>What&apos;s included</p>
        <ul className="mt-3 grid gap-2.5 text-[13.5px] font-semibold leading-relaxed sm:grid-cols-2">
          {presentation.features.map((feature) => <li key={feature} className={cn("flex items-start gap-2.5", isSignature ? "text-white" : "text-[#0f172a]")}><span className={cn("mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full text-[9px] font-bold", isSignature ? "bg-white/20 text-white" : "bg-[#eaf6ff] text-[#087cbc]")}>✓</span>{feature}</li>)}
        </ul>
        {plan.id === "essential" ? (
          <div className={cn("mt-4 border-t pt-3", isSignature ? "border-white/15" : "border-[#d6e5ee]")}>
            <button
              type="button"
              onClick={() => setIsUpdateInfoOpen((open) => !open)}
              aria-expanded={isUpdateInfoOpen}
              className={cn("flex w-full items-center justify-between gap-3 rounded-[11px] border px-3 py-2.5 text-left text-[11px] font-extrabold transition", isSignature ? "border-white/25 bg-white/10 text-white hover:bg-white/15" : "border-[#b8dced] bg-[#eef8ff] text-[#087cbc] hover:border-[#72c5eb]")}
            >
              <span>Managed update details</span>
              <span className={cn("text-base leading-none transition-transform", isUpdateInfoOpen && "rotate-45")}>+</span>
            </button>
            {isUpdateInfoOpen ? (
              <p className={cn("mt-2.5 rounded-[10px] px-3 py-2.5 text-[11px] font-semibold leading-relaxed", isSignature ? "bg-white/10 text-white/80" : "bg-white text-[#526173]")}>
                3 update requests are included each month. Additional update pack: <strong>₹199 + GST</strong> for up to <strong>3–5 content changes</strong>.
              </p>
            ) : null}
          </div>
        ) : null}
      </section>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-current/10 pt-4">
        <Link href="/pricing/compare" className={cn("inline-flex min-h-10 items-center justify-center rounded-[11px] border px-4 text-[12px] font-extrabold transition hover:-translate-y-0.5", isSignature ? "border-white/50 bg-white text-[#064083]" : "border-[#9fc8e5] bg-white text-[#087cbc]")}>Compare all features <span className="ml-1.5" aria-hidden="true">→</span></Link>
        <BuyButton
          planId={plan.id}
          maintenanceId={selectedCare}
          isDiwali={isDiwali}
          variant={isSignature ? "white" : "primary"}
          label={isDiwali ? `Choose ${plan.name} · Diwali Offer` : `Choose ${plan.name}`}
          className={cn("h-10 rounded-[11px] px-5 text-[13px] font-extrabold", isSignature ? "!bg-white !text-[#064083] hover:!bg-neutral-100 shadow-sm" : "!bg-[#09223E] !text-white hover:!bg-[#064083] shadow-sm")}
        />
      </div>
    </article>
  );
}

function PricingCard({ plan, isSignature, isDiwali = false }: { plan: Plan; isSignature?: boolean; isDiwali?: boolean }) {
  const isElite = plan.id === "elite";
  const [selectedCare, setSelectedCare] = useState("6-month");
  const presentation = pricingPresentation[plan.id as TopPlanId];

  if (!presentation) return null;

  const regularSetup = presentation.setupRegular;
  const currentSetup = isDiwali ? presentation.setupDiwali : presentation.setupRegular;
  const savings = presentation.diwaliSavings;
  const selectedOption = plan.maintenanceOptions.find((item) => item.id === selectedCare) ?? plan.maintenanceOptions[1];
  const totalFirstPackage = currentSetup + (selectedOption?.price ?? 0);

  // Gradient pods styling matching the reference luxury SaaS screenshots
  const podGradient = isSignature
    ? "bg-[linear-gradient(135deg,#03366e_0%,#005bb5_45%,#00A9FF_100%)] shadow-[0_16px_36px_-12px_rgba(0,119,255,0.38)] border border-sky-300/30 text-white"
    : isElite
      ? "bg-[linear-gradient(145deg,#030a14_0%,#0a1f3b_55%,#1b3b6d_100%)] shadow-[0_14px_30px_-12px_rgba(9,34,62,0.32)] border border-white/10 text-white"
      : "bg-[linear-gradient(145deg,#071626_0%,#0d2745_65%,#133c66_100%)] shadow-[0_14px_30px_-12px_rgba(9,34,62,0.28)] border border-white/10 text-white";

  return (
    <article
      className={cn(
        "group relative mx-auto flex h-full w-full max-w-[calc(100vw-40px)] min-w-0 flex-col rounded-[28px] border bg-white p-3 sm:p-3.5 transition-all duration-300 sm:max-w-none",
        isSignature
          ? isDiwali
            ? "!overflow-visible border-amber-400/60 shadow-[0_16px_36px_-12px_rgba(245,158,11,0.18)] ring-1 ring-amber-400/25"
            : "!overflow-visible border-[#00A9FF]/40 shadow-[0_16px_36px_-12px_rgba(0,119,255,0.2)] ring-1 ring-[#00A9FF]/20"
          : isDiwali
            ? "border-amber-200/70 shadow-sm hover:border-amber-300/80 hover:shadow-md"
            : "border-slate-200/90 shadow-sm hover:border-slate-300 hover:shadow-md",
      )}
    >
      {/* Most Popular badge on Signature */}
      {isSignature ? (
        <span className={cn(
          "absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3.5 py-1 text-[10px] font-extrabold uppercase leading-none tracking-[0.12em] text-white shadow-sm transition-all duration-300",
          isDiwali
            ? "border border-amber-300 bg-[linear-gradient(135deg,#0088ff_0%,#005bb5_100%)] ring-1 ring-amber-300/30"
            : "border border-sky-300 bg-[#0088ff]",
        )}>
          Most Popular
        </span>
      ) : null}

      {/* Top Gradient Hero Pod */}
      <div className={cn("relative overflow-hidden rounded-[22px] p-5 sm:p-6 transition-all duration-300", podGradient)}>
        {/* Soft Radial Gloss Overlay */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.22),transparent_65%)]" aria-hidden />

        <div className="relative z-10 flex flex-col">
          {/* Plan Name & Description */}
          <h3 className="text-[27px] font-black leading-tight tracking-[-0.03em] text-white sm:text-[29px]">
            {plan.name}
          </h3>
          <p className="mt-1 text-[13px] font-semibold text-white/90 leading-snug">
            {presentation.description}
          </p>

          {/* Pricing Row */}
          <div className="mt-4 flex flex-wrap items-baseline gap-2">
            {isDiwali ? (
              <span className="text-[17px] font-bold text-white/70 line-through decoration-red-400 decoration-2 tabular-nums">
                {formatPricingCurrency(regularSetup)}
              </span>
            ) : null}
            <span className="text-[38px] font-black leading-none tracking-tight text-white tabular-nums sm:text-[42px]">
              {formatPricingCurrency(currentSetup)}
            </span>
            <span className="text-[11.5px] font-bold text-white/80 tabular-nums">
              + GST
            </span>
            {isDiwali ? (
              <span className="ml-auto rounded-full bg-emerald-400 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-950 shadow-xs">
                Save {formatPricingCurrency(savings)}
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-[11.5px] font-medium text-white/85">
            One-time development fee
          </p>

          {/* CTA Button */}
          <div className="mt-4">
            <BuyButton
              planId={plan.id}
              maintenanceId={selectedCare}
              isDiwali={isDiwali}
              variant="white"
              label={
                isDiwali
                  ? `Get ${plan.name} · Save ${formatPricingCurrency(savings)}`
                  : `Get ${plan.name}`
              }
              className={cn(
                "h-11 sm:h-12 w-full rounded-[13px] text-[14px] font-black tracking-[-0.01em] shadow-md transition-all active:scale-[0.98]",
                isSignature
                  ? "!text-[#03366e] !bg-white hover:!bg-sky-50"
                  : "!text-[#09223E] !bg-white hover:!bg-slate-50",
              )}
            />
          </div>

          {/* Platform Care Selector Pill Bar */}
          <div className="mt-4 pt-3.5 border-t border-white/20">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-white/90">
                Platform Care
              </span>
              <span className="text-[10.5px] font-medium text-sky-200/80">
                Hosting &amp; Support
              </span>
            </div>

            <div className="grid grid-cols-3 gap-1.5 rounded-[12px] border border-white/20 bg-black/25 p-1 backdrop-blur-md">
              {primaryCareRows.map((row) => {
                const option = plan.maintenanceOptions.find((item) => item.id === row.id);
                const isSelected = selectedCare === row.id;
                return (
                  <button
                    key={row.id}
                    type="button"
                    onClick={() => setSelectedCare(row.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "min-h-[44px] rounded-[9px] py-1 px-1 text-center transition-all duration-150 flex flex-col items-center justify-center",
                      isSelected
                        ? "bg-white text-[#09223E] font-black shadow-sm ring-1 ring-white/40"
                        : "bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold transition-colors",
                    )}
                  >
                    <span className={cn(
                      "text-[10px] uppercase font-black tracking-wider leading-none",
                      isSelected ? "text-[#09223E]" : "text-white",
                    )}>
                      {row.label}
                    </span>
                    <span className={cn(
                      "text-[12.5px] font-black leading-tight tabular-nums mt-0.5",
                      isSelected ? "text-[#005bb5]" : "text-white",
                    )}>
                      {formatPricingCurrency(option?.price ?? 0)}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Clean Total Pill */}
            <div className="mt-2.5 flex items-center justify-between rounded-[10px] border border-white/15 bg-black/30 px-3 py-2 text-white">
              <span className="text-[11.5px] font-medium text-white/90">
                Total ({selectedOption.label}):
              </span>
              <span className="text-[13.5px] font-black tracking-tight text-white tabular-nums">
                {formatPricingCurrency(totalFirstPackage)}{" "}
                <span className="text-[9px] font-bold text-white/75 uppercase">+ GST</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature List on Clean White Background */}
      <div className="flex flex-1 flex-col px-4 pt-4 pb-4 sm:px-5 sm:pt-5 sm:pb-5">
        <div>
          <p className="text-[10.5px] font-extrabold uppercase tracking-[0.15em] text-[#087cbc] mb-3">
            What&apos;s included
          </p>

          <ul className="space-y-2.5 sm:space-y-3">
            {presentation.features.map((feature, idx) => {
              const isLeadFeature = idx === 0 && (feature.startsWith("Custom") || feature.startsWith("Everything in"));
              return (
                <li key={feature} className="flex items-start gap-2.5">
                  <span className={cn(
                    "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-black shadow-2xs",
                    isSignature
                      ? "bg-[#0077FF] text-white"
                      : isElite
                        ? "bg-[#09223E] text-white"
                        : "bg-[#087cbc] text-white",
                  )}>
                    ✓
                  </span>
                  <span className={cn(
                    "text-[13px] sm:text-[13.5px] leading-snug",
                    isLeadFeature
                      ? isSignature
                        ? "font-bold text-[#0066d6]"
                        : "font-bold text-[#09223E]"
                      : "font-medium text-[#1e293b]",
                  )}>
                    {feature}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </article>
  );
}

function PricingPackageBuilder({ initialPlanId, isDiwali = false }: { initialPlanId?: TopPlanId; isDiwali?: boolean }) {
  const modalRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<TopPlanId>(initialPlanId ?? "signature");
  const [selectedCareId, setSelectedCareId] = useState("12-month");
  const [includeGst, setIncludeGst] = useState(false);
  const [discountSelection, setDiscountSelection] = useState("10");
  const [customDiscount, setCustomDiscount] = useState("0");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [discountOpen, setDiscountOpen] = useState(false);
  const plans = pricingPlans.filter((plan): plan is Plan & { id: TopPlanId } =>
    ["essential", "signature", "elite"].includes(plan.id),
  );
  const selectedPlan = plans.find((plan) => plan.id === selectedPlanId) ?? plans[1];
  const selectedCare = selectedPlan?.maintenanceOptions.find((option) => option.id === selectedCareId)
    ?? selectedPlan?.maintenanceOptions[0];
  const careAmount = selectedCare?.price ?? 0;
  const presentation = pricingPresentation[selectedPlanId];
  const setupAmount = isDiwali ? presentation.setupDiwali : presentation.setupRegular;
  const baseSubtotal = setupAmount + careAmount;
  const subtotal = baseSubtotal;
  const discountAmount = Math.round(subtotal * (Math.min(Math.max(appliedDiscount, 0), 100) / 100));
  const discountedSubtotal = subtotal - discountAmount;
  const gst = Math.round(discountedSubtotal * 0.18);
  const total = includeGst ? discountedSubtotal + gst : discountedSubtotal;

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.body.style.overflow = "hidden";
    const resetFrame = window.requestAnimationFrame(() => modalRef.current?.scrollTo({ top: 0 }));
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(resetFrame);
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const applyDiscount = () => {
    setAppliedDiscount(discountSelection === "custom" ? Number(customDiscount) : Number(discountSelection));
  };
  const resetDiscount = () => {
    setAppliedDiscount(0);
  };
  const getStartedHref = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent([
    "Hello OneLink, I want to build my OneLink package.",
    `Plan: ${selectedPlan?.name ?? "Signature"}`,
    `Duration: ${selectedCare?.label ?? "12 Months"}`,
    `First Purchase: ${formatCurrency(subtotal)} + GST`,
    `Future Renewal: ${formatCurrency(careAmount)} + GST`,
    discountAmount > 0 ? `Discount applied: -${formatCurrency(discountAmount)}` : null,
    `GST preference: ${includeGst ? "With GST" : "Without GST"}`,
    `Estimated Total: ${formatCurrency(total)}${includeGst ? " (including GST)" : " (GST excluded)"}`,
  ].filter(Boolean).join("\n"))}`;

  return (
    <div className="mx-auto mt-8 max-w-6xl sm:mt-9">
      <div className="relative overflow-hidden rounded-[24px] border border-[#b9d7f3] bg-white px-5 py-5 shadow-[0_24px_58px_-40px_rgba(9,34,62,0.48)] sm:flex sm:items-center sm:justify-between sm:gap-6 sm:px-7 sm:py-6">
        <div className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#0077FF]/[0.07] blur-3xl" />
        <div className="relative flex items-center gap-3.5 text-left">
          <PricingBrandMark tone="essential" className="h-12 w-12 rounded-[15px] border-[#b9d7f3] bg-[#f5faff] [&_img]:h-[30px] [&_img]:w-auto" />
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#0077a8]">Need exact pricing?</p>
            <h3 className="mt-1 text-[18px] font-extrabold tracking-[-0.025em] text-[#09223E] sm:text-[20px]">Build Your OneLink Package</h3>
            <p className="mt-1 text-[11px] font-semibold leading-relaxed text-[#718096] sm:text-[12px]">Choose your plan and care period. See the final payable amount instantly.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          aria-expanded={isOpen}
          aria-controls="pricing-package-builder"
          className="relative mt-5 inline-flex min-h-[50px] w-full shrink-0 items-center justify-center gap-2 rounded-[15px] border border-[#287fdc] bg-[linear-gradient(135deg,#09223E_0%,#064083_50%,#0077FF_100%)] px-5 text-[13px] font-extrabold text-white shadow-[0_18px_34px_-20px_rgba(0,65,150,0.66)] transition hover:-translate-y-0.5 hover:brightness-110 sm:mt-0 sm:w-auto sm:px-6 sm:text-[14px]"
        >
          {isOpen ? "Close Package Builder" : "Build Your OneLink Package"}
          <svg className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m4 6 4 4 4-4" />
          </svg>
        </button>
      </div>

      {isOpen && typeof document !== "undefined" ? createPortal(
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-[#071b2f]/58 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.currentTarget === event.target) setIsOpen(false);
          }}
        >
          <div ref={modalRef} id="pricing-package-builder" role="dialog" aria-modal="true" aria-labelledby="pricing-builder-title" className="relative max-h-[92vh] w-full max-w-[1180px] overflow-y-auto rounded-[24px] border border-white/70 bg-white shadow-[0_40px_110px_-30px_rgba(2,18,38,0.75)] sm:rounded-[30px]">
            <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-[#dce9f5] bg-white/94 px-5 py-4 backdrop-blur-xl sm:px-7 sm:py-5">
              <div className="flex min-w-0 items-center gap-3">
                <PricingBrandMark tone="essential" className="h-11 w-11 shrink-0 rounded-[13px] border-[#b9d7f3] bg-[#f5faff] [&_img]:h-7 [&_img]:w-auto" />
                <div className="min-w-0">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#087cbc]">Simple, transparent pricing</p>
                  <h2 id="pricing-builder-title" className="truncate text-[18px] font-extrabold tracking-[-0.03em] text-[#09223E] sm:text-[23px]">Build Your OneLink Package</h2>
                </div>
              </div>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Close package builder" className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#d7e4ef] bg-white text-[#27425f] shadow-sm transition hover:rotate-90 hover:border-[#8dbde9] hover:text-[#0077FF]">
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m3 3 10 10M13 3 3 13" /></svg>
              </button>
            </div>
            <div className="pointer-events-none absolute inset-x-8 top-0 z-30 h-[2px] bg-[linear-gradient(90deg,transparent,#0077FF,transparent)] opacity-80" />
            <div className="grid gap-0 lg:grid-cols-[1fr_1fr_1.15fr]">
            <div className="border-b border-[#dfeaf4] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#087cbc]">Step 1</p>
              <h3 className="mt-1.5 text-[19px] font-extrabold tracking-[-0.025em] text-[#111821]">Choose Plan</h3>
              <div className="mt-4 grid grid-cols-1 gap-2.5">
                {plans.map((plan) => {
                  const isSelected = selectedPlanId === plan.id;
                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlanId(plan.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex min-h-[56px] items-center justify-between rounded-[12px] border px-3.5 text-left transition",
                        isSelected
                          ? "border-[#0077FF] bg-[#f0f6ff] text-[#064083] shadow-[0_12px_24px_-17px_rgba(0,86,185,0.62)] ring-2 ring-[#0077FF]/15"
                          : "border-[#dce8ef] bg-white text-[#526173] hover:border-[#9ddcf8]",
                      )}
                    >
                      <span className="text-[13px] font-extrabold">{plan.name}</span>
                      <span className={cn("text-right text-[10px] font-bold uppercase leading-tight tracking-[0.04em]", isSelected ? "text-[#087cbc]" : "text-[#718096]")}>
                        One-time setup<br /><span className="mt-1 inline-block text-[16px] font-extrabold tracking-[-0.02em] tabular-nums">{formatPricingCurrency(plan.setupAmount)}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="border-b border-[#dfeaf4] p-5 sm:p-7 lg:border-b-0 lg:border-r">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#087cbc]">Step 2</p>
              <h3 className="mt-1.5 text-[19px] font-extrabold tracking-[-0.025em] text-[#111821]">Choose Duration</h3>
              <div className="mt-4 grid grid-cols-1 gap-2.5">
                {primaryCareRows.map((row) => {
                  const isSelected = selectedCareId === row.id;
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => setSelectedCareId(row.id)}
                      aria-pressed={isSelected}
                      className={cn(
                        "flex min-h-[56px] items-center justify-between gap-3 rounded-[12px] border px-3.5 text-left transition",
                        isSelected
                          ? "border-[#0077FF] bg-[#f0f6ff] text-[#064083] shadow-[0_12px_24px_-17px_rgba(0,86,185,0.62)] ring-2 ring-[#0077FF]/15"
                          : "border-[#dce8ef] bg-white text-[#526173] hover:border-[#9ddcf8]",
                      )}
                    >
                      <span className="text-[12px] font-extrabold uppercase tracking-[0.035em]">{row.label}</span>
                      <span className="text-right text-[15px] font-extrabold tabular-nums">{formatPricingCurrency(selectedPlan?.maintenanceOptions.find((option) => option.id === row.id)?.price ?? 0)}<small className="ml-1 text-[8px] font-bold text-[#718096]">+ GST</small></span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-[linear-gradient(145deg,#f7fbff_0%,#e9f2ff_100%)] p-5 sm:p-7">
              <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#087cbc]">Step 3</p>
              <div className="mt-1.5 flex items-center justify-between gap-3">
                <h3 className="text-[19px] font-extrabold tracking-[-0.025em] text-[#111821]">See Final Total</h3>
                <span className="rounded-full bg-[linear-gradient(135deg,#09223E,#0077FF)] px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.08em] text-white">{selectedPlan?.name}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 rounded-[11px] border border-[#bcddeb] bg-white p-1 shadow-[0_8px_18px_-16px_rgba(0,90,140,0.5)]">
                {[false, true].map((value) => (
                  <button
                    key={String(value)}
                    type="button"
                    onClick={() => setIncludeGst(value)}
                    aria-pressed={includeGst === value}
                    className={cn(
                      "min-h-9 rounded-[8px] px-2 text-[10px] font-extrabold transition sm:text-[11px]",
                      includeGst === value ? "bg-[linear-gradient(135deg,#09223E,#0077FF)] text-white shadow-sm ring-1 ring-[#064083]" : "text-[#607286] hover:bg-[#f3f7fc]",
                    )}
                  >
                    {value ? "Including GST" : "Without GST"}
                  </button>
                ))}
              </div>
              <dl className="mt-4 space-y-2 text-[12px] font-semibold text-[#526173] sm:text-[13px]">
                <div className="flex items-center justify-between gap-4"><dt>OneLink first purchase</dt><dd className="font-bold tabular-nums text-[#263446]">{formatPricingCurrency(baseSubtotal)}</dd></div>
                <div className="flex items-center justify-between gap-4"><dt>Future renewal ({selectedCare?.label})</dt><dd className="font-bold tabular-nums text-[#263446]">{formatPricingCurrency(careAmount)}</dd></div>
                {discountAmount > 0 ? <div className="flex items-center justify-between gap-4 text-[#138808]"><dt>Discount applied</dt><dd className="font-extrabold tabular-nums">−{formatPricingCurrency(discountAmount)}</dd></div> : null}
                {includeGst ? <div className="flex items-center justify-between gap-4"><dt>GST (18%)</dt><dd className="font-bold tabular-nums text-[#263446]">{formatPricingCurrency(gst)}</dd></div> : null}
              </dl>
              <button type="button" onClick={() => setDiscountOpen((open) => !open)} className="mt-4 flex h-10 w-full items-center justify-between rounded-[11px] border border-[#c9dced] bg-white px-3 text-[11px] font-extrabold text-[#526173] shadow-sm"><span>Give discount</span><span className="text-[#087cbc]">{appliedDiscount ? `${appliedDiscount}% applied` : "Choose →"}</span></button>
              {discountOpen ? <div className="mt-2 rounded-[13px] border border-[#c9dced] bg-white p-2.5 shadow-[0_12px_28px_-24px_rgba(9,34,62,0.45)]">
                <div className="flex items-center justify-between gap-3 px-1 pb-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.09em] text-[#526173]">Add customer discount</p>
                </div>
                <div className="grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-2">
                  <label className="relative min-w-0">
                    <span className="sr-only">Choose discount</span>
                    <select
                      value={discountSelection}
                      onChange={(event) => {
                        setDiscountSelection(event.target.value);
                        setAppliedDiscount(0);
                      }}
                      className="h-10 w-full appearance-none rounded-[9px] border border-[#d6e3ed] bg-[#f7fbff] px-3 pr-8 text-[11px] font-extrabold text-[#334155] outline-none transition focus:border-[#0077FF] focus:ring-2 focus:ring-[#0077FF]/12"
                    >
                      <option value="10">10% Discount</option>
                      <option value="15">15% Discount</option>
                      <option value="20">20% Discount</option>
                      <option value="25">25% Discount</option>
                      <option value="custom">Custom Discount</option>
                    </select>
                    <svg className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#718096]" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m4 6 4 4 4-4" /></svg>
                  </label>
                  {discountSelection === "custom" ? <input aria-label="Custom discount percentage" type="number" min="0" max="100" value={customDiscount} onChange={(event) => { setCustomDiscount(event.target.value); setAppliedDiscount(0); }} className="h-10 w-full rounded-[9px] border border-[#c8e0f1] bg-[#edf7ff] px-3 text-[11px] font-extrabold text-[#087cbc] outline-none focus:border-[#0077FF]" placeholder="Custom %" /> : <div className="flex h-10 items-center rounded-[9px] border border-[#c8e0f1] bg-[#edf7ff] px-3 text-[11px] font-extrabold text-[#087cbc]">
                    {discountSelection}% will be applied
                  </div>}
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button type="button" onClick={applyDiscount} className="h-9 rounded-[9px] bg-[#09223E] px-3 text-[11px] font-extrabold text-white transition hover:bg-[#064083]">Apply Discount</button>
                  <button type="button" onClick={resetDiscount} disabled={discountAmount === 0} className="h-9 rounded-[9px] border border-[#cad9e5] bg-white px-3 text-[11px] font-extrabold text-[#526173] transition hover:border-[#e09b8b] hover:text-[#c44932] disabled:cursor-not-allowed disabled:opacity-45">Reset</button>
                </div>
              </div> : null}
              <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#bcdceb] pt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.07em] text-[#526173]">Total Payable</p>
                <p className="text-[26px] font-extrabold leading-none tracking-[-0.04em] text-[#064083] tabular-nums">{formatPricingCurrency(total)}</p>
              </div>
              <a href={getStartedHref} className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-[13px] bg-[linear-gradient(135deg,#09223E_0%,#064083_50%,#0077FF_100%)] px-4 text-[14px] font-extrabold text-white shadow-[0_16px_30px_-17px_rgba(0,58,135,0.72)] transition hover:-translate-y-0.5 hover:brightness-110">
                Get Started — {formatPricingCurrency(total)}
              </a>
            </div>
            </div>
          </div>
        </div>
      , document.body) : null}
    </div>
  );
}

function QuickBillPackageBuilder() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCare, setSelectedCare] = useState<"3-month" | "6-month" | "12-month">("6-month");
  const [includeGst, setIncludeGst] = useState(false);
  const [discountSelection, setDiscountSelection] = useState("0");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const setup = 1999;
  const care: Record<typeof selectedCare, number> = { "3-month": 999, "6-month": 1799, "12-month": 2999 };
  const packageSubtotal = setup + care[selectedCare];
  const discountAmount = Math.round(packageSubtotal * (appliedDiscount / 100));
  const totalBeforeGst = packageSubtotal - discountAmount;
  const gst = Math.round(totalBeforeGst * 0.18);
  const total = includeGst ? totalBeforeGst + gst : totalBeforeGst;
  const durations = [
    { id: "3-month" as const, label: "3 Months", note: "Easy start" },
    { id: "6-month" as const, label: "6 Months", note: "Most popular" },
    { id: "12-month" as const, label: "12 Months", note: "Best value" },
  ];

  return (
    <section className="mx-auto mt-3 max-w-6xl overflow-hidden rounded-[20px] border border-[#d4e4db] bg-white shadow-[0_12px_32px_-26px_rgba(24,65,48,.3)]">
      <button type="button" onClick={() => setIsOpen((open) => !open)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-[#f7fbff] sm:px-8">
        <span><span className="block text-[10px] font-extrabold uppercase tracking-[.15em] text-[#378a2e]">QuickBill</span><strong className="mt-1 block text-xl font-extrabold tracking-[-.03em] text-[#09223E] sm:text-2xl">Build Your QuickBill Package</strong><span className="mt-1 block text-xs font-semibold text-[#718096]">Choose a billing period and see your complete total instantly.</span></span>
        <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#b8dfa9] bg-[#f5fff2] text-xl font-bold text-[#378a2e] transition", isOpen && "rotate-45")}>+</span>
      </button>
      {isOpen ? <div className="border-t border-[#e1ebf4] bg-[linear-gradient(145deg,#fbfdff,#f1f8ff)] px-5 pb-6 pt-5 sm:px-8 sm:pb-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_290px] lg:items-start">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[.14em] text-[#087cbc]">Choose billing period</p>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
              {durations.map((duration) => {
                const selected = selectedCare === duration.id;
                return <button key={duration.id} type="button" onClick={() => setSelectedCare(duration.id)} aria-pressed={selected} className={cn("rounded-[14px] border bg-white px-3 py-3 text-left transition", selected ? "border-[#0077FF] bg-[#eef7ff] shadow-[0_12px_24px_-18px_rgba(0,86,185,.7)] ring-2 ring-[#0077FF]/15" : "border-[#d7e5ef] hover:border-[#9ddcf8]")}><span className="block text-[11px] font-extrabold uppercase tracking-[.06em] text-[#263b58]">{duration.label}</span><span className="mt-1 block text-xl font-extrabold tracking-[-.03em] text-[#123d9d]">{formatPricingCurrency(care[duration.id])}</span><span className="mt-1 block text-[10px] font-bold capitalize text-[#718096]">{duration.note}</span></button>;
              })}
            </div>
            <div className="mt-4 rounded-[14px] border border-[#d7e5ef] bg-white px-4 py-3 text-xs font-semibold text-[#526173]">One-time setup includes QuickBill activation, business configuration and onboarding.</div>
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-[14px] border border-[#d7e5ef] bg-white p-3"><span className="text-[11px] font-extrabold text-[#526173]">Give discount</span><select aria-label="QuickBill discount" value={discountSelection} onChange={(event) => { setDiscountSelection(event.target.value); setAppliedDiscount(0); }} className="h-9 rounded-[9px] border border-[#cfe0ef] bg-[#f7fbff] px-2 text-[11px] font-extrabold text-[#334155]"><option value="0">No discount</option><option value="10">10%</option><option value="15">15%</option><option value="20">20%</option><option value="25">25%</option></select><button type="button" onClick={() => setAppliedDiscount(Number(discountSelection))} className="h-9 rounded-[9px] bg-[#09223E] px-3 text-[11px] font-extrabold text-white">Apply</button><button type="button" onClick={() => { setDiscountSelection("0"); setAppliedDiscount(0); }} className="h-9 rounded-[9px] border border-[#cfe0ef] bg-white px-3 text-[11px] font-extrabold text-[#526173]">Reset</button></div>
          </div>
          <div className="rounded-[17px] border border-[#bdd6ee] bg-white p-4 shadow-[0_14px_30px_-24px_rgba(9,34,62,.45)]">
            <div className="grid grid-cols-2 rounded-[10px] border border-[#cfe0ef] bg-[#f7fbff] p-1">
              {[false, true].map((value) => <button key={String(value)} type="button" onClick={() => setIncludeGst(value)} aria-pressed={includeGst === value} className={cn("min-h-9 rounded-[8px] px-2 text-[10px] font-extrabold", includeGst === value ? "bg-[#09223E] text-white" : "text-[#607084]")}>{value ? "With GST" : "Without GST"}</button>)}
            </div>
            <dl className="mt-4 space-y-2 text-xs font-semibold text-[#526173]"><div className="flex justify-between gap-3"><dt>One-time setup</dt><dd className="font-extrabold text-[#263446]">{formatPricingCurrency(setup)}</dd></div><div className="flex justify-between gap-3"><dt>{durations.find((item) => item.id === selectedCare)?.label} plan</dt><dd className="font-extrabold text-[#263446]">{formatPricingCurrency(care[selectedCare])}</dd></div>{discountAmount > 0 ? <div className="flex justify-between gap-3 text-[#378a2e]"><dt>Discount ({appliedDiscount}%)</dt><dd className="font-extrabold">−{formatPricingCurrency(discountAmount)}</dd></div> : null}{includeGst ? <div className="flex justify-between gap-3"><dt>GST (18%)</dt><dd className="font-extrabold text-[#263446]">{formatPricingCurrency(gst)}</dd></div> : null}</dl>
            <div className="mt-4 border-t border-[#dce8f1] pt-3"><p className="text-[10px] font-extrabold uppercase tracking-[.1em] text-[#087cbc]">Total payable</p><p className="mt-1 text-3xl font-extrabold tracking-[-.05em] text-[#064083]">{formatPricingCurrency(total)} <span className="text-[10px]">{includeGst ? "incl. GST" : "+ GST"}</span></p></div>
          </div>
        </div>
      </div> : null}
    </section>
  );
}

function PricingTermsNotice({ className }: { className?: string }) {
  return (
    <div className={cn("mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 rounded-[18px] border border-[#00A9FF]/14 bg-white/82 px-5 py-4 text-center shadow-[0_16px_36px_-30px_rgba(15,23,42,0.32)] sm:flex-row sm:text-left", className)}>
      <p className="text-[13px] font-semibold leading-6 text-[#526173] sm:text-[14px]">
        Setup is charged once. Platform Care renews based on your selected plan. GST Extra.{" "}
        <Link href="/terms" className="font-bold text-[#087cbc] underline decoration-[#00A9FF]/45 underline-offset-4 hover:text-[#005f91]">
          Terms &amp; Conditions apply.
        </Link>
      </p>
      <Link href="/terms" className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-[11px] border border-[#00A9FF]/24 bg-[#edf8ff] px-4 text-[13px] font-bold text-[#087cbc] transition hover:-translate-y-0.5 hover:border-[#00A9FF]/45 hover:bg-white">
        View Terms &amp; Conditions
      </Link>
    </div>
  );
}

function EnterprisePanel({ href, plan, detailed = false }: { href: string; plan: Plan; detailed?: boolean }) {
  const [activeMockup, setActiveMockup] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveMockup((current) => (current + 1) % premiumMockups.length);
    }, 3200);
    return () => window.clearInterval(timer);
  }, []);

  const mockup = premiumMockups[activeMockup];

  return (
    <div className="border-shine border-shine-blue relative mx-auto mt-10 w-full max-w-[calc(100vw-40px)] overflow-hidden rounded-[22px] border border-[#38bdf8]/45 bg-[linear-gradient(135deg,#020b14_0%,#041d34_34%,#075a91_72%,#00A9FF_100%)] p-4 text-white shadow-[0_34px_82px_-44px_rgba(0,72,145,0.72)] sm:max-w-7xl sm:p-6 lg:mt-12 lg:p-6">
      <div className="pointer-events-none absolute -right-14 -top-20 h-72 w-72 rounded-full bg-[#00A9FF]/24 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 left-1/3 h-56 w-72 rounded-full bg-[#0077FF]/14 blur-3xl" />
      <Image src="/onelink-primary-logo.png" alt="" width={10895} height={2720} className="pointer-events-none absolute -bottom-10 -right-24 w-[48%] rotate-[-7deg] opacity-[0.022] brightness-0 invert" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,#6bcfff,transparent)] opacity-55" />
      <div className="relative grid gap-5 lg:grid-cols-[200px_minmax(0,1fr)_280px] lg:items-center lg:gap-7">
        <div className="lg:order-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#ead7a4]/45 bg-[#d8b86a]/12 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.11em] text-[#f4dfad]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e4c77f] shadow-[0_0_10px_rgba(228,199,127,0.72)]" />
            Premium Custom Build
          </span>
          <div className="mt-3 flex items-center gap-3">
            <PricingBrandMark
              tone="essential"
              className="h-11 w-11 rounded-[13px] border-white/20 [&_img]:w-6"
            />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9bddff]">OneLink Premium</p>
              <h3 className="font-display mt-1 text-[1.55rem] font-bold leading-[1.12] tracking-[-0.04em] text-white sm:text-[1.85rem]">Built for brands that need more.</h3>
            </div>
          </div>
          <p className="mt-2.5 max-w-2xl text-[13px] font-medium leading-[1.55] text-white/72 sm:text-[14px]">
            {detailed ? "An in-depth custom OneLink system for multi-branch businesses, franchise networks and teams that need bulk OneLinks, shared control and tailored operational workflows." : "For established businesses, agencies and multi-location brands needing premium design, advanced functionality and custom setup."}
          </p>
          <div className="mt-4 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
            {(detailed ? enterpriseHighlights : enterpriseHighlights.slice(0, 4)).map((highlight) => (
              <span key={highlight} className="inline-flex items-center gap-2 text-[11px] font-semibold text-white/78">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#55c5ff]/14 text-[#8bdcff]"><Icon name="check" className="h-3 w-3" /></span>
                {highlight}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto flex h-[225px] w-full max-w-[200px] items-end justify-center self-end lg:order-1 lg:h-[260px]">
          <div className="pointer-events-none absolute bottom-1 h-24 w-44 rounded-full bg-[#00A9FF]/22 blur-3xl" />
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mockup.alt}
              initial={{ opacity: 0, x: 24, scale: 0.94, rotate: 4 }}
              animate={{ opacity: 1, x: 0, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, x: -24, scale: 0.94, rotate: -4 }}
              transition={{ duration: 0.62, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 flex items-end justify-center"
            >
              <Image src={mockup.src} alt={mockup.alt} quality={92} sizes="200px" className="h-full w-auto object-contain object-bottom drop-shadow-[0_24px_30px_rgba(0,0,0,0.42)]" />
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-1 z-20 flex items-center gap-1.5 rounded-full border border-white/16 bg-[#020b14]/55 px-2.5 py-1.5 backdrop-blur">
            {premiumMockups.map((item, index) => <span key={item.alt} className={index === activeMockup ? "h-1.5 w-4 rounded-full bg-[#00A9FF]" : "h-1.5 w-1.5 rounded-full bg-white/45"} />)}
          </div>
        </div>

        <div className="rounded-[18px] border border-white/70 bg-white p-4 text-[#111821] shadow-[0_22px_48px_-28px_rgba(0,0,0,0.55)] sm:p-5 lg:order-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#087cbc]">Premium OneLink</p>
          <p className="mt-2.5 text-[11px] font-bold uppercase tracking-[0.09em] text-[#718096]">Starting from</p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <p className="font-display text-[2rem] font-bold leading-none tracking-[-0.04em] text-[#111821] tabular-nums sm:text-[2.2rem]">
              {formatCurrency(plan.setupAmount)}
            </p>
            <span className="rounded-full bg-[#edf8ff] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.06em] text-[#087cbc]">+ GST</span>
          </div>
          <p className="mt-3 text-[12px] font-medium leading-relaxed text-[#64748b]">Custom-built around your business requirements.</p>
          <a href={href} className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-[12px] bg-[linear-gradient(135deg,#00A9FF,#0077FF)] px-4 text-[14px] font-bold text-white shadow-[0_14px_28px_-15px_rgba(0,126,191,0.58)] transition hover:-translate-y-0.5 hover:brightness-110">
            Discuss Now
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 8h9" /><path d="M8.5 3l4.5 5-4.5 5" /></svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function getPlanTone(plan: Plan) {
  if (plan.id === "signature") {
    return {
      markTone: "signature" as const,
      wash: "bg-[linear-gradient(180deg,rgba(0,169,255,0.11),rgba(255,255,255,0))]",
      badge: "border-[#bae6fd] bg-[#eff9ff] text-[#0369A1]",
      label: "text-[#9b6d14]",
      gstPill: "border-[#ead8b0] bg-[#fff8ea] text-[#9b6d14]",
      selectorWrap: "border-[#eee1c2] bg-[linear-gradient(180deg,#fffaf2_0%,#fbf4e7_100%)]",
      selectorActive: "border-white/70 bg-white shadow-[0_8px_24px_-10px_rgba(3,61,96,0.42)] ring-2 ring-white/25",
      saveBadge: "border-emerald-200/90 bg-emerald-50 text-emerald-800",
      value: "text-[#087cbc]",
      icon: "bg-[#e7f6ff] text-[#087cbc]",
      featureWrap: "border-white/40 bg-white/[0.97] shadow-[0_18px_42px_-32px_rgba(3,61,96,0.5)]",
      button: "border border-white/25 bg-[#00A9FF] text-white hover:bg-[#008fd9] shadow-[0_16px_34px_-14px_rgba(0,105,180,0.58)]",
    };
  }

  if (plan.id === "elite") {
    return {
      markTone: "essential" as const,
      wash: "bg-[linear-gradient(180deg,rgba(0,169,255,0.05),rgba(255,255,255,0))]",
      badge: "border-[#dbeafe] bg-[#f7fbff] text-[#0369A1]",
      label: "text-[#0369A1]",
      gstPill: "border-[#dbeafe] bg-[#f7fbff] text-[#0369A1]",
      selectorWrap: "border-[#E3EDF6] bg-[linear-gradient(180deg,#f7fafc_0%,#f4f8fb_100%)]",
      selectorActive: "border-transparent bg-white [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(135deg,#00A9FF,#087cbc)_border-box] shadow-[0_8px_22px_-10px_rgba(0,169,255,0.5)] ring-2 ring-[#00A9FF]/20",
      saveBadge: "border-emerald-200/90 bg-emerald-50 text-emerald-800",
      value: "text-[#0369A1]",
      icon: "bg-[#00A9FF]/10 text-[#00A9FF]",
      featureWrap: "border-[#eff4f8] bg-[linear-gradient(180deg,#fcfeff_0%,#f8fbfe_100%)]",
      button: "bg-[#00A9FF] text-white hover:bg-[#008fd9] shadow-[0_12px_26px_-16px_rgba(0,169,255,0.62)]",
    };
  }

  return {
    markTone: "business" as const,
    wash: "bg-[linear-gradient(180deg,rgba(136,151,168,0.14),rgba(255,255,255,0))]",
    badge: "border-[#e5edf4] bg-slate-50 text-[#475569]",
    label: "text-[#5c6774]",
    gstPill: "border-[#d7e0e8] bg-[#f6f8fb] text-[#5c6774]",
    selectorWrap: "border-[#dde5eb] bg-[linear-gradient(180deg,#fafbfd_0%,#f2f5f8_100%)]",
    selectorActive: "border-transparent bg-white [background:linear-gradient(#fff,#fff)_padding-box,linear-gradient(135deg,#00A9FF,#087cbc)_border-box] shadow-[0_8px_22px_-10px_rgba(0,169,255,0.5)] ring-2 ring-[#00A9FF]/20",
    saveBadge: "border-emerald-200/90 bg-emerald-50 text-emerald-800",
    value: "text-[#087cbc]",
    icon: "bg-[#eef2f5] text-[#5c6774]",
    featureWrap: "border-[#e8edf2] bg-[linear-gradient(180deg,#fcfdff_0%,#f6f8fa_100%)]",
    button: "bg-[#00A9FF] text-white hover:bg-[#008fd9] shadow-[0_12px_26px_-16px_rgba(0,169,255,0.62)]",
  };
}
