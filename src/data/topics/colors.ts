import { Topic } from "../topics";

export const colorsTopic: Topic = {
  id: "colors",
  name: "Colors Mini",
  description: "Quick mini-quiz with just 3 colors",
  icon: "🎨",
  words: [
    { word: "RED", hint: "Color of apples and roses", extraLetters: "PQWXYZ" },
    {
      word: "BLUE",
      hint: "Color of the sky and ocean",
      extraLetters: "PQWXYZ",
    },
    {
      word: "GREEN",
      hint: "Color of grass and leaves",
      extraLetters: "PQWXYZ",
    },
  ],
};
