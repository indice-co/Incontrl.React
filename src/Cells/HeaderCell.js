import React from "react";

export default class HeaderCell extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        currentsort : props.currentsort,
        currentdir : props.currentdir,
        className : props.sortfield ? props.sortfield === props.currentsort ? props.currentdir === "asc" ? "sortable sort-asc": "sortable sort-desc" : "sortable" : ""
    };
    this.label = props.label;
    this.onSort = props.onSort;
    this.sortfield = props.sortfield;
    this.styleclass = props.className || "";
  }

  componentWillReceiveProps(nextProps) {
    this.setState({className : this.calcClassNames(nextProps.currentsort, nextProps.currentdir)});
  }

  calcClassNames(nextSort,nextDir) {
    var _class = this.sortfield ? "sortable" : "";
    if (nextSort !== this.state.currentsort || nextDir !== this.state.currentdir) {
      if(nextSort === this.sortfield) {
        _class = nextDir  === "asc" ? "sortable sort-asc": "sortable sort-desc";
      }
      _class = `${_class} ${this.styleclass}`;
    }
    return _class;
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
