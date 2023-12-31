import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
export type  Word ={
    id:number;
    word:string;
    phrase:number;
    pronunc:any;
    iscommon:number;
    chinese?:string;
}



export interface INavPageProps<T> {
    navigation?: NativeStackNavigationProp<any, string>;
    route?: RouteProp<any, string>;
    screenData?: T;
    showSlideUpPanel?: boolean;
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
    word?:Word;
    searchItem:string;
    total:number;
    data:T[];
    category?:WordCategory[];
}

export type DefailHistory ={
    words:Word[];
}

export type WordCategory ={
    title:string;
    key:string;
    groupFunction:(word:Word)=>boolean;
    words:Word[];
    allowStop?:boolean;
}

export type UserWord={
    word:string;
    first_check_date:Date;
    userid:string;
}

export type UserWordGroup={
    title:string;
    data:UserWord[];
}

export type UserSearch={
    userid:string;
    search_word:string;
    date_search:Date;
    user_search_id:number;
}
