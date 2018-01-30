import React from 'react';
import mergeProps from './mergeProps';

const getCustomTdProps = () => ({
  onClick: (e, handleOriginal) => {
    e.target.parentNode.firstChild.click();

    // IMPORTANT! React-Table uses onClick internally to trigger
    // events like expanding SubComponents and pivots.
    // By default a custom 'onClick' handler will override this functionality.
    // If you want to fire the original onClick handler, call the
    // 'handleOriginal' function.
    if (handleOriginal) {
      handleOriginal();
    }
  },
});

export default function expandingRows(WrappedReactTable) {
  const ExpandableRowsReactTable = (props) => {
    const newProps = Object.assign({}, props);
    const getTdProps = newProps.getTdProps;

    let newGetTdProps;
    if (getTdProps) {
      newGetTdProps = mergeProps(getCustomTdProps, getTdProps);
      delete newProps.getTdProps;
    } else {
      newGetTdProps = getCustomTdProps;
    }

    return (
      <WrappedReactTable
        getTdProps={newGetTdProps}
        {...newProps}
      />
    );
  };
  ExpandableRowsReactTable.propTypes = WrappedReactTable.propTypes;
  return ExpandableRowsReactTable;
}
