import { IEvent } from "@/interfaces/event.interface";

export const handler = async (event: IEvent) => {
  const { Token } = event;
  
  // VALIDAR TOKEN
  if (Token !== 'ZYXZ') {
    throw new Error(`Invalid token: ${Token}`);
  }

  // FETCH DAS INFOR DO USUARIO E ADD EVENT

  return { ...event, Username: "HANDS ON" };
}