import React from "react";

export default class LinkCell extends React.Component {
  constructor(props) {
    super(props);
    this.value = props.value;
    this.className = props.className;
    this.href = props.href;
    this.target = props.target;
  }

  onClick(e) {
    if(this.onClickHandler) {
        this.onClickHandler(e);
    }
  }

  render() {
    if (this.href) {
      return (
        <td className={this.className}>
          <span className={this.className}>
            <a href={this.href} target={this.target}>
              {this.value}
            </a>
          </span>
        </td>
      );
    } else {
      return (
        <td className={this.className}>
          <span className={this.className}>{this.value}</span>
        </td>
      );
    }
  }
}
