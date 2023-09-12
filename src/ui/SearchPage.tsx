import React, { Fragment, useEffect, useLayoutEffect, useMemo } from "react";
import StartUp from "../instance/StartUp";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";
import { View, StyleSheet, TextInput, FlatList, ListRenderItemInfo, Pressable, TextInputChangeEventData } from "react-native";
import { INavPageProps, SearchResult, Word, WordCategory } from "../models/Word";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { Chip, IconButton, Searchbar } from 'react-native-paper';
import { useTheme } from '@react-navigation/native';
import { ActivityIndicator, MD2Colors, Text, Button } from 'react-native-paper';
import {
    NavigationState,
    SceneMap,
    SceneRendererProps,
    TabBar,
    TabView,
} from 'react-native-tab-view';
import { SafeAreaView } from "react-native-safe-area-context";
import { UserDataService } from "../Service/UserDataService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

let dbProvider = StartUp.getInstance<SQLiteDataProvider>(SQLiteDataProvider.OBJECTID);
let userWordService = StartUp.getInstance<UserDataService>(UserDataService.OBJECTID);
let userid = "Terry";
let navigation: NativeStackNavigationProp<any, string>|undefined=undefined;
type State = NavigationState<WordCategory>;

const style = StyleSheet.create({
    topContainer: {
        flex: 1,
    },
    inputText: {
        flex: 1,
        fontSize: 30,
    },
    inputContainer: {
        margin: 5,
        borderRadius: 10,
        overflow: "hidden",
        flexDirection: "row",
        alignContent: "center",
    },
    resultContainer: {
        flex: 1
    },
    resultItem: {
        flexDirection: "row",
        padding: 10,
        paddingTop: 8,
        paddingBottom: 8,
        borderBottomColor: "black",
        borderBottomWidth: 0,
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
    },
    tabbar: {
        backgroundColor: '#3f51b5',
    },
    tabbarContentContainer: {
        paddingHorizontal: 10,
    },
    tab: {
        width: 120,
    },
    indicator: {
        backgroundColor: '#ffeb3b',
    },
    label: {
        fontWeight: '400',
    },
    separator: {
        height: StyleSheet.hairlineWidth,
    },
});

const ItemSeparator = () => {
    const { colors } = useTheme();

    return (
        <View style={[style.separator, { backgroundColor: colors.primary }]} />
    );
};



const SearchResultPage = (scene: { route: WordCategory }) => {
    return <View style={{ flex: 1 }}>
    <FlatList
        ItemSeparatorComponent={ItemSeparator}
        data={scene.route.words}
        renderItem={(item: ListRenderItemInfo<Word>)=>{
            return <SearchResultItem userid={userid} userWordService={userWordService} navigation={navigation} item={item} />
        }}>
    </FlatList>
</View>
}

const SearchResultPageMemo=React.memo(SearchResultPage);

const SearchResultItem = (props: { userid: string, item: ListRenderItemInfo<Word>, userWordService: UserDataService, navigation: NativeStackNavigationProp<any, string> | undefined }) => {
    let [isSaving, setIsSaving] = React.useState(false);
    let item = props.item;
    let userid = props.userid;
    let navigation = props.navigation;
    const addToUserWords = async (word: Word) => {
        setIsSaving(true);
        try {
            await props.userWordService.saveUserWord(word.word, userid);
        }
        catch (error) {
            console.error(error);
        }
        setIsSaving(false);
    }

    return <View key={item.index} style={style.resultItem}>
        <View style={{ flex: 1 }}>
            <Text onPress={() => { navigation?.navigate("WordDetail", { words: [item.item] }) }} style={style.resultItemText}>{item.item.word}</Text>
            {
                item?.item?.chinese ?
                    <Text>{item.item.chinese}</Text>
                    : null
            }
        </View>
        <View style={{ width: 40, justifyContent: "center" }}>
            {
                isSaving ? <ActivityIndicator animating={true} size={"small"}></ActivityIndicator> :
                    <IconButton onPress={(e) => {
                        e.stopPropagation();
                        addToUserWords(item.item);
                    }} icon="plus-circle"></IconButton>
            }
        </View>
    </View>
}
const SearchPage = (props: INavPageProps<any>) => {
   
    let [dbOpened, setDbOpened] = React.useState(false);
    let [isOpening, setIsOpening] = React.useState(true);
    let [searchWord, setSearchWord] = React.useState<SearchResult<Word> | undefined>(undefined);
    let [searchWordText, setSearchWordText] = React.useState("");
    let [debugMessage, setDebugMessage] = React.useState("");
    let [isSavingUserSearch, setIsSavingUserSearch] = React.useState(false);
   

    navigation = props.navigation;
    useLayoutEffect(() => {
        navigation?.setOptions({
            headerTitle: "Word search",
            headerSearchBarOptions: {
                autoCapitalize: "none",
                onChangeText: (e) => {
                    console.log("onChangeText", e.nativeEvent.text);
                    searchWordHandler(e.nativeEvent.text);
                    setSearchWordText(e.nativeEvent.text);
                }
            }
        });
    })

    useEffect(() => {
        console.log("useEffect");
        (async () => {
            setDebugMessage("openDatabase start");
            try {
                let dbOpen = await dbProvider.openDatabase("https://www.jpgtour.com/public/wordnet.sqlite", "myDatabaseName", false);
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

  

    const searchWordHandler = async (text: string) => {
        //console.log("searching", searchWordText);
        setDebugMessage("onPress");
        if (text?.length > 0) {
            let result = await dbProvider.searchWord(text);
            if (result?.category) {
                setRoutes(result.category);
            }
            else {
                setRoutes([]);
            }
            //setSearchWord(result);
        }
        else {
            setRoutes([]);
        }
        //console.log(searchWordText, result);
    }
    const [index, onIndexChange] = React.useState(1);
    const [routes, setRoutes] = React.useState<WordCategory[]>([]);
  
    const renderScene = SceneMap({
        CommonWords: SearchResultPageMemo,
        Numbers: SearchResultPageMemo,
        Uppercase: SearchResultPageMemo,
        Begin: SearchResultPageMemo,
        End: SearchResultPageMemo,
        Contains: SearchResultPageMemo,
    });
    const saveUserSearch = async () => {
        setIsSavingUserSearch(true);
        try {
            await userWordService.saveUserSearch(searchWordText, userid);
        }
        catch (error) {
            console.error(error);
        }
        setIsSavingUserSearch(false);
    }
    const renderTabBar = (
        props: SceneRendererProps & { navigationState: State }
    ) => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={style.indicator}
            style={style.tabbar}
            contentContainerStyle={style.tabbarContentContainer}
            tabStyle={style.tab}
            labelStyle={style.label}
            gap={20}
        />
    );
    return <SafeAreaView style={{ flex: 1 }}>
        <View style={style.topContainer}>
            {
                !isOpening ?
                    <Fragment>
                        <View style={[style.inputContainer, { display: routes?.length > 0 ? "flex" : "none" }]}>
                            <Chip style={[{ flex: 1, backgroundColor: "transparent" }]}>Save <Text style={{ fontWeight: "bold", fontSize: 20 }}>{searchWordText}</Text> to my search

                            </Chip>
                            {
                                isSavingUserSearch ? 
                                <ActivityIndicator animating={true} size={"small"}></ActivityIndicator> 
                                :
                                <Button mode="contained" compact={true} labelStyle={{ lineHeight: 15 }} style={{ padding: 0 }} onPress={saveUserSearch}>Save</Button>
                            }
                        </View>
                        <View style={style.resultContainer}>
                            <TabView
                                lazy
                                navigationState={{
                                    index,
                                    routes,
                                }}
                                renderScene={renderScene}
                                renderTabBar={renderTabBar}
                                onIndexChange={onIndexChange}
                            />
                        </View>
                    </Fragment>
                    : <View style={style.debugContainer}><Text style={style.debugContainerText}>{debugMessage}</Text></View>
            }
        </View>
    </SafeAreaView>
};


export default SearchPage;
