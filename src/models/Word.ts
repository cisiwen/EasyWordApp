import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
export type  Word ={
    id:number;
    word:string;
    phrase:number;
    pronunc:any;
}



export interface INavPageProps<T> {
    navigation?: NativeStackNavigationProp<any, string>;
    route?: RouteProp<any, string>;
    screenData?: T;
}

export type  WordMeaningExample ={
    glossid:number;
    example:string;
}
export type Gloss={
    id:number;
    gloss:string;
    example?:WordMeaningExample[];
}

export type  SearchResult<T> ={
    searchItem:string;
    total:number;
    data:T[];
}
