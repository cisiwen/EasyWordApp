import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import { Asset } from 'expo-asset';
import { SQLError, SQLTransaction } from 'expo-sqlite';
import { Gloss, SearchResult, Word, WordMeaningExample } from '../models/Word';

export default class SQLiteDataProvider {

    public db: SQLite.SQLiteDatabase | undefined = undefined
    constructor() {

    }
    async openDatabase(pathToDatabaseFile: string): Promise<boolean> {
        if (this.db == null) {
            if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
                await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
            }
            let isDbExists = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite/myDatabaseName.db');
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
        let sql = `select * from word where word${exactSearch ? `="${word}"` : ` like "%${word}%"`} and phrase=0 order by word asc`;
        let result = await this.executeQuery(sql);
        let searchResult: SearchResult<Word> = { searchItem: word, total: result.rows.length, data: [] };
        result.rows._array.forEach((element: any) => {
            searchResult.data.push(element);
        });
        return searchResult;
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