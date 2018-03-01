import React from "react";

export default class TextCell extends React.Component {
  constructor(props) {
    super(props);
    this.value = props.value || "";
    this.className = props.className || "";
  }

  onClick(e) {
    if (this.onClickHandler) {
      this.onClickHandler(e);
    }
  }

  render() {
    return (
      <td className={this.className}>
        <span className={this.className}>
          {this.value}
        </span>
      </td>
    );
  }
}
