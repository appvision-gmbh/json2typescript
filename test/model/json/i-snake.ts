import { IHuman } from "./i-human";

export interface ISnake {
    snakeName: string;
    owner?: IHuman;
    district: number;    
}