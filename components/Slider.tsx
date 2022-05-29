import React from 'react';
import {makeImgPath} from "../utils";
import {StyleSheet, useColorScheme} from "react-native";
import {BlurView} from "expo-blur";
import styled from "styled-components/native";
import {View} from "react-native";

interface ISlider {
    backdrop_path : string | null
    poster_path : string
    original_title : string
    vote_average : number
    overview : string
}


const Slider: React.FC<ISlider> =
    ({
        backdrop_path,
        poster_path,
        original_title,
        vote_average,
        overview
     }) => {

    const isDark = useColorScheme() === "dark";

    return (
        <View style={{flex: 1}}>
            <BgImg source={{uri: backdrop_path ?? poster_path}}
                   style={StyleSheet.absoluteFill}/>
            <BlurView
                tint={isDark ? "dark" : "light"}
                intensity={60}
                style={StyleSheet.absoluteFill}>
                <Wrapper>
                    <Poster source={{uri: makeImgPath(poster_path)}}/>
                    <Column>
                        <Title isDark={isDark}>{original_title}</Title>
                        {vote_average > 0 ? (
                            <Vote isDark={isDark}>⭐️{vote_average} / 10</Vote>
                        ) : null}
                        {
                            overview ?
                                <OverView isDark={isDark}>{overview.slice(0, 80)}...</OverView> : null
                        }

                    </Column>

                </Wrapper>
            </BlurView>
        </View>
    )
}

export default Slider;


const BgImg = styled.Image`
`


const Poster = styled.Image`
  width: 100px;
  height: 160px;
  border-radius: 5px;
`

const Title = styled.Text<{ isDark: boolean }>`
  font-size: 16px;
  font-weight: 600;
  color: ${props => props.isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0,0,0,0.6)"};
`

const Wrapper = styled.View`

  flex-direction: row;
  height: 100%;
  justify-content: center;
  align-items: center;
`

const Column = styled.View`
  width: 40%;
  margin-left: 15px;
`

const OverView = styled.Text<{ isDark: boolean }>`
  margin-top: 15px;
  color: ${props => props.isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0,0,0,0.6)"};

`


const Vote = styled(OverView)`
  margin: 10px 0;
  font-size: 12px;
`
