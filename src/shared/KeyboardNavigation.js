import React from 'react';
import mergeProps from './mergeProps';
import PropTypes from 'prop-types';

export default function keyboardNavigation(WrappedReactTable) {
  class KeyboardNavigableReactTable extends React.Component {
    state = {
      focused: {
        row: 1,
        column: 1,
      },
    };

    getCustomTdProps = (state, rowInfo, column, instance) => {
      let focusedCol = this.state.focused.column;
      let focusedRow = this.state.focused.row;

      // Note that column.id is an id and not an index. Unfortunately there is not a column
      // index in passed in through the params of this function from ReactTable. Likewise, in the
      // props of the wrapped ReactTable component there is no such concept as a column index.
      // As such, we are using the position of the column string ids as an index.

      let focused = false;
      if (focusedRow === rowInfo.viewIndex + 1) {
        if (this.hasExpanderCol && focusedCol === 0) {
          if (column.expander) {
            // The expander arrow column doesn't have a column id so it is a special case
            focused = true;
          }
        } else if (this.props.columns[focusedCol - 1].accessor === column.id) {
          focused = true;
        }
      }

      return {
        tabIndex: focused ? 0 : -1,
        'data-row': rowInfo.viewIndex + 1,
        'data-col': column.id ? column.id : (column.expander && 'rt-expandable'),
        'data-parent': this.props.tableId,
        onClick: (e, handleOriginal) => {
          console.log('A Td Element was clicked!');
          console.log('it has this state:', state);
          console.log('It was in this column:', column);
          console.log('It was in this row:', rowInfo);
          console.log('It was in this instance:', instance);
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
        onFocus: () => {
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
            // Allow 0 index only if there is an expander arrow column
            if (focusedCol < (this.hasExpanderCol ? 0 : 1)) {
              focusedCol = this.props.columns.length;
            }
          } else if (e.key === 'ArrowRight') {
            changed = true;
            focusedCol += 1;
            if (focusedCol > this.props.columns.length) {
              focusedCol = this.props.SubComponent ? 0 : 1;
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

            let nodes;
            if (focusedCol === 0 && this.props.SubComponent) {
              nodes = document.querySelectorAll(`[data-row="${focusedRow}"][data-col="rt-expandable"][data-parent="${this.props.tableId}"]`);
            } else {
              nodes = document.querySelectorAll(`[data-row="${focusedRow}"][data-col="${this.props.columns[focusedCol - 1].accessor}"][data-parent="${this.props.tableId}"]`);
            }

            nodes[0].focus();
          }
        },
      };
    };

    // The presence of a subcomponent means there is an expander arrow column.
    hasExpanderCol = !!this.props.SubComponent;

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
