/**
 * Centralised navigation data used by both the Footer and Navbar.
 * Keeps URLs in one place so a path change is a single-line edit.
 */
export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavSection {
  title: string;
  links: NavLink[];
}

/** Hash-anchor links that smooth-scroll on the homepage */
export const HOMEPAGE_ANCHORS: NavLink[] = [
  { label: "Features", href: "/features" },
  { label: "Solutions", href: "/solutions" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Resources", href: "/resources" },
  { label: "Pricing", href: "/pricing" },
];

/** Footer link columns */
export const FOOTER_SECTIONS: NavSection[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Book a Demo", href: "/book-demo" },
      { label: "Changelog", href: "/product/changelog" },
      { label: "Roadmap", href: "/product/roadmap" },
      { label: "Status", href: "/product/status" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "E-Commerce", href: "/solutions/e-commerce" },
      { label: "Healthcare", href: "/solutions/healthcare" },
      { label: "SaaS", href: "/solutions/saas" },
      { label: "Finance", href: "/solutions/finance" },
      { label: "Education", href: "/solutions/education" },
      { label: "Travel", href: "/solutions/travel" },
      { label: "Enterprise", href: "/enterprise" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "Documentation", href: "/developers/docs" },
      { label: "API Reference", href: "/developers/api-reference" },
      { label: "SDKs", href: "/developers/sdks" },
      { label: "Webhooks", href: "/developers/webhooks" },
      { label: "Status Page", href: "/product/status" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "https://v2.throughouttechnologies.com/about-us", external: true },
      { label: "Blog", href: "https://v2.throughouttechnologies.com/blogs", external: true },
      { label: "Careers", href: "https://v2.throughouttechnologies.com/careers", external: true },
      { label: "Press", href: "https://v2.throughouttechnologies.com/awards", external: true },
      { label: "Contact", href: "https://v2.throughouttechnologies.com/contact-us", external: true },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/legal/privacy" },
      { label: "Terms of Service", href: "/legal/terms" },
      { label: "Cookie Policy", href: "/legal/cookies" },
      { label: "GDPR", href: "/legal/gdpr" },
      { label: "Security", href: "/legal/security" },
    ],
  },
];
