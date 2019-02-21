export interface ICat {
    catName: string;
    owner?: object | null;
    birthdate?: string | null;
    friends?: any[] | null;
    district: number;
    talky: boolean;
    other: string;
}