import { View, Text, StyleSheet, ScrollView, Button, FlatList, ListRenderItemInfo,SafeAreaView } from "react-native"
import { DefailHistory, Gloss, INavPageProps, SearchResult, Word, WordMeaningExample } from "../models/Word";
import { Fragment, useEffect, useRef, useState } from "react";
import StartUp from "../instance/StartUp";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";
import { useNavigation, NavigationProp } from '@react-navigation/native';
const WordDetailPage = (props: INavPageProps<Word>) => {
    let words: Readonly<DefailHistory> | undefined = props?.route?.params;
    let dbProvider = StartUp.getInstance<SQLiteDataProvider>(SQLiteDataProvider.OBJECTID);
    let [searchResult, setSearchResult] = useState<SearchResult<Gloss> | null>(null);
    let [popUpWord, setPopUpWord] = useState<string | null>(null);
    let word: Word | undefined = undefined;
    let navigator = useNavigation<NavigationProp<any>>();
    const searchDetail = async () => {
        if (words) {
            word = words?.words[words?.words.length - 1];
            if (word.id > 0) {
                let details = await dbProvider.getWordDetail(word);
                setSearchResult(details);
            }
            else if (word.word) {
                let details = await dbProvider.searchPhrase(word.word);
                if (details) {
                    setSearchResult(details);
                }
                else {
                    setSearchResult(null);
                }
            }
        }
    }
    useEffect(() => {
        words=props?.route?.params;
        console.log(new Date(),words);
        searchDetail();
    }, [words])

    const showSlidupPanelWithText = (selectedWord: string) => {
        console.log("selectedWord", selectedWord);
        let word: Word = {
            word: selectedWord,
            id: -1,
            phrase: 0,
            iscommon: 0,
            pronunc: undefined
        };
        words?.words.push(word);
        let newResults = JSON.parse(JSON.stringify(words));
        navigator.navigate("WordDetail", newResults);
        // setPopUpWord(selectedWord);
        //slideUpPanel?.show();
    }

    const renderText = (text: string) => {
        return text.split(" ").map((a, i) => {
            return <Text
                selectable={false}
                onPress={() => showSlidupPanelWithText(a)}
                style={style.meaningTextEach}
                key={i}>{a}
            </Text>
        })
    }
    const readerMeaning = (gloss: Gloss[] | undefined) => {
        return <View>
            <View style={[{ paddingBottom: 10, paddingTop: 10 }]}>
                <Text style={style.sectionText} >Meaning</Text>
            </View>
            {
                gloss && gloss?.length > 0 ? gloss.map((gloss, index) => {
                    return <View style={style.meaningItem} key={index}>
                        <Text style={style.meaningText}>{index + 1}. </Text>
                        {
                            renderText(gloss.gloss)
                        }
                    </View>
                }) : <Text>No detail found</Text>
            }
        </View>
    }

    const readerExample = (gloss: Gloss[] | undefined) => {

        let examples: WordMeaningExample[] | undefined = gloss?.reduce((prev: WordMeaningExample[], current: Gloss) => {
            if (current.example) {
                prev.push(...current.example);
            }
            return prev;
        }, []);

        return examples && examples.length > 0 ? <View>
            <View style={[{ paddingBottom: 10, paddingTop: 10 }]}>
                <Text style={style.sectionText} >Example</Text>
            </View>
            {

                examples?.map((example, index) => {
                    return <View style={style.meaningItem} key={`${index}-${index}`}>
                        <Text style={style.meaningText}>{index + 1}. </Text>
                        {
                            renderText(example.example)
                        }
                    </View>
                })

            }
        </View> : null;
    }

    const navigateToWordFromHistory = (word: Word) => {
        if (words?.words) {
            let index = words?.words.findIndex((w) => w.word == word.word);
            let newList = words?.words.slice(0, index + 1);
            let newResults: DefailHistory = { words: newList };
            navigator.navigate("WordDetail", newResults);
        }
    }
    const historyItemRenderer = (item: ListRenderItemInfo<Word>) => {
        return <Text onPress={() => navigateToWordFromHistory(item.item)} style={style.sectionText} key={item.index}>{item.item.word}/</Text>
    }
    const flatListRef = useRef<FlatList>(null);
    return <SafeAreaView style={{flex:1}}>{words != null ?
        <View style={[{ flex: 1 }]}>
            <View style={style.mainSearchWordContainer}>
                <FlatList
                    ref={flatListRef}
                    onContentSizeChange={() => flatListRef?.current?.scrollToEnd()}
                    scrollsToTop={false}
                    showsHorizontalScrollIndicator={false}
                    data={words?.words}
                    horizontal={true}
                    renderItem={historyItemRenderer}
                />
            </View>
            <ScrollView style={style.detailMeaningContainer}>
                {
                    searchResult ?
                        <Fragment>
                            {
                                readerMeaning(searchResult?.data)
                            }
                            {
                                readerExample(searchResult?.data)
                            }
                        </Fragment>
                        : <Text>No detail found</Text>
                }
                <View style={[{ height: 100 }]}></View>
            </ScrollView>
        </View> :
        <View style={style.detailMeaningContainer}><Text>Please set a word for search</Text></View>
    }</SafeAreaView>

}

const style = StyleSheet.create({
    wordInnerMeaningContainer: {
        flex: 1,
        justifyContent: "flex-end"
    },
    wordInnerWrapperMeaningContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    mainSearchWordContainer: {
        padding: 10,
        borderBottomColor: "black",
        borderBottomWidth: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    mainSearchWordText: {
        fontSize: 30,
    },
    meaningItem: {
        paddingTop: 5,
        padding: 10,
        paddingBottom: 5,
        paddingLeft: 0,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start"
    },
    meaningText: {
        fontSize: 25,
    },
    meaningTextEach: {
        fontSize: 25,
        marginRight: 5
    },
    sectionText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    detailMeaningContainer: {
        padding: 10,
    }
})

export default WordDetailPage