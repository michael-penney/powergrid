/***
 * dropDownList extension.
 * Enabled when column type is 'dropdown'.
 * Represents a list of values depends from column name or column id
 *
 * @option getOptionsForColumn(name, index) => [{ label: string, value: string }, ...]
 * @option showEmptyOption(name, index) => boolean
 * name - it's column name
 * index - it's column index
 */

define(['../override', 'jquery', '../utils'], function(override, $, utils) {

    return {
        loadFirst: ['directinput'],
        init: function(grid, options) {
            override(grid, function($super) {
                return {
                    renderCellContent: function(record, column, value) {
                        const isDropDownListCol = column.type === 'dropdown';
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

                            // FIXME a hack for tree-grid extension
                            if (value === undefined) {
                                return cellContent;
                            }

                            let dropDownList = document.createElement('select');
                            dropDownList.setAttribute('id', utils.getValue(record, 0) + '-key-' + column.key);
                            dropDownList.setAttribute('class', 'pg-dropDownList');

                            if (options.showEmptyOption && options.showEmptyOption(column._key, column.key)) {
                                // render empty option
                                let option = document.createElement('option');
                                option.setAttribute('value', undefined);
                                option.textContent = '---';
                                if (value === "") option.setAttribute('selected', 'true');
                                dropDownList.appendChild(option);
                            }

                            // render options
                            options.getOptionsForColumn && options.getOptionsForColumn(column._key, column.key).forEach(function(element) {
                                let option = document.createElement('option');
                                option.setAttribute('value', element.value);
                                option.textContent = element.label;
                                if (element.value === value) option.setAttribute('selected', 'true');
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
