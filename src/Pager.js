import React from "react";

export default class Pager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagesize: props.pagesize,
      page: props.page,
      count: props.count
    };
    this.onChangeCallback = props.onChange;
    this.pagesize = this.pagesize.bind(this);
    this.firstpage = this.firstpage.bind(this);
    this.nextpage = this.nextpage.bind(this);
    this.previouspage = this.previouspage.bind(this);
    this.lastpage = this.lastpage.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.count !== this.state.count) {
      var pagecount = Math.round(
        (nextProps.count + this.state.pagesize - 1) / this.state.pagesize
      );
      this.setState({ pagecount: pagecount-1 });
    }
  }

  pagesize(e) {
    e.preventDefault();
    this.setState(
      {
        pagesize: +e.target.value,
        page: 1
      },
      () => {
        this.onChangeCallback(this.state);
      }
    );
  }

  firstpage() {
    this.setState(
      {
        page: 1
      },
      () => {
        this.onChangeCallback(this.state);
      }
    );
  }

  previouspage() {
    this.setState(
      prevState => {
        return {
          page: prevState.page - 1
        };
      },
      () => {
        this.onChangeCallback(this.state);
      }
    );
  }

  nextpage() {
    this.setState(
      prevState => {
        return {
          page: prevState.page + 1
        };
      },
      () => {
        this.onChangeCallback(this.state);
      }
    );
  }

  lastpage() {
    this.setState(
      prevState => {
        return { page: prevState.pagecount };
      },
      () => {
        this.onChangeCallback(this.state);
      }
    );
  }

  render() {
    return (
      <span className="search-bar">
        Page size:
        <select onChange={this.pagesize} value={this.state.pagesize}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
        <nav aria-label="pager">
          <ul className="pagination">
            <li className={this.state.page === 1 ? "page-item disabled" : "page-item"}>
              <a onClick={this.firstpage} className="page-link" href="#nowhere">
                <span aria-hidden="true">&laquo;&laquo;</span>
                <span className="sr-only">First</span>
              </a>
            </li>
            <li className={this.state.page === 1 ? "page-item disabled" : "page-item"}>
              <a onClick={this.previouspage} className="page-link" href="#nowhere">
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </a>
            </li>
            <li className="page-item">
              <label>
                Page {this.state.page} of {this.state.pagecount}
              </label>
            </li>
            <li className={this.state.page === this.state.pagecount? "page-item disabled": "page-item"}>
              <a onClick={this.nextpage} className="page-link" href="#nowhere">
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </a>
            </li>
            <li className={this.state.page === this.state.pagecount? "page-item disabled": "page-item"}>
              <a onClick={this.lastpage} className="page-link" href="#nowhere">
                <span aria-hidden="true">&raquo;&raquo;</span>
                <span className="sr-only">Last</span>
              </a>
            </li>
          </ul>
        </nav>
      </span>
    );
  }
}
