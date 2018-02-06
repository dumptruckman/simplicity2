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

function combineAndReplaceProp(newProps, oldProp, replacementProp) {
  let newProp;
  if (oldProp) {
    newProp = mergeProps(replacementProp, oldProp);
    delete newProps.oldProp;
  } else {
    newProp = replacementProp;
  }
  return newProp;
}

export default function screenReadable(WrappedReactTable) {
  const ScreenReadableReactTable = (props) => {
    const newProps = Object.assign({}, props);

    const getTableProps = combineAndReplaceProp(newProps, newProps.getTableProps, getCustomTableProps);
    const getTrGroupProps = combineAndReplaceProp(newProps, newProps.getTrGroupProps, getCustomTrGroupProps);
    const getTrProps = combineAndReplaceProp(newProps, newProps.getTrProps, getCustomTrProps);
    const getThProps = combineAndReplaceProp(newProps, newProps.getThProps, getCustomThProps);
    const getTdProps = combineAndReplaceProp(newProps, newProps.getTdProps, getCustomTdProps);


    return (
      <WrappedReactTable
        getTableProps={getTableProps}
        getTrGroupProps={getTrGroupProps}
        getTrProps={getTrProps}
        getThProps={getThProps}
        getTdProps={getTdProps}
        {...newProps}
      />
    );
  };

  ScreenReadableReactTable.propTypes = WrappedReactTable.propTypes;

  return ScreenReadableReactTable;
}
