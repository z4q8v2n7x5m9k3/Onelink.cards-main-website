"use client";

import { getPlanById, siteConfig } from "@/content/site";
import { cn } from "@/lib/utils";

type BuyButtonProps = {
  planId: string;
  maintenanceId?: string;
  label: string;
  className?: string;
  variant?: "primary" | "secondary" | "white";
  withArrow?: boolean;
  isDiwali?: boolean;
};

export function BuyButton({
  planId,
  maintenanceId,
  label,
  className,
  variant = "primary",
  withArrow = false,
  isDiwali = false,
}: BuyButtonProps) {
  function handleBookingStart() {
    const plan = getPlanById(planId);
    const resolvedPlanId = plan?.id ?? "signature";
    const resolvedPlan = getPlanById(resolvedPlanId);
    const duration = resolvedPlan?.maintenanceOptions.find((option) => option.id === maintenanceId)
      ?? resolvedPlan?.maintenanceOptions[1];
    const setupFee = isDiwali && resolvedPlan?.diwaliSetupAmount
      ? resolvedPlan.diwaliSetupAmount
      : resolvedPlan?.setupAmount ?? 0;
    const careFee = duration?.price ?? 0;
    const totalBeforeGst = setupFee + careFee;
    const gstAmount = Math.round(totalBeforeGst * 0.18);
    const totalWithGst = totalBeforeGst + gstAmount;
    const savings = isDiwali && resolvedPlan?.diwaliSavings
      ? ` (Diwali Special — Save ₹${resolvedPlan.diwaliSavings.toLocaleString("en-IN")})`
      : "";
    const message = [
      "Hello OneLink, I want to buy a plan.",
      `Plan: ${resolvedPlan?.name ?? resolvedPlanId}${isDiwali ? " (Diwali Special Offer)" : ""}`,
      duration ? `Platform Care: ${duration.label} (₹${careFee.toLocaleString("en-IN")} + GST)` : null,
      resolvedPlan ? `One-Time Development: ₹${setupFee.toLocaleString("en-IN")} + GST${savings}` : null,
      `Total Package: ₹${totalBeforeGst.toLocaleString("en-IN")} + 18% GST (₹${totalWithGst.toLocaleString("en-IN")} incl. GST)`,
      isDiwali ? "Bonus: Complimentary Custom QR Counter-Card Design Included (Digital Artwork)" : null,
    ]
      .filter(Boolean)
      .join("\n");

    window.location.href = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  const variantStyle =
    variant === "white"
      ? "border border-transparent bg-white text-[#09223E] hover:bg-slate-50 shadow-md"
      : variant === "primary"
        ? "border border-transparent bg-[#00a9ff] text-white shadow-[0_18px_34px_-18px_rgba(0,169,255,0.46)] hover:scale-[1.015] hover:bg-[#087cbc] hover:shadow-[0_24px_42px_-20px_rgba(0,169,255,0.48)]"
        : "border border-black/8 bg-white text-[var(--foreground)] shadow-[0_18px_34px_-24px_rgba(15,23,42,0.24)] hover:scale-[1.015] hover:bg-neutral-50 hover:shadow-[0_22px_40px_-24px_rgba(15,23,42,0.28)]";

  return (
    <button
      type="button"
      onClick={handleBookingStart}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-[18px] px-5 py-3 text-sm font-semibold tracking-[-0.01em] transition-all duration-300",
        variantStyle,
        className,
      )}
    >
      <span className="font-inherit text-inherit">{label}</span>
      {withArrow ? (
        <svg
          className="h-4 w-4"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M3.5 8h9" />
          <path d="M8.5 3l4.5 5-4.5 5" />
        </svg>
      ) : null}
    </button>
  );
}
