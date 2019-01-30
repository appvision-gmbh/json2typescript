export interface ICat {
    catName: string;
    owner?: object;
    birthdate?: string | null;
    friends?: any[];
    district: number;
    talky: boolean;
    other: string;
}