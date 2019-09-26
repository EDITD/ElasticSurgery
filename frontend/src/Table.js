import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import { AutoSizer, Column, Table as VTable } from 'react-virtualized';
import './Table.css'

export default class Table extends Component {
    static propTypes = {
        config: PropTypes.arrayOf(PropTypes.shape({
            title: PropTypes.string.isRequired,
            dataKey: PropTypes.string.isRequired,
            formatter: PropTypes.func,
            width: PropTypes.number,
            flexGrow: PropTypes.number,
        })).isRequired,
        data: PropTypes.arrayOf(PropTypes.object).isRequired,
        headerHeight: PropTypes.number.isRequired,
        rowHeight: PropTypes.number.isRequired,
    };

    static defaultProps = {
        headerHeight: 48,
        rowHeight: 48,
    };

    headerRenderer = ({ title, style }) => {
        return <TableCell
            variant="head"
            style={style}
            component="div"
        >
            <span>{title}</span>
        </TableCell>
    };

    cellRenderer = ({ cellData, style, config }) => {
        const data = config.formatter ? config.formatter(cellData) : cellData;

        return <TableCell
            variant="body"
            style={style}
            component="div"
        >
            <span>{data}</span>
        </TableCell>
    };

    getRowData = ({ index }) => this.props.data[index];

    render() {
        return <AutoSizer>
        {({height, width}) =>
            <VTable
                height={height}
                width={width}
                rowHeight={this.props.rowHeight}
                headerHeight={this.props.headerHeight}
                rowCount={this.props.data.length}
                rowGetter={this.getRowData}
            >
                {this.props.config.map(({ title, dataKey, ...columnConfig }) => {
                    return <Column
                        key={dataKey}
                        headerRenderer={headerProps => this.headerRenderer({
                            ...headerProps,
                            title,
                            dataKey,
                        })}
                        cellRenderer={({...args}) =>
                            this.cellRenderer({...args, config: {
                                title,
                                dataKey,
                                ...columnConfig,
                            }})
                        }
                        dataKey={dataKey}
                        {...columnConfig}
                    />;
                })}
            </VTable>
        }
        </AutoSizer>
    }
}
