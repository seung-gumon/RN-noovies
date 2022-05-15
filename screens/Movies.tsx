import React from 'react';
import {Text} from "react-native";
import styled from "styled-components/native";
import {NativeStackScreenProps} from "@react-navigation/native-stack";

const Btn = styled.View<any>`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: white;
  background-color: ${props => props.theme.mainBgColor};
`;


const Movies: React.FC<NativeStackScreenProps<any, "Movies">> = ({navigation: {navigate}}) => (
    <Btn onPress={() => navigate("Stack", {screen: "Three"})}
         style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Movies</Text>
    </Btn>
)

export default Movies