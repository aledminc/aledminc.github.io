// Single source for contact + social links. NavHeader and Footer both read this,
// so a handle only ever changes in one place.
//
// Order is intentional and matches the nav spec: X, Instagram, LinkedIn.
// NOTE: these must be absolute (https://...). A bare "linkedin.com/in/..." is
// treated as a relative path and would resolve to aledminc.github.io/linkedin.com/...
export const socials = [
  { id: 'x', label: 'Twitter/X', url: 'https://x.com/XanderMinch' },
  { id: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/xandererr' },
  { id: 'linkedin', label: 'LinkedIn', url: 'https://www.linkedin.com/in/xander-minch' },
]

// Confirmed against the 2026 resume.
export const contactEmail = 'xanderminch@gmail.com'
