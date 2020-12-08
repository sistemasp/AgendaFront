import React from 'react';
import { forwardRef } from 'react';

import AddBox from '@material-ui/icons/AddBox';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import MaterialTable from 'material-table';
import { TablePagination, makeStyles } from '@material-ui/core';

const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowUpward {...props} ref={ref} />),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const useStyles = makeStyles({
    root: {
        backgroundColor: "blue",
        color: "green"
    },
    toolbar: {
        backgroundColor: "white"
    },
    caption: {
        color: "red",
        fontSize: "20px"
    },
    selectIcon: {
        color: "green"
    },
    select: {
        color: "green",
        fontSize: "20px"
    },
    actions: {
        color: "blue"
    }
});

const TableComponent = props => {

    const classes = useStyles();

    const {
        titulo,
        columns,
        data,
        actions,
        editable,
        options,
        components,
        detailPanel,
    } = props;

    const localization = {
        pagination: {
            labelDisplayedRows: '{from}-{to} DE {count}',
            labelRowsSelect: 'REGISTROS'
        },
        toolbar: {
            nRowsSelected: '{0} registro(s) seleccionados',
            searchTooltip: 'BUSCAR REGISTROS',
            searchPlaceholder: 'BUSCAR REGISTROS'
        },
        header: {
            actions: 'ACCIONES'
        },
        body: {
            emptyDataSourceMessage: 'NO HAY REGISTROS PARA MOSTRAR',
            filterRow: {
                filterTooltip: 'FILTRO'
            }
        },
        pagination: {
            labelRowsSelect: 'REGISTROS',
            firstTooltip: 'PRIMER PÁGINA',
            previousTooltip: 'PÁGINA ANTERIOR',
            nextTooltip: 'PÁGINA SIGUIENTE',
            lastTooltip: 'ÚLTIMA PÁGINA',
        }
    };

    return (
        <MaterialTable
            title={titulo}
            columns={columns}
            data={data}
            icons={tableIcons}
            localization={localization}
            actions={actions}
            editable={editable}
            options={options}
            components={components}
            detailPanel={detailPanel}
            classes={{
                root: classes.root,
                toolbar: classes.toolbar,
                caption: classes.caption,
                selectIcon: classes.selectIcon,
                select: classes.select,
                actions: classes.actions
            }}
        />
    );
}

export default TableComponent;
