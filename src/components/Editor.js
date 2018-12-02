import React, { Component } from "react";
import styled from "styled-components";
import EditorForm from "./EditorForm";
import Header from "./Header";
import BlogPost from "./BlogPost";
import MsgModal from "./MsgModal";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../scss/index.css";
import "../App.css";

const OuterWrap = styled.div`
  height: calc(100vh - 60px);
  position: absolute;
  width: 100%;
  top: 60px;
  overflow-y: scroll;
`;

const md = require("markdown-it")({
  html: false,
  xhtmlOut: false,
  breaks: true,
  linkify: true,
  typographer: true
})
  .use(require("markdown-it-footnote"))
  .use(require("markdown-it-deflist"))
  .use(require("markdown-it-emoji"))
  .use(require("markdown-it-sub"))
  .use(require("markdown-it-sup"));

class Main extends Component {
  constructor(props) {
    super(props);
    this.newPost = {
      _id: 0,
      author: "",
      title: "",
      brief: "",
      published: this.getTodayDate(),
      image: "",
      content: "",
      contentMD: ""
    };
    this.state = {
      preview: false,
      loadingPosts: true,
      posts: [],
      post: { ...this.newPost },
      imageError: "",
      errorMsg: "",
      successMsg: "",
      modalShowing: false,
      deleteCalled: false,
      cachedId: "",
      registerSuccess: false
    };
  }

  componentDidMount() {
    this.getPosts();
  }

  getPosts = () => {
    this.props.db
      .collection("archive")
      .get()
      .then(res => {
        let posts = [];
        res.forEach(doc => {
          let post = doc.data();
          post._id = doc.id;
          posts.push(post);
        });
        this.setState({ posts, loadingPosts: false });
      });
  };

  getTodayDate = () => {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    return `${year}-${month}-${day}`;
  };

  togglePreview = () => {
    let content = md.render(this.state.post.contentMD);
    const { post } = this.state;
    post.content = content;
    this.setState(prevState => ({
      preview: !prevState.preview,
      post: post
    }));
  };

  handleChange = e => {
    const post = { ...this.state.post };
    const id = e.target.id;
    post[id] = e.target.value;
    this.setState({ post });
  };
  selectPost = ({ nativeEvent }) => {
    let [post] = this.state.posts.filter(
      p => p._id === nativeEvent.target.value
    );
    if (!post) {
      post = { ...this.newPost };
    }
    post.content = md.render(post.contentMD);
    this.setState({ post, cachedId: post._id });
  };

  forceEditView = () => {
    this.setState({ preview: false });
  };

  closeModal = () => {
    this.setState({ modalShowing: false });
    setTimeout(() => {
      this.setState({
        errorMsg: "",
        successMsg: "",
        deleteCalled: false
      });
    }, 1000);
  };

  showModal = () => {
    this.setState({ modalShowing: true });
  };

  save = button => {
    const { post } = this.state;
    const { db } = this.props;
    if (this.state.errorMsg) return;

    let { title } = post;
    let urlString = post.published + "-" + title.replace(/[\W_]+/g, "-");
    let newId =
      post.published +
      "-" +
      Math.random()
        .toString(36)
        .substr(2, 6);
    let parsedMD = md.render(post.contentMD);

    if (!post._id) {
      post._id = newId;
      this.setState({ post });
    }

    let postToSave = {
      _id: post._id,
      title: post.title,
      brief: post.brief,
      author: post.author,
      image: post.image,
      content: parsedMD,
      contentMD: post.contentMD,
      published: post.published,
      time: new Date().getTime(),
      source: `/${urlString}`
    };

    db.collection("archive")
      .doc(post._id)
      .set(postToSave)
      .then(() => {
        if (button === "save") {
          this.showModal();
          this.setState({
            successMsg: "Saved!"
          });
        }
        this.setState({ cachedId: post._id });
        this.getPosts();
      })
      .catch(err => {
        console.error(err);
        this.showModal();
        this.setState({
          errorMsg: "Error: You need to be signed in to perform that action."
        });
      });
    return postToSave;
  };

  validateAndPublish = () => {
    const { db } = this.props;
    const { post } = this.state;
    const imageValid = post.image.match(
      /(https?:\/\/.*\.(?:png|jpg|gif|svg))/i
    );
    if (!post.author) {
      this.setState({ errorMsg: "Please specify author." });
      this.showModal();
      return;
    }
    if (!post.title) {
      this.setState({ errorMsg: "Please provide a title." });
      this.showModal();
      return;
    }
    if (post.title > 60) {
      this.setState({
        errorMsg: "Please shorten title to 60 characters or less."
      });
      this.showModal();
      return;
    }
    if (post.brief.length > 250) {
      this.setState({
        errorMsg: "Please shorten synopsis to 250 characters or less."
      });
      this.showModal();
      return;
    }
    if (!imageValid) {
      this.setState({
        errorMsg:
          "Invalid or missing header image. Please provide a URL to a large jpg, png or gif."
      });
      this.showModal();
      return;
    }
    if (!post.contentMD) {
      this.setState({
        errorMsg: "You haven't written any content to publish. :)"
      });
      this.showModal();
      return;
    }
    this.setState({ errorMsg: "" });

    ///archvives the post and returns it
    const postToPublish = this.save();
    db.collection("blog")
      .doc(postToPublish._id)
      .set(postToPublish)
      .then(doc => {
        this.showModal();
        this.setState({
          successMsg: "Published!"
        });
      })
      .catch(err => {
        console.error(err);
        this.showModal();
        this.setState({
          errorMsg: "Error: You need to be signed in to perform that action."
        });
      });
  };

  promptForDelete = () => {
    this.setState({ errorMsg: "Are you sure?", deleteCalled: true }, () => {
      this.showModal();
    });
  };

  deletePost = () => {
    const id = this.state.post._id;
    this.props.db
      .collection("archive")
      .doc(id)
      .delete()
      .then(() => {
        this.props.db
          .collection("blog")
          .doc(id)
          .delete()
          .then(() => {
            this.setState({
              deleteCalled: false,
              post: { ...this.newPost },
              cachedId: id,
              errorMsg: "",
              successMsg: "Successfully Deleted!"
            });
            this.getPosts();
            this.forceEditView();
          });
      })
      .catch(error => {
        this.setState({
          deleteCalled: false,
          errorMsg: "Error: You need to be signed in to perform that action."
        });
      });
  };

  render() {
    const { windowSize, isSignedIn, init } = this.props;

    const {
      preview,
      posts,
      post,
      imageError,
      successMsg,
      errorMsg,
      modalShowing,
      deleteCalled,
      cachedId,
      loadingPosts
    } = this.state;

    return (
      <React.Fragment>
        <Header
          loadingPosts={loadingPosts}
          posts={posts}
          post={post}
          selectPost={this.selectPost}
          togglePreview={this.togglePreview}
          preview={preview}
          save={this.save}
          validateAndPublish={this.validateAndPublish}
          promptForDelete={this.promptForDelete}
          windowSize={windowSize}
          forceEditView={this.forceEditView}
          cachedId={cachedId}
          signOut={() => init.auth().signOut()}
          isSignedIn={isSignedIn}
        />
        {preview ? (
          <OuterWrap>
            <BlogPost post={post} imageError={imageError} />
          </OuterWrap>
        ) : (
          <EditorForm
            posts={posts}
            post={post}
            handleChange={this.handleChange}
          />
        )}
        <MsgModal
          show={modalShowing}
          closeModal={this.closeModal}
          errorMsg={errorMsg}
          successMsg={successMsg}
          deleteFunc={this.deletePost}
          deleteCalled={deleteCalled}
        />
      </React.Fragment>
    );
  }
}

export default Main;
