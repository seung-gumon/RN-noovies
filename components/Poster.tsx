import React from 'react';
import styled from "styled-components/native";
import {makeImgPath} from "../utils";

interface IPoster {
    path: string;
}


const Poster: React.FC<IPoster> = ({path}) => {
    return <PosterImage source={{uri: makeImgPath(path)}}/>
}


const PosterImage = styled.Image`
  width: 100px;
  height: 160px;
  border-radius: 5px;
  background-color: rgba(255,255,255,0.5);
`

export default Poster