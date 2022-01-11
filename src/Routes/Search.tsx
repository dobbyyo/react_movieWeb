import { useQuery } from "react-query";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";
import { getSearch, IGetSearch } from "../api/api";
import { makeImagePath } from "../api/utils";
import { AnimatePresence, motion } from "framer-motion";

const Wrapper = styled.div`
  overflow: hidden;
  /* width: 100%; */
  padding-bottom: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Loader = styled.div`
  margin-top: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.white.lighter};
  width: 100%;
  font-weight: bold;
  font-size: 30px;
`;
const Items = styled.div`
  padding-top: 80px;
  position: relative;
  width: 100%;
`;
const Item = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
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
const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -10,
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

function Search() {
  const history = useHistory();
  const location = useLocation();
  console.log(location);
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data, isLoading } = useQuery<IGetSearch>(["search", keyword], () =>
    getSearch(keyword || "")
  );
  console.log(data);
  const onBoxClicked = (searchId: number, media_type: string) => {
    if (media_type === "tv") {
      history.push(`/tv/${searchId}`);
    } else if (media_type === "movie") {
      history.push(`/movie/${searchId}`);
    } else {
      history.push(`/search?keword=${keyword}`);
    }
  };
  // console.log(onBoxClicked);
  return (
    <Wrapper>
      {!data?.results[0] ? (
        <Loader>검색 결과가 없습니다.</Loader>
      ) : (
        <>
          <AnimatePresence>
            <Items>
              <Item>
                {data?.results.map((search) => (
                  <Box
                    key={search.id}
                    variants={boxVariants}
                    transition={{ type: "tween" }}
                    whileHover="hover"
                    initial="normal"
                    bgphoto={makeImagePath(search.poster_path)}
                    onClick={() => onBoxClicked(search.id, search.media_type)}
                  >
                    <Info variants={infoVariants}>
                      <h4>
                        {search.name ? search.name : "제목이 없습니다..."}
                      </h4>
                    </Info>
                  </Box>
                ))}
              </Item>
            </Items>
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Search;
