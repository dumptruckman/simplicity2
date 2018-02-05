import React from 'react';
import mergeProps from './mergeProps';

export default function keyboardNavigation(WrappedReactTable) {
  class KeyboardNavigableReactTable extends React.Component {
    constructor(props) {
      super(props);
      this.getCustomTdProps = this.getCustomTdProps.bind(this);
      this.state = {
        focused: {
          row: 0,
          column: 0,
        },
      };
    }

    componentDidMount() {
      // ... that takes care of the subscription...
      // DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      // DataSource.removeChangeListener(this.handleChange);
    }

    getCustomTdProps(state, rowInfo, column, instance) {
      let focusedCol = this.state.focused.column;
      let focusedRow = this.state.focused.row;

      let focused = false;
      if (this.props.columns[focusedCol].accessor === column.id && focusedRow === rowInfo.viewIndex) {
        focused = true;
      }

      return {
        tabIndex: focused ? 0 : -1,
        onClick: (e, handleOriginal) => {
          console.log('A Td Element was clicked!');
          console.log('it has this state:', state);
          console.log('It was in this column:', column);
          console.log('It was in this row:', rowInfo);
          // console.log('It was in this table instance:', instance);

          // IMPORTANT! React-Table uses onClick internally to trigger
          // events like expanding SubComponents and pivots.
          // By default a custom 'onClick' handler will override this functionality.
          // If you want to fire the original onClick handler, call the
          // 'handleOriginal' function.
          if (handleOriginal) {
            handleOriginal();
          }
        },
        onKeyDown: (e) => {
          if (e.key === 37) { // left
            focusedCol -= 1;
          } else if (e.key === 39) { // right
            focusedCol += 1;
          } else if (e.key === 38) { // up
            focusedRow -= 1;
          } else if (e.key === 40) { // down
            focusedRow += 1;
          }
          this.setState({
            focused: {
              row: focusedRow,
              column: focusedCol,
            },
          });
        },
      };
    }

    render() {
      const newProps = Object.assign({}, this.props);
      const getTdProps = newProps.getTdProps;

      let newGetTdProps;
      if (getTdProps) {
        newGetTdProps = mergeProps(this.getCustomTdProps, getTdProps);
        delete newProps.getTdProps;
      } else {
        newGetTdProps = this.getCustomTdProps;
      }

      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return (
        <WrappedReactTable
          getTdProps={newGetTdProps}
          {...newProps}
        />
      );
    }
  }

  KeyboardNavigableReactTable.propTypes = WrappedReactTable.propTypes;
  return KeyboardNavigableReactTable;
}
