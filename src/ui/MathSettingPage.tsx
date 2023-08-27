import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Switch, TextInput, View, Text, StyleSheet, SafeAreaView as RNSafeAreaView, Platform } from "react-native";
import { Button } from "react-native-paper";
import { INavPageProps } from "../models/Word";
import { MathOperatorSelection } from "./MathPage";
import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
const style = StyleSheet.create({
    topContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    mathFormContainer: {
        flexDirection: "row",
    },
    text: {
        fontSize: 30,
    },
    buttonContainer: {
        padding: 20
    },
    emojiContainer: {
        padding: 20
    },
    textInput: {
        width: 60,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 5,
        padding: 2,
        fontSize: 20,
    },
    settingContainer: {
        padding: 20,
        backgroundColor: "white",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flex: 0.5
    },
    columnHeader: {
        fontWeight: "bold",

    }
})
const OperatorSelectionSettingItem = (props: { operator: MathOperatorSelection, onChange: (operator: MathOperatorSelection) => void }) => {
    let [isEnabled, setIsEnabled] = useState<boolean>(props.operator.enabled);
    let [number1Max, setNumber1Max] = useState<number>(props.operator.number1Max);
    let [number2Max, setNumber2Max] = useState<number>(props.operator.number2Max);
    return (
        <View style={{ flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 10 }}>
            <Text style={{ flex: 0.3 }}>{props.operator.operatorText ?? props.operator.operator}</Text>
            <View style={{ flex: 0.2 }}>
                <Switch onValueChange={(e) => {
                    setIsEnabled(e);
                    props.onChange({ operator: props.operator.operator, enabled: e, number1Max: number1Max, number2Max: number2Max });

                }} value={isEnabled}>
                </Switch>
            </View>
            <View style={{ flex: 0.25 }}>
                <TextInput editable={isEnabled} style={style.textInput} onChange={(e) => {
                    let value = parseInt(e.nativeEvent.text);
                    if (value) {
                        setNumber1Max(value)
                        props.onChange({ operator: props.operator.operator, enabled: isEnabled, number1Max: value, number2Max: number2Max });
                    }
                }} value={number1Max.toString()}></TextInput>
            </View>
            <View style={{ flex: 0.25 }}>
                <TextInput editable={isEnabled} style={style.textInput} onChange={(e) => {
                    let value = parseInt(e.nativeEvent.text);
                    if (value) {
                        setNumber2Max(value)
                        props.onChange({ operator: props.operator.operator, enabled: isEnabled, number1Max: number1Max, number2Max: value });
                    }
                }} value={number2Max.toString()}></TextInput>
            </View>
        </View>
    )
}
const OperatorSelectionSetting = (props: { allSupportedOperator: MathOperatorSelection[], onChange: (operator: MathOperatorSelection) => void }) => {
    //const allOperators = [MathOperator.Plus, MathOperator.Minus, MathOperator.Multiply, MathOperator.Divide];
    //let [selectedOperators, setSelectedOperators] = useState<MathOperator[]>([MathOperator.Plus, MathOperator.Minus, MathOperator.Multiply, MathOperator.Divide]);
    return (
       
            <View style={{ padding: 20 }}>
                <View style={{ flexDirection: "row", width: "100%", marginBottom: 10 }}>
                    <View style={{ flex: 0.3 }}>
                        <Text style={[style.columnHeader]}>Operator</Text>
                    </View>
                    <View style={{ flex: 0.2 }}></View>
                    <View style={{ flex: 0.25 }}>
                        <Text style={[style.columnHeader]}>Number1 max</Text>
                    </View>
                    <View style={{ flex: 0.25 }}>
                        <Text style={[style.columnHeader]}>Number2 max</Text>
                    </View>
                </View>
                <View>
                    {props.allSupportedOperator.map((operator, index) => {
                        return (
                            <View key={index} style={{ width: "100%" }}>
                                <OperatorSelectionSettingItem
                                    operator={operator}
                                    onChange={props.onChange}
                                ></OperatorSelectionSettingItem>
                            </View>
                        )
                    })
                    }
                </View>
            </View>
        
    );
}

const MathSettingPage = (props: INavPageProps<any>) => {

    let navigation = useNavigation<NavigationProp<any>>();
    let [allSupportedOperators, setAllEnabledOperators] = useState<MathOperatorSelection[]>(props?.route?.params?.allSupportedOperators);
    useEffect(() => {

    });
    const onOperatorSelectionChanged = (operator: MathOperatorSelection) => {
        allSupportedOperators.forEach(x => {
            if (x.operator == operator.operator) {
                x.enabled = operator.enabled;
                x.number1Max = operator.number1Max;
                x.number2Max = operator.number2Max;
            }
        })
        setAllEnabledOperators(allSupportedOperators);
    };

    const saveChange = () => {
        navigation.navigate("Math", { updated: allSupportedOperators });
    }
    return <SafeAreaView style={{ flex: 1, paddingTop: Platform?.OS=="android" ? 40 :0 }}>
        <OperatorSelectionSetting allSupportedOperator={allSupportedOperators} onChange={onOperatorSelectionChanged}></OperatorSelectionSetting>
    </SafeAreaView>

}

export default MathSettingPage;