import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import PropTypes from 'prop-types';

import { withWidth } from '@material-ui/core';
import { isWidthDown } from '@material-ui/core/withWidth';

class SimpleTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      current: '',
    };
    this.orders = {};
    props.columns.forEach(element => {
      this.orders[element.key] = 1;
    });
  }

  componentDidMount() {
    if (this.props.setRef) this.props.setRef(this);
  }

  getBreakPoint = () => {
    if (isWidthDown('xs', this.props.width, false)) return 0;
    if (isWidthDown('sm', this.props.width, false)) return 1;
    if (isWidthDown('md', this.props.width, false)) return 2;
    if (isWidthDown('lg', this.props.width, false)) return 3;
    if (isWidthDown('xl', this.props.width, false)) return 4;
    return 5;
  }

  render() {
    const { columns, data, useTranslate, cellStyle, cellClassName, columnClassName, columnStyle } = this.props;
    const breakPoint = this.getBreakPoint();
    const shouldRenders = columns.map(e => !e.shouldRender || e.shouldRender(columns, breakPoint));
    return (
      <Table style={{ maxWidth: '100%', ...this.props.style }} className={this.props.className}>
        <TableHead>
          <TableRow>
            {columns.map((e, k) => {
              if (!shouldRenders[k]) return null;
              let otherProps = {};
              if (e.sort) {
                otherProps.onClick = () => {
                  this.setState({
                    data: data.sort((a, b) => this.orders[e.key] * e.sort(a, b)),
                    current: e.key,
                  });
                  this.orders[e.key] *= -1;
                };
              }
              return <TableCell key={k} {...otherProps} style={columnStyle} className={columnClassName}>
                <TableSortLabel direction={this.orders[e.key] === 1 ? 'asc' : 'desc'} active={this.state.current === e.key} >
                  <span className={'first-cap first-cap-span'} style={e.headerStyle} >{useTranslate && e.name ? useTranslate(e.name) : e.name}</span>
                </TableSortLabel>
              </TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((e, k) => {
            return (
              <TableRow key={k} hover
                className={this.props.rowClassName}
                onClick={this.props.onRowClick ? event => this.props.onRowClick(event, e, k) : undefined}
              >
                {
                  columns.map((c, ck) => {
                    if (!shouldRenders[ck]) return null;
                    return (
                      <TableCell style={cellStyle} className={cellClassName} key={ck} >
                        {columns[ck].render ? columns[ck].render(e, k, this.props) : e[c.key]}
                      </TableCell>
                    );
                  })
                }
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    );
  }
}

SimpleTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
    render: PropTypes.func
  })),
  data: PropTypes.array.isRequired,
  cellStyle: PropTypes.object,
  cellClassName: PropTypes.string,
  columnStyle: PropTypes.object,
  columnClassName: PropTypes.string,
  rowClassName: PropTypes.string,
  useTranslate: PropTypes.func,
  onRowClick: PropTypes.func // event, obj, idx
};

export default withWidth()(SimpleTable);
