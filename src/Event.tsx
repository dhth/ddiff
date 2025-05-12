import { z } from "zod";

export const ActorClassSchema = z.object({
  login: z.string(),
  url: z.string(),
});

export const EventSchema = z.object({
  actor: ActorClassSchema,
  created_at: z.union([z.coerce.date(), z.null()]),
  type: z.union([z.null(), z.string()]),
});
export type Event = z.infer<typeof EventSchema>;

export const Events = z.array(EventSchema);
