import React, {Component} from 'react';

class DocumentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            access_token: this.props.token,
            subscriptionid: this.props.subscriptionid,
            doctypeid: this.props.doctypeid,
            environment: this.props.environment,
            debug: this.props.debug,
            sortfield: 'numberPrintable',
            sortdir: 'asc',
            pagesize: 50,
            page: 1,
            pagecount: 1,
            count: 0,
            culture: this.props.culture
        };
        
        this.userlinkfunc = eval(this.props.userlink);
        // console.log(this.userlinkfunc('lalala'));

        this.dateFormatter = new Intl.DateTimeFormat(this.state.culture);
        this.numberFormatter = new Intl.NumberFormat(this.state.culture, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

        this.sort = this
            .sort
            .bind(this);
        this.pagesize = this
            .pagesize
            .bind(this);
        this.search = this
            .search
            .bind(this);
        this.firstpage = this
            .firstpage
            .bind(this);
        this.nextpage = this
            .nextpage
            .bind(this);
        this.previouspage = this
            .previouspage
            .bind(this);
        this.lastpage = this
            .lastpage
            .bind(this);
    }

    componentDidMount() {
        this.search();
    }

    search() {
        var component = this;
        var xhr = new XMLHttpRequest();
        xhr.addEventListener("readystatechange", function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var documents_response = JSON.parse(xhr.response);
                    var pagecount = Math.round((documents_response.count + component.state.pagesize - 1) / component.state.pagesize);
                    component.setState({documents: documents_response.items, count: documents_response.count, pagecount: pagecount});
                } else {
                    component.setState({documents: null, count: 0, pagecount: 0});
                }
            }
        });
        var doctype = `?Filter.TypeId=${component.state.doctypeid}`
        var sort = `&sort=${component.state.sortfield}${component.state.sortdir === 'asc'
            ? '+'
            : '-'}`;
        var size = `&size=${component.state.pagesize}`;
        var page = `&page=${component.state.page}`;
        var culture = `&culture=${component.state.culture}`;
        var url = `https://${component.state.environment}.incontrl.io/subscriptions/${component.state.subscriptionid}/documents${doctype}${page}${size}${sort}${culture}`;
        console.log(url);
        xhr.open("GET", url);
        xhr.setRequestHeader("Authorization", "Bearer " + component.state.access_token);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    addRootPath(permaLink) {
        var culture = `?culture=${this.state.culture}`;
        return `https://${this.state.environment}.incontrl.io${permaLink}${culture}`;
    }

    sort(field, e) {
        e.preventDefault();
        var dir = 'asc';
        if (field.toLowerCase() === this.state.sortfield.toLowerCase()) {
            dir = this.state.sortdir === 'asc'
                ? 'desc'
                : 'asc';
        }
        this.setState({
            sortfield: field,
            sortdir: dir
        }, () => {
            console.log('sort method: ' + field + ' ' + dir);
            this.search();
        });
    }

    headerCell(label, sortfield) {
        var _class = 'sortable ';
        if (this.state.sortfield && sortfield.toLowerCase() === this.state.sortfield.toLowerCase()) {
            _class = (this.state.sortdir === 'asc')
                ? 'sortable sort-asc'
                : 'sortable sort-desc';
        }

        return (
            <th
                className={_class}
                onClick={this
                .sort
                .bind(this, sortfield)}>
                <a href="#">
                    <span>{label}</span>
                </a>
            </th>
        );
    }

    cell(value, className) {
        return (
            <td className={className}>
                <span className={className}>{value}</span>
            </td>
        );
    }

    codecell(value, className) {
        return (
            <td className={className}>
                <span className={className}>
                    <code>{value}</code>
                </span>
            </td>
        );
    }

    dateCell(value, className) {
        var date = Date.parse(value);
        return this.cell(this.dateFormatter.format(date), "date");
    }

    moneyCell(value, currencyCode) {
        if (!value) 
            value = 0;
        var moneyFormatter = new Intl.NumberFormat(this.state.culture, {
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        return this.cell(moneyFormatter.format(value), "numeric");
    }

    numericCell(value, currencyCode) {
        if (!value) 
            value = 0;
        return this.cell(this.numberFormatter.format(value), "numeric");
    }

    statusCell(value) {
        return this.cell(value, `status-${value}`);
    }

    pagesize(e) {
        e.preventDefault();
        this.setState({
            pagesize: + e.target.value,
            page: 1
        }, () => {
            this.search();
        })
    }

    searchbar() {
        return (
            <div className="search-bar">
                Page size:
                <select onChange={this.pagesize} value={this.state.pagesize}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>

                <button onClick={this.firstpage} disabled={this.state.page === 1}>first</button>
                <button onClick={this.previouspage} disabled={this.state.page === 1}>prev</button>
                <label>page {this.state.page} of {this.state.pagecount}</label>
                <button
                    onClick={this.nextpage}
                    disabled={this.state.page === this.state.pagecount}>next</button>
                <button
                    onClick={this.lastpage}
                    disabled={this.state.page === this.state.pagecount}>last</button>
            </div>
        );
    }

    firstpage() {
        this.setState({
            page: 1
        }, () => {
            this.search();
        })
    }

    previouspage() {
        this.setState((prevState) => {
            return {
                page: prevState.page - 1
            }
        }, () => {
            this.search();
        })
    }

    nextpage() {
        this.setState((prevState) => {
            return {
                page: prevState.page + 1
            }
        }, () => {
            this.search();
        })
    }

    lastpage() {
        this.setState((prevState) => {
            return {page: prevState.pagecount}
        }, () => {
            this.search();
        })
    }

    render() {
        var component = this;
        return (
            <div>
                {component.searchbar()}
                <hr/>
                <table cellPadding="4">
                    <thead>
                        <tr>
                            {this.headerCell('Αριθμός', 'numberPrintable')}
                            {this.headerCell('Ονοματεπώνυμο', 'recipient.contact.lastName')}
                            {this.headerCell('Ημερομηνία', 'date')}
                            {this.headerCell('Κατάσταση', 'status')}
                            {this.headerCell('Κωδ.Πληρωμής', 'paymentCode')}
                            {this.headerCell('Νόμισμα', 'currencyCode')}
                            {this.headerCell('Αξία', 'subTotal')}
                            {this.headerCell('ΦΠΑ', 'totalSalesTax')}
                            {this.headerCell('Συνολική αξία', 'total')}
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.documents
                            ? this
                                .state
                                .documents
                                .map(function (doc) {
                                    return (
                                        <tr key={doc.id}>
                                            <td>
                                                <a href={component.addRootPath(doc.permaLink)} target='__new'>{doc.numberPrintable}</a>
                                            </td>
                                            <td>
                                                <a href={component.userlinkfunc(doc.id)} target='__new'>{doc.recipient.contact.lastName} {doc.recipient.contact.firstName}</a>
                                            </td>
                                            {component.dateCell(doc.date)}
                                            {component.statusCell(doc.status)}
                                            {component.cell(doc.paymentCode)}
                                            {component.cell(doc.currencyCode)}
                                            {component.numericCell(doc.subTotal, doc.currencyCode)}
                                            {component.numericCell(doc.totalSalesTax, doc.currencyCode)}
                                            {component.moneyCell(doc.total, doc.currencyCode)}
                                        </tr>
                                    )
                                })
                            : ''
}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default DocumentList;