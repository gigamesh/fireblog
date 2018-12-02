import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import firebase from "firebase";
import config from "./hoverboardConfig";
import Editor from "./components/Editor";
import Register from "./components/Register";
import SignIn from "./components/SignIn";
import Home from "./components/Home";
import BlogPostRoute from "./components/BlogPostRoute";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./scss/index.css";
import "./App.css";

const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: "popup",
  signInSuccessUrl: "/editor",
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ]
};

////// FIREBASE SETUP

const settings = { timestampsInSnapshots: true };

const init = firebase.initializeApp(config);
const db = init.firestore();
db.settings(settings);

///////// APP

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      isSignedIn: false,
      windowSize: { x: window.innerWidth, y: window.innerHeight }
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.getSize);

    this.unregisterAuthObserver = init.auth().onAuthStateChanged(user => {
      this.setState({ isSignedIn: !!user });
    });
    db.collection("blog")
      .get()
      .then(snapShot => {
        let posts = [];
        snapShot.forEach(doc => {
          let post = doc.data();
          post._id = doc.id;
          posts.push(post);
        });
        this.setState({ posts });
      });
  }

  componentWillUnmount() {
    this.unregisterAuthObserver();
  }

  getSize = () => {
    const windowSize = {
      x: window.innerWidth,
      y: window.innerHeight
    };
    this.setState({
      windowSize
    });
  };

  render() {
    const { windowSize, registerSuccess, posts, isSignedIn } = this.state;
    return (
      <Router>
        <Switch>
          <Route
            path="/"
            exact
            render={() => (
              <Home db={db} windowSize={windowSize} posts={posts} />
            )}
          />
          <Route
            path="/register"
            exact
            render={() => (
              <Register
                register={this.register}
                registerSuccess={registerSuccess}
              />
            )}
          />
          <Route
            path="/signin"
            exact
            render={() => (
              <SignIn firebaseAuth={init.auth()} uiConfig={uiConfig} />
            )}
          />
          <Route
            path="/editor"
            exact
            render={() => (
              <Editor
                db={db}
                windowSize={windowSize}
                init={init}
                uiConfig={uiConfig}
                isSignedIn={isSignedIn}
              />
            )}
          />
          <Route
            path="/:post"
            render={() => (
              <BlogPostRoute db={db} windowSize={windowSize} posts={posts} />
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
