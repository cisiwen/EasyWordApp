import React, { Fragment, useEffect } from "react";
import StartUp from "../instance/StartUp";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";
import { View, Text, StyleSheet, TextInput, FlatList, Button, ListRenderItemInfo, Pressable } from "react-native";
import { SearchResult, Word } from "../models/Word";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { useTheme } from 'react-native-paper';
const style = StyleSheet.create({
    topContainer: {
        flex: 1,
    },
    inputText: {
        flex: 1,
        fontSize: 30,
    },
    inputContainer: {

        borderBottomWidth: 2,
        borderBottomColor: "black",
        padding: 10,
    },
    resultContainer: {
        flex: 1
    },
    resultItem: {
        padding: 10,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomColor: "black",
        borderBottomWidth: 1,
    },
    resultItemText: {
        fontSize: 25,
    },
    debugContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    debugContainerText: {
        fontSize: 20,
        fontWeight: "bold"
    }
});
const SearchPage = () => {
    let dbProvider = StartUp.getInstance<SQLiteDataProvider>();
    let [dbOpened, setDbOpened] = React.useState(false);
    let [isOpening, setIsOpening] = React.useState(true);
    let [searchWord, setSearchWord] = React.useState<SearchResult<Word> | undefined>(undefined);
    let [searchWordText, setSearchWordText] = React.useState("");
    let [debugMessage, setDebugMessage] = React.useState("");
    const navigation = useNavigation<NavigationProp<any>>();
    useEffect(() => {
        console.log("useEffect");
        (async () => {
            setDebugMessage("openDatabase start");
            try {
                let dbOpen = await dbProvider.openDatabase("https://www.jpgtour.com/public/wordnet.sqlite");
                setIsOpening(false)
                setDbOpened(dbOpen);
                setDebugMessage("openDatabase good");
            }
            catch (error) {
                setDebugMessage(`${FileSystem.documentDirectory}---${JSON.stringify(error)}`);
            }
        })();
        return () => {

        }
    }, ["TESTING"]);
    const renderItem = (item: ListRenderItemInfo<Word>) => {
        return <Pressable onPress={() => { navigation.navigate("WordDetail", {words:[item.item]}) }}>
            <View key={item.index} style={style.resultItem}>
                <Text style={style.resultItemText}>{item.item.word}</Text>
            </View>
        </Pressable>
    }

    const searchWordHandler = async () => {
        //console.log("searching", searchWordText);
        setDebugMessage("onPress");
        let result = await dbProvider.searchWord(searchWordText);
        //console.log(searchWordText, result);
        setSearchWord(result);
    }
    return <View style={style.topContainer}>
        {
            !isOpening ?
                <Fragment>
                    <View style={style.inputContainer}>
                        <View style={[{ flexDirection: "row", alignContent: "center" }]}>
                            <TextInput autoCapitalize="none" onSubmitEditing={searchWordHandler} value={searchWordText} onChangeText={(text) => { setSearchWordText(text) }} style={style.inputText} placeholder="search word"></TextInput>
                            <Button title={`Search${searchWord ? `(${searchWord.total})`:""}`} onPress={async () => {
                                //console.log("searching", searchWordText);
                                setDebugMessage("onPress");
                                let result = await dbProvider.searchWord(searchWordText);
                                //console.log(searchWordText, result);
                                setSearchWord(result);
                            }} />
                        </View>
                    </View>
                    <View style={style.resultContainer}>
                        <FlatList data={searchWord?.data} renderItem={renderItem}>
                        </FlatList>
                    </View>
                </Fragment>
                : <View style={style.debugContainer}><Text style={style.debugContainerText}>{debugMessage}</Text></View>
        }
    </View>
};
export default SearchPage;
