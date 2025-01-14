import React, { Component, ChangeEvent, MouseEvent } from "react";
import { Building } from "./buildings";

type EditorProps = {
  /** Names of all the buildings that are available to choose. */
  buildings: Array<Building>;

  /** Called to note that the selection has changed. */
  onEndPointChange: (endPoints?: [Building, Building]) => void;
};

type EditorState = {
  from?: Building;
  to?: Building;
};

/** Component that allows the user to edit a marker. */
export class Editor extends Component<EditorProps, EditorState> {
  constructor(props: EditorProps) {
    super(props);

    this.state = {};
  }

  // collects and the buildings to select from
  loadLocations = (): Array<JSX.Element> => {
    const options: Array<JSX.Element> = [
      <option key="NONE" value="-1"></option>,
    ];
    this.locationMap.set("NONE", "-1");
    var building: Building;
    for (let i = 0; i < this.props.buildings.length; i++) {
      building = this.props.buildings[i];
      options.push(
        <option key={building.shortName} value={String(i)}>
          {building.longName}
        </option>
      );
      this.locationMap.set(building.shortName, String(i));
    }
    return options;
  };

  locationMap: Map<string, string> = new Map();
  locations: Array<JSX.Element> = this.loadLocations();

  getValue = (current: Building | undefined): string => {
    if (current === undefined) {
      return "-1";
    }
    const value: string | undefined = this.locationMap.get(current.shortName);
    if (value === undefined) {
      throw new Error("shouldn't happen");
    }
    return value;
  };

  render = (): JSX.Element => {
    return (
      <div>
        <p>
          From:{" "}
          <select
            id="from"
            value={this.getValue(this.state.from)}
            children={this.locations}
            onChange={this.doFromChange}
          />
        </p>
        <p>
          To:{" "}
          <select
            id="to"
            value={this.getValue(this.state.to)}
            children={this.locations}
            onChange={this.doToChange}
          />
        </p>
        <button id="clear" onClick={this.doClearClick}>
          Clear
        </button>
      </div>
    );
  };

  doFromChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    const building: Building = this.props.buildings[Number(evt.target.value)];
    this.setState({ from: building });
  };

  doToChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
    if (evt.target.value === "-1") {
      return this.setState({ to: undefined });
    }
    const building: Building = this.props.buildings[Number(evt.target.value)];
    this.setState({ to: building });
  };

  doClearClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.setState({ from: undefined, to: undefined });
  };

  componentDidUpdate = (
    _oldProps: EditorProps,
    oldState: EditorState
  ): void => {
    // if the state didn't update but the props did,such as when we call
    // props.onEndpPointChange(), then we ignore
    if (oldState.from === this.state.from && oldState.to === this.state.to) {
      return;
    }
    // when the from and to endpoints are both set to something that's not undefined
    if (this.state.from && this.state.to) {
      this.props.onEndPointChange([this.state.from, this.state.to]);
      // when the from and two endpoints are both set to something that is undefined
    } else if (!this.state.from && !this.state.to) {
      this.props.onEndPointChange(undefined);
    }
  };
}
