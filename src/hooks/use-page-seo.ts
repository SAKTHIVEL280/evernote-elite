import { useEffect } from "react";

interface SEOProps {
  title: string;
  description?: string;
  path?: string;
}

export function usePageSEO({ title, description, path }: SEOProps) {
  useEffect(() => {
    document.title = `${title} | PMNT`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && description) {
      metaDesc.setAttribute("content", description);
    }

    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && path) {
      canonical.setAttribute("href", `https://pmnt.daeq.in${path}`);
    }

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", `${title} | PMNT`);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && description) ogDesc.setAttribute("content", description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl && path) ogUrl.setAttribute("content", `https://pmnt.daeq.in${path}`);
  }, [title, description, path]);
}
