import { Fragment, useEffect, useState } from "react";
import StartUp from "../instance/StartUp";
import { SearchResult, Gloss, WordMeaningExample, Word } from "../models/Word";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";
import { View, StyleSheet, Text, ScrollView } from "react-native";
import { HighlightableText } from "@cisiwen/react-native-highlightable-text";

export type WordDetailPagePopUpProps = {
    word: string;
}

const WordDetailPagePopUp = (props: WordDetailPagePopUpProps) => {
    let dbProvider = StartUp.getInstance<SQLiteDataProvider>();
    let [searchResult, setSearchResult] = useState<SearchResult<Gloss> | null>(null);
    let [loading, setLoading] = useState<boolean>(false);
    useEffect(() => {
        (async () => {
            if (props.word) {
                setLoading(true);
                let details = await dbProvider.searchPhrase(props.word);
                setLoading(false);
                if (details) {
                    setSearchResult(details);
                }
                else {
                    setSearchResult(null);
                }

            }
        })()
    }, ["test"]);

    const readerMeaning = (gloss: Gloss[] | undefined) => {
        return <View>
            <View style={[{ paddingBottom: 10, paddingTop: 10 }]}>
                <Text style={style.sectionText} >Meaning</Text>
            </View>
            {
                gloss && gloss?.length > 0 ? gloss.map((gloss, index) => {
                    return <View style={style.meaningItem} key={index}>
                        <Text style={style.meaningText}>{index + 1}. </Text>
                        <HighlightableText
                            style={style.meaningText}
                            onSelectionChange={(selection) => {
                                console.log("onSelectionChange", selection);

                            }}
                            onWordPress={(event) => { console.log("onWordPress", event) }}
                            onHighlightPress={(id) => { console.log("onHighlightPress", id) }}
                            onHighlightRectsCalculated={(rects) => { console.log("onHighlightRectsCalculated", rects) }}
                            value={gloss.gloss} highlights={[]} />
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
                        <HighlightableText
                            style={style.meaningText}
                            onSelectionChange={(selection) => {
                                console.log("onSelectionChange", selection);

                            }}
                            onWordPress={(event) => { console.log("onWordPress", event) }}
                            onHighlightPress={(id) => { console.log("onHighlightPress", id) }}
                            onHighlightRectsCalculated={(rects) => { console.log("onHighlightRectsCalculated", rects) }}
                            value={example.example} highlights={[]} />
                    </View>
                })

            }
        </View> : null;
    }

    return <View>
        {
            loading ? <Text>Loading...</Text> :

                <Fragment>
                    <View style={style.mainSearchWordContainer}>
                        <Text style={style.mainSearchWordText}>{searchResult?.word?.word}</Text>
                    </View>
                    <ScrollView style={style.detailMeaningContainer}>
                        {
                            searchResult ?
                                <Fragment>
                                    {readerMeaning(searchResult?.data)}
                                    {readerExample(searchResult?.data)}
                                </Fragment>
                                : <Text>No detail found</Text>
                        }
                    </ScrollView>
                </Fragment>
        }

    </View>

}

const style = StyleSheet.create({
    wordInnerMeaningContainer: {
        flex: 1,


        justifyContent: "flex-end"
    },
    wordInnerWrapperMeaningContainer: {
        flex: 0.5,
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
        alignItems: "flex-start"
    },
    meaningText: {
        fontSize: 25,
    },
    sectionText: {
        fontSize: 20,
        fontWeight: "bold"
    },
    detailMeaningContainer: {
        padding: 10,
    }
})

export default WordDetailPagePopUp