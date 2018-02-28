import React from "react";
import Pager from "./Pager";
import HeaderCell from "./Cells/HeaderCell";
import TextCell from "./Cells/TextCell";

// some comment to test my CI process
export default class TransactionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: this.props.token,
      subscriptionid: this.props.subscriptionid,
      environment: this.props.environment,
      debug: this.props.debug,
      sortfield: "merchantReference",
      sortdir: "asc",
      pagesize: 20,
      page: 1,
      count: 0,
      paymentOptions: [],
      selectedOption:"",
    };
    this.culture = this.props.culture;
    // eslint-disable-next-line
    this.linkfunc = eval(this.props.link ? this.props.link : "doc => ``");
    this.sort = this.sort.bind(this);
    this.search = this.search.bind(this);
    this.pageChanged = this.pageChanged.bind(this);
    this.numberFormatter = new Intl.NumberFormat(this.culture, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    this.dateFormatter = new Intl.DateTimeFormat(this.culture);
  }

  componentDidMount() {
    this.loadPaymentOptions();
  }

  loadPaymentOptions() {
    var component = this;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.response);
          if(response.items.length>0) {
          component.setState({
            paymentOptions: response.items,
            selectedOption: response.items[0].id
          },()=> {
            component.search();
          });
        } else {
          component.setState({ paymentOptions: [], selectedOption: "" });
        }
        } else {
          // do some error handling here!
          component.setState({ paymentOptions: [], selectedOption: "" });
        }
      }
    });

    var url = `https://${component.state.environment}.incontrl.io/subscriptions/${component.state.subscriptionid}/payment-options?Page=1&Size=1000`;
    xhr.open("GET", url);
    xhr.setRequestHeader("Authorization","Bearer " + component.state.access_token);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
  }

  search() {
    if(!this.state.selectedOption || this.state.selectedOption===""){
      return;
    }
    var component = this;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.response);
          component.setState({
            transactions: response.items,
            count: response.count
          });
        } else {
          // do some error handling here!
          component.setState({ transactions: null, count: 0, pagecount: 0 });
        }
      }
    });
    var page = `?page=${component.state.page}`;
    var sort = `&sort=${component.state.sortfield}${component.state.sortdir === "asc" ? "+" : "-"}`;
    var size = `&size=${component.state.pagesize}`;
    var culture = `&culture=${component.culture}`;
    var url = `https://${component.state.environment}.incontrl.io/subscriptions/${component.state.subscriptionid}/payment-options/${component.state.selectedOption}/transactions${page}${size}${sort}${culture}`;
    xhr.open("GET", url);
    xhr.setRequestHeader("Authorization","Bearer " + component.state.access_token);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
  }

  addRootPath(permaLink) {
    var culture = `?culture=${this.culture}`;
    return `https://${this.state.environment}.incontrl.io${permaLink}${culture}`;
  }

  sort(field, e) {
    e.preventDefault();
    var dir = "asc";
    if (field.toLowerCase() === this.state.sortfield.toLowerCase()) {
      dir = this.state.sortdir === "asc" ? "desc" : "asc";
    }
    this.setState({ sortfield: field, sortdir: dir }, () => {
      console.log("sort method: " + field + " " + dir);
      this.search();
    });
  }

  pageChanged(e) {
    this.setState(
      {
        pagesize: e.pagesize,
        page: e.page
      },
      () => {
        this.search();
      }
    );
  }

  selectOption(e) {

  }

  render() {
    var component = this;
    return (
      <div>
        <span className="toolbar">
          <span className="payment-options">
            Payment option : 
            <select onChange={this.selectOption} value={this.state.selectedOption}>
              {
                this.state.paymentOptions.map(function(po) {
                  return <option key={po.id} value={po.id}>{po.name}</option>
                })
              }
            </select>&nbsp;
            <Pager
              onChange={this.pageChanged}
              pagesize={this.state.pagesize}
              page={this.state.page}
              count={this.state.count}
            />
          </span>
        </span>
        <hr />
        <div className="table-responsive">
          <table className="table table-hover table-sm grid" cellPadding="4">
            <thead>
              <tr>
                <HeaderCell label="Αριθμός" sortfield="UniqueId" currentsort={component.state.sortfield} currentdir={component.state.sortdir} onSort={component.sort} />
                <HeaderCell label="Τύπος συναλλαγής" sortfield="Τype" currentsort={component.state.sortfield} currentdir={component.state.sortdir} onSort={component.sort} />
                <HeaderCell label="Ημερομηνία" sortfield="Completed" currentsort={component.state.sortfield} currentdir={component.state.sortdir} onSort={component.sort} />
                <HeaderCell label="Κωδικός αναφοράς" sortfield="merchantReference" currentsort={component.state.sortfield} currentdir={component.state.sortdir} onSort={component.sort} />
                <HeaderCell label="Περιγραφή" sortfield="Description" currentsort={component.state.sortfield} currentdir={component.state.sortdir} onSort={component.sort} />
                <HeaderCell label="Αξια" sortfield="Value" styleclass="numeric" currentsort={component.state.sortfield} currentdir={component.state.sortdir} onSort={component.sort} />
                <HeaderCell label="Υπόλοιπο" sortfield="Balance" styleclass="numeric" currentsort={component.state.sortfield} currentdir={component.state.sortdir} onSort={component.sort} />
              </tr>
            </thead>
            <tbody>
              {this.state.transactions
                ? this.state.transactions.map(function(transaction) {
                    return (
                      <tr key={transaction.id}>
                        <TextCell value={transaction.uniqueId}/>
                        <TextCell value={transaction.type}/>
                        <TextCell value={component.dateFormatter.format(Date.parse(transaction.completed))}/>
                        <TextCell value={transaction.merchantReference}/>
                        <TextCell value={transaction.description}/>
                        <TextCell value={component.numberFormatter.format(transaction.value.amount)} className="numeric" />
                        <TextCell value={component.numberFormatter.format(transaction.balance.amount)} className="numeric" />
                      </tr>
                    );
                  })
                : ""}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
