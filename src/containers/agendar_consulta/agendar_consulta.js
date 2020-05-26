import 'date-fns';
import React, { Fragment } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Paper, Button, TextField } from '@material-ui/core';
import TableComponent from '../../components/table/TableComponent';
import ModalCita from '../../components/modal_cita';
import { Multiselect } from 'multiselect-react-dropdown';

const useStyles = makeStyles(theme => ({
	formControl: {
		minWidth: 120,
		width: '100%',
	},
	selectEmpty: {
		marginTop: theme.spacing(2),
	},
	button: {
		width: '100%',
	}
}));

export const AgendarConsultaContainer = (props) => {

	const classes = useStyles();

	const {
		values,
		errors,
		servicios,
		tratamientos,
		horarios,
		onChangeServicio,
		onChangeTratamientos,
		onChangeFecha,
		onChangeHora,
		onChangeFilterDate,
		filterDate,
		paciente,
		onClickAgendar,
		isValid,
		isSubmitting,
		onChangePrecio,
		onChangeTiempo,
		empleado,
		disableDate,
		medicos,
		onChangeDoctors,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		citas,
		actions,
		options,
		// MODAL PROPERTIES
		openModal,
		cita,
		onClickActualizarCita,
		onClickCancel,
		onChangeTipoCita,
		onChangeAsistio,
		loadCitas,
	} = props;

	return (
		<Fragment>
			{
				openModal ?
					<ModalCita
						open={openModal}
						cita={cita}
						onClickActualizarCita={onClickActualizarCita}
						onClose={onClickCancel}
						onChangeServicio={onChangeServicio}
						onChangeTratamientos={onChangeTratamientos}
						onChangeFecha={onChangeFecha}
						onChangeHora={onChangeHora}
						onChangeTipoCita={onChangeTipoCita}
						onChangeAsistio={onChangeAsistio}
						servicios={servicios}
						tratamientos={tratamientos}
						horarios={horarios}
						empleado={empleado}
						loadCitas={loadCitas} /> : ''
			}
			<Paper>
				<h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'Selecciona un paciente'}</h1>

				<Grid container spacing={3}>
					<Grid item xs={12} sm={2}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Grid
								container
								justify="center"
								alignItems="center" >
								<KeyboardDatePicker
									disableToolbar
									//disablePast
									autoOk
									variant="inline"
									format="dd/MM/yyyy"
									margin="normal"
									id="date-picker-inline"
									label="Fecha"
									value={values.fecha_show}
									onChange={onChangeFecha}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
									invalidDateMessage='Selecciona una fecha' />
							</Grid>
						</MuiPickersUtilsProvider>
					</Grid>

					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-hora">Hora</InputLabel>
							<Select
								labelId="simple-select-outlined-hora"
								id="simple-select-outlined-hora"
								value={values.hora}
								error={Boolean(errors.hora)}
								onChange={onChangeHora}
								disabled={values.fecha_show === ''}
								label="Hora" >
								{horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>

					<Grid item xs={12} sm={2}>
						<TextField
							name="precio"
							//helperText={touched.precio ? errors.precio : ""}
							error={Boolean(errors.precio)}
							label="Precio"
							value={values.precio}
							type='Number'
							onChange={onChangePrecio}
							variant="outlined" />
					</Grid>


					<Grid item xs={12} sm={2}>
						<Button
							className={classes.button}
							variant="contained"
							color="primary"
							disabled={!isValid || isSubmitting}
							onClick={() => onClickAgendar(values)} >
							Agendar
                        </Button>
					</Grid>
				</Grid>
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
							label="Filtrado Consultas"
							value={filterDate}
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
				actions={actions}
				options={options} />

		</Fragment>
	);
}
