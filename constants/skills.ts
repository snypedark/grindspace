export const SKILLS = [
    "Coding",
    "Design",
    "Writing",
    "Math",
    "Language",
    "Business",
    "Music",
    "Reading",
    "Research",
    "Other",
] as const;

export type Skill = (typeof SKILLS)[number];

export const MOCK_SKILL_DISTRIBUTION = [
    { skill: "Coding", hours: 42, percentage: 40 },
    { skill: "Design", hours: 21, percentage: 20 },
    { skill: "Writing", hours: 16, percentage: 15 },
    { skill: "Math", hours: 11, percentage: 10 },
    { skill: "Research", hours: 8, percentage: 8 },
    { skill: "Other", hours: 7, percentage: 7 },
];
