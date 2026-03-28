import z from "zod";

export const platformTypeSchema = z.enum(["Web", "Mobile", "Internal"]);

const personaSchema = z
  .object({
    Name: z.string().min(1),
    Age: z.number().int().nonnegative(),
    Goal: z.string().min(1),
    PainPoints: z.array(z.string().min(1)).min(1),
  })
  .strict();

const competitorSchema = z
  .object({
    Name: z.string().min(1),
    Strengths: z.array(z.string().min(1)).min(1),
    Weaknesses: z.array(z.string().min(1)).min(1),
    UI_Notes: z.array(z.string().min(1)).min(1),
  })
  .strict();

const userResearchSchema = z
  .object({
    demographics: z
      .object({
        targetAgeRange: z.string().min(1),
        targetRegions: z.array(z.string().min(1)).min(1),
        occupations: z.array(z.string().min(1)).min(1),
      })
      .strict(),
  })
  .strict();

const informationArchitectureNodeSchema: z.ZodType<
  string | { title: string; children?: Array<string | { title: string }> }
> = z.lazy(() =>
  z.union([
    z.string().min(1),
    z
      .object({
        title: z.string().min(1),
        children: z
          .array(
            z.union([
              z.string().min(1),
              z
                .object({
                  title: z.string().min(1),
                })
                .strict(),
            ]),
          )
          .optional(),
      })
      .strict(),
  ]),
);

export const uxBriefSchema = z
  .object({
    goals: z.union([z.string().min(1), z.array(z.string().min(1)).min(1)]),
    platformType: platformTypeSchema,
    userResearch: userResearchSchema,
    personas: z.array(personaSchema).min(1),
    competitors: z.array(competitorSchema).min(1),
    userJourney: z.array(z.string().min(1)).min(1),
    requirements: z
      .object({
        functional: z.array(z.string().min(1)).min(1),
        nonFunctional: z.array(z.string().min(1)).min(1),
      })
      .strict(),
    content: z
      .object({
        Text: z.union([z.boolean(), z.string().min(1)]),
        Images: z.union([z.boolean(), z.string().min(1)]),
        Videos: z.union([z.boolean(), z.string().min(1)]),
        Icons: z.union([z.boolean(), z.string().min(1)]),
      })
      .strict(),
    informationArchitecture: z.array(informationArchitectureNodeSchema).min(1),
    technicalConstraints: z
      .object({
        techStack: z.array(z.string().min(1)).min(1),
        os: z.array(z.string().min(1)).min(1),
        limitations: z.array(z.string().min(1)).min(1),
      })
      .strict(),
    successMetrics: z.array(z.string().min(1)).min(1),
  })
  .strict();

export type UxBrief = z.infer<typeof uxBriefSchema>;
