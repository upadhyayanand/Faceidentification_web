import React, { Component } from "react";
import Navigation from "./Navigation/Navigation";
import Signin from "./Signin/Signin";
import Register from "./Register/Register";
import Logo from "./Logo/Logo";
import ImageLinkForm from "./ImageLinkForm/ImageLinkForm";
import Rank from "./Rank/Rank";
import "./App.js";

import { detectFaces } from "./Devops_Flask/httpReq";

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",

      imageUrl: "",
      detectedFaceUrl: "", //changes for python app

      route: "Signin",
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: "",
      },
    };
  }

  onInputChange = (event) => {
    //python changed
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = async () => {
    try {
      console.log("Input value:", this.state.input);
      const detectedFaceUrl = await detectFaces(this.state.input);
      console.log("Detected face URL:", detectedFaceUrl);
      this.setState({ detectedFaceUrl });
    } catch (error) {
      console.error("Error detecting faces:", error);
    }
  };

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  componentDidMount() {
    fetch("http://localhost:3004/")
      .then((response) => response.json())
      .then(console.log);
  }

  // onInputChange = (event) => {
  //   console.log(event.target.value);
  // };

  // onButtonSubmit = () => {
  //   console.log("click");
  //   fetch("http://localhost:3004/image", {
  //     method: "put",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       id: this.state.user.id,
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((count) => {
  //       this.setState(Object.assign(this.state.user, { entries: count }));
  //     });
  // };

  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState({ isSignedIn: false });
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    return (
      <div className="App">
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />

            {this.state.detectedFaceUrl && (
              <div>
                <h2>Detected Faces:</h2>
                <img src={this.state.detectedFaceUrl} alt="Detected Faces" />
              </div>
            )}
            {/*<FaceRecognition/>*/}
          </div>
        ) : this.state.route === "Signin" ? (
          <Signin onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}
export default App;
