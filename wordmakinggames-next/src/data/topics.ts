export interface WordData {
  word: string;
  hint: string;
  extraLetters: string;
  meaning?: string; // Optional detailed meaning of the word
  pronunciation?: string; // Optional pronunciation guide
  audioUrl?: string; // Optional URL to pronunciation audio
  example?: string; // Optional example sentence using the word
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  words: WordData[];
}

// For the sake of this SEO implementation, we'll create a sample topics array
// In a full migration, you would import all individual topic files
export const topics: Topic[] = [
  {
    id: "colors",
    name: "Colors",
    description: "Learn color names, hues, and shades through fun word games.",
    icon: "🎨",
    words: [
      {
        word: "azure",
        hint: "A light blue color, like the sky on a clear day",
        extraLetters: "xyz",
      },
      {
        word: "violet",
        hint: "A purplish-blue color, like certain flowers",
        extraLetters: "hkm",
      },
      {
        word: "scarlet",
        hint: "A bright red color with a slightly orange tinge",
        extraLetters: "bcop",
      }
    ]
  },
  {
    id: "animals",
    name: "Animals",
    description: "Discover fascinating animal names from around the world.",
    icon: "🦁",
    words: [
      {
        word: "giraffe",
        hint: "Tall African mammal with a very long neck",
        extraLetters: "wxyz",
      },
      {
        word: "penguin",
        hint: "Flightless bird that lives in the Antarctic and swims well",
        extraLetters: "rstv",
      }
    ]
  },
  {
    id: "programming",
    name: "Programming",
    description: "Test your knowledge of programming terms and concepts.",
    icon: "💻",
    words: [
      {
        word: "function",
        hint: "A reusable block of code that performs a specific task",
        extraLetters: "xywz",
      },
      {
        word: "variable",
        hint: "A container for storing data values",
        extraLetters: "pqstz",
      }
    ]
  },
  {
    id: "space",
    name: "Space & Astronomy",
    description: "Explore celestial objects and cosmic phenomena.",
    icon: "🚀",
    words: [
      {
        word: "galaxy",
        hint: "A system of millions or billions of stars",
        extraLetters: "pqwz",
      },
      {
        word: "nebula",
        hint: "A cloud of gas and dust in outer space",
        extraLetters: "crstz",
      }
    ]
  },
  {
    id: "food",
    name: "Food & Cuisine",
    description: "Explore delicious dishes and ingredients from around the world.",
    icon: "🍲",
    words: [
      {
        word: "sushi",
        hint: "Japanese dish with vinegared rice and raw fish",
        extraLetters: "acpt",
      },
      {
        word: "pasta",
        hint: "Italian food made from dough of flour and water",
        extraLetters: "eloq",
      }
    ]
  }
]; 