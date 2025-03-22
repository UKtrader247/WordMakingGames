interface WordData {
  word: string;
  hint: string;
  extraLetters: string;
}

interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  words: WordData[];
}

export const topics: Topic[] = [
  {
    id: 'programming',
    name: 'Programming',
    description: 'Test your knowledge of programming terms and concepts',
    icon: '💻',
    words: [
      { word: "GIT", hint: "Version control system", extraLetters: "HMRXYZ" },
      { word: "API", hint: "Interface for software communication", extraLetters: "TXNWQZ" },
      { word: "CSS", hint: "Styles for web pages", extraLetters: "PTNMWX" },
      { word: "NPM", hint: "Node package manager", extraLetters: "XYZWQT" },
      { word: "DOM", hint: "Web page structure model", extraLetters: "PXZWQT" },
      { word: "RUST", hint: "Systems programming language focused on safety", extraLetters: "PQWXYZ" },
      { word: "JAVA", hint: "Write once, run anywhere language", extraLetters: "PQWXYZ" },
      { word: "NODE", hint: "JavaScript runtime environment", extraLetters: "PQWXYZ" },
      { word: "CODE", hint: "Instructions for computers", extraLetters: "PQWXYZ" },
      { word: "HTML", hint: "Web page markup language", extraLetters: "PQWXYZ" },
      { word: "REACT", hint: "UI library by Facebook", extraLetters: "PNSXWM" },
      { word: "LINUX", hint: "Open-source OS kernel", extraLetters: "PQWXYZ" },
      { word: "SWIFT", hint: "Apple's programming language", extraLetters: "PQXYZN" },
      { word: "MONGO", hint: "NoSQL database system", extraLetters: "PQWXYZ" },
      { word: "REDUX", hint: "State management for JavaScript", extraLetters: "MNPQWY" },
      { word: "DOCKER", hint: "Container platform", extraLetters: "MNSTYZ" },
      { word: "GITHUB", hint: "Code hosting platform", extraLetters: "PQWXYZ" },
      { word: "PYTHON", hint: "Snake-named programming language", extraLetters: "JKQWXZ" },
      { word: "NODEJS", hint: "Server-side JavaScript platform", extraLetters: "PQWXYZ" },
      { word: "GOLANG", hint: "Google's programming language", extraLetters: "PQWXYZ" }
    ]
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Explore scientific terms and discoveries',
    icon: '🔬',
    words: [
      { word: "ATOM", hint: "Smallest unit of matter", extraLetters: "PQWXYZ" },
      { word: "DNA", hint: "Genetic material", extraLetters: "PQWXYZ" },
      { word: "LASER", hint: "Focused light beam", extraLetters: "PQWXYZ" }
    ]
  },
  {
    id: 'space',
    name: 'Space',
    description: 'Journey through astronomical terms',
    icon: '🚀',
    words: [
      { word: "MARS", hint: "Red planet", extraLetters: "PQWXYZ" },
      { word: "STAR", hint: "Burning ball of gas in space", extraLetters: "PQWXYZ" },
      { word: "MOON", hint: "Earth's natural satellite", extraLetters: "PQWXYZ" }
    ]
  },
  {
    id: 'nature',
    name: 'Nature',
    description: 'Learn about flora and fauna',
    icon: '🌿',
    words: [
      { word: "TREE", hint: "Tall woody plant", extraLetters: "PQWXYZ" },
      { word: "LEAF", hint: "Plant's food factory", extraLetters: "PQWXYZ" },
      { word: "SEED", hint: "Plant embryo", extraLetters: "PQWXYZ" }
    ]
  },
  {
    id: 'food',
    name: 'Food',
    description: 'Delicious culinary vocabulary',
    icon: '🍽️',
    words: [
      { word: "PASTA", hint: "Italian noodles", extraLetters: "PQWXYZ" },
      { word: "RICE", hint: "Asian grain staple", extraLetters: "PQWXYZ" },
      { word: "SOUP", hint: "Liquid food", extraLetters: "PQWXYZ" }
    ]
  },
  {
    id: 'music',
    name: 'Music',
    description: 'Musical terms and instruments',
    icon: '🎵',
    words: [
      { word: "JAZZ", hint: "American music genre", extraLetters: "PQWXYZ" },
      { word: "DRUM", hint: "Percussion instrument", extraLetters: "PQWXYZ" },
      { word: "NOTE", hint: "Musical symbol", extraLetters: "PQWXYZ" }
    ]
  },
  {
    id: 'sports',
    name: 'Sports',
    description: 'Athletic terms and equipment',
    icon: '⚽',
    words: [
      { word: "GOAL", hint: "Point scoring target", extraLetters: "PQWXYZ" },
      { word: "TEAM", hint: "Group of players", extraLetters: "PQWXYZ" },
      { word: "RACE", hint: "Speed competition", extraLetters: "PQWXYZ" }
    ]
  },
  {
    id: 'animals',
    name: 'Animals',
    description: 'Discover the animal kingdom',
    icon: '🦁',
    words: [
      { word: "LION", hint: "King of the jungle", extraLetters: "PQWXYZ" },
      { word: "BEAR", hint: "Large forest mammal", extraLetters: "PQWXYZ" },
      { word: "WOLF", hint: "Wild canine", extraLetters: "PQWXYZ" }
    ]
  },
  {
    id: 'geography',
    name: 'Geography',
    description: 'Explore lands, features, and countries',
    icon: '🌎',
    words: [
      { word: "RIVER", hint: "Flowing body of water", extraLetters: "PQZXST" },
      { word: "OCEAN", hint: "Vast body of saltwater", extraLetters: "PQWXYZ" },
      { word: "CANYON", hint: "Deep valley with steep sides", extraLetters: "PQZXST" },
      { word: "ISLAND", hint: "Land surrounded by water", extraLetters: "PQZXMT" }
    ]
  },
  {
    id: 'movies',
    name: 'Movies',
    description: 'Film industry terms and classics',
    icon: '🎬',
    words: [
      { word: "ACTOR", hint: "Performer in films", extraLetters: "PQWXYZ" },
      { word: "SCENE", hint: "Section of film", extraLetters: "PQWXTZ" },
      { word: "OSCAR", hint: "Famous film award", extraLetters: "PQLXYZ" },
      { word: "PLOT", hint: "Story of a film", extraLetters: "CQWXYZ" }
    ]
  },
  {
    id: 'history',
    name: 'History',
    description: 'Notable events and historical figures',
    icon: '📜',
    words: [
      { word: "KING", hint: "Male monarch", extraLetters: "PQWXYZ" },
      { word: "WAR", hint: "Armed conflict", extraLetters: "PQWXYZ" },
      { word: "ROME", hint: "Ancient Italian empire", extraLetters: "PQWXZF" },
      { word: "EMPIRE", hint: "Group of territories under single ruler", extraLetters: "CQWXAD" }
    ]
  },
  {
    id: 'technology',
    name: 'Technology',
    description: 'Modern tech gadgets and terms',
    icon: '📱',
    words: [
      { word: "PHONE", hint: "Communication device", extraLetters: "TQWXYZ" },
      { word: "WIFI", hint: "Wireless network", extraLetters: "PQAXYZ" },
      { word: "CLOUD", hint: "Online storage system", extraLetters: "PQWXVZ" },
      { word: "ROBOT", hint: "Mechanical automaton", extraLetters: "PQWXDC" }
    ]
  },
  {
    id: 'art',
    name: 'Art',
    description: 'Art forms and famous works',
    icon: '🎨',
    words: [
      { word: "PAINT", hint: "Colored liquid for artwork", extraLetters: "SQWXYZ" },
      { word: "BRUSH", hint: "Tool for painting", extraLetters: "PQWXLZ" },
      { word: "CANVAS", hint: "Surface for painting", extraLetters: "PQWMRZ" },
      { word: "DRAW", hint: "Create pictures with pen or pencil", extraLetters: "PQVXYZ" }
    ]
  },
  {
    id: 'literature',
    name: 'Literature',
    description: 'Books, authors and literary terms',
    icon: '📚',
    words: [
      { word: "POEM", hint: "Rhythmic literary composition", extraLetters: "TQWXYZ" },
      { word: "NOVEL", hint: "Long fictional narrative", extraLetters: "PQWXCZ" },
      { word: "AUTHOR", hint: "Writer of books", extraLetters: "PSWXYZ" },
      { word: "STORY", hint: "Narrative of events", extraLetters: "PQWXLZ" }
    ]
  },
  {
    id: 'health',
    name: 'Health',
    description: 'Medical terms and wellness concepts',
    icon: '❤️',
    words: [
      { word: "HEART", hint: "Blood-pumping organ", extraLetters: "PQWXSZ" },
      { word: "BRAIN", hint: "Control center of the body", extraLetters: "PQWXMZ" },
      { word: "SLEEP", hint: "Rest period for the body", extraLetters: "PQWXYT" },
      { word: "WATER", hint: "Essential liquid for life", extraLetters: "PQCXYZ" }
    ]
  }
];