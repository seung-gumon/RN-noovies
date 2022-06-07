import React, {useEffect, useMemo, useState, useTransition} from 'react';
import {ActivityIndicator, FlatList, RefreshControl, ScrollView, useColorScheme, View, Text} from "react-native";
import {Dimensions} from 'react-native'
import styled from "styled-components/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";
import Swiper from 'react-native-swiper';
import {makeImgPath} from "../utils";
import Slider, {Title, Vote} from "../components/Slider";
import Poster from "../components/Poster";


const API_KEY = "c612e14da1356358b6c7e5ac139b9843";


const Container = styled.FlatList`
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
  margin-left: 15px;
  margin-bottom: 10px;
`

const Movie = styled.View`

  align-items: center;
`;

const ListContainer = styled.View`
  margin-bottom: 40px;
`

const HMovie = styled.View`
  flex-direction: row;
  padding: 0 0 0 20px;
`

const HColumn = styled.View`
  margin-left: 15px;
  width: 80%;
  margin-vertical: 10px;
`

const OverView = styled.Text<{ isDark: boolean }>`
  color: ${props => props.isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0,0,0,0.6)"};
  width: 80%;
`

const Release = styled.Text<{ isDark: boolean }>`
  color: ${props => props.isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0,0,0,0.6)"};
  font-size: 12px;
  margin-vertical: 10px;
`

const ComingSoonTitle = styled(ListTitle)`
  margin-bottom: 30px;
`


const {height: SCREEN_HEIGHT} = Dimensions.get("window");


const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = ({navigation: {navigate}}) => {

    const isDark = useColorScheme() === "dark";

    const [refreshing, setRefreshing] = useState(false);
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


    const onRefresh = async () => {
        setRefreshing(true);
        await getData();
        setRefreshing(false);
    }


    useEffect(() => {
        getData()
    }, [])


    return loading ?
        <Loader>
            <ActivityIndicator/>
        </Loader>

        :
        (
            <Container
                onRefresh={onRefresh}
                refreshing={refreshing}
                data={upcoming}
                ListHeaderComponent={
                    <>

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
                        <ListContainer>
                            <ListTitle isDark={isDark}>Trending Movies</ListTitle>
                            <FlatList
                                data={trending}
                                horizontal={true}
                                keyExtractor={(item) => item.id + ""}
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{paddingHorizontal: 20}}
                                ItemSeparatorComponent={() => (
                                    <View style={{width: 20}}/>
                                )}
                                renderItem={({item: movie}: any) => (
                                    <Movie key={movie.id}>
                                        <Poster path={makeImgPath(movie.poster_path)}/>
                                        <Title
                                            isDark={isDark}>{movie.original_title.slice(0, 10)}{movie.original_title.length > 10 && "..."}</Title>
                                        <Vote isDark={isDark}>⭐️{movie.vote_average} / 10</Vote>
                                    </Movie>
                                )}/>
                        </ListContainer>
                        <ComingSoonTitle isDark={isDark}>Coming Soon</ComingSoonTitle>
                    </>
                }
                keyExtractor={(item) => item.id + ""}
                ItemSeparatorComponent={() => <View style={{height: 13}}/>}
                renderItem={({item: movie}: any) => (
                    <HMovie key={movie.id}>
                        <Poster path={movie.poster_path}/>
                        <HColumn>
                            <Title isDark={isDark}>
                                {movie.original_title}{movie.original_title.length > 10 && "..."}
                            </Title>
                            <OverView isDark={isDark}>
                                {
                                    movie.overview !== "" && movie.overview.length > 10 ?
                                        `${movie.overview.slice(0, 120)}...`
                                        :
                                        movie.overview
                                }
                            </OverView>
                            <Release isDark={isDark}>
                                Coming : {new Date(movie.release_date).toLocaleDateString('ko', {
                                month: "long",
                                day: "numeric",
                                year: "numeric"
                            })}
                            </Release>
                        </HColumn>
                    </HMovie>
                )}>


            </Container>
        )
}


export default Movies