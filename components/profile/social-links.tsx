"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  Twitter,
  Linkedin,
  Youtube,
  Instagram,
  Facebook,
  Mail,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react";
import type { GitHubUser } from "@/types/github";

interface SocialLinksProps {
  user: GitHubUser;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: React.ReactNode;
  color: string;
  username?: string;
}

export function SocialLinks({ user }: SocialLinksProps) {
  const extractSocialLinks = (): SocialLink[] => {
    const links: SocialLink[] = [];

    // Twitter from GitHub profile
    if (user.twitter_username) {
      links.push({
        platform: "Twitter",
        url: `https://twitter.com/${user.twitter_username}`,
        icon: <Twitter className="h-4 w-4" />,
        color: "text-blue-400 hover:text-blue-500",
        username: `@${user.twitter_username}`,
      });
    }

    // Email
    if (user.email) {
      links.push({
        platform: "Email",
        url: `mailto:${user.email}`,
        icon: <Mail className="h-4 w-4" />,
        color:
          "text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300",
        username: user.email,
      });
    }

    // Website/Blog
    if (user.blog) {
      const blogUrl = user.blog.startsWith("http")
        ? user.blog
        : `https://${user.blog}`;
      const domain = new URL(blogUrl).hostname.replace("www.", "");

      links.push({
        platform: "Website",
        url: blogUrl,
        icon: <Globe className="h-4 w-4" />,
        color: "text-green-600 hover:text-green-700",
        username: domain,
      });
    }

    // Parse bio for social links
    if (user.bio) {
      const bioLinks = extractLinksFromBio(user.bio);
      links.push(...bioLinks);
    }

    // Parse company for potential links
    if (user.company) {
      const companyLinks = extractCompanyLinks(user.company);
      links.push(...companyLinks);
    }

    return links.slice(0, 6); // Limit to 6 social links
  };

  const extractLinksFromBio = (bio: string): SocialLink[] => {
    const links: SocialLink[] = [];

    // Common social media patterns
    const patterns = [
      {
        regex:
          /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9\-_]+)/gi,
        platform: "LinkedIn",
        icon: <Linkedin className="h-4 w-4" />,
        color: "text-blue-600 hover:text-blue-700",
        urlBuilder: (match: string) =>
          match.startsWith("http") ? match : `https://${match}`,
      },
      {
        regex:
          /(?:https?:\/\/)?(?:www\.)?youtube\.com\/(?:c\/|channel\/|user\/)?([a-zA-Z0-9\-_]+)/gi,
        platform: "YouTube",
        icon: <Youtube className="h-4 w-4" />,
        color: "text-red-600 hover:text-red-700",
        urlBuilder: (match: string) =>
          match.startsWith("http") ? match : `https://${match}`,
      },
      {
        regex:
          /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9\-_\.]+)/gi,
        platform: "Instagram",
        icon: <Instagram className="h-4 w-4" />,
        color: "text-pink-600 hover:text-pink-700",
        urlBuilder: (match: string) =>
          match.startsWith("http") ? match : `https://${match}`,
      },
      {
        regex: /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9\-_\.]+)/gi,
        platform: "Facebook",
        icon: <Facebook className="h-4 w-4" />,
        color: "text-blue-700 hover:text-blue-800",
        urlBuilder: (match: string) =>
          match.startsWith("http") ? match : `https://${match}`,
      },
    ];

    patterns.forEach((pattern) => {
      const matches = bio.matchAll(pattern.regex);
      for (const match of matches) {
        if (match[0] && links.length < 3) {
          // Limit bio links
          links.push({
            platform: pattern.platform,
            url: pattern.urlBuilder(match[0]),
            icon: pattern.icon,
            color: pattern.color,
            username: match[1] ? `@${match[1]}` : undefined,
          });
        }
      }
    });

    return links;
  };

  const extractCompanyLinks = (company: string): SocialLink[] => {
    const links: SocialLink[] = [];

    // Check if company contains URL
    if (
      company.includes(".com") ||
      company.includes(".io") ||
      company.includes(".org")
    ) {
      const urlMatch = company.match(
        /(https?:\/\/[^\s]+|[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
      );
      if (urlMatch) {
        const url = urlMatch[0].startsWith("http")
          ? urlMatch[0]
          : `https://${urlMatch[0]}`;
        links.push({
          platform: "Company",
          url,
          icon: <LinkIcon className="h-4 w-4" />,
          color: "text-purple-600 hover:text-purple-700",
          username: company,
        });
      }
    }

    return links;
  };

  const socialLinks = extractSocialLinks();

  if (socialLinks.length === 0) {
    return null; // Don't render if no social links
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <LinkIcon className="h-4 w-4" />
          Social Links
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
          >
            <div className={`${link.color} transition-colors`}>{link.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {link.platform}
              </div>
              {link.username && (
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {link.username}
                </div>
              )}
            </div>
            <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
