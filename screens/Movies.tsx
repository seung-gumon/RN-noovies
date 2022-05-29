import React, {useEffect, useMemo, useState, useTransition} from 'react';
import {ActivityIndicator, ScrollView, useColorScheme} from "react-native";
import {Dimensions} from 'react-native'
import styled from "styled-components/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Swiper from 'react-native-swiper';
import {makeImgPath} from "../utils";
import Slider, {Title, Vote} from "../components/Slider";
import Poster from "../components/Poster";



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


const ListTitle = styled.Text<{ isDark: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0,0,0,0.6)"};
  margin-left: 30px;
  margin-bottom: 10px;
`

const Movie = styled.View`
  margin-right: 20px;
  align-items: center;
`;


const {height: SCREEN_HEIGHT} = Dimensions.get("window");


const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = ({navigation: {navigate}}) => {

    const isDark = useColorScheme() === "dark";

    const [loading, setLoading] = useState(true);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [trending, setTrending] = useState([]);

    const getTrending = async () => {
        const {results} = await (await fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=en-US&page=1&region=KR`)).json();
        setTrending(results);
    }


    const getUpcoming = async () => {
        const {results} = await (await fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1&region=KR`)).json();
        setUpcoming(results);
    }


    const getNowPlaying = async () => {
        const {results} = await (await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1&region=KR`)).json();
        setNowPlayingMovies(results);
    }


    const getData = async () => {
        await Promise.all([getTrending(), getUpcoming(), getNowPlaying()])
        setLoading(false);
    }


    useEffect(() => {
        getData()
    }, [])


    useEffect(() => {
        console.log(trending)
    }, [trending])


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
                    containerStyle={{width: "100%", height: SCREEN_HEIGHT / 4, marginBottom: 30}}
                >
                    {
                        nowPlayingMovies.map((movie: any) => {
                            return (
                                <Slider key={movie.id}
                                        backdrop_path={makeImgPath(movie.backdrop_path)}
                                        original_title={movie.original_title}
                                        vote_average={movie.vote_average}
                                        overview={movie.overview}
                                        poster_path={movie.poster_path}
                                />
                            )
                        })
                    }
                </Swiper>
                <ListTitle isDark={isDark}>Trending Movies</ListTitle>
                <ScrollView
                    contentContainerStyle={{paddingLeft: 30}}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {trending?.map((movie: any) => {
                        return (
                            <Movie key={movie.id}>
                                <Poster path={makeImgPath(movie.poster_path)}/>
                                <Title isDark={isDark}>{movie.original_title.slice(0,13)}{movie.original_title.length > 13 && "..."}</Title>
                                <Vote isDark={isDark}>⭐️{movie.vote_average} / 10</Vote>
                            </Movie>
                        )
                    })
                    }
                </ScrollView>
            </Container>
        )
}


export default Movies