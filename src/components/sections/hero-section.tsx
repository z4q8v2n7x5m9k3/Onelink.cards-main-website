/* eslint-disable @next/next/no-img-element */
import { HeroMockupShowcase } from "@/components/hero-mockup-showcase";
import { HeroEntrance } from "@/components/ui/reveal";
import { ActionLink } from "@/components/ui/action-link";
import { siteConfig } from "@/content/site";
import { Icon } from "@/components/icons";
import styles from "./hero-section.module.css";
import Image from "next/image";
import { portfolioItems } from "@/content/portfolio";
import LineWaves from "@/components/LineWaves";
import BorderGlow from "@/components/ui/BorderGlow";

const heroIntegrations = [
  { label: "Google Reviews", image: "/integration-logos/google-reviews.png", imageClass: "h-7 w-auto max-w-[78px]" },
  { label: "Google Maps", image: "/integration-logos/google-maps.png", imageClass: "h-7 w-7" },
  { label: "Razorpay", image: "/payment-logos/razorpay.svg", imageClass: "h-[19px] w-auto max-w-[78px]" },
  { label: "UPI", image: "/payment-logos/upi.svg", imageClass: "h-[23px] w-auto max-w-[54px]" },
  { label: "Instagram", image: "/integration-logos/instagram.png", imageClass: "h-[26px] w-[26px] shrink-0" },
] as const;

const mobileHeroIntegrations = [
  heroIntegrations[0],
  heroIntegrations[1],
  heroIntegrations[4],
  heroIntegrations[3],
] as const;

const trustedBusinesses = [
  { name: "Burger Bazaar", id: "burger-bazaar" },
  { name: "Vastukar Architects", id: "vastukar" },
  { name: "New Vision Diagnostics", id: "new-vision" },
].flatMap((business) => {
  const portfolio = portfolioItems.find((item) => item.id === business.id);
  return portfolio ? [{ ...business, image: portfolio.image }] : [];
});

export function HeroSection() {
  const whatsappHref = `https://wa.me/${siteConfig.contact.whatsappNumber}?text=${encodeURIComponent("Hello OneLink, I want to discuss OneLink for my business.")}`;

  return (
    <section id="home" className="section-shell relative isolate overflow-x-clip overflow-y-visible bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_68%,#edf6ff_100%)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 -bottom-20 -z-20 overflow-hidden opacity-48 [mask-image:linear-gradient(to_bottom,black_0%,black_70%,rgba(0,0,0,0.5)_88%,transparent_100%)] sm:-bottom-24 sm:opacity-90" aria-hidden="true">
        <LineWaves
          speed={0.26}
          innerLineCount={20}
          outerLineCount={24}
          warpIntensity={0.78}
          rotation={-45}
          edgeFadeWidth={0.12}
          colorCycleSpeed={0.8}
          brightness={0.17}
          color1="#00A9FF"
          color2="#55C6FF"
          color3="#DDF5FF"
          enableMouseInteraction
          mouseInfluence={2}
          lightMode
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(0,119,255,0.14),transparent_36%),radial-gradient(circle_at_18%_72%,rgba(112,211,255,0.08),transparent_38%)]" />
        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.74)_32%,rgba(255,255,255,0.2)_50%,transparent_65%)] sm:block" />
      </div>
      <div className={`${styles.heroGrid} relative z-20 mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)] gap-0 px-4 pb-8 pt-[5.85rem] sm:gap-7 sm:px-6 sm:pb-12 sm:pt-36 md:gap-6 md:pb-12 md:pt-28 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8 lg:pb-20 lg:pt-[160px]`}>
        <div className="contents min-w-0 text-left sm:flex sm:flex-col sm:items-start sm:justify-center">
          <HeroEntrance delay={0.03} x={-18} y={8} className="relative z-30 order-1 sm:order-none">
            <div className="mt-2 flex items-center gap-3 sm:mt-4">
              <div className="flex -space-x-2" aria-label="Featured OneLink businesses">
                {trustedBusinesses.map((business) => (
                  <span
                    key={business.name}
                    title={business.name}
                    className="relative block h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-[#eaf6ff] shadow-[0_8px_20px_-10px_rgba(15,23,42,0.5)] sm:h-10 sm:w-10"
                  >
                    <Image src={business.image} alt="" fill sizes="40px" className="object-cover object-top" aria-hidden="true" />
                  </span>
                ))}
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-extrabold tracking-[-0.01em] text-[#172235] sm:text-[12px]">Trusted by 24+ businesses</p>
                <p className="mt-1 text-[10px] font-bold tracking-[0.08em] text-[#f59e0b]" aria-label="Rated five out of five">★★★★★ <span className="tracking-normal text-[#536174]">5.0</span></p>
              </div>
            </div>
          </HeroEntrance>
          <HeroEntrance delay={0.12} x={-24} y={10} className="order-2 sm:order-none">
            <h1 className="font-display relative isolate mt-4 max-w-none text-[clamp(35px,10.25vw,40px)] font-[720] leading-[1.08] tracking-[-0.055em] before:pointer-events-none before:absolute before:-inset-x-5 before:-inset-y-6 before:-z-10 before:rounded-[38px] before:bg-white/82 before:blur-2xl before:content-[''] sm:mt-7 sm:text-[50px] sm:before:hidden md:text-[48px] lg:text-[52px] xl:text-[60px]">
              <span className="block whitespace-nowrap text-[#111827] lg:hidden">Stop sharing links.</span>
              <span className="hidden whitespace-nowrap text-[#111827] lg:block">Stop sharing links.</span>
              <span className="mt-1 block whitespace-nowrap text-[#00A9FF]">Share OneLink.</span>
            </h1>
          </HeroEntrance>
          <HeroEntrance delay={0.2} x={-22} y={10} className="order-4 sm:order-none">
            <p className="mt-3 max-w-[52ch] text-pretty text-[15px] font-medium leading-[1.72] text-[#475970] sm:mt-6 sm:text-[16px] sm:leading-[1.7] sm:text-[#27364a]">
              Bring your services, products, bookings, payments and reviews together in one seamless place. Make it easier for customers to connect and easier for you to manage.
            </p>
          </HeroEntrance>
          <HeroEntrance delay={0.29} x={-20} y={10} className="order-5 min-w-0 w-full sm:order-none">
          <div className="mt-5 grid w-full grid-cols-2 gap-2.5 sm:hidden">
            <BorderGlow backgroundColor="#008cf5" borderRadius={15} colors={["#ffffff", "#7de3ff", "#00a9ff"]}>
              <ActionLink href={whatsappHref} variant="blue" withArrow className="h-12 min-w-0 !rounded-[15px] bg-[linear-gradient(135deg,#00A9FF_0%,#0077FF_100%)] px-3 text-[13px] font-bold shadow-[0_16px_30px_-18px_rgba(0,135,225,0.7)] [&_svg]:h-4 [&_svg]:w-4">
                Get Your OneLink
              </ActionLink>
            </BorderGlow>
            <BorderGlow glowColor="145 72 52" backgroundColor="#25D366" borderRadius={15} colors={["#ffffff", "#8fffb9", "#25D366"]}>
              <ActionLink href={whatsappHref} variant="whatsapp" className="h-12 min-w-0 !rounded-[15px] px-3 text-[13px] font-bold shadow-[0_16px_30px_-20px_rgba(37,211,102,0.45)]">
                <Icon name="whatsapp" className="h-5 w-5" />
                WhatsApp
              </ActionLink>
            </BorderGlow>
            <BorderGlow className="col-span-2" backgroundColor="#ffffff" borderRadius={15} colors={["#7de3ff", "#00a9ff", "#1476ff"]}>
              <ActionLink href={whatsappHref} variant="secondary" withArrow className="h-12 min-w-0 !rounded-[15px] border-2 border-[#00A9FF] !bg-white px-3 text-[14px] font-extrabold !text-[#0077b9] shadow-[0_14px_30px_-22px_rgba(0,169,255,0.52)] hover:border-[#008fd9] hover:!bg-[#f2fbff] [&_svg]:h-4 [&_svg]:w-4">
                See OneLink in Action
              </ActionLink>
            </BorderGlow>
            <div className="col-span-2 mt-3 w-full border-t border-[#d8e2ea] pt-5">
              <p className="text-left text-[12px] font-extrabold leading-5 text-[#435267]">
                Connect with the tools your customers already use.
              </p>
              <div className="mt-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex min-w-max items-center justify-start gap-5 pr-4">
                  <div className="flex h-9 items-center justify-center">
                    <Icon name="whatsapp" className="h-8 w-8 text-[#25D366]" />
                    <span className="sr-only">WhatsApp</span>
                  </div>
                  {mobileHeroIntegrations.map((item) => item.label === "Instagram" ? (
                    <a key={item.label} href={siteConfig.social.instagram} target="_blank" rel="noreferrer" aria-label="Follow OneLink on Instagram" className="flex h-9 items-center justify-center">
                      <img src={item.image} alt="" className="h-7 w-7 object-contain" />
                    </a>
                  ) : (
                    <div key={item.label} className="flex h-9 items-center justify-center">
                      <img src={item.image} alt={item.label} className={`${item.imageClass} object-contain`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-7 hidden w-full max-w-[470px] flex-row flex-nowrap items-stretch gap-3 sm:flex">
            <BorderGlow className="min-w-0 flex-[1.15]" backgroundColor="#008cf5" borderRadius={15} colors={["#ffffff", "#7de3ff", "#00a9ff"]}>
              <ActionLink
                href={whatsappHref}
                variant="primary"
                withArrow
                className="h-12 min-w-0 !rounded-[15px] bg-[linear-gradient(135deg,#00A9FF_0%,#0077FF_100%)] px-4 text-[13px] font-bold shadow-[0_16px_30px_-16px_rgba(0,135,225,0.62)] hover:brightness-110 [&_svg]:h-4 [&_svg]:w-4"
              >
                See OneLink in Action
              </ActionLink>
            </BorderGlow>
            <BorderGlow className="min-w-0 flex-1" backgroundColor="#ffffff" borderRadius={15} colors={["#7de3ff", "#00a9ff", "#1476ff"]}>
            <ActionLink
              href={whatsappHref}
              variant="secondary"
              withArrow
              className="h-12 min-w-0 !rounded-[15px] border-2 border-[#168fd4] !bg-white/92 px-4 text-[13px] font-extrabold !text-[#064083] shadow-[0_16px_34px_-20px_rgba(0,70,140,0.48)] backdrop-blur-md hover:border-[#087bc1] hover:!bg-white [&_svg]:h-4 [&_svg]:w-4"
            >
              Get OneLink
            </ActionLink>
            </BorderGlow>
          </div>
          </HeroEntrance>
          <HeroEntrance delay={0.38} x={-16} y={8} className="order-6 hidden sm:order-none sm:block">
          <div className="mt-5 w-full max-w-xl pt-2">
            <p className="text-left text-[11px] font-bold leading-5 text-[#435267] sm:text-[12px]">
              Connect with the tools your customers already use.
            </p>
            <div className="mt-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex min-w-max items-center justify-start gap-3 pr-2 sm:gap-5">
                <div className="group flex h-9 items-center justify-start">
                  <Icon
                    name="whatsapp"
                    className="h-7 w-7 text-[#25D366] transition-transform duration-300 ease-out group-hover:scale-105"
                  />
                  <span className="sr-only">WhatsApp</span>
                </div>
                {heroIntegrations.map((item) => item.label === "Instagram" ? (
                  <a key={item.label} href={siteConfig.social.instagram} target="_blank" rel="noreferrer" className="group flex h-9 items-center justify-start gap-1.5 rounded-full pr-2 text-[11px] font-extrabold text-[#c72570]">
                    <img src={item.image} alt="" className={`${item.imageClass} object-contain transition-transform duration-300 ease-out group-hover:scale-105`} />
                    Follow us
                  </a>
                ) : (
                  <div key={item.label} className="group flex h-9 items-center justify-start">
                    <img src={item.image} alt={item.label} className={`${item.imageClass} object-contain transition-transform duration-300 ease-out group-hover:scale-105`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          </HeroEntrance>
        </div>
        <HeroEntrance delay={0.14} x={28} y={16} className={`${styles.heroVisual} order-3 relative z-40 mt-2 min-w-0 overflow-visible pb-0 pt-0 sm:order-none sm:mt-0 sm:pb-0 sm:pt-0 md:mx-auto md:w-[80%] lg:mx-0 lg:w-auto lg:translate-x-6 lg:pt-1 xl:translate-x-8`}>
          <div className="absolute -z-10 left-0 top-8 h-[220px] w-[220px] rounded-full bg-[var(--accent-glow)] blur-[78px] pointer-events-none sm:-left-6 sm:top-6 sm:h-[320px] sm:w-[320px] sm:blur-[90px]" />
          <div className="absolute -z-10 right-0 bottom-8 h-[190px] w-[190px] rounded-full bg-[rgba(11,126,200,0.1)] blur-[60px] pointer-events-none sm:-right-6 sm:bottom-6 sm:h-[250px] sm:w-[250px] sm:blur-[70px]" />
          <div className="relative">
            <HeroMockupShowcase />
          </div>
        </HeroEntrance>
      </div>
    </section>
  );
}
