import {
  BrowserRouter as Router,
  Switch,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Header from "./Components/Header";
import Home from "./Routes/Home";
import Movie from "./Routes/Movie";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL + "/"}>
      <Router>
        <Header />
        <Switch>
          <Route path={["/search", "/search/:searchId"]}>
            <Search />
          </Route>
          <Route path={["/tv", "/tv/:tvId"]}>
            <Tv />
          </Route>
          <Route path={["/movie", "/movie/:movieId"]}>
            <Movie />
          </Route>
          <Route path={["/", "/:movieId"]}>
            <Home />
          </Route>
        </Switch>
      </Router>
    </BrowserRouter>
  );
}

export default App;
