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
  padding: 0 50px;
  padding-bottom: 700px;
`;
const H1 = styled.div`
  /* background-color: gray; */
  padding: 80px 0;
  margin-top: 80px;
  font-size: 50px;
  font-weight: 600;
  color: ${(props) => props.theme.white.lighter};
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
const Slider = styled.div`
  position: relative;
  &:hover {
    ${Button} {
      opacity: 1;
    }
  }
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  position: absolute;
  width: 100%;
  /* padding: 60px; */
`;
const Box = styled(motion.div)<{ bgimg: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgimg});
  height: 500px;
  font-size: 66px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
    color: ${(props) => props.theme.white.lighter};
  }
`;
const Overlay = styled(motion.div)`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
  top: 0;
`;
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: scroll;
  background: linear-gradient(
    90deg,
    rgba(182, 62, 22, 1) 0%,
    rgba(230, 69, 21, 1) 48%,
    rgba(191, 167, 162, 1) 100%
  );
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
  position: relative;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 46px;
  position: absolute;
  /* bottom: 200px; */
  bottom: 50%;
  font-weight: bold;
`;
const BigOverview = styled.p`
  padding: 20px;
  color: ${(props) => props.theme.white.lighter};
  border-top: 1px solid red;
  box-shadow: 0px 3px 20px -8px red;
`;
const Big = styled.div`
  display: flex;
  font-size: 20px;
`;
const Biginfo = styled.div`
  height: 20px;
  width: 50%;
  color: ${(props) => props.theme.white.lighter};
  display: flex;
  flex-direction: column;
  span {
    margin-top: 10px;
    padding-top: 20px;
  }
`;
const BigCompany = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  height: 100%;
  padding-top: 20px;
  color: ${(props) => props.theme.white.lighter};
`;
const CompanyLogo = styled.div<{ bgimg: string }>`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-image: url(${(props) => props.bgimg});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  margin-bottom: 10px;
`;
const Title = styled.span`
  color: rgba(255, 255, 222, 0.9);
  font-weight: bold;
`;
const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const rowVariants = {
  hidden: {
    x: window.outerWidth + 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth - 5,
  },
};
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -80,
    transition: {
      delay: 0.5,
      duaration: 0.1,
      type: "tween",
    },
  },
};
const offset = 6;

function Home() {
  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/:movieId");
  const { data: nowPlayingMovies, isLoading } = useQuery<IGetMovieResult>(
    ["movies", "nowPlaying"],
    getMovies
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const toggleLeaving = () => setLeaving((cur) => !cur);
  const increaseIndex = () => {
    if (nowPlayingMovies) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = nowPlayingMovies.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((cur) => (cur === maxIndex ? 0 : cur + 1));
    }
  };
  const onBoxClicked = (movieId: number) => {
    history.push(`/${movieId}`);
  };
  //   const bigMovieMatch = useRouteMatch<{ movieId: string }>("/movies/:movieId");
  const { scrollY } = useViewportScroll();
  const onOverlayClick = () => history.push("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    nowPlayingMovies?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );

  const { data: detailMovies, isLoading: isLoadingDetail } =
    useQuery<IGetDetail>(
      ["movies", "detailMovies", String(bigMovieMatch?.params.movieId)],
      () => getMovieDetail(String(bigMovieMatch?.params.movieId) || "")
    );
  // console.log(detailMovies);
  useEffect(() => {
    const timer = setInterval(() => {
      increaseIndex();
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Wrapper>
      {isLoading ? (
        <div>loading</div>
      ) : (
        <>
          <H1 onClick={increaseIndex}>
            최신영화, 드라마, 애니까지!!
            <br />
            <span style={{ color: "red" }}>도비플릭스</span>
            에서 보세요!
          </H1>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {nowPlayingMovies?.results
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      whileHover="hover"
                      initial="normal"
                      variants={boxVariants}
                      onClick={() => onBoxClicked(movie.id)}
                      transition={{ type: "tween" }}
                      bgimg={makeImagePath(movie.poster_path || "")}
                    >
                      <Info variants={infoVariants}>
                        <h4>
                          {movie.title ? movie.title : "제목이 없습니다..."}
                        </h4>
                      </Info>
                    </Box>
                  ))}
                <Button onClick={() => increaseIndex()}>&gt;</Button>
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {bigMovieMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigMovie
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigMovieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>
                        줄거리 : {clickedMovie.overview}
                      </BigOverview>
                      <Big>
                        <Biginfo>
                          <span>
                            <Title>등급 :</Title>
                            {detailMovies?.adult
                              ? "청소년불가이용가"
                              : "전체이용가"}
                          </span>
                          <span>
                            <Title>개봉 날짜:</Title>{" "}
                            {detailMovies?.release_date}
                          </span>
                          <span>
                            <Title>평점:</Title> {detailMovies?.vote_average}
                          </span>
                        </Biginfo>
                        <BigCompany>
                          <Title>제작자:</Title>
                          {detailMovies?.production_companies.map((a) => (
                            <CompanyLogo
                              bgimg={makeImagePath(a.logo_path || "")}
                              key={a.id}
                            ></CompanyLogo>
                          ))}
                        </BigCompany>
                      </Big>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Home;
