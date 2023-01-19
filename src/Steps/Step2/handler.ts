import { BadRequestException } from "../../Errors/bad-request-exception";
import { IEvent } from "../../interfaces/event.interface";
import { z } from 'zod';

export interface IEvent2 extends IEvent {
  Username: string;
}

const schema = z.object({
  id: z.number(),
  document: z.string(),
});

export type Data = z.infer<typeof schema>

export const handler = async (event: IEvent2) => {
  const { Data } = event;
  try {
    const data = schema.parse(Data);
    return { ...event, Data: data};
  } catch (err) {
    throw new BadRequestException(err);
  }
}