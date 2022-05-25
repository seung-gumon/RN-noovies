import React, {useEffect, useMemo, useState, useTransition} from 'react';
import {ActivityIndicator, StyleSheet, Text} from "react-native";
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

const Title = styled.Text`
    color: ${(props) => props.theme.textColor};
`

const {height: SCREEN_HEIGHT} = Dimensions.get("window");




const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = ({navigation: {navigate}}) => {


    const [loading, setLoading] = useState(true);
    const [nowPlayingMovies, setNowPlayingMovies] = useState([]);


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
                <Swiper loop={true}
                        autoplay={true}
                        dot={<View style={{display:'none'}}/>}
                        activeDot={<View style={{display: 'none'}}/>}
                        containerStyle={{width: "100%", height: SCREEN_HEIGHT / 4}}>
                    {
                        nowPlayingMovies.map((movie : any) => {
                            return (
                                <View key={movie.id}>
                                    <BgImg source={{uri : makeImgPath(movie.backdrop_path)}} style={StyleSheet.absoluteFill}/>
                                    <BlurView
                                        intensity={40}
                                        style={StyleSheet.absoluteFill}>
                                        <Title>{movie.original_title}</Title>
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