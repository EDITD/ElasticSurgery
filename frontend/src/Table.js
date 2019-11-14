import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TableCell, TableSortLabel, InputBase } from '@material-ui/core';
import { AutoSizer, Column, Table as VTable } from 'react-virtualized';
import './Table.css'

function applySort(data, sortKey, sortDirection) {
    const comparitor = (a, b) => {
        let aSortValue = a[sortKey], bSortValue = b[sortKey];

        if (typeof(aSortValue) === 'string' && typeof(bSortValue) === 'string') {
            aSortValue = aSortValue.toLowerCase();
            bSortValue = bSortValue.toLowerCase();
        }

        if (aSortValue < bSortValue) {
            return -1;
        } else if (bSortValue < aSortValue) {
            return 1;
        }
        return 0;
    };

    if (sortKey) {
        let sortComparitor = sortDirection === 'desc' ? (a, b) => -comparitor(a, b) : comparitor;
        data.sort(sortComparitor);
    }
    return data;
}

function applySearch(data, searchTerms) {
    return Object.entries(searchTerms).reduce((filteredData, [searchKey, searchTerm]) => {
        const preparedSearchTerm = searchTerm.toLowerCase();
        return filteredData.filter(d => {
            const searchValue = d[searchKey].toLowerCase();
            return searchValue.indexOf(preparedSearchTerm) >= 0;
        });
    }, data);
}

function applyFormatters(data, config) {
    const formatters = config.reduce((formattedColumns, columnConfig) => {
        if (columnConfig.formatter) {
            return {
                ...formattedColumns,
                [columnConfig.dataKey]: columnConfig.formatter,
            };
        }
        return formattedColumns;
    }, {});

    if (formatters) {
        return data.map(d => {
            const formattedDatum = {...d};
            for (let [key, formatter] of Object.entries(formatters)) {
                formattedDatum[key] = formatter(d[key]);
            }
            return formattedDatum;
        });
    }

    return data;
}

const EditableCell = ({ originalValue, onEdit }) => {
    const [editedValue, setEditedValue] = React.useState(originalValue);
    const handleChange = e => setEditedValue(e.target.value);
    const handleEditEnd = () => onEdit(editedValue, originalValue);
    return <InputBase placeholder={originalValue} value={editedValue} onChange={handleChange} onBlur={handleEditEnd} />
};

export default class Table extends Component {
    static propTypes = {
        config: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string.isRequired,
            dataKey: PropTypes.string.isRequired,
            formatter: PropTypes.func,
            searchable: PropTypes.bool,
            sortable: PropTypes.bool,
            editable: PropTypes.bool,
            width: PropTypes.number,
            flexGrow: PropTypes.number,
        })).isRequired,
        onCellEdit: PropTypes.func,
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
        headerHeight: PropTypes.number.isRequired,
        rowHeight: PropTypes.number.isRequired,
    };

    static defaultProps = {
        headerHeight: 70,
        rowHeight: 48,
    };

    state = {
        orderBy: '',
        orderDirection: 'asc',
        searchTerms: {},
        data: [],
    };

    componentDidMount() {
        this.updateSortAndSearch();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.data !== prevProps.data) {
            this.updateSortAndSearch();
        }

        if (prevState.orderBy !== this.state.orderBy || prevState.orderDirection !== this.state.orderDirection) {
            this.updateSortAndSearch();
        }

        if (prevState.searchTerms !== this.state.searchTerms) {
            this.updateSortAndSearch();
        }
    }

    updateSortAndSearch() {
        const { orderBy, orderDirection, searchTerms } = this.state;
        const { config, data } = this.props;

        this.setState({
            data: applySearch(  // search using formatted values
                applyFormatters(  // format/pretty for user
                    [...applySort(  // sort with raw input values
                        data,
                        orderBy,
                        orderDirection,
                    )],
                    config,
                ),
                searchTerms,
            ),
        });
    };

    createSortHandler = property => e => {
        const { orderBy, orderDirection } = this.state;
        const isDesc = orderBy === property && orderDirection === 'desc';
        this.setState({
            orderBy: property,
            orderDirection: isDesc ? 'asc' : 'desc',
        });
    };

    createSearchHandler = property => e => {
        const term = e.target.value;
        this.setState(s => ({
            searchTerms: {
                ...s.searchTerms,
                [property]: term,
            }
        }));
    };

    headerRenderer = ({ config, style }) => {
        const { orderBy, orderDirection, searchTerms } = this.state;
        const { title, searchable, sortable } = config;
        return <TableCell
            variant="head"
            style={style}
            component="div"
        >
            {sortable && <TableSortLabel
                active={orderBy === config.dataKey}
                direction={orderDirection}
                onClick={this.createSortHandler(config.dataKey)}
            >{title}</TableSortLabel>}
            {!sortable && <span>{title}</span>}
            {searchable && <InputBase
                placeholder="Search"
                margin="dense"
                value={searchTerms[config.dataKey] || ''}
                onChange={this.createSearchHandler(config.dataKey)}
                inputProps={{
                    style: {
                        fontSize: 12,
                        padding: 0,
                    }
                }}
            />}
        </TableCell>
    };

    createEditHandler = (config, index) => (newValue, oldValue) => {
        this.props.onCellEdit(this.getRowData({ index }), config.dataKey, newValue, oldValue);
    };

    cellRenderer = ({ rowIndex, cellData, style, config }) => {
        if (!config.editable) {
            return <TableCell
                variant="body"
                style={style}
                component="div"
            >
                <span>{cellData}</span>
            </TableCell>;
        }

        return <TableCell
                    variant="body"
                    style={style}
                    component="div"
                >
                    <EditableCell originalValue={cellData} onEdit={this.createEditHandler(config, rowIndex)} />
                </TableCell>;
    };

    getRowData = ({ index }) => {
        return this.state.data[index];
    };

    render() {
        return <AutoSizer>
        {({height, width}) =>
            <VTable
                height={height}
                width={width}
                rowHeight={this.props.rowHeight}
                headerHeight={this.props.headerHeight}
                rowCount={this.state.data.length}
                rowGetter={this.getRowData}
            >
                {this.props.config.map(config => {
                    const { dataKey } = config;
                    return <Column
                        key={dataKey}
                        headerRenderer={({...args}) => this.headerRenderer({...args, config})}
                        cellRenderer={({...args}) => this.cellRenderer({...args, config})}
                        dataKey={dataKey}
                        {...config}
                    />;
                })}
            </VTable>
        }
        </AutoSizer>
    }
}
