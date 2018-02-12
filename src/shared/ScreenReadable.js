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
  const ScreenReadableReactTable = (props) => {
    const newProps = Object.assign({}, props);

    newProps.getTableProps = mergeProps(getCustomTableProps, props.getTableProps);
    newProps.getTrGroupProps = mergeProps(getCustomTrGroupProps, props.getTrGroupProps);
    newProps.getTrProps = mergeProps(getCustomTrProps, props.getTrProps);
    newProps.getTheadThProps = mergeProps(getCustomTheadThProps, props.getTheadThProps);
    newProps.getTdProps = mergeProps(getCustomTdProps, props.getTdProps);

    return (
      <WrappedReactTable
        {...newProps}
      />
    );
  };

  const myPropTypes = {
    ariaLabel: PropTypes.string,
    ariaLabelledBy: PropTypes.string,
    ariaDescribedBy: PropTypes.string,
  };

  ScreenReadableReactTable.propTypes = Object.assign({}, WrappedReactTable.propTypes, myPropTypes);

  return ScreenReadableReactTable;
}
