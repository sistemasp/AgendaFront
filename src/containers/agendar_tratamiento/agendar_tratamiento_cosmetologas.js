import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import { Paper } from '@material-ui/core';
import TableComponent from '../../components/table/TableComponent';

export const TratamientosCosmetologasContainer = (props) => {

	const {
		onChangeFilterDate,
		filterDate,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		citas,
		options,
	} = props;

	return (
		<Fragment>
			<Paper>
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
							label="Filtrado Citas"
							value={filterDate.fecha_show}
							onChange={onChangeFilterDate}
							KeyboardButtonProps={{
								'aria-label': 'change date',
							}} />
					</Grid>
				</MuiPickersUtilsProvider>
			</Paper>

			<TableComponent
				titulo={titulo}
				columns={columns}
				data={citas}
				options={options} />

		</Fragment>
	);
}
