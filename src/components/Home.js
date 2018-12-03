import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { ClipLoader } from "react-spinners";
import media from "../mediaqueries";

const LoaderWrap = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  font-size: 4em;
`;

const EditBtn = styled(Link)`
  opacity: 0.4;
  i {
    font-size: 2em;
    padding: 10px;
  }
  box-shadow: none;
  &:hover {
    box-shadow: none;
    opacity: 0.7;
  }
`;

const PageWrap = styled.div`
  position: relative;
  left: 4%;
  width: 95%;
  max-width: 600px;
  margin: 0 auto;
  ul {
    margin: 0;
    padding: 0;
  }
  li {
    list-style-type: none;
    margin-bottom: 10px;
  }
  p {
    margin: 0;
  }
  ${media.portrait.sm`
    left: 0
  `}
`;

const Header = styled.h1`
  font-weight: 500;
  font-size: 5em;
  margin: 0.6em 0;
  span {
    font-size: 0.9em;
  }
  ${media.portrait.sm`
    font-size: 3em;
  `}
`;

const PostTitle = styled.li`
  margin-left: 1em;
  text-indent: -1em;
  span {
    font-size: 1.5em;
  }
  strong {
    font-size: 1.5em;
    font-weight: 500;
  }
  ${media.portrait.sm`
    span {
      font-size: 1.2em;
  }
    strong {
      font-size: 1.2em;
      font-weight: 500;
    }
  `}
`;

class Home extends React.Component {
  state = {
    posts: []
  };

  componentDidMount() {
    this.props.db
      .collection("blog")
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
  changeActiveItem = activeItemIndex => this.setState({ activeItemIndex });

  render() {
    const { posts } = this.state;
    return !posts.length ? (
      <LoaderWrap>
        <span role="img" aria-label="fire">
          🔥
        </span>
        <ClipLoader size={50} />
      </LoaderWrap>
    ) : (
      <React.Fragment>
        <EditBtn to="/editor">
          <i class="fas fa-edit" />
        </EditBtn>
        <PageWrap>
          <Header>
            Fireblog{" "}
            <span role="img" aria-label="fire">
              🔥
            </span>
          </Header>
          <ul>
            {posts.reverse().map(post => (
              <PostTitle key={post.time}>
                <Link to={post.source}>
                  <span>{post.published.replace(/-/g, ".")}</span>
                  {" - "}
                  <strong>{post.title}</strong>
                </Link>
              </PostTitle>
            ))}
          </ul>
        </PageWrap>
      </React.Fragment>
    );
  }
}

export default Home;
