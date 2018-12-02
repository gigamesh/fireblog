import React from "react";
import styled from "styled-components";
import moment from "moment";
import media from "../mediaqueries";

const FullWrap = styled.div`
  font-size: 18px;
  ${media.portrait.md`
    font-size: 16px;
    h1 {
      font-size: 2.3em;
    }
  `}
  ${media.portrait.sm`
    h1 {
      font-size: 2.1em;
    }
  `}
  ${media.portrait.xs`
    h1 {
      font-size: 1.8em;
    }
  `}
`;

const ContentWrap = styled.div`
  ${media.portrait.sm`
    font-size: 16px;
  `}
  width: 95%;
  margin: 0 auto;
  max-width: 900px;
  padding: 0 15px 25px;
  img {
    width: 100%;
  }
`;

const Image = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  background: cover;
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  z-index: -1;
  ${media.portrait.sm`
    height: 200px
  `}
`;

const Overlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 32px;
  ${media.portrait.sm`
      padding: 0
  `}
`;

const Title = styled.div`
  max-width: 1000px;
  width: 90%;
  margin: 0 auto;
  h1 {
    line-height: 110%;
    color: #fff;
    margin: 0;
  }
`;

const Error = styled.h5`
  color: #fff;
`;

export default function Preview({ post, imageError }) {
  imageError = !post.image ? "[Missing image URL]" : imageError;
  return (
    <FullWrap>
      <Image style={{ backgroundImage: `url(${post.image})` }}>
        <Overlay>
          <Title>
            <h1>{post.title}</h1>
            {imageError && <Error>{imageError}</Error>}
          </Title>
        </Overlay>
      </Image>
      <div className="author-date author">
        <h4>{post.author}</h4>
      </div>
      <ContentWrap dangerouslySetInnerHTML={{ __html: post.content }} />
      <div className="author-date date">
        <h4>
          Published{" "}
          {moment
            .parseZone(post.published)
            .utc()
            .format("MMM DD, YYYY")}
        </h4>
      </div>
    </FullWrap>
  );
}
