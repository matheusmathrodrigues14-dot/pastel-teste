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
            const hero = gsap.timeline({
              scrollTrigger: {
                trigger: ".hero",
                start: () => `top top+=${header?.offsetHeight ?? 0}`,
                end: () => `+=${Math.min(window.innerHeight * 0.85, 800)}`,
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
                  scale: 1.13,
                  xPercent: -6,
                  yPercent: -2,
                  borderRadius: "90px 90px 0px 0px",
                  duration: 1,
                  ease: "none",
                },
                0,
              )
              .to(
                ".hero-photo",
                {
                  scale: 1.3,
                  xPercent: -5,
                  yPercent: 3,
                  duration: 1,
                  ease: "none",
                },
                0,
              )
              .to(
                ".hero-badge",
                { yPercent: -32, rotation: -6, duration: 1, ease: "none" },
                0,
              )
              .to(
                ".hero-photo-caption",
                { yPercent: -24, duration: 1, ease: "none" },
                0,
              )
              .to(
                ".hero-word",
                { yPercent: -14, stagger: 0.035, duration: 0.65, ease: "none" },
                0.2,
              )
              .fromTo(
                ".hero-next-photo",
                { autoAlpha: 0, scale: 1.14 },
                { autoAlpha: 0.8, scale: 1, duration: 0.36, ease: "none" },
                0.64,
              )
              .to(
                ".hero-bottom",
                { autoAlpha: 0, y: -15, duration: 0.35, ease: "none" },
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
                { scale: 1.2, yPercent: 7, duration: 1, ease: "none" },
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
                { autoAlpha: 0, scale: 1.12 },
                { autoAlpha: 0.3, scale: 1, duration: 0.4, ease: "none" },
                0.6,
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
