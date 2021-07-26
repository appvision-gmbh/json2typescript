export interface IDog {
    name: string;
    owner?: object | null;
    birthdate?: string;
    friends?: any[];
    barking: boolean;
    other: number;
    toys: string[];
}
