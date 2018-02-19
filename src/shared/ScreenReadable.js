import React from 'react';
import PropTypes from 'prop-types';
import mergeProps from './mergeProps';
import Methods from 'react-table';

const getCustomTrGroupProps = () => ({
  role: 'rowgroup',
});

const getCustomTrProps = () => ({
  role: 'row',
});

const getCustomTdProps = () => ({
  role: 'gridcell',
});

// TODO Add support for multi-sortable tables
export default function screenReadable(WrappedReactTable) {
  class ScreenReadableReactTable extends React.Component {
    state = { };

    onSortedChange = (sorted) => {
      this.setState({
        sorted: sorted[0],
      });
    };

    getCustomTheadThProps = (state, rowInfo, column) => {
      const sorted = this.state.sorted;
      let ariaSort;
      if (sorted && column.id === sorted.id) {
        ariaSort = (sorted.desc ? 'descending' : 'ascending');
      } else {
        ariaSort = 'none';
      }
      return ({
        'aria-sort': ariaSort,
        role: 'columnheader',
        tabIndex: -1,
      });
    };

    getCustomTableProps = () => {
      const props = {
        role: 'grid',
      };

      if (this.props.ariaLabel) {
        props['aria-label'] = this.props.ariaLabel;
      } else if (this.props.ariaLabelledBy) {
        props['aria-labelledby'] = this.props.ariaLabelledBy;
      }

      if (this.props.ariaDescribedBy) {
        props['aria-describedby'] = this.props.ariaDescribedBy;
      }

      return props;
    };

    render() {
      const newProps = Object.assign({}, this.props);

      newProps.getTableProps = mergeProps(this.getCustomTableProps, this.props.getTableProps);
      newProps.getTheadProps = mergeProps(getCustomTrGroupProps, this.props.getTheadProps);
      // newProps.getTrGroupProps = mergeProps(getCustomTrGroupProps, this.props.getTrGroupProps);
      newProps.getTbodyProps = mergeProps(getCustomTrGroupProps, this.props.getTbodyProps);
      // newProps.getTheadTrProps = mergeProps(getCustomTrProps, this.props.getTheadTrProps);
      newProps.getTrProps = mergeProps(getCustomTrProps, this.props.getTrProps);
      newProps.getTheadThProps = mergeProps(this.getCustomTheadThProps, this.props.getTheadThProps);
      newProps.getTdProps = mergeProps(getCustomTdProps, this.props.getTdProps);

      return (
        <WrappedReactTable
          {...newProps}
          onSortedChange={this.onSortedChange}
        />
      );
    }
  }

  const myPropTypes = {
    ariaLabel: PropTypes.string,
    ariaLabelledBy: PropTypes.string,
    ariaDescribedBy: PropTypes.string,
  };

  ScreenReadableReactTable.propTypes = { ...WrappedReactTable.propTypes, ...myPropTypes };

  return ScreenReadableReactTable;
}
