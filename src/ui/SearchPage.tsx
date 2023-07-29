import React, { useEffect } from "react";
import StartUp from "../instance/StartUp";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";
import { View, Text } from "react-native";
import { SearchResult, Word } from "../models/Word";
const SearchPage = () => {
    let dbProvider = StartUp.getInstance<SQLiteDataProvider>();
    let [dbOpened, setDbOpened] = React.useState(false);
    let [isOpening, setIsOpening] = React.useState(true);
    let [searchWord, setSearchWord] = React.useState<SearchResult<Word>|undefined>(undefined);
    useEffect(() => {
        (async () => {

            let dbOpen = await dbProvider.openDatabase("../../assets/wordnet.sqlite");
            setIsOpening(false)
            setDbOpened(dbOpen);
            let testSearch = await dbProvider.searchWord("deli");
            setSearchWord(testSearch);
        })();
        return () => {

        }
    });
    return <View>
        <Text>1.opening database {isOpening ? "opening":"done"}</Text>
        <Text>2.db connected: {dbOpened ? "connected":"sorry not"}</Text>
        {
            searchWord?.data.map((word, index) => {
                return <Text key={index}>{word.word}</Text>
            })
        }
    </View>
};
export default SearchPage;
