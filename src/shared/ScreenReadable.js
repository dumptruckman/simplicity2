import React from 'react';
import PropTypes from 'prop-types';
import mergeProps from './mergeProps';
import Methods from 'react-table';

const getCustomTableProps = () => () => ({
  role: 'grid',
});

const getCustomTrGroupProps = () => ({
  role: 'rowgroup',
});

const getCustomTrProps = () => ({
  role: 'row',
});

const getCustomTheadThProps = (state, rowInfo, column) => ({
  onClick: (e, handleOriginal) => {
    console.log('A Th element was clicked!');
    console.log('It\'s state is: ', state);
    console.log('It\'s rowInfo is: ', rowInfo);
    console.log('It\'s column is: ', column);

    if (handleOriginal) {
      // This doesn't work the same as getTdProps :(
      // TODO I need to find another way to have sorting in addition to this onClick.
      // handleOriginal();
    }
  },
  role: 'columnheader',
});

const getCustomTdProps = () => ({
  role: 'gridcell',
});

export default function screenReadable(WrappedReactTable) {
  class ScreenReadableReactTable extends React.Component {
    constructor(props) {
      super(props);

      this.state = {

      };
    }

    render() {
      const newProps = Object.assign({}, this.props);

      newProps.getTableProps = mergeProps(getCustomTableProps, this.props.getTableProps);
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
