import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { SQLError, SQLTransaction } from 'expo-sqlite';
import { Gloss, SearchResult, Word, WordCategory, WordMeaningExample } from '../models/Word';

export default class SQLiteDataProvider {

    public db: SQLite.SQLiteDatabase | undefined = undefined
    constructor() {

    }
    async openDatabase(pathToDatabaseFile: string, update: boolean = false): Promise<boolean> {
        if (this.db == null) {
            if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
            }
            let isDbExists = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/myDatabaseName.db');
            if (update && isDbExists.exists) {
                await FileSystem.deleteAsync(FileSystem.documentDirectory + 'SQLite/myDatabaseName.db');
                isDbExists = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/myDatabaseName.db');
            }
            if (!isDbExists.exists) {
                await FileSystem.downloadAsync(
                    pathToDatabaseFile,
                    FileSystem.documentDirectory + 'SQLite/myDatabaseName.db'
                );
            }
            this.db = SQLite.openDatabase('myDatabaseName.db');
        }
        return true;
    }

    async executeQuery(query: string, params: any[] = []): Promise<SQLite.SQLResultSet> {
        return new Promise((resolve, reject) => {
            if (this.db == null) {
                reject('Database not opened');
            }
            this.db!.transaction((tx) => {
                tx.executeSql(query, params, (tx, results) => {
                    resolve(results);
                }),
                    (transaction: SQLTransaction, error: SQLError) => {
                        reject(error);
                    }
            });
        });
    }

    async getWordDetail(word: Word): Promise<SearchResult<Gloss>> {
        let sql = `select * from gloss  as gl left outer join sense as se on se.glossid  = gl.id  where se.wordid=${word.id}`;
        let result = await this.executeQuery(sql);
        let searchResult: SearchResult<Gloss> = { searchItem: word.id.toString(), total: result.rows.length, data: [] };
        result.rows._array.forEach((element: any) => {
            searchResult.data.push(element);
        });
        await this.enrichWordDetailExample(searchResult);
        return searchResult;
    }

    async enrichWordDetailExample(gloss: SearchResult<Gloss>): Promise<SearchResult<Gloss>> {
        let ids = gloss.data.map((item) => item.id).join(",");
        let sql = `select * from example where glossid in (${ids})`;
        let result = await this.executeQuery(sql);
        let searchResult: SearchResult<Gloss> = { searchItem: ids, total: result.rows.length, data: [] };

        let allExample = result.rows._array.map((element: WordMeaningExample) => {
            return element;
        });
        gloss.data.forEach((item) => {
            item.example = allExample.filter((example) => example.glossid == item.id);
        })
        return gloss;

    }

    async searchWord(word: string, exactSearch: boolean = false): Promise<SearchResult<Word>> {
        //let sql = `select * from word where word${exactSearch ? `="${word}"` : ` like "%${word}%"`} and phrase=0 order by word asc`;
        let sql=`select w.*,commonword.chinese  from word as w left outer join commonword on w.word==commonword.word where w.word${exactSearch ? `="${word}"` : ` like "%${word}%"`} and w.phrase=0 order by w.word asc`
        let result = await this.executeQuery(sql);
        let searchResult: SearchResult<Word> = { searchItem: word, total: result.rows.length, data: [] };
        result.rows._array.forEach((element: any) => {
            searchResult.data.push(element);
        });
        searchResult.category = this.splitResult(searchResult.data, word);
        return searchResult;
    }

    splitResult(data: Word[], searchWord: string): WordCategory[] {

        let groups: WordCategory[] = [];
        groups.push({
            key: "CommonWords",
            title: "Common Words",
            groupFunction: (word: Word) => word.iscommon == 1,
            words: [],
            allowStop: false
        });
        groups.push({
            key: "Numbers",
            title: "Numbers",
            groupFunction: (word: Word) => word.word.match(/[0-9][a-zA-Z]/gm) != null,
            words: [],
            allowStop: true
        });
        groups.push({
            key: "Uppercase",
            title: "Uppercase",
            groupFunction: (word: Word) => word.word.match(/[A-Z][0-9a-z]/gm) != null,
            words: [],
            allowStop: true
        });
        if (searchWord?.length > 0) {
            groups.push({
                key: "Begin",
                title: "Begin",
                groupFunction: (word: Word) => word.word.startsWith(searchWord),
                words: [],
                allowStop: true
            });
            groups.push({
                key: "End",
                title: "End",
                groupFunction: (word: Word) => word.word.endsWith(searchWord),
                words: [],
                allowStop: true
            });
            groups.push({
                key: "Contains",
                title: "Contains",
                groupFunction: (word: Word) => word.word.indexOf(searchWord) > 0,
                words: [],
                allowStop: true
            });
        }
        data.forEach((a) => {
            for (let i = 0; i < groups.length; i++) {
                if (groups[i].groupFunction(a)) {
                    groups[i].words.push(a);
                    if (groups[i].allowStop) {
                        break;
                    }
                }
            }
        })

        groups.forEach((a) => {
            a.title = `${a.title} (${a.words.length})`;
        })
        let commonWordsGroup = groups.find((a) => a.key == "CommonWords");
        let sorted = commonWordsGroup?.words.sort((a, b) => a.word.indexOf(searchWord) - b.word.indexOf(searchWord));
        if (commonWordsGroup && sorted) {
            commonWordsGroup.words = sorted;
        }

        return groups.filter((a) => a.words.length > 0);
    }

    async searchPhrase(word: string): Promise<SearchResult<Gloss> | undefined> {
        let words = await this.searchWord(word, true);
        if (words?.data?.length > 0) {
            let firstWord = words.data[0];
            let meaning = await this.getWordDetail(firstWord);
            meaning.word = firstWord;
            return meaning;
        }
        return undefined;
    }
}