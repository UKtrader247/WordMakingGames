export interface WordData {
  word: string;
  hint: string;
  extraLetters: string;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  icon: string;
  words: WordData[];
}

// Import all individual topics
import { programmingTopic } from "./topics/programming";
import { scienceTopic } from "./topics/science";
import { spaceTopic } from "./topics/space";
import { moviesTopic } from "./topics/movies";
import { animalsTopic } from "./topics/animals";
import { foodTopic } from "./topics/food";
import { geographyTopic } from "./topics/geography";
import { sportsTopic } from "./topics/sports";
import { musicTopic } from "./topics/music";
import { natureTopic } from "./topics/nature";
import { historyTopic } from "./topics/history";
import { technologyTopic } from "./topics/technology";
import { artTopic } from "./topics/art";
import { literatureTopic } from "./topics/literature";
import { healthTopic } from "./topics/health";

// Combine all topics into a single array
export const topics: Topic[] = [
  programmingTopic,
  scienceTopic,
  spaceTopic,
  natureTopic,
  foodTopic,
  musicTopic,
  sportsTopic,
  animalsTopic,
  geographyTopic,
  moviesTopic,
  historyTopic,
  technologyTopic,
  artTopic,
  literatureTopic,
  healthTopic,
];
