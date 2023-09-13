import { ListRenderItemInfo, View, FlatList, StyleSheet, SectionList, SectionListData, SafeAreaView } from "react-native"
import StartUp from "../instance/StartUp";
import { UserDataService } from "../Service/UserDataService";
import { UserSearch, UserWord, UserWordGroup } from "../models/Word";
import { ReactElement, useEffect, useState } from "react";
import { IconButton, useTheme } from "react-native-paper";
import { Card, List } from 'react-native-paper';
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
    NavigationState,
    SceneMap,
    SceneRendererProps,
    TabBar,
    TabView,
} from 'react-native-tab-view';
import React from "react";
import { EventTypes, UserStateManager } from "./stateManager/userStateManager";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
const styles = StyleSheet.create({
    resultItem: {
        flexDirection: "row",
        padding: 10,
        paddingTop: 8,
        paddingBottom: 8,
    },
    sectionHeader: {
        padding: 10,
        backgroundColor: "#00000034",
    },
    resultItemText: {
        fontSize: 25,
    },
    separator: {
        height: StyleSheet.hairlineWidth,
    },
})


const ItemSeparator = (colors: MD3Colors) => {
    return (
        <View style={[styles.separator, { backgroundColor: colors.primary }]} />
    );
};
const MyWordPage = () => {
    const { colors } = useTheme();

    let userDataService = StartUp.getInstance<UserDataService>(UserDataService.OBJECTID);
    let [myWords, setMyWords] = useState<UserWordGroup[]>([]);
    let userStateManager = StartUp.getInstance<UserStateManager>(UserStateManager.OBJECTID);
    let GUID=`MyWordPage_${new Date().valueOf()}`;
    let navigation = useNavigation<NativeStackNavigationProp<any, string>>();
    
    useEffect(() => {
        console.log("MyWordPage");
        if (myWords.length < 1) {
            userDataService.getUserWordsGroup("Terry").then((words) => {
                console.log("words", JSON.stringify(words));
                setMyWords(words);
            }).catch((error) => {
                console.log("error", error);
            });
        }
        userStateManager.addEventListener(GUID, EventTypes.UserWordChanagedEvent,setMyWords);
        return () => {
            console.log("MyWordPage unmount");
            userStateManager.removeEventListener(GUID, EventTypes.UserWordChanagedEvent);
        }
    }, ["dd"]);

    const removeWord = (word: UserWord) => {
        userDataService.hideUserWord("Terry", word.word).then((words) => {
            let myWord = myWords.find((a) => a.data.find((b) => b.word == word.word));
            if (myWord) {
                myWord.data = myWord.data.filter((a) => a.word != word.word);
            }
            setMyWords([...myWords]);

        }).catch((error) => {
            console.log("error", error);
        });
    }

    const renderItem = (item: ListRenderItemInfo<UserWord>) => {
        return (

            <List.Item
                onPress={()=>{
                    navigation.navigate("WordDetail", { words: [{word:item.item.word}] });
                }}
                title={item.item.word}
                right={props => <IconButton onPress={()=>{removeWord(item.item)}}  {...props} icon="minus-circle" />}
            />
        )
    };

    const renderSectionHeader = (info: { section: SectionListData<UserWord, UserWordGroup> }): ReactElement<any> => {
        return (
            <Card.Title
                style={{ backgroundColor: colors.primary }}
                titleStyle={{ color: colors.background }}
                subtitleStyle={{ color: colors.background }}
                subtitleVariant="bodyLarge"
                title={info.section.title}
                subtitle={info.section.data.length.toString() + " words"}
            >
            </Card.Title>
        )
    }
    return <View>
        <SectionList
            renderSectionHeader={renderSectionHeader}
            ItemSeparatorComponent={() => { return ItemSeparator(colors) }}
            sections={myWords}
            keyExtractor={(item, index) => item.word + index}
            renderItem={renderItem}>
        </SectionList>
    </View>
}


const MySearchPage = () => {
    const { colors } = useTheme();
    let userDataService = StartUp.getInstance<UserDataService>(UserDataService.OBJECTID);
    let [userSearchs, setUserSearchs] = useState<UserSearch[]>([]);
    let GUID=`MySearchPage_${new Date().valueOf()}`;
    let userStateManager = StartUp.getInstance<UserStateManager>(UserStateManager.OBJECTID);
    let navigation = useNavigation<NativeStackNavigationProp<any, string>>();
    useEffect(() => {
        console.log("MySearchPage");
        if (userSearchs.length < 1) {
            userDataService.getUserSearch("Terry").then((words) => {
                console.log("words", JSON.stringify(words));
                setUserSearchs(words);
            }).catch((error) => {
                console.log("error", error);
            });
        }
        userStateManager.addEventListener(GUID, EventTypes.UserSearchChanagedEvent,setUserSearchs)
        return () => {
            userStateManager.removeEventListener(GUID, EventTypes.UserSearchChanagedEvent);
            console.log("MySearchPage unmount");
        }
    }, ["dd"])

    const removeSearch = (search: UserSearch) => {
        userDataService.deleteUserSearch("Terry", search.search_word).then(() => {
            setUserSearchs(userSearchs.filter((a) => a.search_word != search.search_word));
        }).catch((error) => {
            console.log("error", error);
        });
    }
    const renderItem = (item: ListRenderItemInfo<UserSearch>) => {
        return (
            <Card onPress={(a)=>{
                navigation.navigate("WordSearch", { searchWord: item.item.search_word });
            }}>
                <Card.Title
                    titleVariant="headlineMedium"
                    subtitle={item.item.date_search.toString()}
                    title={item.item.search_word}
                    right={props => <IconButton onPress={()=>{removeSearch(item.item)}} {...props} icon="minus-circle" />}
                >
                </Card.Title>
            </Card>
        )
    }
    return <View>
        <FlatList
            ItemSeparatorComponent={() => { return ItemSeparator(colors) }}
            renderItem={renderItem}
            keyExtractor={(item, index) => item.search_word + index}
            data={userSearchs}>
        </FlatList>
    </View>
}
const MyWordPageMemo = React.memo(MyWordPage);
const MySearchPageMemo = React.memo(MySearchPage);

const tabStyle = StyleSheet.create({
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
})

type TabBarState = {
    title: string;
    key: string;
}
type State = NavigationState<TabBarState>;
const MyPage = () => {
    const renderScene = SceneMap({
        Searchs: MySearchPageMemo,
        Words: MyWordPageMemo,
    });

    const [index, onIndexChange] = React.useState(0);
    const [routes, setRoutes] = React.useState<TabBarState[]>([
        { key: 'Searchs', title: 'Searchs' },
        { key: 'Words', title: 'Words' },
    ])
    const renderTabBar = (
        props: SceneRendererProps & { navigationState: State }
    ) => (
        <TabBar
            {...props}
            scrollEnabled
            indicatorStyle={tabStyle.indicator}
            style={tabStyle.tabbar}
            contentContainerStyle={tabStyle.tabbarContentContainer}
            tabStyle={tabStyle.tab}
            labelStyle={tabStyle.label}
            gap={20}
        />
    );
    return <SafeAreaView style={{ flex: 1, paddingTop: 5 }}>
        <TabView
            lazy={true}
            navigationState={{
                index,
                routes,
            }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={onIndexChange}
        />
    </SafeAreaView>
}

export default MyPage;