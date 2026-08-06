// Single source for contact + social links. NavHeader and Footer both read this,
// so a handle only ever changes in one place.
//
// TODO(xander): replace the three '#' placeholders with your real profile URLs.
// Order is intentional and matches the nav spec: X, Instagram, LinkedIn.
export const socials = [
  { id: 'x', label: 'Twitter/X', url: '#' },
  { id: 'instagram', label: 'Instagram', url: '#' },
  { id: 'linkedin', label: 'LinkedIn', url: '#' },
]

// TODO(xander): confirm this is the address you want public. This is the value
// given in the build plan; the other addresses on file are aledminc@iu.edu and
// alexander.d.minch@gmail.com.
export const contactEmail = 'xanderminch@gmail.com'
