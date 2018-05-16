import React from "react";

export default class ButtonCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value : props.value
    }
    this.value = props.value;
    this.onClickHandler = props.onClick;
    this.className = props.className;
  }

  onClick(e) {
    if(this.onClickHandler) {
        this.onClickHandler(e);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    var should = this.value !== nextProps.value;
    return should;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({value : nextProps.value});
  }


  render() {
    return (
      <td className={this.state.value.toLowerCase()}>
        <span className={this.state.value.toLowerCase()}>
          <button onClick={this.onClick.bind(this)} className={`status-${this.state.value.toLowerCase()}`}>{this.state.value}</button>
        </span>
      </td>
    );
  }
}
