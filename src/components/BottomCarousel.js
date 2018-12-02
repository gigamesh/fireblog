import React from "react";
import { Link } from "react-router-dom";
import Color from "color";
import moment from "moment";
import styled from "styled-components";
import ItemsCarousel from "react-items-carousel";
import Divider from "./Divider";

const mainColor = Color.rgb(40, 40, 40);

const BottomWrap = styled.div`
  width: ${({ mobile }) => (mobile ? "85%" : "calc(100% - 100px)")};
  max-width: 1000px;
  margin: ${({ mobile }) => (mobile ? "30px auto 40px" : "60px auto 80px")};
  padding: ${({ mobile }) => (mobile ? 0 : "0 10px")};
`;

const Card = styled.div`
  position: relative;
  color: white;
  height: 220px;
  background: #ccc;
  user-select: none;
  background: url('${({ img }) => img}');
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 5px;
`;

const Overlay = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  transition: background-color 150ms;
  border-radius: 5px;
  &:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }
  h3 {
    font-size: 1.5em;
    font-weight: 500;
    transition: color 150ms;
    margin: 0;
  }
`;

const Chev = styled.i`
  font-size: 3em;
  color: ${mainColor.hex()};
  &:hover {
    color: ${mainColor.lighten(1).hex()};
  }
`;

class BottomCarousel extends React.Component {
  state = {
    activeItemIndex: 0
  };

  componentDidMount() {
    this.setState({ activeItemIndex: this.props.postIndex + 1 });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.postIndex !== this.props.postIndex) {
      this.setState({ activeItemIndex: this.props.postIndex + 1 });
    }
  }

  changeActiveItem = activeItemIndex => this.setState({ activeItemIndex });

  render() {
    const { activeItemIndex } = this.state;
    const { posts, windowSize, postIndex } = this.props;
    // console.log(activeItemIndex);
    return windowSize.x > 600 ? (
      <BottomWrap>
        <Divider>Previous Blog Posts</Divider>
        <ItemsCarousel
          enablePlaceholder
          numberOfPlaceholderItems={3}
          slidesToScroll={2}
          minimumPlaceholderTime={500}
          placeholderItem={<Card>Loading...</Card>}
          springConfig={{ stiffness: 180, damping: 20 }}
          numberOfCards={windowSize.x < 900 ? 2 : 3}
          gutter={24}
          firstAndLastGutter={false}
          showSlither={false}
          freeScrolling={false}
          requestToChangeActive={this.changeActiveItem}
          activeItemIndex={activeItemIndex}
          activePosition={"left"}
          chevronWidth={60}
          rightChevron={<Chev className="fas fa-chevron-right" />}
          leftChevron={<Chev className="fas fa-chevron-left" />}
          outsideChevron={true}
        >
          {posts.map(post => (
            <Link to={post.source} key={post.time}>
              <Card key={post.time} img={post.image}>
                <Overlay>
                  <div>
                    <h3>{post.title}</h3>
                    <p>{post.brief}</p>
                  </div>
                  <span className="published">
                    {moment
                      .parseZone(post.published)
                      .utc()
                      .format("MMM DD, YYYY")}
                  </span>
                </Overlay>
              </Card>
            </Link>
          ))}
        </ItemsCarousel>
      </BottomWrap>
    ) : posts.length > postIndex + 1 ? (
      <BottomWrap mobile>
        <Divider>Previous Blog Post</Divider>
        <Link to={posts[postIndex + 1].source}>
          <Card img={posts[postIndex + 1].image}>
            <Overlay>
              <div>
                <h3>{posts[postIndex + 1].title}</h3>
                <p>{posts[postIndex + 1].brief}</p>
              </div>
              <span className="published">
                {moment
                  .parseZone(posts[1].published)
                  .utc()
                  .format("MMM DD, YYYY")}
              </span>
            </Overlay>
          </Card>
        </Link>
      </BottomWrap>
    ) : null;
  }
}

export default BottomCarousel;
