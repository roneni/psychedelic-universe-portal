import { useEffect } from "react";

const SITE_NAME = "Psychedelic Universe";

/**
 * Sets the page title and meta description for SEO.
 * Each page should call this with unique values.
 */
export function usePageMeta(options: {
  title: string;
  description: string;
  canonicalPath?: string;
}) {
  useEffect(() => {
    // Set document title
    document.title = `${options.title} | ${SITE_NAME}`;

    // Set meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", options.description);
    }

    // Set Open Graph title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute("content", `${options.title} | ${SITE_NAME}`);
    }

    // Set Open Graph description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) {
      ogDesc.setAttribute("content", options.description);
    }

    // Set Twitter title
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) {
      twTitle.setAttribute("content", `${options.title} | ${SITE_NAME}`);
    }

    // Set Twitter description
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) {
      twDesc.setAttribute("content", options.description);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && options.canonicalPath) {
      canonical.setAttribute(
        "href",
        `https://psychedelic-universe.manus.space${options.canonicalPath}`
      );
    }

    // Cleanup: restore defaults on unmount
    return () => {
      document.title = `${SITE_NAME} - The Global Hub for Psytrance Culture`;
    };
  }, [options.title, options.description, options.canonicalPath]);
}
