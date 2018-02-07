import React from 'react';
import mergeProps from './mergeProps';

const getCustomTableProps = () => ({
  role: 'grid',
});

const getCustomTrGroupProps = () => ({
  role: 'rowgroup',
});

const getCustomTrProps = () => ({
  role: 'row',
});

const getCustomThProps = () => ({
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
    newProps.getThProps = mergeProps(getCustomThProps, props.getThProps);
    newProps.getTdProps = mergeProps(getCustomTdProps, props.getTdProps);

    return (
      <WrappedReactTable
        {...newProps}
      />
    );
  };

  ScreenReadableReactTable.propTypes = WrappedReactTable.propTypes;

  return ScreenReadableReactTable;
}
