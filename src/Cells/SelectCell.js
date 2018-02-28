import React from "react";

export default class SelectCell extends React.Component {
  constructor(props) {
    super(props);
    this.onChangeHandler = props.onChange;
    this.onCancelHandler = props.onCancel;
    this.value = props.value;
    this.className = props.className;
    this.options = props.options || [];
  }

  onChange(e) {
    if(this.onChangeHandler) {
        this.onChangeHandler(e);
    }
  }

  onCancel(e) {
    if(this.onCancelHandler) {
        this.onCancelHandler(e);
    }
  }

  render() {
    return (
      <td className={this.className}>
        <span className={this.className}>
          <select onChange={this.onChange.bind(this)} className={this.className} value={this.value}>
            {
              this.options.map(function(option) {
                return <option key={option.value} value={option.value}>{option.label}</option>
              })
            }
          </select>&nbsp;
          {
            this.onCancelHandler ? <button onClick={this.onCancel.bind(this)}>X</button> : ""
          }
        </span>
      </td>
    );
  }
}
