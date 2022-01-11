import { useQuery } from "react-query";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import {
  getAiringTv,
  getPopularTv,
  getTopTv,
  getTvDetail,
  IGetDetail,
  IGetTvResult,
} from "../api/api";
import { makeImagePath } from "../api/utils";
import { useEffect, useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  padding-bottom: 200px;
  overflow: hidden;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px; ;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
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
const SliderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  /* background-color: red; */
  position: relative;
  top: -700px;
`;
const Slider = styled.div`
  padding-top: 600px;
  top: 0px;
  &:hover {
    ${Button} {
      opacity: 1;
    }
  }
`;
const Row = styled(motion.div)`
  position: absolute;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  margin-bottom: 80px;
`;
const SmallTitle = styled.div`
  color: white;
  font-size: 30px;
  font-weight: bold;
  margin-bottom: 20px;
`;
const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
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
  background-color: ${(props) => props.theme.black.lighter};
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
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigTv = styled(motion.div)`
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
  padding: 20px;
  font-size: 46px;
  position: absolute;
  bottom: 200px;
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
  /* height: 100%; */
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
    /* text-align: center; */
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
const CompanyLogo = styled.div<{ bgphoto: string }>`
  /* display: flex; */
  /* flex-direction: column; */
  width: 50px;
  height: 50px;
  border-radius: 50%;
  /* background-color: rgba(255, 255, 255, 0.5); */
  background-image: url(${(props) => props.bgphoto});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  margin-bottom: 10px;
`;
const BoxTitle = styled.span`
  color: rgba(255, 255, 222, 0.9);
  font-weight: bold;
  /* border-bottom: 1px solid white; */
`;
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

const offset = 6;

function Tv() {
  const history = useHistory();
  const bigTvMatch = useRouteMatch<{ tvId: string }>("/tv/:tvId");
  const { scrollY } = useViewportScroll();
  const { data: airTv, isLoading: airLoading } = useQuery<IGetTvResult>(
    ["tv", "airTv"],
    getAiringTv
  );
  // console.log(airTv);
  const { data: popularTv, isLoading: popularLoading } = useQuery<IGetTvResult>(
    ["tv", "popularTv"],
    getPopularTv
  );
  const { data: topTv, isLoading: topLoading } = useQuery<IGetTvResult>(
    ["tv", "topTv"],
    getTopTv
  );
  const { data: detailTv, isLoading: isLoadingDetail } = useQuery<IGetDetail>(
    ["tv", "detailTv", String(bigTvMatch?.params.tvId)],
    () => getTvDetail(String(bigTvMatch?.params.tvId) || "")
  );
  const isLoading = airLoading || popularLoading || topLoading;
  const [airIndex, setAirIndex] = useState(0);
  const [popularIndex, setPopularIndex] = useState(0);
  const [topIndex, setTopIndex] = useState(0);
  // console.log(upcomingMovie);
  const addIndex = (data: IGetTvResult | undefined, target: string) => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalTv = data.results.length - 1;
      const maxIndex = Math.floor(totalTv / offset) - 1;
      switch (target) {
        case "air":
          setAirIndex((cur) => (cur === maxIndex ? 0 : cur + 1));
          break;
        case "popular":
          setPopularIndex((cur) => (cur === maxIndex ? 0 : cur + 1));
          break;
        case "top":
          setTopIndex((cur) => (cur === maxIndex ? 0 : cur + 1));
          break;
        default:
          break;
      }
    }
  };

  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => setLeaving((prev) => !prev);
  const onBoxClicked = (tvId: number) => {
    history.push(`/tv/${tvId}`);
  };
  const onOverlayClick = () => history.push("/tv");

  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgphoto={makeImagePath(airTv?.results[0].backdrop_path || "")}
          >
            <Title>{airTv?.results[0].name}</Title>
            <Overview>{airTv?.results[0].overview}</Overview>
          </Banner>
          <SliderWrapper>
            <Slider>
              <SmallTitle>현재상영영화</SmallTitle>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={airIndex}
                >
                  {airTv?.results
                    // .slice(1)
                    .slice(offset * airIndex, offset * airIndex + offset)
                    .map((tv) => (
                      <Box
                        layoutId={tv.id + "air"}
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onBoxClicked(tv.id)}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(tv.poster_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                  <Button onClick={() => addIndex(airTv, "air")}>&gt;</Button>
                </Row>
              </AnimatePresence>
            </Slider>

            <Slider>
              <SmallTitle>인기영화</SmallTitle>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={popularIndex}
                >
                  {popularTv?.results
                    // .slice(1)
                    .slice(
                      offset * popularIndex,
                      offset * popularIndex + offset
                    )
                    .map((tv) => (
                      <Box
                        layoutId={tv.id + "popular"}
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onBoxClicked(tv.id)}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(tv.poster_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                  <Button onClick={() => addIndex(popularTv, "popular")}>
                    &gt;
                  </Button>
                </Row>
              </AnimatePresence>
            </Slider>

            <Slider>
              <SmallTitle>계봉예정영화</SmallTitle>
              <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
                <Row
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  transition={{ type: "tween", duration: 1 }}
                  key={topIndex}
                >
                  {topTv?.results
                    // .slice(1)
                    .slice(offset * topIndex, offset * topIndex + offset)
                    .map((tv) => (
                      <Box
                        layoutId={tv.id + "top"}
                        key={tv.id}
                        whileHover="hover"
                        initial="normal"
                        variants={boxVariants}
                        onClick={() => onBoxClicked(tv.id)}
                        transition={{ type: "tween" }}
                        bgphoto={makeImagePath(tv.poster_path, "w500")}
                      >
                        <Info variants={infoVariants}>
                          <h4>{tv.name}</h4>
                        </Info>
                      </Box>
                    ))}
                  <Button onClick={() => addIndex(topTv, "top")}>&gt;</Button>
                </Row>
              </AnimatePresence>
            </Slider>
          </SliderWrapper>

          <AnimatePresence>
            {bigTvMatch ? (
              <>
                <Overlay
                  onClick={onOverlayClick}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <BigTv
                  style={{ top: scrollY.get() + 100 }}
                  layoutId={bigTvMatch.params.tvId}
                >
                  {detailTv && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            detailTv.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{detailTv.title}</BigTitle>
                      <BigOverview>
                        줄거리 :{" "}
                        {detailTv.overview
                          ? detailTv.overview
                          : "줄거리가 존재하지 않습니다..."}
                      </BigOverview>
                      <Big>
                        <Biginfo>
                          <span>
                            <BoxTitle>등급 :</BoxTitle>
                            {detailTv?.adult
                              ? "청소년불가이용가"
                              : "전체이용가"}
                          </span>
                          <span>
                            <BoxTitle>개봉 날짜:</BoxTitle>{" "}
                            {detailTv?.release_date}
                          </span>
                          <span>
                            <BoxTitle>평점:</BoxTitle> {detailTv?.vote_average}
                          </span>
                        </Biginfo>
                        <BigCompany>
                          <BoxTitle>제작자:</BoxTitle>
                          {detailTv?.production_companies.map((a) => (
                            <CompanyLogo
                              bgphoto={makeImagePath(a.logo_path || "")}
                              key={a.id}
                            ></CompanyLogo>
                          ))}
                        </BigCompany>
                      </Big>
                    </>
                  )}
                </BigTv>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
