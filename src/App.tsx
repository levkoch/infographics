import React, { Component } from "react";
import { Building, Edge, Location } from "./buildings";
import { Editor } from "./Editor";
import { isRecord } from "./record";
import campusMap from "./img/campus_map.jpg";

// Radius of the circles drawn for each marker.
const RADIUS: number = 30;

type AppProps = {}; // no props

type AppState = {
  buildings?: Array<Building>; // list of known buildings
  endPoints?: [Building, Building]; // end for path
  path?: Array<Edge>; // shortest path between end points
};

/** Top-level component that displays the entire UI. */
export class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    this.state = {};
  }

  componentDidMount = (): void => {
    var positions = require("/data/flourish.json");
    var metadata  = require("/data/metadata.json");
  };

  render = (): JSX.Element => {
    if (!this.state.buildings) {
      return <p>Loading building information...</p>;
    } else {
      return (
        <div>
          <svg id="svg" width="866" height="593" viewBox="0 0 4330 2964">
            <image href={campusMap} width="4330" height="2964" />
            {this.renderPath()}
            {this.renderEndPoints()}
          </svg>
          <Editor
            buildings={this.state.buildings}
            onEndPointChange={this.doEndPointChange}
          />
        </div>
      );
    }
  };

  /** Returns SVG elements for the two end points. */
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
  };

  /** Returns SVG elements for the edges on the path. */
  renderPath = (): Array<JSX.Element> => {
    if (!this.state.path) {
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
  };

  // handy little conversion method to make locations into strings.
  locString = (location: Location): string => {
    return String(location.x) + "," + String(location.y);
  };

  doEndPointChange = (endPoints?: [Building, Building]): void => {
    this.setState({ endPoints, path: undefined });
    if (endPoints) {
      const [start, end] = endPoints;
      const url: string =
        "/api/shortestPath?from=" +
        this.locString(start.location) +
        "&to=" +
        this.locString(end.location);

      fetch(url)
        .then(this.doPathResp)
        .catch(() => this.doPathError("failed to connect"));
    }
  };

  // process a response we get after asking for a path
  doPathResp = (res: Response): void => {
    if (res.status === 200) {
      res
        .json()
        .then(this.doPathJson)
        .catch(() => this.doPathError("response not JSON"));
    } else if (res.status === 400) {
      res
        .text()
        .then(this.doPathError)
        .catch(() => this.doPathError("error response not text"));
    } else {
      this.doPathError(`Bad status: ${res.status}`);
    }
  };

  // parse the path that we were sent through the json response.
  // hopefully this was a "gotcha" moment to show us how nice
  // it is to have a library to do this mess for us all.
  // 
  // data is supposed to look like the following (at least 
  // the parts that we care about, which are in the "steps" element.)
  // { "steps": [
  //   {
  //     "start": { "x": number, "y": number },
  //     "end": { "x": number, "y": number },
  //   },
  //     ... more of the same elements ...
  //   ],
  // }
  doPathJson = (data: unknown): void => {
    if (!isRecord(data)) {
      return this.doPathError("JSON is not a record.");
    }

    const steps: unknown = data.steps;
    if (!Array.isArray(steps)) {
      return this.doPathError("JSON returned .steps value that's not an array.");
    }
    for (let step of steps) {
      if (!isRecord(step)) {
        return this.doPathError("JSON returned .steps element that's not a record.");
      }
      if (!isRecord(step.start) || !isRecord(step.end)) {
        return this.doPathError(
          "JSON returned .steps element attributes .start or .end that aren't records."
        );
      }
      for (let loc of [step.start, step.end]) {
        if (typeof loc.x !== "number" || typeof loc.y !== "number") {
          return this.doPathError(
            "JSON returned .steps element attributes .start or .end attributes " +
              ".x or .y that aren't numeric."
          );
        }
      }
    }
    // yay we checked it all for the right types :)
    this.setState({ path: steps });
  };

  doPathError = (error: string): void => {
    console.error(`errror handling /shortestPath request: ${error}`);
  };
}
