import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Paper, Button } from '@material-ui/core';
import TableComponent from '../../../../../components/table/TableComponent';


export const ReportesAparatologiaContainer = (props) => {

    const {
        onChangeStartDate,
		onChangeEndDate,
		startDate,
		endDate,
		onClickReportes,
        // TABLE DATES PROPERTIES
        titulo,
        columns,
        citas,
        actions,
        options,

    } = props;

    return (
        <Fragment>
            <Paper>
				<Grid container spacing={3} justify="center">
                    <Grid item xs={12} sm={2}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Grid 
								container
								justify="center"
								alignItems="center" >
								<KeyboardDatePicker
									disableToolbar
									loadingIndicator
									autoOk
									variant="inline"
									format="dd/MM/yyyy"
									margin="normal"
									id="date-picker-inline-filter"
									label="FECHA INICIAL"
									value={startDate}
									onChange={onChangeStartDate}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}} />
							</Grid>
						</MuiPickersUtilsProvider>
					</Grid>
					<Grid item xs={12} sm={2}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Grid 
								container
								justify="center"
								alignItems="center" >
								<KeyboardDatePicker
									disableToolbar
									loadingIndicator
									autoOk
									variant="inline"
									format="dd/MM/yyyy"
									margin="normal"
									id="date-picker-inline-filter"
									label="FECHA FINAL"
									value={endDate}
									onChange={onChangeEndDate}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}} />
							</Grid>
						</MuiPickersUtilsProvider>
					</Grid>
					<Grid item xs={12} sm={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => onClickReportes()} >
                            OBTENER DATOS
                        </Button>
                    </Grid>
				</Grid>
            </Paper>

            <TableComponent
                titulo={titulo}
                columns={columns}
                data={citas}
                actions={actions}
                options={options} />

        </Fragment>
    );
}
