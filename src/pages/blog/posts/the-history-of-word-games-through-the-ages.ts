import { BlogPost } from "../blogData";

export const post3: BlogPost = {
  id: 3,
  title: "The History of Word Games Through the Ages",
  slug: "history-word-games-through-ages",
  summary:
    "From ancient civilizations to modern apps, word games have a rich and fascinating history.",
  content: `
    <p>Word games have been a part of human culture for thousands of years, evolving alongside language itself.</p>
    
    <h2>Ancient Origins</h2>
    <p>Some of the earliest word games date back to ancient Egypt and Mesopotamia, where word puzzles were found inscribed on papyrus and clay tablets. These ancient puzzles often had religious or educational purposes.</p>
    
    <h2>Medieval Word Play</h2>
    <p>During the Middle Ages, riddling became a popular form of entertainment among all social classes. Nobles would challenge each other with complex wordplay during feasts, while common folk shared riddles as part of oral traditions.</p>
    
    <h2>The Print Revolution</h2>
    <p>The invention of the printing press democratized word games. The first crossword puzzle appeared in a New York newspaper in 1913, sparking a global phenomenon that continues today.</p>
    
    <h2>Digital Transformation</h2>
    <p>The digital era revolutionized word games again. Games like Scrabble found new life online, reaching millions of players worldwide. Mobile apps have further transformed how we play with words, making word games accessible anytime, anywhere.</p>
    
    <h2>Modern Innovations</h2>
    <p>Today's word games often incorporate advanced features like AI opponents, educational tracking, and social connectivity. These innovations have helped word games remain relevant in the digital age.</p>
    
    <p>Throughout history, word games have served multiple purposes: entertainment, education, social bonding, and cognitive development. Their enduring popularity speaks to the fundamental human love of language and play.</p>
  `,
  author: "Prof. Sarah Williams",
  date: "March 15, 2025",
  readTime: "7 min read",
  imageUrl:
    "https://images.unsplash.com/photo-1524578271613-d550eacf6090?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
  tags: ["history", "language", "games"],
  styles: {
    lineHeight: "1.8",
    headingMargin: "2.2rem 0 1rem 0",
    paragraphSpacing: "1.5rem 0",
  },
};
