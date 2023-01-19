import { Data } from "../Step2/handler";

export interface IEvent3 {
  Payload: Data
}

export const handler = async (event: IEvent3) => {
  // SALVA NO BANCO OU FAZ UM POST PRO MS
  return event;
}