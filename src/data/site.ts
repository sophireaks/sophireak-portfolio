/** Everything personal lives here. Edit this file, not the components. */
export interface SocialLink {
  readonly label: string;
  readonly href: string;
}

export const site = {
  name: 'Sophireak',
  fullName: 'Sophireak Soeng',
  initial: 'S.',
  role: 'SOFTWARE ENGINEER / SECURITY RESEARCHER',
  tagline:
    'Software engineer and security researcher, building tools and testing how systems break.',
  description:
    'Portfolio of Sophireak Soeng, software engineer and security researcher based in Phnom Penh. Offensive security and open-source tooling.',
  location: 'Phnom Penh, Cambodia',
  coordinates: { lat: '11.56°N', lng: '104.93°E' },
  /** Leave empty to hide every email link. */
  email: '',
  availability: 'Open to junior Security Engineer roles',
  links: [
    { label: 'GitHub', href: 'https://github.com/sophireaks' },
    { label: 'TryHackMe', href: 'https://tryhackme.com/p/Sophireak.S' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sophireak-soeng-10b668265/' },
  ] as readonly SocialLink[],
  marquee: [
    'Python',
    'Burp Suite',
    'Kotlin',
    'Firebase',
    'Rasa',
    'TryHackMe',
    'Web Security',
    'Open Source',
  ] as readonly string[],
  facts: [
    { label: 'Based in', value: 'Phnom Penh, Cambodia' },
    { label: 'Education', value: 'IT Engineering, RUPP' },
    { label: 'Focus', value: 'Offensive security, software' },
    { label: 'Looking for', value: 'Junior Security Engineer roles' },
  ] as readonly { label: string; value: string }[],
  services: [
    {
      letter: 'S',
      title: 'Software Engineering',
      text: 'Web apps, Android apps and command line tools, built to be read and maintained.',
    },
    {
      letter: 'O',
      title: 'Offensive Security',
      text: 'Web application testing and recon, practiced hands-on with Burp Suite and TryHackMe.',
    },
    {
      letter: 'T',
      title: 'Security Tooling',
      text: 'Command line scanners and automation, built in Python and released as open source.',
    },
    {
      letter: 'R',
      title: 'Security Research',
      text: 'Studying how systems fail: web vulnerabilities, misconfigurations and attack paths.',
    },
  ] as readonly { letter: string; title: string; text: string }[],
} as const;

export function emailHref(): string | null {
  return site.email === '' ? null : `mailto:${site.email}`;
}
