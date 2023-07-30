import React, { useEffect } from "react";
import StartUp from "../instance/StartUp";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";
import { View, Text, StyleSheet, TextInput, FlatList, Button, ListRenderItemInfo, Pressable } from "react-native";
import { SearchResult, Word } from "../models/Word";
import { useNavigation,NavigationProp } from '@react-navigation/native';
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
        paddingTop: 5,
        paddingBottom: 5,
        borderBottomColor: "black",
        borderBottomWidth: 1,
    },
    resultItemText: {
        fontSize: 20,
    }
});
const SearchPage = () => {
    let dbProvider = StartUp.getInstance<SQLiteDataProvider>();
    let [dbOpened, setDbOpened] = React.useState(false);
    let [isOpening, setIsOpening] = React.useState(true);
    let [searchWord, setSearchWord] = React.useState<SearchResult<Word> | undefined>(undefined);
    let [searchWordText, setSearchWordText] = React.useState("");
    const navigation = useNavigation<NavigationProp<any>>();
    useEffect(() => {
        console.log("useEffect");
        (async () => {

            let dbOpen = await dbProvider.openDatabase("../../assets/wordnet.sqlite");
            setIsOpening(false)
            setDbOpened(dbOpen);
        })();
        return () => {

        }
    });
    const renderItem = (item: ListRenderItemInfo<Word>) => {
        return <Pressable onPress={()=>{navigation.navigate("WordDetail",item.item)}}>
                    <View key={item.index} style={style.resultItem}>
                        <Text style={style.resultItemText}>{item.item.word}</Text>
                    </View>
                </Pressable>
    }
    return <View style={style.topContainer}>
        <View style={style.inputContainer}>
            <View style={[{ flexDirection: "row", alignContent: "center" }]}>
                <TextInput autoCapitalize="none" value={searchWordText} onChangeText={(text) => { setSearchWordText(text) }} style={style.inputText} placeholder="search word"></TextInput>
                <Button title="Search" onPress={async () => {
                    console.log("searching", searchWordText);
                    let result = await dbProvider.searchWord(searchWordText);
                    console.log(searchWordText, result);
                    setSearchWord(result);
                }} />
            </View>
        </View>
        <View style={style.resultContainer}>
            <FlatList
                data={searchWord?.data}
                renderItem={renderItem}
            >

            </FlatList>
        </View>
    </View>
};
export default SearchPage;
