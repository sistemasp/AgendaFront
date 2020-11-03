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
import ModalCita from '../../components/modales/modal_cita';
import { Multiselect } from 'multiselect-react-dropdown';
import ModalPagos from '../../components/modales/modal_pagos';
import { toFormatterCurrency } from '../../utils/utils';
import ModalImprimirTratamiento from '../../components/modales/imprimir/tratamiento';

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

export const AgendarAparatologiaContainer = (props) => {

	const classes = useStyles();

	const {
		values,
		errors,
		servicios,
		tratamientos,
		areas,
		horarios,
		tipoCitas,
		onChangeServicio,
		onChangeTratamientos,
		onChangeAreas,
		onChangeFecha,
		onChangeHora,
		onChangeFilterDate,
		filterDate,
		paciente,
		onClickAgendar,
		isValid,
		isSubmitting,
		onChangeTiempo,
		onChangeObservaciones,
		empleado,
		disableDate,
		medicos,
		promovendedores,
		cosmetologas,
		onChangeDoctors,
		onChangeTipoCita,
		onChangePromovendedor,
		onChangeCosmetologa,
		onChangeMedio,
		medios,
		medicoDirectoId,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		aparatologias,
		actions,
		options,
		components,
		// MODAL PROPERTIES
		openModal,
		cita,
		onClickActualizarCita,
		onClickCancel,
		onChangeAsistio,
		loadAparatologias,
		setFilterDate,
		// MODAL PAGOS
		onCloseVerPagos,
		openModalPagos,
		sucursal,
		setMessage,
		setOpenAlert,
		// MODAL IMPRIMIR
		openModalImprimirCita,
		datosImpresion,
		onCloseImprimirConsulta,
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
						onChangeMedio={onChangeMedio}
						onChangeAsistio={onChangeAsistio}
						servicios={servicios}
						tratamientos={tratamientos}
						horarios={horarios}
						empleado={empleado}
						loadAparatologias={loadAparatologias}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalPagos ?
					<ModalPagos
						open={openModalPagos}
						onClose={onCloseVerPagos}
						servicio={cita}
						empleado={empleado}
						sucursal={sucursal}
						setMessage={setMessage}
						setOpenAlert={setOpenAlert}
						tipoServicioId={cita.servicio._id} />
					: ''
			}
			{
				openModalImprimirCita ?
					<ModalImprimirTratamiento
						open={openModalImprimirCita}
						onClose={onCloseImprimirConsulta}
						datos={datosImpresion} />
					: ''
			}
			<Paper>
				<h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'Selecciona un paciente'}</h1>
				<Grid container spacing={3}>
					{
						false ?
							<Grid item xs={12} sm={2}>
								<Multiselect
									options={tratamientos} // Options to display in the dropdown
									displayValue="nombre" // Property name to display in the dropdown options
									onSelect={(e) => onChangeTratamientos(e)} // Function will trigger on select event
									onRemove={(e) => onChangeTratamientos(e)} // Function will trigger on remove event
									placeholder="Selecciona tratamientos"
									selectedValues={values.tratamientos} // Preselected value to persist in dropdown
								/>
							</Grid> :
							<Grid item xs={12} sm={2}>
								<FormControl variant="outlined" className={classes.formControl}>
									<InputLabel id="simple-select-outlined-tratamientos">Tratamientos</InputLabel>
									<Select
										labelId="simple-select-outlined-tratamientos"
										id="simple-select-outlined-tratamientos"
										value={values.tratamientos[0]}
										onChange={(e) => onChangeTratamientos(e)}
										label="Tratamientos" >
										{tratamientos.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
					}
					<Grid item xs={12} sm={2}>
						<Multiselect
							options={areas} // Options to display in the dropdown
							displayValue="nombre" // Property name to display in the dropdown options
							onSelect={(e) => onChangeAreas(e)} // Function will trigger on select event
							onRemove={(e) => onChangeAreas(e)} // Function will trigger on remove event
							placeholder={`Areas`}
							selectedValues={values.areas} // Preselected value to persist in dropdown
						/>
					</Grid>
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-hora">Medico</InputLabel>
							<Select
								labelId="simple-select-outlined-medico"
								id="simple-select-outlined-medico"
								value={values.medico}
								error={Boolean(errors.medico)}
								onChange={onChangeDoctors}
								label="Medico" >
								{medicos.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					{
						medicoDirectoId !== values.medico._id ?
							<Grid item xs={12} sm={2}>
								<FormControl variant="outlined" className={classes.formControl}>
									<InputLabel id="simple-select-outlined-tipo-cita">Tipo Cita</InputLabel>
									<Select
										labelId="simple-select-outlined-tipo-cita"
										id="simple-select-outlined-tipo-cita"
										value={values.tipoCita}
										error={Boolean(errors.tipoCita)}
										onChange={onChangeTipoCita}
										label="Tipo Cita" >
										{tipoCitas.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
							: ''
					}
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-promovendedor">Promovendedor</InputLabel>
							<Select
								labelId="simple-select-outlined-promovendedor"
								id="simple-select-outlined-promovendedor"
								value={values.promovendedor}
								error={Boolean(errors.promovendedor)}
								onChange={onChangePromovendedor}
								label="Promovendedor" >
								{promovendedores.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-cosmetologa">Cosmetologa</InputLabel>
							<Select
								labelId="simple-select-outlined-cosmetologa"
								id="simple-select-outlined-cosmetologa"
								value={values.cosmetologa}
								error={Boolean(errors.cosmetologa)}
								onChange={onChangeCosmetologa}
								label="Cosmetologa" >
								{cosmetologas.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={2}>
						<MuiPickersUtilsProvider utils={DateFnsUtils}>
							<Grid
								container
								justify="center"
								alignItems="center" >
								<KeyboardDatePicker
									className={classes.button}
									disableToolbar
									//disablePast
									autoOk
									disabled={disableDate}
									variant="inline"
									format="dd/MM/yyyy"
									margin="normal"
									id="date-picker-inline"
									label="Fecha"
									value={values.fecha_hora}
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
								disabled={!values.fecha_hora}
								label="Hora" >
								{horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-tipo-cita">Medio</InputLabel>
							<Select
								labelId="simple-select-outlined-tipo-cita"
								id="simple-select-outlined-tipo-cita"
								value={values.medio}
								onChange={onChangeMedio}
								label="Medio" >
								{medios.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField
							className={classes.button}
							name="observaciones"
							error={Boolean(errors.observaciones)}
							label="Observaciones"
							value={values.observaciones}
							onChange={onChangeObservaciones}
							variant="outlined" />
					</Grid>
					<Grid item xs={12} sm={2}>
						<Button
							className={classes.button}
							variant="contained"
							color="primary"
							disabled={!isValid || isSubmitting || !paciente.nombres
								|| values.tratamientos.length === 0 || !values.fecha_hora || !values.precio}
							onClick={() => onClickAgendar(values)} >
							AGREGAR
                        </Button>
					</Grid>
					<Grid item xs={12} sm={2}>
						<h1>Total: {toFormatterCurrency(values.precio)}</h1>
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
							label="Filtrado Citas"
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
				data={aparatologias}
				actions={actions}
				options={options}
				components={components} />

		</Fragment>
	);
}
