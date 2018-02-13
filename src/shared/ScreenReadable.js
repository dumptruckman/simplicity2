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

const getCustomTheadThProps = () => ({
  role: 'columnheader',
});

const getCustomTdProps = () => ({
  role: 'gridcell',
});

export default function screenReadable(WrappedReactTable) {
  class ScreenReadableReactTable extends React.Component {
    state = {};

    onSortedChange = () => {
      this.setState({});
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
      newProps.getTrGroupProps = mergeProps(getCustomTrGroupProps, this.props.getTrGroupProps);
      newProps.getTrProps = mergeProps(getCustomTrProps, this.props.getTrProps);
      newProps.getTheadThProps = mergeProps(getCustomTheadThProps, this.props.getTheadThProps);
      newProps.getTdProps = mergeProps(getCustomTdProps, this.props.getTdProps);

      return (
        <WrappedReactTable
          {...newProps}
        />
      );
    }
  }

  const myPropTypes = {
    ariaLabel: PropTypes.string,
    ariaLabelledBy: PropTypes.string,
    ariaDescribedBy: PropTypes.string,
  };

  ScreenReadableReactTable.propTypes = Object.assign({}, WrappedReactTable.propTypes, myPropTypes);

  return ScreenReadableReactTable;
}
