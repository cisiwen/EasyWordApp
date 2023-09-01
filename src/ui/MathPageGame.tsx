import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import Animated, {
    AnimatableValue,
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useFrameCallback,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';

import {
    Gesture,
    GestureDetector,
    GestureHandlerRootView,
    PanGestureHandler,
} from 'react-native-gesture-handler';
import React from "react";


const styles = StyleSheet.create({
    rootContainer: {
        flex: 1,
        backgroundColor: 'rgb(100,50,0)',
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: 'white',
        justifyContent: "flex-end",
        alignItems: "center"
    },
    canon: {
        borderRadius: 50,
        backgroundColor: "red",
        width: 50,
        height: 50,
        position: "absolute",
        bottom: 100,

    },
    arrow: {
        height: 1,
        backgroundColor: 'red',
        position: 'absolute',
    },
    ball: {
        position: 'absolute',
    },
    ballRectangle: {
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ballCircle: {
        backgroundColor: 'white',
        width: 18,
        height: 18,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ballText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    ballTextUnderline: {
        textDecorationLine: 'underline',
    },
    wall: {
        position: 'absolute',
        backgroundColor: 'green',
    },
    wallShadow: {
        position: 'absolute',
        backgroundColor: 'black',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
    },
    Answer: {
        width: "25%",
        height: "100%",
        ///backgroundColor: "red",
        borderRightWidth: 1,
        borderRightColor: "black",
        position: "relative",
        alignItems: "center",

    }
});





const Canon = () => {

    const x = useSharedValue(0);
    const y = useSharedValue(0);
    const eventHandler = useAnimatedGestureHandler({
        onStart: (event, ctx: { startX: number, startY: number }) => {
            ctx.startX = x.value;
            ctx.startY = y.value;
        },
        onActive: (event, ctx) => {
            //x.value = event.translationX + ctx.startX;
            y.value = Math.min(event.translationY + ctx.startY, 100);
            
        },
        onEnd: (event, ctx) => {
            //x.value = withSpring(0);
            if (event.translationY > 60) {
                y.value = withSpring(-650, {duration: (Math.abs((160 - Math.abs(event.translationY))) * 100)}, (finished?: boolean,
                    current?: AnimatableValue) => {
                        console.log(finished, current);
                });
            }
            else {
                y.value = withSpring(0);
            }
        },
    });

    const _style = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: x.value }, { translateY: y.value }],
        };
    });


    return (
        <PanGestureHandler onGestureEvent={eventHandler}>
            <Animated.View style={[styles.canon, _style]}>
                <Text>Drag me</Text>
            </Animated.View>
        </PanGestureHandler>
    );
}

const Answer = () => {
    return (
        <View style={styles.Answer}>
            <Text>Answer</Text>
            <Canon />
        </View>
    );
}



const MathPageGame = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <GestureHandlerRootView style={styles.rootContainer}>
                <View style={styles.content}>
                    <View style={{ flex: 1, width: "100%", flexDirection: "row" }}>
                        <Answer />
                        <Answer />
                        <Answer />
                        <Answer />
                    </View>
                </View>
            </GestureHandlerRootView>
        </SafeAreaView>
    );
}

export default MathPageGame;