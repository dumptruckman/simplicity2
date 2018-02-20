import React from 'react';
import mergeProps from './mergeProps';
import PropTypes from "prop-types";

export default function keyboardNavigation(WrappedReactTable) {
  class KeyboardNavigableReactTable extends React.Component {
    constructor(props) {
      super(props);
      this.getCustomTdProps = this.getCustomTdProps.bind(this);
      this.state = {
        focused: {
          row: 1,
          column: 1,
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
      if (this.props.columns[focusedCol - 1].accessor === column.id && focusedRow === rowInfo.viewIndex + 1) {
        focused = true;
      }

      return {
        tabIndex: focused ? 0 : -1,
        'data-row': rowInfo.viewIndex + 1,
        'data-col': column.id,
        'data-parent': this.props.tableId,
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
        onFocus: (e) => {
          const newFocused = {
            row: rowInfo.viewIndex + 1,
            column: this.props.columns.findIndex(c => c.accessor === column.id) + 1,
          };
          console.log('focus: ', newFocused);
          this.setState({
            focused: newFocused,
          });
        },
        onKeyDown: (e) => {
          let changed = false;
          if (e.key === 'ArrowLeft') {
            changed = true;
            focusedCol -= 1;
            if (focusedCol < 1) {
              focusedCol = this.props.columns.length;
            }
          } else if (e.key === 'ArrowRight') {
            changed = true;
            focusedCol += 1;
            if (focusedCol > this.props.columns.length) {
              focusedCol = 1;
            }
          } else if (e.key === 'ArrowUp') {
            changed = true;
            focusedRow -= 1;
            if (focusedRow < 1) {
              focusedRow = state.endRow;
            }
          } else if (e.key === 'ArrowDown') {
            changed = true;
            focusedRow += 1;
            if (focusedRow > state.endRow) {
              focusedRow = 1;
            }
          }

          if (changed) {
            e.preventDefault();
            console.log('row: ', focusedRow, ' col: ', focusedCol);
            console.log('column: ', this.props.columns[focusedCol - 1]);

            const nodes = document.querySelectorAll(`[data-row="${focusedRow}"][data-col="${this.props.columns[focusedCol - 1].accessor}"][data-parent="${this.props.tableId}"]`);
            nodes[0].focus();
          }
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

  const myPropTypes = {
    tableId: PropTypes.string.isRequired,
  };

  KeyboardNavigableReactTable.propTypes = { ...WrappedReactTable.propTypes, ...myPropTypes };

  return KeyboardNavigableReactTable;
}
