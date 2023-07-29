export type  Word ={
    id:number;
    word:string;
    phrase:number;
    pronunc:any;
}

export type  SearchResult<T> ={
    searchItem:string;
    total:number;
    data:T[];
}