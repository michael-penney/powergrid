/***
 * dropDownList extension.
 * Enabled when column type is 'DROP_DOWN_LIST'.
 * Represents a list of values.
  */

define(['../override', 'jquery', '../utils', '../datasources/currencyDataSource'], function(override, $, utils, currencyDataSource) {

    const listData = currencyDataSource.currencyCodesList;

    return {
        loadFirst: ['directinput'],
        init: function(grid) {
            override(grid, function($super) {
                return {
                    renderCellContent: function(record, column, value) {
                        const isDropDownListCol = column.type === 'DROP_DOWN_LIST';
                        if(!isDropDownListCol) {
                            return $super.renderCellContent(record, column, value);
                        }
                        const cellContent = this.dropDownList.renderDropDownList(record, column, value);
                        const fragment = document.createDocumentFragment();
                        fragment.appendChild(cellContent);
                        fragment.appendChild($super.renderCellContent(record, column, value));
                        return fragment;
                    },

                    init: function() {
                        $super.init();
                        this.container.on('change', '.pg-dropDownList', function() {
                            let cell = $(this).parents('.pg-cell:eq(0)'),
                                row = cell.parents('.pg-row:eq(0)'),
                                key = cell.attr('data-column-key'),
                                rowId = row.data('row-id');

                            let listId = rowId + '-key-' + key;
                            let val = $('#' + listId + ' option:selected').text();
                            grid.dataSource.setValue(rowId, key, val);
                        });
                    },

                    dropDownList: {
                        renderDropDownList: function(record, column) {
                            let cellContent = document.createElement('div');
                            let value = utils.getValue(record, column.key);

                            if (value === undefined) {
                                return cellContent;
                            }

                            let dropDownList = document.createElement('select');
                            dropDownList.setAttribute('id', utils.getValue(record, 0) + '-key-' + column.key);
                            dropDownList.setAttribute('class', 'pg-dropDownList');

                            listData.forEach(function(element) {
                                let option = document.createElement('option');
                                option.setAttribute('value', element);
                                option.textContent = element;
                                if (element === value) option.setAttribute('selected', 'true');
                                dropDownList.appendChild(option);
                            });

                            cellContent.appendChild(dropDownList);
                            return cellContent;
                        },
                    }
                };
            });
        }
    };
});
