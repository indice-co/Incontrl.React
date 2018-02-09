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
            sortdir: 'asc'
        };

        this.sort = this
            .sort
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
        var sort = `${component.state.sortfield}${component.state.sortdir === 'asc'
            ? '+'
            : '-'}`;
        console.log(' getdocuments ' + sort + ' ' + component.state.sortdir);
        var url = `https://${component.state.environment}.incontrl.io/subscriptions/${component.state.subscriptionid}/documents?Filter.TypeId=${component.state.doctypeid}&sort=${sort}`;
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
                ? 'sortable asc'
                : 'sortable desc';
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

    cell(value,className) {
        return (
            <td>
                <span>{value}</span>
            </td>
        );
    }

    dateCell(value,className) {
        return this.cell(value,"date");
    }

    numericCell(value,className) {
        return this.cell(value,"numeric");
    }

    statusCell(value) {
        return this.cell(value,`status-${value}`);
    }

    render() {
        var component = this;
        return (
            <div>
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
                                            {component.numericCell(doc.subTotal)}
                                            {component.numericCell(doc.totalSalesTax)}
                                            {component.numericCell(doc.total)}
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