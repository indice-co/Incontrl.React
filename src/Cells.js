import React from "react";

export default class Cells {

  static headerCell(label, sortfield, currentSort, sort) {
    var _class = "sortable ";
    if (currentSort && sortfield.toLowerCase() === currentSort.toLowerCase()) {
      _class = this.state.sortdir === "asc"? "sortable sort-asc": "sortable sort-desc";
    }

    return (
      <th className={_class}>
        <div>
          <a href="" onClick={sort.bind(this,sortfield)}>
            <span>{label}</span>
          </a>
        </div>
      </th>
    );
  }

  static cell(value, className) {
    return (
      <td className={className}>
        <span className={className}>{value}</span>
      </td>
    );
  }

  static codeCell(value, className) {
    return (
      <td className={className}>
        <span className={className}>
          <code>{value}</code>
        </span>
      </td>
    );
  }

  static linkCell(value, className, href, target) {
    return (
      <td className={className}>
        <span className={className}>
        <a href={href} target={target}>{value}</a>
        </span>
      </td>
    );
  }

  static dateCell(value, culture) {
    var date = Date.parse(value);
    var dateFormatter = new Intl.DateTimeFormat(culture);
    return this.cell(dateFormatter.format(date), "date");
  }

  static moneyCell(value, currencyCode, culture) {
    if (!value) value = 0;
    var moneyFormatter = new Intl.NumberFormat(culture, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return this.cell(moneyFormatter.format(value), "numeric");
  }

  static numericCell(value, currencyCode, culture) {
    if (!value) value = 0;
    var numberFormatter = new Intl.NumberFormat(culture, {
        currency: currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    return this.cell(numberFormatter.format(value), "numeric");
  }

  static statusCell(value) {
    return this.cell(value, `status-${value.toLowerCase()}`);
  }
}
