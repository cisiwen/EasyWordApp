import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { TextInput, View, Text, StyleSheet, Alert } from "react-native";
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
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { INavPageProps } from "../models/Word";

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
    },
    columnHeader: {
        fontWeight: "bold",

    }
})
export type MathOperatorSelection = {
    operator: MathOperator;
    number1Max: number;
    number2Max: number;
    enabled: boolean;
    operatorText?: string;
}

export type UserAnswer = {
    number1: number;
    number2: number;
    operator: MathOperator;
    result: number;
    isCorrect: boolean;
}
const MathPage = (props: INavPageProps<any>) => {
    let navigation = useNavigation<NavigationProp<any>>();
    let [allSupportedOperators, setAllEnabledOperators] = useState<MathOperatorSelection[]>([
        { operator: MathOperator.Plus, number1Max: 100, number2Max: 100, enabled: true, operatorText: "Addition" },
        { operator: MathOperator.Minus, number1Max: 100, number2Max: 100, enabled: true, operatorText: "Subtraction" },
        { operator: MathOperator.Multiply, number1Max: 10, number2Max: 20, enabled: true, operatorText: "Multiplication" },
        { operator: MathOperator.Divide, number1Max: 100, number2Max: 20, enabled: true, operatorText: "Division" },
    ]);

     
    let optionSeted = false;
    useEffect(() => {
        if (!optionSeted) {
            props?.navigation?.setOptions({
                headerRight: () => {
                    return <Ionicons onPress={() => {
                        navigation.navigate("MathSetting", { allSupportedOperators });
                    }} name="settings" size={24} color="black" />
                }
            });
            optionSeted = true;
        }
        if(props?.route?.params?.updated){
            setAllEnabledOperators(props?.route?.params?.updated);
        }
    })
    let defaultOperator = allSupportedOperators[0];
    let [operator, setOperator] = useState<MathOperatorSelection>(defaultOperator);
    const getRandomInt = (mx: number) => {
        return Math.floor(Math.random() * (mx - 1) + 1);
    }
    let [number1, setNumber1] = useState<number>(getRandomInt(defaultOperator.number1Max));
    let [number2, setNumber2] = useState<number>(getRandomInt(defaultOperator.number2Max));
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
        let number1 = getRandomInt(operator.number1Max);
        let number2 = getRandomInt(operator.number2Max);

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
                newQuestion();
            }
            else {
                newQuestion();
            }
        }
        startAnimation();
    }

   

    const settingCallback = () => {
        Alert.alert("Setting callback");
    }
    let _panel: SlidingUpPanel | null = null;

    return (
        <View style={style.topContainer}>
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
                <View style={{ flexDirection: "row" }}>
                    <Chip icon="bookmark-check">{userAnswers.filter((a) => a.isCorrect).length}</Chip>
                    <Chip icon="sword-cross">{userAnswers.filter((a) => !a.isCorrect).length}</Chip>
                    <Chip icon="history">{userAnswers.length}</Chip>
                </View>
            </View>
        </View>
    );
}



export default MathPage;