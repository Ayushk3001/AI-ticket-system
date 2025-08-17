import React from 'react';
import './Table.css';

const Table = ({
  children,
  className = '',
  stickyHeader = false,
  ...props
}) => {
  const classes = [
    'table-container',
    stickyHeader ? 'table-container--sticky' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      <table className="table" {...props}>
        {children}
      </table>
    </div>
  );
};

const TableHeader = ({ children, className = '', ...props }) => (
  <thead className={`table-header ${className}`} {...props}>
    {children}
  </thead>
);

const TableBody = ({ children, className = '', ...props }) => (
  <tbody className={`table-body ${className}`} {...props}>
    {children}
  </tbody>
);

const TableRow = ({ children, className = '', clickable = false, ...props }) => {
  const classes = [
    'table-row',
    clickable ? 'table-row--clickable' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <tr className={classes} {...props}>
      {children}
    </tr>
  );
};

const TableCell = ({ children, className = '', ...props }) => (
  <td className={`table-cell ${className}`} {...props}>
    {children}
  </td>
);

const TableHeaderCell = ({ children, className = '', ...props }) => (
  <th className={`table-header-cell ${className}`} {...props}>
    {children}
  </th>
);

Table.Header = TableHeader;
Table.Body = TableBody;
Table.Row = TableRow;
Table.Cell = TableCell;
Table.HeaderCell = TableHeaderCell;

export default Table;