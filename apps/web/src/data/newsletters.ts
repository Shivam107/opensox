export type NewsletterSection = {
  type: "text" | "image" | "video" | "media";
  heading: string;
  body: string;
  src?: string;
  alt?: string;
  mediaSrc?: string;
  mediaType?: "image" | "video";
  mediaAlt?: string;
};

export type NewsletterIssue = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  readTime: string;
  heroMediaUrl: string;
  heroMediaType: "image" | "video";
  sections: NewsletterSection[];
};

export const newsletterIssues: NewsletterIssue[] = [
  {
    slug: "newsletter-122-week-1",
    title: "OpenSox Premium Newsletter #122 – Week 1",
    summary:
      "Kick-off highlights covering new OSS bounties, premium AMA recaps, and tool updates.",
    publishedAt: "2025-09-28",
    readTime: "6 min read",
    heroMediaUrl: "/images/Screenshot-2025-10-22.png",
    heroMediaType: "image",
    sections: [
      {
        type: "text",
        heading: "Editor Note",
        body:
          "We welcomed 120 new premium builders and launched the bounty tracker that lets you filter rewards by language and project health.",
      },
      {
        type: "media",
        heading: "Project Spotlight & Automation Demo",
        body:
          "Glance at the redesigned contribution flow for OpenSox Sheets with live lint checks. Product engineers walk through the new PR triage bot that landed merged PRs 32% faster.",
        src: "/images/welcome.jpg",
        alt: "Screenshot of the OpenSox Sheets contribution flow",
        mediaSrc: "/videos/os-demo.mp4",
        mediaType: "video",
      },
    ],
  },
  {
    slug: "newsletter-122-week-2",
    title: "OpenSox Premium Newsletter #122 – Week 2",
    summary:
      "Contributor success stories, funding alerts, and community playbooks from last week.",
    publishedAt: "2025-10-05",
    readTime: "7 min read",
    heroMediaUrl: "/images/Screenshot-2025-10-22.png",
    heroMediaType: "image",
    sections: [
      {
        type: "text",
        heading: "In Case You Missed It",
        body:
          "Premium members unlocked three new grants and paired up through the mentor roulette. Catch all of the links in the recap.",
      },
      {
        type: "image",
        heading: "Photo Recap",
        body:
          "Scenes from the Bangalore premium jam featuring lightning talks and code clinics.",
        src: "https://assets.opensox.dev/newsletters/122-week2-gallery.jpg",
        alt: "Developers collaborating during the OpenSox Bangalore meetup",
      },
      {
        type: "text",
        heading: "Contributor Interview",
        body:
          "Sneha shares how she automated QA for 30+ repositories and dropped the test runtime by 18 minutes.",
      },
    ],
  },
  {
    slug: "newsletter-122-week-3",
    title: "OpenSox Premium Newsletter #122 – Week 3",
    summary:
      "Roadmap deep dives, beta launch previews, and curated resources for premium builders.",
    publishedAt: "2025-10-12",
    readTime: "8 min read",
    heroMediaUrl: "https://assets.opensox.dev/newsletters/122-week3-hero.mp4",
    heroMediaType: "video",
    sections: [
      {
        type: "text",
        heading: "Roadmap Deep Dive",
        body:
          "Discover what is landing next: initiative tracker rollouts, AI pairing tools, and the observability stack for maintainers.",
      },
      {
        type: "video",
        heading: "Beta Launch Walkthrough",
        body:
          "Product leads screen-share the newest workspace analytics shipping to premium members in November.",
        src: "https://assets.opensox.dev/newsletters/122-week3-beta.mp4",
      },
      {
        type: "text",
        heading: "Resource Pack",
        body:
          "Slide decks, RFC templates, and reusable GitHub Actions to boost review throughput.",
      },
    ],
  },
  {
    slug: "newsletter-122-week-4",
    title: "OpenSox Premium Newsletter #122 – Week 4",
    summary:
      "Month-in-review featuring leaderboards, upcoming events, and premium-only office hours.",
    publishedAt: "2025-10-19",
    readTime: "5 min read",
    heroMediaUrl: "https://assets.opensox.dev/newsletters/122-week4-hero.jpg",
    heroMediaType: "image",
    sections: [
      {
        type: "text",
        heading: "Month In Review",
        body:
          "We wrapped with 480 merged PRs and featured maintainers who mentored the new cohort.",
      },
      {
        type: "image",
        heading: "Contributor Leaderboard",
        body:
          "Celebrate the top contributors and track how premium streaks unlock extra support hours.",
        src: "https://assets.opensox.dev/newsletters/122-week4-leaderboard.png",
        alt: "Leaderboard graphic highlighting top contributors",
      },
      {
        type: "text",
        heading: "Events Calendar",
        body:
          "RSVP for November clinics including roadmap AMAs, live pairing rooms, and design critiques.",
      },
    ],
  },
];