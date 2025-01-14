import React, { Component } from "react";
import campusMap from "./img/campus_map.jpg";

// Radius of the circles drawn for each marker.
// const RADIUS: number = 30;

type AppProps = {}; // no props

type AppState = {

};

/** Top-level component that displays the entire UI. */
export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {};
  }

  componentDidMount = (): void => {
    const positions = require(".//data/flourish.json");
    const metadata  = require(".//data/metadata.json");

    console.log(positions);
    console.log(metadata);

    fetch(".//data/flourish.json")
      .then(response => response.json())
      .then(json => console.log(json));

    fetch(".//data/metadata.json")
      .then(response => response.json())
      .then(json => console.log(json));
  };

  render = (): JSX.Element => {
    return (
      <div>
        <svg id="svg" width="866" height="593" viewBox="0 0 4330 2964">
          <image href={campusMap} width="4330" height="2964" />
        </svg>
        
      </div>
    );
  };

  /** Returns SVG elements for the two end points. 
  renderEndPoints = (): Array<JSX.Element> => {
    if (!this.state.endPoints) {
      return [];
    } else {
      const [start, end] = this.state.endPoints;
      return [
        <circle
          cx={start.location.x}
          cy={start.location.y}
          fill={"red"}
          r={RADIUS}
          stroke={"white"}
          strokeWidth={10}
          key={"start"}
        />,
        <circle
          cx={end.location.x}
          cy={end.location.y}
          fill={"blue"}
          r={RADIUS}
          stroke={"white"}
          strokeWidth={10}
          key={"end"}
        />,
      ];
    }
  }; */
  
  /** Returns SVG elements for the edges on the path. 
  renderPath = (): Array<JSX.Element> => {
    /*if (!this.state.path) {
      return [];
    } else {
      const elems: Array<JSX.Element> = [];
      for (let i = 0; i < this.state.path.length; i++) {
        const e = this.state.path[i];
        elems.push(
          <line
            x1={e.start.x}
            y1={e.start.y}
            key={i}
            x2={e.end.x}
            y2={e.end.y}
            stroke={"green"}
            strokeWidth={10}
          />
        );
      }
      return elems;
    }
  };*/
}
