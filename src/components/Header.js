import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Form from "react-bootstrap/lib/Form";
import Button from "react-bootstrap/lib/Button";
import moment from "moment";

const HeaderOuter = styled.div`
  width: 100%;
  height: 60px;
  border-bottom: 1px solid #bbb;
  position: fixed;
  top: 0;
  background: #fff;
  a {
    box-shadow: none;
  }
  a:hover {
    box-shadow: none;
  }
`;
const HeaderInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 97%;
  margin: 0 auto;
  height: 100%;
  h4 {
    margin-bottom: 0;
  }
`;

const HomeLink = styled(Link)`
  color: var(--main);
  text-decoration: none;
  box-shadow: none;
  font-weight: 500;
  text-align: center;
  &:hover {
    text-decoration: none;
    box-shadow: none;
    color: var(--main);
  }
  span {
    font-size: 0.9em;
  }
`;

const ButtonWrapTop = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  flex-grow: 1;
  button {
    min-width: 80px;
    margin-left: 0.6em;
  }
`;
const ButtonWrapSide = styled.div`
  margin: 0 auto 10%;
  width: 90%;
  max-width: 300px;
  button {
    width: 100%;
    margin-top: 1.5em;
    height: 3em;
  }
  select {
    height: 3em;
  }
  a {
    display: block;
    margin-top: 120px;
    box-shadow: none;
  }
  a:hover {
    box-shadow: none;
  }
`;
const MenuBtn = styled.button`
  background: none;
  border: none;
  visibility: ${({ hidden }) => (hidden ? "hidden" : null)};
  i {
    font-size: 1.5em;
    color: var(--main);
    cursor: pointer;
  }
`;
const MenuBtnExit = styled.button`
  background: none;
  border: none;
  position: absolute;
  right: 1em;
  top: 1em;
  i {
    font-size: 1.5em;
    color: var(--main);
    cursor: pointer;
  }
`;
const SideNav = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  height: 100vh;
  width: 100%;
  max-width: 450px;
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  background-color: #fff;
  overflow-x: hidden;
  transition: 0.2s;
  transform: ${({ open }) => (open ? "translateX(0)" : "translateX(-100%)")};
  box-shadow: 40px 40px 40px rgba(10, 10, 10, 0.05);
`;

const Overlay = styled.div`
  z-index: 1;
  height: 100vh;
  width: 100vw;
  position: absolute;
`;

class Header extends React.Component {
  state = {
    sideNavOpen: false
  };

  previewClicked = () => {
    if (!this.props.preview) {
      this.props.save();
    }
    this.props.togglePreview();
    this.closeSideNav();
  };

  publish = () => {
    this.props.validateAndPublish();
    this.closeSideNav();
  };
  saveButtonClicked = () => {
    this.props.save("save");
    this.closeSideNav();
  };
  dropDownChanged = e => {
    this.props.selectPost(e);
    this.closeSideNav();
    if (e.nativeEvent.target.value === "0") {
      this.props.forceEditView();
    }
  };

  openSideNav = () => {
    this.setState({ sideNavOpen: true });
  };
  closeSideNav = () => {
    this.setState({ sideNavOpen: false });
  };

  render() {
    const {
      posts,
      post,
      preview,
      promptForDelete,
      windowSize,
      cachedId,
      signOut,
      isSignedIn,
      loadingPosts
    } = this.props;
    const { sideNavOpen } = this.state;

    let dropdownOptions = posts.reverse().map(post => {
      let date = moment
        .parseZone(post.published)
        .utc()
        .format("MMM DD, YYYY");

      return (
        <option key={post._id} value={post._id}>
          [{date}] {post.title}
        </option>
      );
    });

    dropdownOptions.unshift(
      <option key={0} value={0}>
        {loadingPosts ? "Loading..." : "NEW POST"}
      </option>
    );

    let disabled = !post.title || !post.author || !post.contentMD;

    const menuItems = (
      <React.Fragment>
        <Form.Group
          style={{
            marginBottom: 0,
            display: "flex",
            flexGrow: 1,
            justifyContent: "center",
            maxWidth: "400px",
            margin: "0 5px"
          }}
        >
          <Form.Control
            as="select"
            onChange={this.dropDownChanged}
            style={{ flexBasis: "280px", flexGrow: 1 }}
            value={cachedId}
          >
            {dropdownOptions}
          </Form.Control>
        </Form.Group>
        <Button
          variant="info"
          onClick={this.previewClicked}
          disabled={disabled}
        >
          {preview ? "Edit" : "Preview"}
        </Button>
        <Button
          variant="outline-success"
          disabled={disabled}
          onClick={this.saveButtonClicked}
        >
          Save
        </Button>
        <Button
          variant="outline-success"
          disabled={disabled}
          onClick={this.publish}
        >
          Publish
        </Button>
        <Button
          variant="outline-danger"
          onClick={promptForDelete}
          disabled={!post._id}
        >
          Delete
        </Button>
        {isSignedIn ? (
          <Button variant="outline-danger" onClick={signOut}>
            Sign Out
          </Button>
        ) : (
          <Link to="/signin">
            <Button variant="outline-success">Sign In</Button>
          </Link>
        )}
      </React.Fragment>
    );
    return (
      <React.Fragment>
        <SideNav open={sideNavOpen}>
          <MenuBtnExit onClick={this.closeSideNav}>
            <i className="fas fa-times" />
          </MenuBtnExit>
          <ButtonWrapSide>
            <h1 style={{ margin: "1em auto 1em", textAlign: "center" }}>
              <HomeLink to="/">
                Fireblog{" "}
                <span role="img" aria-label="fire">
                  🔥
                </span>
              </HomeLink>
            </h1>
            {menuItems}
          </ButtonWrapSide>
        </SideNav>
        {sideNavOpen && <Overlay onClick={this.closeSideNav} />}
        <HeaderOuter>
          <HeaderInner>
            <MenuBtn hidden={windowSize.x > 1100} onClick={this.openSideNav}>
              <i className="fas fa-bars" />
            </MenuBtn>
            <h3 className="text-center" style={{ margin: 0 }}>
              <HomeLink to="/">
                Fireblog{" "}
                <span role="img" aria-label="fire">
                  🔥
                </span>
              </HomeLink>
            </h3>
            {windowSize.x > 1100 && <ButtonWrapTop>{menuItems}</ButtonWrapTop>}
          </HeaderInner>
        </HeaderOuter>
      </React.Fragment>
    );
  }
}

export default Header;
