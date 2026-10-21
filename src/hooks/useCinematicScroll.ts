import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const scrub = { scrub: true, invalidateOnRefresh: true } as const;

/** All scene movement follows scroll progress. MatchMedia removes pinning on touch layouts. */
export function useCinematicScroll(root: RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const media = gsap.matchMedia();
    media.add(
      {
        desktop: "(min-width: 901px) and (min-height: 700px)",
        compact: "(max-width: 900px), (max-height: 699px)",
      },
      (conditions) => {
        const scene = gsap.context(() => {
          if (conditions.conditions?.desktop) {
            const header = document.querySelector<HTMLElement>(".site-header");
            const heroElement = document.querySelector<HTMLElement>(".hero");
            const heroInner = document.querySelector<HTMLElement>(".hero-inner");
            const heroVisual = document.querySelector<HTMLElement>(".hero-visual");
            const hero = gsap.timeline({
              scrollTrigger: {
                trigger: ".hero",
                start: () => `top top+=${header?.offsetHeight ?? 0}`,
                end: () => `+=${Math.min(window.innerHeight * 1.55, 1400)}`,
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                ...scrub,
              },
            });

            hero
              .to(
                ".hero-visual",
                {
                  scale: () => heroElement && heroVisual
                    ? (heroElement.offsetWidth / heroVisual.offsetWidth) * 1.04
                    : 2,
                  x: () => heroElement && heroInner && heroVisual
                    ? heroElement.offsetWidth / 2 - (heroInner.offsetLeft + heroVisual.offsetLeft + heroVisual.offsetWidth / 2)
                    : 0,
                  y: () => heroElement && heroInner && heroVisual
                    ? heroElement.offsetHeight / 2 - (heroInner.offsetTop + heroVisual.offsetTop + heroVisual.offsetHeight / 2)
                    : 0,
                  borderRadius: "0px",
                  duration: 1.8,
                  ease: "none",
                },
                0,
              )
              .to(
                ".hero-photo",
                {
                  scale: 1.45,
                  xPercent: -7,
                  yPercent: 4,
                  duration: 1.8,
                  ease: "none",
                },
                0,
              )
              .to(
                ".hero-immersive-shade",
                { opacity: 1, duration: 0.75, ease: "none" },
                0.15,
              )
              .to(
                ".hero-badge",
                { yPercent: -35, rotation: -7, scale: 0.53, duration: 1.8, ease: "none" },
                0,
              )
              .to(
                ".hero-photo-caption",
                { yPercent: -30, scale: 0.53, transformOrigin: "left bottom", duration: 1.8, ease: "none" },
                0,
              )
              .to(
                ".hero-word",
                { yPercent: -23, stagger: 0.07, duration: 0.9, ease: "none" },
                0.25,
              )
              .to(
                ".hero-copy > p",
                { y: -24, duration: 1, ease: "none" },
                0.3,
              )
              .fromTo(
                ".hero-next-photo",
                { autoAlpha: 0, scale: 1.2, clipPath: "circle(0% at 72% 50%)" },
                { autoAlpha: 1, scale: 1, clipPath: "circle(125% at 72% 50%)", duration: 1.2, ease: "none" },
                1.45,
              )
              .to(
                ".hero-bottom",
                { autoAlpha: 0, y: -24, duration: 0.75, ease: "none" },
                0.5,
              );
          } else {
            // Keep touch scrolling natural while retaining reversible image movement.
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: ".hero-visual",
                  start: () => window.innerWidth <= 700 ? "top 55%" : "top top",
                  end: "bottom top",
                  ...scrub,
                },
              })
              .to(
                ".hero-photo",
                { scale: 1.42, yPercent: 9, duration: 1, ease: "none" },
                0,
              )
              .to(
                ".hero-visual",
                { scale: 1.09, borderRadius: "48px 48px 0px 0px", duration: 1, ease: "none" },
                0,
              )
              .to(
                ".hero-badge",
                { yPercent: -22, rotation: -5, duration: 1, ease: "none" },
                0,
              )
              .to(
                ".hero-photo-caption",
                { yPercent: -18, duration: 1, ease: "none" },
                0,
              )
              .fromTo(
                ".hero-next-photo",
                { autoAlpha: 0, scale: 1.18, clipPath: "circle(0% at 70% 55%)" },
                { autoAlpha: 1, scale: 1, clipPath: "circle(125% at 70% 55%)", duration: 0.4, ease: "none" },
                0.26,
              );
          }

          // The same image flows from the hero into the first featured card.
          gsap.utils
            .toArray<HTMLElement>(".featured-grid .product-card")
            .forEach((card) => {
              const image = card.querySelector<HTMLElement>(".product-image");
              if (!image) return;
              gsap.fromTo(
                image,
                { scale: 1.14, yPercent: 5 },
                {
                  scale: 1,
                  yPercent: -5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    ...scrub,
                  },
                },
              );
            });

          gsap
            .timeline({
              scrollTrigger: {
                trigger: ".story",
                start: "top 95%",
                end: "bottom 25%",
                ...scrub,
              },
            })
            .fromTo(
              ".story-image",
              { clipPath: "inset(14% 10% 14% 10% round 28px)" },
              {
                clipPath: "inset(0% 0% 0% 0% round 0px)",
                duration: 1,
                ease: "none",
              },
              0,
            )
            .fromTo(
              ".story-photo",
              { scale: 1.2, yPercent: 8 },
              { scale: 1, yPercent: -8, duration: 1, ease: "none" },
              0,
            );

          gsap.fromTo(
            ".story-title-mask h2",
            { yPercent: 92 },
            {
              yPercent: 0,
              ease: "none",
              scrollTrigger: {
                trigger: ".story-copy",
                start: "top 90%",
                end: "top 65%",
                ...scrub,
              },
            },
          );

          gsap.fromTo(
            ".story-image-label",
            { yPercent: 60, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".story-image",
                start: "top 90%",
                end: "top 60%",
                ...scrub,
              },
            },
          );

          gsap.utils
            .toArray<HTMLElement>(".section-heading")
            .forEach((heading) => {
              const title = heading.querySelector<HTMLElement>(".title-mask h2");
              if (!title) return;
              gsap.fromTo(
                title,
                { yPercent: 75 },
                {
                  yPercent: 0,
                  ease: "none",
                  scrollTrigger: {
                    trigger: heading,
                    start: "top 90%",
                    end: "top 61%",
                    ...scrub,
                  },
                },
              );
            });

          gsap.utils.toArray<HTMLElement>(".step.reveal").forEach((step) => {
            gsap.fromTo(
              step,
              { y: 28, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: step,
                  start: "top 95%",
                  end: "top 72%",
                  ...scrub,
                },
              },
            );
          });

          gsap.fromTo(
            ".marquee > div",
            { xPercent: 0 },
            {
              xPercent: -25,
              ease: "none",
              scrollTrigger: {
                trigger: ".marquee",
                start: "top bottom",
                end: "bottom top",
                ...scrub,
              },
            },
          );
        }, root);
        return () => scene.revert();
      },
    );

    let active = true;
    document.fonts?.ready.then(() => {
      if (active) ScrollTrigger.refresh();
    });
    return () => {
      active = false;
      media.revert();
    };
  }, [root]);
}
