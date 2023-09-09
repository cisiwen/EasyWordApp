import { ListRenderItemInfo, View, FlatList,StyleSheet, SectionList, SectionListData } from "react-native"
import StartUp from "../instance/StartUp";
import { UserDataService } from "../Service/UserDataService";
import { UserWord, UserWordGroup } from "../models/Word";
import { ReactElement, useEffect, useState } from "react";
import { Text, useTheme } from "react-native-paper";
import { Avatar, Card, IconButton,List } from 'react-native-paper';
const styles= StyleSheet.create({
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


const MyWordPage = () => {
    const { colors } = useTheme();
    const ItemSeparator = () => {
        return (
            <View style={[styles.separator, { backgroundColor: colors.primary }]} />
        );
    };
    let userDataService = StartUp.getInstance<UserDataService>(UserDataService.OBJECTID);
    let [myWords, setMyWords] = useState<UserWordGroup[]>([]);
    useEffect(() => {
        console.log("MyWordPage");
        userDataService.getUserWordsGroup("Terry").then((words) => {
            console.log("words", JSON.stringify(words));
            setMyWords(words);
        }).catch((error) => {
            console.log("error", error);
        });
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

    const renderSectionHeader = (info:{section: SectionListData<UserWord, UserWordGroup>}):ReactElement<any> => {
        return (
            <Card.Title 
                style={{backgroundColor: colors.primary}}
                titleStyle={{color: colors.background}}
                subtitleStyle={{color: colors.background}}
                subtitleVariant="bodyLarge"
                title={info.section.title}
                subtitle ={info.section.data.length.toString() + " words"}
                >
            </Card.Title>
        )
    }
    return <View>
        <SectionList 
            renderSectionHeader={renderSectionHeader}
            ItemSeparatorComponent={ItemSeparator}
            sections={myWords}
            keyExtractor={(item,index) => item.word + index}
            renderItem={renderItem}>
        </SectionList>
    </View>
}

const MyPage = () => {

    return <View>
        <MyWordPage></MyWordPage>
    </View>
}

export default MyPage;