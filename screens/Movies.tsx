import React, {useEffect, useMemo, useState, useTransition} from 'react';
import {ActivityIndicator, StyleSheet, Text, useColorScheme} from "react-native";
import {Dimensions} from 'react-native'
import styled from "styled-components/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Swiper from 'react-native-swiper';
import {makeImgPath} from "../utils";

import Slider from "../components/Slider";





const API_KEY = "c612e14da1356358b6c7e5ac139b9843";


const Container = styled.ScrollView`
  background-color: ${(props) => props.theme.mainBgColor};
`


const Loader = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.mainBgColor};
`;


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
                                <Slider key={movie.id}
                                        backdrop_path={makeImgPath(movie.backdrop_path)}
                                        original_title={movie.original_title}
                                        vote_average={movie.vote_average}
                                        overview={movie.overview}
                                        poster_path={makeImgPath(movie.poster_path)}
                                />
                            )
                        })
                    }
                </Swiper>
            </Container>
        )
}


export default Movies