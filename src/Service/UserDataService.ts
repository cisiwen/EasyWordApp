import { UserWord, UserWordGroup } from "../models/Word";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";

export class UserDataService {
    public static OBJECTID: string = "UserDataService";
    private provider: SQLiteDataProvider;
    private dbSourceUrl: string = "";
    private dbName: string = "UserActivity.db";
    constructor(provider: SQLiteDataProvider) {
        this.provider = provider;
    }



    async checkDatabase(): Promise<boolean> {
        let result = await this.provider.openDatabase(this.dbSourceUrl, this.dbName);
        return result;
    }

    async saveUserWord(word: string, userId: string) {
        
            let exists = await this.getUserWords(userId, word);
            let sql = `insert into user_words(word,first_check_date,userid) values ('${word}',${new Date().getTime()},'${userId}')`;
            if (exists?.length == 0) {
                let result = await this.provider.executeQuery(sql);
                console.log(result);
            }
            else {

            }
         

    }

    async deleteUserWord(userId: string, word: string) {
        let sql = `delete from user_words where userid='${userId}' and word='${word}'`;
        await this.provider.executeQuery(sql);
    }


    async getUserWordsGroup(userId: string): Promise<UserWordGroup[]> {
        let userWords = await this.getUserWords(userId);
        let groups: UserWordGroup[] = [];
        userWords.forEach((element) => {
            let title = element.first_check_date.toLocaleDateString();
            let group = groups.find((item) => item.title == title);
            if (group == null) {
                group = { title, data: [] };
                groups.push(group);
            }
            group.data.push(element);
        });
        return groups;
    }

    async hideUserWord(userId: string, word: string) {
        let sql = `update user_words set first_check_date=${new Date().getTime()} where userid='${userId}' and word='${word}'`;
        await this.provider.executeQuery(sql);
    }

    async getUserWords(userId: string, word: string | null = null): Promise<UserWord[]> {
        let sql = `select word,first_check_date, userid from user_words where userid='${userId}'`;
        if (word) {
            sql = `${sql} and word='${word}'`;
        }
        let result = await this.provider.executeQuery(sql);
        let words: UserWord[] = [];
        result.rows._array.forEach((element: any) => {
            words.push({
                word: element.word,
                first_check_date: new Date(element.first_check_date),
                userid: element.userid
            });
        });
        return words;
    }
}