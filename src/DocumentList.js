import React from "react";
import Cells from "./Cells";
import Pager from "./Pager";
import HeaderCell from "./Cells/HeaderCell";
import ButtonCell from "./Cells/ButtonCell";
import SelectCell from "./Cells/SelectCell";
import LinkCell from "./Cells/LinkCell";
import TextCell from "./Cells/TextCell";

// some comment to test my CI process
export default class DocumentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      access_token: this.props.token,
      subscriptionid: this.props.subscriptionid,
      doctypeid: this.props.doctypeid,
      environment: this.props.environment,
      debug: this.props.debug,
      sortfield: "numberPrintable",
      sortdir: "asc",
      pagesize: 20,
      page: 1,
      count: 0,
    };
    
    this.culture = this.props.culture;
    // eslint-disable-next-line
    this.linkfunc = eval(this.props.link ? this.props.link : "doc => ``");
    // eslint-disable-next-line
    this.userlinkfunc = eval(
      this.props.userlink ? this.props.userlink : "doc => ``"
    );
    this.sort = this.sort.bind(this);
    this.search = this.search.bind(this);
    this.pageChanged = this.pageChanged.bind(this);
    
    this.statusoptions = [
      { value: "Draft", label: "Draft" },
      { value: "Issued", label: "Issued" },
      { value: "Overdue", label: "Overdue" },
      { value: "Partial", label: "Partial" },
      { value: "Paid", label: "Paid" },
      { value: "Void", label: "Void" },
      { value: "Deleted", label: "Deleted" }
    ];

    this.numberFormatter = new Intl.NumberFormat(this.culture, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    this.dateFormatter = new Intl.DateTimeFormat(this.culture);
  }

  componentDidMount() {
    this.search();
  }

  getMoneyFormatter(currencyCode) {
    return new Intl.NumberFormat(this.culture, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
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
    var url = `https://${
      component.state.environment
    }.incontrl.io/subscriptions/${
      component.state.subscriptionid
    }/documents${doctype}${page}${size}${sort}${culture}`;
    console.log(url);
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

  getProduct(doc) {
    var name = "";
    if (doc.lines && doc.lines.length > 0) {
      if (doc.lines[0].product) {
        name = doc.lines[0].product.name;
      } else {
        name = doc.lines[0].description;
      }
    }
    return name;
  }

  statusButtonHandler(doc, e) {
    console.log("statusButtonHandler " + doc.id);
    this.setState({
      editdocid: doc.id
    });
  }

  statusChangehandler(doc,e) {
    console.log("statusChangehandler " + doc.id);
    this.setState({
      editdocid: null
    });
  }

  cancelStatusChangehandler(doc,e) {
    console.log("cancelStatusChangehandler " +doc.id);
    this.setState({
      editdocid: null
    });
  }


  isEditable(id) {
    return !(this.state.editdocid && this.state.editdocid === id);
  }

  formatDate(date) {
    return this.dateFormatter.format(date);
  }

  render() {
    var component = this;
    return (
      <div>
        <Pager
          onChange={this.pageChanged}
          pagesize={this.state.pagesize}
          page={this.state.page}
          count={this.state.count}
        />
        <hr />
        <div className="table-responsive">
          <table className="table table-hover table-sm grid" cellPadding="4">
            <thead>
              <tr>
                <HeaderCell
                  label="Αριθμός"
                  sortfield="numberPrintable"
                  currentsort={component.state.sortfield}
                  currentdir={component.state.sortdir}
                  onSort={component.sort}
                />
                <HeaderCell
                  label="Ονοματεπώνυμο"
                  sortfield="recipient.contact.lastName"
                  currentsort={component.state.sortfield}
                  currentdir={component.state.sortdir}
                  onSort={component.sort}
                />
                <HeaderCell
                  label="Ημερομηνία"
                  sortfield="date"
                  currentsort={component.state.sortfield}
                  currentdir={component.state.sortdir}
                  onSort={component.sort}
                />
                <HeaderCell
                  label="Κατάσταση"
                  sortfield="status"
                  currentsort={component.state.sortfield}
                  currentdir={component.state.sortdir}
                  onSort={component.sort}
                />
                <HeaderCell
                  label="Κωδ.Πληρωμής"
                  sortfield="paymentCode"
                  currentsort={component.state.sortfield}
                  currentdir={component.state.sortdir}
                  onSort={component.sort}
                />
                <HeaderCell label="Προϊόν / Υπηρεσία" />
                <HeaderCell
                  label="Νόμισμα"
                  sortfield="currencyCode"
                  currentsort={component.state.sortfield}
                  currentdir={component.state.sortdir}
                  onSort={component.sort}
                />
                <HeaderCell
                  label="Αξία"
                  sortfield="subTotal"
                  className="numeric"
                  currentsort={component.state.sortfield}
                  currentdir={component.state.sortdir}
                  onSort={component.sort}
                />
                <HeaderCell
                  label="ΦΠΑ"
                  sortfield="totalSalesTax"
                  className="numeric"
                  currentsort={component.state.sortfield}
                  currentdir={component.state.sortdir}
                  onSort={component.sort}
                />
                <HeaderCell
                  label="Συνολική αξία"
                  sortfield="total"
                  className="numeric"
                  currentsort={component.state.sortfield}
                  currentdir={component.state.sortdir}
                  onSort={component.sort}
                />
              </tr>
            </thead>
            <tbody>
              {this.state.documents
                ? this.state.documents.map(function(doc) {
                    return (
                      <tr key={doc.id}>
                        <LinkCell value={doc.numberPrintable} href={component.addRootPath(doc.permaLink)} target="__new" />
                        {doc.recipient.contact
                          ?
                          (<LinkCell value={`${doc.recipient.contact.lastName} ${doc.recipient.contact.firstName}`}
                          href={component.userlinkfunc(doc)} target="__new" />)
                          : 
                          (<TextCell />)
                        }
                        <TextCell value={doc.date} className="date" />
                        {component.isEditable(doc.id) ? 
                          (<ButtonCell value={doc.status} onClick={component.statusButtonHandler.bind(component,doc)}
                            className={`status-${doc.status.toLowerCase()}`}/>) 
                          : 
                          (<SelectCell
                            value={doc.status} 
                            options={component.statusoptions}
                            onChange={component.statusChangehandler.bind(component,doc)}
                            onCancel={component.cancelStatusChangehandler.bind(component,doc)}/>)
                        }
                        <TextCell value={doc.paymentCode} />
                        <TextCell value={component.getProduct(doc)} />
                        <TextCell value={doc.currencyCode} />
                        <TextCell value={component.numberFormatter.format(doc.subTotal)} className="numeric" />
                        <TextCell value={component.numberFormatter.format(doc.totalSalesTax)} className="numeric" />
                        <TextCell value={component.numberFormatter.format(doc.total)} className="numeric" />
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
