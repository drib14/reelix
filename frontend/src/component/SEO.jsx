import { useEffect } from "react";

const SEO = ({
  title = "Reelix — Watch & Stream Movies, TV Series & Anime in 1080p Ultra HD",
  description = "Stream thousands of free movies, trending TV series, and anime in 1080p Ultra HD on Reelix. Explore top rated cinema and stream across 8 global HD servers.",
  keywords = "Reelix, movie streaming, watch movies online, stream TV series, anime 1080p HD",
  image = "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?q=80&w=1200&auto=format&fit=crop",
  url = window.location.href,
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

    // Twitter Tags
    setMetaTag('meta[name="twitter:title"]', "content", title);
    setMetaTag('meta[name="twitter:description"]', "content", description);
    setMetaTag('meta[name="twitter:image"]', "content", image);
  }, [title, description, keywords, image, url]);

  return null;
};

export default SEO;
