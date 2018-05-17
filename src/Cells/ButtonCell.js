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
    const classes = `${this.state.value.toLowerCase()}`
    return (
      <td className={classes}>
        <span className={this.state.value.toLowerCase()}>
          <button onClick={this.onClick.bind(this)} className={`status-${this.state.value.toLowerCase()}`}>
            <span className={this.props.isLoading!== undefined && this.props.isLoading === true?'spinner' : ''}>{this.state.value}</span>
          </button>
        </span>
      </td>
    );
  }
}
