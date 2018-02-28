import React from "react";

export default class ButtonCell extends React.Component {
  constructor(props) {
    super(props);
    this.onClickHandler = props.onClick;
    this.value = props.value;
    this.className = props.className;
  }

  onClick(e) {
    if(this.onClickHandler) {
        this.onClickHandler(e);
    }
  }

  render() {
    return (
      <td className={this.className}>
        <span className={this.className}>
          <button onClick={this.onClick.bind(this)} className={this.className}>{this.value}</button>
        </span>
      </td>
    );
  }
}
