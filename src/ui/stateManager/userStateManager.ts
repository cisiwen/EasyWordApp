import { UserDataService } from "../../Service/UserDataService";
import { UserSearch, UserWord, UserWordGroup, Word } from "../../models/Word";

export enum EventTypes{
    UserWordChanagedEvent="UserWordChanagedEvent",
    UserSearchChanagedEvent="UserSearchChanagedEvent"
}
export type EventUserWordChanagedPayload={
    word:Word;
    userId:string;
    action:"add"|"remove";
}
export class UserStateManager{

    public static OBJECTID:string="UserStateManager";
    public UserWords:UserWord[]=[];
    public UserWordGroups:UserWordGroup[]=[];
    public UserSearchs:UserSearch[]=[];
    public UserDataService:UserDataService;
    public constructor(UserDataService:UserDataService){
        this.UserDataService=UserDataService;
    }


    public Events:{[key:string]:Function}={};
    
    public addEventListener<T>(sender:string,eventType:EventTypes, callback:(args:T)=>void){
        this.Events[`${sender}_${eventType}`]=callback;
    }

    public removeEventListener (sender:string,eventType:EventTypes){
        delete this.Events[`${sender}_${eventType}`];
    }

    public async dispatchUserWordChanagedEvent(event:EventUserWordChanagedPayload){
       this.UserWordGroups = await this.loadUserWords(event.userId);
       for(let f in this.Events){
        if(f.indexOf(EventTypes.UserWordChanagedEvent)>-1){
            this.Events[f](this.UserWordGroups);
        }
       }
    }

    public async dispatchUserSearchChanagedEvent(event:UserSearch){
        this.UserSearchs = await this.UserDataService.getUserSearch(event.userid);
        for(let f in this.Events){
            if(f.indexOf(EventTypes.UserSearchChanagedEvent)>-1){
                this.Events[f](this.UserSearchs);
            }
        }
    }

    public async loadUserWords(userId:string){
       return await this.UserDataService.getUserWordsGroup(userId);
    }

    public async addToUserSearch(search:string, userId:string){
        await this.UserDataService.saveUserSearch(search,userId);
        this.dispatchUserSearchChanagedEvent({search_word:search,date_search:new Date(),userid:userId,user_search_id:0});
    }

    public async addToUserWords(word:Word,userId:string){
        await this.UserDataService.saveUserWord(word.word,userId);
        this.dispatchUserWordChanagedEvent({word:word,action:"add",userId:userId});
    }
}