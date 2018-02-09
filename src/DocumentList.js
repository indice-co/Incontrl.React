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
            page: 1
        };

        this.sort = this
            .sort
            .bind(this);
        this.pagesize = this
            .pagesize
            .bind(this);
        this.search = this
            .search
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
                    component.setState({documents: documents_response.items});
                } else {
                    component.setState({documents: null});
                }
            }
        });
        var doctype = `?Filter.TypeId=${component.state.doctypeid}`
        var sort = `&sort=${component.state.sortfield}${component.state.sortdir === 'asc'
            ? '+'
            : '-'}`;
        var size = `&size=${component.state.pagesize}`;
        var page = `&page=${component.state.page}`;
        var url = `https://${component.state.environment}.incontrl.io/subscriptions/${component.state.subscriptionid}/documents${doctype}${sort}${size}`;
        console.log(url);
        xhr.open("GET", url);
        xhr.setRequestHeader("Authorization", "Bearer " + component.state.access_token);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send();
    }

    addRootPath(permaLink) {
        return `https://${this.state.environment}.incontrl.io${permaLink}`;
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
                <span className={className}><code>{value}</code></span>
            </td>
        );
    }

    dateCell(value, className) {
        var dateFormatter = new Intl.DateTimeFormat('el-GR');
        var date = Date.parse(value);
        return this.cell(dateFormatter.format(date), "date");
    }

    moneyCell(value, currencyCode) {
        if(!value) value=0;
        var numberFormat = new Intl.NumberFormat('el-GR', { style : 'currency', currency : currencyCode, minimumFractionDigits: 2, 
        maximumFractionDigits: 2 });
        return this.cell(numberFormat.format(value), "numeric");
    }

    numericCell(value, currencyCode) {
        if(!value) value=0;
        var numberFormat = new Intl.NumberFormat('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        return this.cell(numberFormat.format(value), "numeric");
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
                Page size:&nbsp;
                <select onChange={this.pagesize} value={this.state.pagesize}>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
            </div>
        );
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
                                            <td>{doc.recipient.contact.lastName} {doc.recipient.contact.firstName}</td>
                                            {component.dateCell(doc.date)}
                                            {component.statusCell(doc.status)}
                                            {component.cell(doc.paymentCode)}
                                            {component.cell(doc.currencyCode)}
                                            {component.numericCell(doc.subTotal,doc.currencyCode)}
                                            {component.numericCell(doc.totalSalesTax,doc.currencyCode)}
                                            {component.moneyCell(doc.total,doc.currencyCode)}
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

export default DocumentList