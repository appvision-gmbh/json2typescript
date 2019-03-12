export interface IOptionalCat {
    catName: string;
    owner?: object | null;
    birthdate?: string | null;
    friends?: any[] | null;
    district?: number;
}
