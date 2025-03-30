export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  imageUrl: string;
  tags: string[];
  styles?: {
    lineHeight?: string;
    headingMargin?: string;
    paragraphSpacing?: string;
    imageDisplay?: string;
    imageWidth?: string;
    imageHeight?: string;
    objectFit?: string;
  };
}

import { posts } from "../../../public/images/blog/posts";

export const blogPosts: BlogPost[] = posts;
