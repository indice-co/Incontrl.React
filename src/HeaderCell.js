import React from "react";

export default class HeaderCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        currentsort : props.currentsort,
        currentdir : props.currentdir,
        className : props.sortfield ? "sortable" : ""
    };
    this.label = props.label;
    this.onSort = props.onSort;
    this.sortfield = props.sortfield;
    this.styleclass = props.styleclass || "";
  }

  componentWillReceiveProps(nextProps) {
    var _class = this.sortfield ? "sortable" : "";
    if (nextProps.currentsort !== this.state.currentsort || nextProps.currentdir !== this.state.currentdir) {
      if(nextProps.currentsort === this.sortfield) {
        _class = nextProps.currentdir  === "asc" ? "sortable sort-asc": "sortable sort-desc";
        this.setState({className :  _class + " " + this.styleclass});
      } else {
        this.setState({className : _class + " " + this.styleclass});
      }
    }
  }

  render() {
    return (
      <th className={this.state.className}>
        <div>
          {this.sortfield ? (
            <a
              href=""
              onClick={this.onSort.bind(this,this.sortfield)}>
              <span>{this.label}</span>
            </a>
          ) : (
            <span>{this.label}</span>
          )}
        </div>
      </th>
    );
  }
}
