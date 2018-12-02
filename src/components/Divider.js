import React from "react";
import styled from "styled-components";
import media from "../mediaqueries";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  white-space: nowrap;
  margin-bottom: 3em;
  h3 {
    margin: 0 20px;
  }
  ${media.portrait.sm`
    margin-bottom: 1em;
    h3 {
      font-size: 1.2em;
    }
  `}
`;

const HR = styled.hr`
  width: 100%;
`;

export default function Divider(props) {
  return (
    <Wrapper>
      <HR />
      <h3>{props.children}</h3>
      <HR />
    </Wrapper>
  );
}
