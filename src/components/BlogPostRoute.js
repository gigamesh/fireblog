import React from "react";
import styled from "styled-components";
import { withRouter, Redirect } from "react-router-dom";
import BottomCarousel from "./BottomCarousel";
import BlogPost from "./BlogPost";
import { ClipLoader } from "react-spinners";

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Header = styled.h1`
  font-weight: 500;
  font-size: 3em;
  margin: 0.6em 0;
`;

class Home extends React.Component {
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname)
      window.scrollTo(0, 0);
  }

  render() {
    const { posts, windowSize, location } = this.props;
    let postIndex;
    const post = posts.filter((post, i) => {
      if (post.source === location.pathname) {
        postIndex = i;
        return true;
      }
    })[0];
    // console.log("postIndex", postIndex);
    return (
      <React.Fragment>
        {!post && <Redirect to="/" />}
        {!posts.length ? (
          <Wrapper>
            <Header>
              Fireblog{" "}
              <span role="img" aria-label="fire">
                🔥
              </span>
            </Header>
            <ClipLoader size={50} />
          </Wrapper>
        ) : (
          <React.Fragment>
            <BlogPost post={post} />
            <BottomCarousel
              posts={posts}
              windowSize={windowSize}
              postIndex={postIndex}
            />
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default withRouter(Home);
