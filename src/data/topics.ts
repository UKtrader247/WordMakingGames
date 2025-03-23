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
import { fashionTopic } from "./topics/fashion";
import { mythologyTopic } from "./topics/mythology";
import { travelTopic } from "./topics/travel";
import { astronomyTopic } from "./topics/astronomy";
import { cookingTopic } from "./topics/cooking";
import { oceanTopic } from "./topics/ocean";
import { gamingTopic } from "./topics/gaming";
import { architectureTopic } from "./topics/architecture";
import { carsTopic } from "./topics/cars";
import { colorsTopic } from "./topics/colors";
import { flowersTopic } from "./topics/flowers";

// Combine all topics into a single array
export const topics: Topic[] = [
  colorsTopic, // Put the mini quiz at the top for easy access
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
  fashionTopic,
  mythologyTopic,
  travelTopic,
  astronomyTopic,
  cookingTopic,
  oceanTopic,
  gamingTopic,
  architectureTopic,
  carsTopic,
  flowersTopic,
];
