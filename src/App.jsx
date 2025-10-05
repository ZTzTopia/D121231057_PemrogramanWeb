import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import Chip from "./components/Chip";
import Card from "./components/Card";

function App() {
  return (
    <>
      <Header />
      <div className="container">
        <h1>Muhamad Zibrisky</h1>
        <p>
          I'm a full-stack developer and dedicated{" "}
          <Chip>🚩 CTF</Chip> player. I actively participate in
          Capture The Flag (CTF) competitions, where I sharpen my skills in
          cybersecurity, reverse engineering, and creative thinking.
        </p>
        <p>
          Check out my profiles on <Chip>🧑‍💻 TryHackMe</Chip> and{" "}
          <Chip>📦 HackTheBox</Chip>.
        </p>

        <h2>Projects</h2>
        <div className="project-section">
          <Card
            className="flex flex-col gap-2"
            href="https://github.com/ZTzTopia/site"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="font-medium">Site</p>
            <p className="tx-color-muted">My portofolio site.</p>
            <div className="flex flex-row gap-2 flex-wrap">
              <Chip className="bg-color-gr font-medium text-xs tx-color-inverse">
                Portfolio
              </Chip>
            </div>
          </Card>
          <Card
            className="flex flex-col gap-2"
            href="https://github.com/ZTzTopia/GTProxy"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="font-medium">GTProxy</p>
            <p className="tx-color-muted">
              Debugging packets and modifying requests.
            </p>
            <div className="flex flex-row gap-2 flex-wrap">
              <Chip className="bg-color-bl font-medium text-xs tx-color-inverse">
                Proxy
              </Chip>
              <Chip className="bg-color-ma font-medium text-xs tx-color-inverse">
                Debugging
              </Chip>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

export default App;
