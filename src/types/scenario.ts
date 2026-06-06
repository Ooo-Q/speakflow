export type ScenarioId = "daily" | "interview" | "travel";

export interface Scenario {
  id: ScenarioId;
  label: string;
  description: string;
  welcome: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: "daily",
    label: "Daily Chat",
    description: "Casual everyday conversation",
    welcome:
      "Hi! Let's practice everyday English — hobbies, weather, food, or anything on your mind. What would you like to talk about?",
  },
  {
    id: "interview",
    label: "Job Interview",
    description: "Practice interview questions",
    welcome:
      "Hi! I'll act as an interviewer today. Tell me the role you're preparing for, or we can start with a classic: \"Tell me about yourself.\"",
  },
  {
    id: "travel",
    label: "Travel",
    description: "Airport, hotel, and directions",
    welcome:
      "Hi! Let's practice travel English — checking in at a hotel, asking for directions, or ordering at a café. Where are you traveling to?",
  },
];

export function getScenario(id: ScenarioId): Scenario {
  return SCENARIOS.find((s) => s.id === id) ?? SCENARIOS[0];
}

export function isScenarioId(value: unknown): value is ScenarioId {
  return value === "daily" || value === "interview" || value === "travel";
}
