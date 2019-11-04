export interface IDog {
    name: string;
    secName?: string;
    owner?: object | null;
    birthdate?: string;
    friends?: any[];
    barking: boolean;
    other: number;
}