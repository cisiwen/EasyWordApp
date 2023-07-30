import { View, Text, StyleSheet, ScrollView } from "react-native"
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Gloss, INavPageProps, SearchResult, Word, WordMeaningExample } from "../models/Word";
import { useEffect, useState } from "react";
import StartUp from "../instance/StartUp";
import SQLiteDataProvider from "../provider/SQLiteDataProvider";
import { SelectableText } from "@alentoma/react-native-selectable-text";
const WordDetailPage = (props: INavPageProps<Word>) => {
    let word: Readonly<Word> | undefined = props?.route?.params;
    let dbProvider = StartUp.getInstance<SQLiteDataProvider>();
    let [searchResult, setSearchResult] = useState<SearchResult<Gloss>|null>(null);

    const searchDetail = async () => {
        if (word) {
            let details = await dbProvider.getWordDetail(word);
            setSearchResult(details);
        }
    }
    useEffect(() => {
        console.log(new Date());
        searchDetail();
    },["hello"])
    
    

    const readerMeaning = (gloss: Gloss[] | undefined) => {
        return <View>
            <View style={[{ paddingBottom: 10, paddingTop: 10 }]}>
                <Text style={style.sectionText} >Meaning</Text>
            </View>
            {
                gloss && gloss?.length > 0 ? gloss.map((gloss, index) => {
                    return <View style={style.meaningItem} key={index}>
                        <Text style={style.meaningText}>{index + 1}. </Text>
                        <Text selectable={true} selectionColor="orange" style={style.meaningText}>{gloss.gloss}</Text>
                        <SelectableText
                            prependToChild={null}
                            onSelection={({ eventType, content, selectionStart, selectionEnd }) => {}}
                            menuItems={["Copy", "Search", "Share"]}
                            style={style.meaningText}
                            value={gloss.gloss}
                         ></SelectableText>
                    </View>
                }) : <Text>No detail found</Text>
            }
        </View>
    }

    const readerExample = (gloss: Gloss[] | undefined) => {

        let examples: WordMeaningExample[]|undefined = gloss?.reduce((prev: WordMeaningExample[], current: Gloss) => {
            if (current.example) {
                prev.push(...current.example);
            }
            return prev;
        }, []);
       
        return examples && examples.length>0 ? <View>
            <View style={[{ paddingBottom: 10, paddingTop: 10 }]}>
                <Text style={style.sectionText} >Example</Text>
            </View>
            {

                examples?.map((example, index) => {
                    return <View style={style.meaningItem} key={`${index}-${index}`}>
                        <Text style={style.meaningText}>{index + 1}. </Text>
                        <Text selectable={true} selectionColor="orange" style={style.meaningText}>{example.example}</Text>
                    </View>
                })

            }
        </View> : null;
    }
    return word != null ?
        <View>
            <View style={style.mainSearchWordContainer}>
                <Text style={style.mainSearchWordText}>{word.word}</Text>
            </View>
            <ScrollView style={style.detailMeaningContainer}>
                {
                    readerMeaning(searchResult?.data)
                }
                {
                    readerExample(searchResult?.data)
                }
                <View style={[{height:100}]}></View>
            </ScrollView>
        </View> :
        <View style={style.detailMeaningContainer}><Text>Please set a word for search</Text></View>

}

const style = StyleSheet.create({
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
        fontSize: 18,
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