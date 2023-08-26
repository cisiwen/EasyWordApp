import React, { Fragment, useEffect, useLayoutEffect } from "react";
import StartUp from "../instance/StartUp";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";
import { View, Text, StyleSheet, TextInput, FlatList, Button, ListRenderItemInfo, Pressable, TextInputChangeEventData } from "react-native";
import { INavPageProps, SearchResult, Word, WordCategory } from "../models/Word";
import { useNavigation, NavigationProp } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system';
import { Searchbar, useTheme } from 'react-native-paper';
import {
    NavigationState,
    SceneMap,
    SceneRendererProps,
    TabBar,
    TabView,
} from 'react-native-tab-view';
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
        borderBottomWidth: 2,
        borderBottomColor: "#00000034",
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
    }
});
const SearchPage = (props: INavPageProps<any>) => {
    let dbProvider = StartUp.getInstance<SQLiteDataProvider>();
    let [dbOpened, setDbOpened] = React.useState(false);
    let [isOpening, setIsOpening] = React.useState(true);
    let [searchWord, setSearchWord] = React.useState<SearchResult<Word> | undefined>(undefined);
    let [searchWordText, setSearchWordText] = React.useState("");
    let [debugMessage, setDebugMessage] = React.useState("");
    const navigation = props.navigation;


    useLayoutEffect(() => {
    })

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
        return <Pressable onPress={() => { navigation?.navigate("WordDetail", { words: [item.item] }) }}>
            <View key={item.index} style={style.resultItem}>
                <Text style={style.resultItemText}>{item.item.word}</Text>
            </View>
        </Pressable>
    }

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
    const readerScene = (scene: { route: WordCategory }) => {
        //console.log("readerScene", scene.route);
        return <View style={{ flex: 1 }}>
            <FlatList data={scene.route.words} renderItem={renderItem}></FlatList>
        </View>
    }
    const renderScene = SceneMap({
        Numbers: readerScene,
        Uppercase: readerScene,
        Begin: readerScene,
        End: readerScene,
        Contains: readerScene,
    });
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
    return <View style={style.topContainer}>
        {
            !isOpening ?
                <Fragment>
                    <View style={style.inputContainer}>
                        <Searchbar
                            autoCapitalize="none"
                            style={{ width: "100%" }}
                            theme={{ colors: { primary: 'green' } }}
                            placeholder="Search"
                            //onSubmitEditing={searchWordHandler}
                            onChangeText={(e) => {
                                searchWordHandler(e);
                                setSearchWordText(e);
                            }}
                            value={searchWordText}
                        />
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
};
export default SearchPage;
