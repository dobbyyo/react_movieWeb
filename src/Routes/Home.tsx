import styled from "styled-components";
import { AnimatePresence, motion, useViewportScroll } from "framer-motion";
import { makeImagePath } from "../api/utils";
import { useQuery } from "react-query";
import {
  getMovieDetail,
  getMovies,
  IGetDetail,
  IGetMovieResult,
} from "../api/api";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  color: black;
`;
const WrapperOk = styled.img`
  background-color: white;
  /* height: 100%; */
  width: inherit;
  max-width: 100%;
  height: auto;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  position: relative;
`;
const H1 = styled.div`
  position: absolute;
  padding: 80px 0;
  margin-top: 80px;
  font-size: 70px;
  margin-left: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.white.lighter};
  @media only screen and (max-width: 900px) {
    font-size: 40px;
  }
`;
const Button = styled.button`
  position: absolute;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  right: 0;
  color: white;
  font-size: 50px;
  opacity: 0;
`;

function Home() {
  const { data: nowPlayingMovies, isLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  return (
    <Wrapper>
      {isLoading ? (
        <div>loading</div>
      ) : (
        <>
          {/* <Wrapper> */}
          <WrapperOk
            src={makeImagePath(nowPlayingMovies?.results[0].poster_path || "")}
            alt="bgImg"
          />
          <H1>
            최신영화, 드라마, 애니까지!!
            <br />
            <span style={{ color: "red" }}>도비플릭스</span>
            에서 보세요!
          </H1>
          {/* </Wrapper> */}
        </>
      )}
    </Wrapper>
  );
}
export default Home;
