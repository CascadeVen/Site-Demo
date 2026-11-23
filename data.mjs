// Editable content. Edit here, then run: node scripts/build-pages.mjs
export const PACKAGES = [
  { name: "Website Launch", summary: "Website design and development.", price: null, includes: ["Custom, mobile-first design and development", "Quote and contact form", "On-page SEO basics: titles, descriptions, structure", "Analytics and Search Console setup", "Performance optimization"], optional: ["Redesign of an existing website", "Hosting and maintenance (see monthly care)"] },
  { name: "Local Visibility", summary: "Local SEO and Google visibility.", price: null, includes: ["Local keyword research", "On-page and technical SEO review", "Google Business Profile setup assistance and optimization", "Business directory and citation management", "Performance monitoring"], optional: ["Location-specific landing pages", "Review response strategy"] },
  { name: "Complete Digital Presence", summary: "Website, local search and reputation managed together.", price: null, includes: ["Everything in Website Launch and Local Visibility", "Conversion optimization", "Ongoing optimization and monitoring", "Review management strategy"], optional: [] },
];
export const CARE = { name: "Monthly care (optional)", summary: "Ongoing website maintenance and services.", price: null, unit: "per month", wide: true, includes: ["Website hosting", "Maintenance and updates", "Analytics and Search Console monitoring"], optional: ["Ongoing local SEO and Google profile work"] };
export const CUSTOM = ["Online stores or booking systems", "Businesses with several locations", "Custom integrations or advanced features", "Large content migrations"];
// example:true marks a concept layout. Real projects: { title, sector, summary, image:"/assets/x.webp", alt:"...", width, height }
export const PROJECTS = [
  { example: true, title: "Contractor website", summary: "Services, service areas and a prominent quote request." },
  { example: true, title: "Restaurant website", summary: "Menu, hours, location and reservations or ordering links." },
  { example: true, title: "Salon website", summary: "Services, pricing guide, gallery and online booking link." },
];
// Add only real, permitted reviews: { quote, name, business }
export const REVIEWS = [];
