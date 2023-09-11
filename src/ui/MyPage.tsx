import { ListRenderItemInfo, View, FlatList, StyleSheet, SectionList, SectionListData } from "react-native"
import StartUp from "../instance/StartUp";
import { UserDataService } from "../Service/UserDataService";
import { UserSearch, UserWord, UserWordGroup } from "../models/Word";
import { ReactElement, useEffect, useState } from "react";
import { Text, useTheme } from "react-native-paper";
import { Avatar, Card, IconButton, List } from 'react-native-paper';
import { MD3Colors } from "react-native-paper/lib/typescript/types";
import {
    NavigationState,
    SceneMap,
    SceneRendererProps,
    TabBar,
    TabView,
} from 'react-native-tab-view';
import React from "react";
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
    }, ["dd"]);

    const removeWord = (word: UserWord) => {

    }

    const renderItem = (item: ListRenderItemInfo<UserWord>) => {
        return (
            <List.Item
                title={item.item.word}
                right={props => <List.Icon {...props} icon="minus-circle" />}
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
    }, ["dd"])
    const renderItem = (item: ListRenderItemInfo<UserSearch>) => {
        return (
            <Card.Title
                titleVariant="headlineMedium"
                subtitle={item.item.date_search.toString()}
                title={item.item.search_word}
            >
            </Card.Title>
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
    const renderMySearchScene = (scene: { route: TabBarState }) => {
        //console.log("readerScene", scene.route);
        return <View style={{ flex: 1 }}>
            <MySearchPage></MySearchPage>
        </View>
    }

    const renderMyWordScene = (scene: { route: TabBarState }) => {
        //console.log("readerScene", scene.route);
        return <View style={{ flex: 1 }}>
            <MyWordPage></MyWordPage>
        </View>
    }
    const renderScene = SceneMap({
        Searchs: renderMySearchScene,
        Words: renderMyWordScene,
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
    return <View style={{ flex: 1 }}>
        <TabView
            lazy={false}
            navigationState={{
                index,
                routes,
            }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={onIndexChange}
        />
    </View>
}

export default MyPage;