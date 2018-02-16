import React from "react";
import Cells from "./Cells";
import Pager from "./Pager";

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
      culture: this.props.culture
    };

    this.sort = this.sort.bind(this);
    this.search = this.search.bind(this);
    this.pageChanged = this.pageChanged.bind(this);
  }

  componentDidMount() {
    this.search();
  }

  search() {
    var component = this;
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("readystatechange", function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var documents_response = JSON.parse(xhr.response);
          component.setState({
            documents: documents_response.items,
            count: documents_response.count
          });
        } else {
          // do some error handling here!
          component.setState({ documents: null, count: 0, pagecount: 0 });
        }
      }
    });
    var doctype = `?Filter.TypeId=${component.state.doctypeid}`;
    var sort = `&sort=${component.state.sortfield}${
      component.state.sortdir === "asc" ? "+" : "-"
    }`;
    var size = `&size=${component.state.pagesize}`;
    var page = `&page=${component.state.page}`;
    var culture = `&culture=${component.state.culture}`;
    var url = `https://${component.state.environment}.incontrl.io/subscriptions/${component.state.subscriptionid}/documents${doctype}${page}${size}${sort}${culture}`;
    xhr.open("GET", url);
    xhr.setRequestHeader(
      "Authorization",
      "Bearer " + component.state.access_token
    );
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send();
  }

  addRootPath(permaLink) {
    var culture = `?culture=${this.state.culture}`;
    return `https://${
      this.state.environment
    }.incontrl.io${permaLink}${culture}`;
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

  render() {
    var component = this;
    return (
      <div>
        <Pager
          onChange={this.pageChanged}
          pagesize={this.state.pagesize}
          page={this.state.page}
          count={this.state.count}/>
        <hr />
        <div className="table-responsive">
          <table className="table table-hover table-sm grid" cellPadding="4">
            <thead>
              <tr>
                {Cells.headerCell("Αριθμός","numberPrintable",component.state.sortField,component.sort)}
                {Cells.headerCell("Ονοματεπώνυμο","recipient.contact.lastName",component.state.sortField,component.sort)}
                {Cells.headerCell("Ημερομηνία","date",component.state.sortField,component.sort)}
                {Cells.headerCell("Κατάσταση","status",component.state.sortField,component.sort)}
                {Cells.headerCell("Κωδ.Πληρωμής","paymentCode",component.state.sortField,component.sort)}
                {Cells.headerCell("Νόμισμα","currencyCode",component.state.sortField,component.sort)}
                {Cells.headerCell("Αξία","subTotal",component.state.sortField,component.sort)}
                {Cells.headerCell("ΦΠΑ","totalSalesTax",component.state.sortField,component.sort)}
                {Cells.headerCell("Συνολική αξία","total",component.state.sortField,component.sort)}
              </tr>
            </thead>
            <tbody>
              {this.state.documents
                ? this.state.documents.map(function(doc) {
                    return (
                      <tr key={doc.id}>
                        {Cells.linkCell(doc.numberPrintable,undefined,component.addRootPath(doc.permaLink),"__new")}
                        {Cells.linkCell(`${doc.recipient.contact.lastName} ${doc.recipient.contact.firstName}`,undefined,component.userlinkfunc(doc.id),"__new")}
                        {Cells.dateCell(doc.date, component.state.culture)}
                        {Cells.statusCell(doc.status)}
                        {Cells.cell(doc.paymentCode)}
                        {Cells.cell(doc.currencyCode)}
                        {Cells.numericCell(doc.subTotal,doc.currencyCode,component.state.culture)}
                        {Cells.numericCell(doc.totalSalesTax,doc.currencyCode,component.state.culture)}
                        {Cells.moneyCell(doc.total,doc.currencyCode,component.state.culture)}
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
