import { useEffect, useRef, useState } from "react";
import { TextInput, View, Text, StyleSheet } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { Button, Chip, Switch } from 'react-native-paper';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from "react-native-safe-area-context";

export enum MathOperator {
    Plus = "+",
    Minus = "-",
    Multiply = "x",
    Divide = "/",
}

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
    }
})
export type MathOperatorSelection = {
    operator: MathOperator;
    max: number;
    enabled: boolean;
}

export type UserAnswer = {
    number1: number;
    number2: number;
    operator: MathOperator;
    result: number;
    isCorrect: boolean;
}
const MathPage = () => {




    let [allSupportedOperators, setAllEnabledOperators] = useState<MathOperatorSelection[]>([
        { operator: MathOperator.Plus, max: 100, enabled: true },
        { operator: MathOperator.Minus, max: 100, enabled: true },
        { operator: MathOperator.Multiply, max: 10, enabled: true },
        { operator: MathOperator.Divide, max: 100, enabled: true },
    ]);
    let defaultOperator = allSupportedOperators[0];
    let [operator, setOperator] = useState<MathOperatorSelection>(defaultOperator);
    const getRandomInt = (mx: number | null = null) => {
        return Math.floor(Math.random() * ((mx ?? operator.max) - 1) + 1);
    }
    let [number1, setNumber1] = useState<number>(getRandomInt());
    let [number2, setNumber2] = useState<number>(getRandomInt());
    let [result, setResult] = useState<number | null>();
    let [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);


    let [isCorrect, setIsCorrect] = useState<boolean | null>(null);

    const sv = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${sv.value * 360}deg` }],
    }));

    const onChanged = (text: string) => {
        let newText = '';
        let numbers = '0123456789';

        for (var i = 0; i < text.length; i++) {
            if (numbers.indexOf(text[i]) > -1) {
                newText = newText + text[i];
            }
        }
        if (newText.length > 0) {
            setResult(parseInt(newText));
        }
        else {
            setResult(null);
        }
    }

    const newQuestion = () => {
        setResult(null);
        let allEnabledOperators = allSupportedOperators.filter(x => x.enabled);
        let operator = allEnabledOperators[getRandomInt(allEnabledOperators.length + 1) - 1];
        setOperator(operator);
        let number1 = getRandomInt(operator.max);
        let number2 = getRandomInt(operator.max);

        setNumber1(Math.max(number1, number2));
        setNumber2(Math.min(number1, number2));


    }
    const calculate = (): number => {

        switch (operator.operator) {
            case MathOperator.Plus:
                return number1 + number2;
            case MathOperator.Minus:
                return number1 - number2;
            case MathOperator.Multiply:
                return number1 * number2;
            case MathOperator.Divide:
                return number1 / number2;
        }
    }

    const startAnimation = () => {
        const duration = 2000;
        const easing = Easing.bezier(0.25, -0.5, 0.25, 1);
        sv.value = withRepeat(withTiming(1, { duration, easing }, () => {
            sv.value = 0;
            runOnJS(setIsCorrect)(null);
        }), -1);
    }

    const submitResult = () => {
        let computedResult = calculate();
        if (computedResult == result) {
            setIsCorrect(true);
            userAnswers.push({
                number1: number1,
                number2: number2,
                operator: operator.operator,
                result: result,
                isCorrect: true
            });
            setUserAnswers(userAnswers);
            newQuestion();
        }
        else {
            if (result && result.toString().length > 0) {
                userAnswers.push({
                    number1: number1,
                    number2: number2,
                    operator: operator.operator,
                    result: result,
                    isCorrect: false
                });
                setUserAnswers(userAnswers);
                setIsCorrect(false);
            }
            else {
                newQuestion();
            }
        }
        startAnimation();
    }

    const onOperatorSelectionChanged = (operator: MathOperatorSelection) => {
        allSupportedOperators.forEach(x => {
            if (x.operator == operator.operator) {
                x.enabled = operator.enabled;
                x.max = operator.max;
            }
        })
        setAllEnabledOperators(allSupportedOperators);
    }

    let _panel: SlidingUpPanel | null = null;

    return (
        <View style={style.topContainer}>
            <View style={[{
                width: "100%",
                padding: 10,
                alignItems: "flex-end",
                alignContent: "flex-end",
                justifyContent: "flex-end",
            }]}>
                <Ionicons onPress={() => {
                    _panel?.show();
                }} name="settings" size={24} color="black" />
            </View>
            <View style={[{ flex: 1 }]}>
                <Animated.View style={[style.emojiContainer, animatedStyle]}>
                    {isCorrect ? <Entypo name="emoji-happy" size={124} color="black" /> : null}
                    {isCorrect != null && !isCorrect ? <Entypo name="emoji-sad" size={124} color="black" /> : null}
                </Animated.View>
                <View style={style.mathFormContainer}>
                    <Text style={style.text}>{number1}{operator.operator}{number2}=</Text>
                    <TextInput
                        onChangeText={text => onChanged(text)}
                        value={result?.toString()}
                        style={[style.textInput]}
                    ></TextInput>
                </View>
                <View style={style.buttonContainer}>
                    <Button mode="contained" onPress={submitResult}>Submit</Button>
                </View>
                <View style={{flexDirection:"row"}}>
                    <Chip icon="bookmark-check">{userAnswers.filter((a)=>a.isCorrect).length}</Chip>
                    <Chip icon="sword-cross">{userAnswers.filter((a)=>!a.isCorrect).length}</Chip>
                    <Chip icon="history">{userAnswers.length}</Chip>
                </View>
            </View>
            <SlidingUpPanel backdropOpacity={0.8} containerStyle={[{ justifyContent: "flex-end" }]} ref={c => _panel = c}>
                <SafeAreaView style={style.settingContainer}>
                    <View>
                        <OperatorSelectionSetting onChange={onOperatorSelectionChanged} allSupportedOperator={allSupportedOperators}></OperatorSelectionSetting>
                        <Button onPress={() => _panel?.hide()}>close</Button>
                    </View>
                </SafeAreaView>
            </SlidingUpPanel>
        </View>
    );
}

const OperatorSelectionSettingItem = (props: { operator: MathOperatorSelection, onChange: (operator: MathOperatorSelection) => void }) => {
    let [isEnabled, setIsEnabled] = useState<boolean>(props.operator.enabled);
    let [max, setMax] = useState<number>(props.operator.max);

    return (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>{props.operator.operator}</Text>
            <Switch onValueChange={(e) => {
                setIsEnabled(e);
                props.onChange({ operator: props.operator.operator, enabled: e, max: max });

            }} value={isEnabled}>
            </Switch>
            <TextInput editable={isEnabled} style={style.textInput} onChange={(e) => {
                let value = parseInt(e.nativeEvent.text);
                if (value) {
                    setMax(value)
                    props.onChange({ operator: props.operator.operator, enabled: isEnabled, max: value });
                }
            }} value={max.toString()}></TextInput>
        </View>
    )
}
const OperatorSelectionSetting = (props: { allSupportedOperator: MathOperatorSelection[], onChange: (operator: MathOperatorSelection) => void }) => {
    //const allOperators = [MathOperator.Plus, MathOperator.Minus, MathOperator.Multiply, MathOperator.Divide];
    //let [selectedOperators, setSelectedOperators] = useState<MathOperator[]>([MathOperator.Plus, MathOperator.Minus, MathOperator.Multiply, MathOperator.Divide]);
    return (
        <View>
            <Text>Operator</Text>
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

export default MathPage;