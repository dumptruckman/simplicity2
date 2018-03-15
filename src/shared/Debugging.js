import React from 'react';
import mergeProps from './mergeProps';

export default function debugging(WrappedReactTable) {
  class DebuggableReactTable extends React.Component {
    getOnClickDebugging = type => (state, rowInfo, column, instance) => ({
      onClick: () => {
        console.log(`${type} element clicked`);
        console.log('With state: ', state);
        console.log('With rowInfo: ', rowInfo);
        console.log('With column: ', column);
        console.log('With instance: ', instance);
      },
    });

    render() {
      const newProps = { ...this.props };


      newProps.getTdProps = mergeProps(this.getOnClickDebugging('Td'), this.props.getTdProps);
      newProps.getThProps = mergeProps(this.getOnClickDebugging('Th'), this.props.getThProps);
      newProps.getTheadThProps = mergeProps(this.getOnClickDebugging('TheadTh'), this.props.getTheadThProps);
      newProps.getTheadFilterThProps = mergeProps(this.getOnClickDebugging('TheadFilterTh'), this.props.getTheadFilterThProps);

      return (
        <WrappedReactTable
          {...newProps}
        />
      );
    }
  }

  DebuggableReactTable.propTypes = WrappedReactTable.propTypes;
  return DebuggableReactTable;
}
