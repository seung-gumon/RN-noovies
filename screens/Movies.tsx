import React, {useEffect, useMemo, useState, useTransition} from 'react';
import {ActivityIndicator, StyleSheet, Text, useColorScheme} from "react-native";
import {Dimensions} from 'react-native'
import styled from "styled-components/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Swiper from 'react-native-swiper';
import {makeImgPath} from "../utils";
import {BlurView} from "expo-blur";


interface IMovie {

}


const API_KEY = "c612e14da1356358b6c7e5ac139b9843";


const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.mainBgColor};
`

const View = styled.View`
  flex: 1;
`

const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
`;

const BgImg = styled.Image`
`


const Poster = styled.Image`
  width: 100px;
  height: 160px;
  border-radius: 5px;
`

const Title = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: white;
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

const OverView = styled.Text`
  margin-top: 15px;
  color: rgba(255, 255, 255, 0.6);
`


const Vote = styled(OverView)`
  margin-top: 5px;
  font-size: 12px;
`


const {height: SCREEN_HEIGHT} = Dimensions.get("window");


const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = ({navigation: {navigate}}) => {


    const [loading, setLoading] = useState(true);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);


    const isDark = useColorScheme() === "dark";


    useEffect(() => {
        (async () => {
            const {results} = await (await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`)).json();

            setNowPlayingMovies(results);
            setLoading(false);
        })()
    }, [])


    return loading ?
        <Loader>
            <ActivityIndicator/>
        </Loader>

        :
        (
            <Container>
                <Swiper
                    horizontal
                    loop
                    autoplay={true}
                    autoplayTimeout={3.5}
                    showsButtons={false}
                    showsPagination={false}
                    containerStyle={{width: "100%", height: SCREEN_HEIGHT / 4}}
                >
                    {
                        nowPlayingMovies.map((movie: any) => {
                            return (
                                <View key={movie.id}>
                                    <BgImg source={{uri: makeImgPath(movie.backdrop_path)}}
                                           style={StyleSheet.absoluteFill}/>
                                    <BlurView
                                        tint={isDark ? "dark" : "light"}
                                        intensity={40}
                                        style={StyleSheet.absoluteFill}>
                                        <Wrapper>
                                            <Poster source={{url: makeImgPath(movie.poster_path)}}/>
                                            <Column>
                                                <Title>{movie.original_title}</Title>
                                                <OverView>{movie.overview.slice(0, 80)}...</OverView>
                                                <Vote>⭐️{movie.vote_average} / 10</Vote>
                                            </Column>

                                        </Wrapper>
                                    </BlurView>
                                </View>
                            )
                        })
                    }
                </Swiper>
            </Container>
        )
}


export default Movies