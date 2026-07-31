import { useEffect } from "react";
import { REELIX_FALLBACK_BACKDROP } from "../utils/assets";

const SEO = ({
  title = "Reelix — Watch & Stream Movies, TV Series & Anime in 1080p Ultra HD",
  description = "Stream thousands of free movies, trending TV series, and anime in 1080p Ultra HD on Reelix. Explore top rated cinema and stream across 8 global HD servers.",
  keywords = "Reelix, movie streaming, watch movies online free, stream TV series, anime 1080p HD, free HD movies, watch One Piece online, Young Sheldon stream, Big Bang Theory free stream, anime 1080p",
  image = REELIX_FALLBACK_BACKDROP,
  url = typeof window !== "undefined" ? window.location.href : "https://reelix.app",
  type = "website",
  schemaData = null,
}) => {
  useEffect(() => {
    // 1. Dynamic Title
    document.title = title.includes("Reelix") ? title : `${title} | Reelix Streaming`;

    // 2. Helper to set or update meta tag
    const setMetaTag = (selector, attribute, value) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        const [attrName, attrVal] = selector.replace(/[\[\]]/g, "").split("=");
        element.setAttribute(attrName, attrVal.replace(/["']/g, ""));
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    // Meta Description & Keywords
    setMetaTag('meta[name="description"]', "content", description);
    setMetaTag('meta[name="keywords"]', "content", keywords);

    // Open Graph Tags
    setMetaTag('meta[property="og:title"]', "content", title);
    setMetaTag('meta[property="og:description"]', "content", description);
    setMetaTag('meta[property="og:image"]', "content", image);
    setMetaTag('meta[property="og:url"]', "content", url);
    setMetaTag('meta[property="og:type"]', "content", type);

    // Twitter Tags
    setMetaTag('meta[name="twitter:title"]', "content", title);
    setMetaTag('meta[name="twitter:description"]', "content", description);
    setMetaTag('meta[name="twitter:image"]', "content", image);

    // 3. Dynamic Canonical Link for Top Search Engine Ranking
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    // 4. Dynamic JSON-LD Structured Data Injection
    if (schemaData) {
      let schemaScript = document.getElementById("dynamic-seo-schema");
      if (!schemaScript) {
        schemaScript = document.createElement("script");
        schemaScript.id = "dynamic-seo-schema";
        schemaScript.type = "application/ld+json";
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schemaData);
    }
  }, [title, description, keywords, image, url, type, schemaData]);

  return null;
};

export default SEO;
