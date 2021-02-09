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
import { Paper, TextField } from '@material-ui/core';
import TableComponent from '../../../components/table/TableComponent';
import ModalCita from '../../../components/modales/modal_cita';
import { Multiselect } from 'multiselect-react-dropdown';
import ModalPagos from '../../../components/modales/modal_pagos';
import { toFormatterCurrency } from '../../../utils/utils';
import ModalImprimirTratamiento from '../../../components/modales/imprimir/tratamiento';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import ModalProximaCita from '../../../components/modales/modal_proxima_cita';

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
		color: '#FFFFFF',
	}
}));

export const AgendarLaserContainer = (props) => {

	const classes = useStyles();

	const {
		values,
		errors,
		servicios,
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
		dermatologos,
		promovendedores,
		cosmetologas,
		onChangeDoctors,
		onChangeTipoCita,
		onChangePromovendedor,
		onChangeCosmetologa,
		onChangeMedio,
		medios,
		dermatologoDirectoId,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		citas,
		actions,
		options,
		components,
		// MODAL PROPERTIES
		openModal,
		cita,
		onClickActualizarCita,
		onClickCancel,
		onChangeAsistio,
		loadLaser,
		setFilterDate,
		// MODAL PROXIMA
		openModalProxima,
		// MODAL PAGOS
		onCloseVerPagos,
		openModalPagos,
		sucursal,
		setMessage,
		setOpenAlert,
		onGuardarModalPagos,
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
						horarios={horarios}
						empleado={empleado}
						loadLaser={loadLaser}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalProxima ?
					<ModalProximaCita
						open={openModalProxima}
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
						horarios={horarios}
						empleado={empleado}
						loadLaser={loadLaser}
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
						onGuardarModalPagos={onGuardarModalPagos}
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
				<h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'SELECCIONA UN PACIENTE'}</h1>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={2}>
						<Multiselect
							options={areas} // Options to display in the dropdown
							displayValue="nombre" // Property name to display in the dropdown options
							onSelect={(e) => onChangeAreas(e)} // Function will trigger on select event
							onRemove={(e) => onChangeAreas(e)} // Function will trigger on remove event
							placeholder={`AREAS`}
							selectedValues={values.areas} // Preselected value to persist in dropdown
						/>
					</Grid>
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-hora">DERMATÓLOGO</InputLabel>
							<Select
								labelId="simple-select-outlined-dermatologo"
								id="simple-select-outlined-dermatologo"
								value={values.dermatologo}
								error={Boolean(errors.dermatologo)}
								onChange={onChangeDoctors}
								label="DERMATÓLOGO" >
								{dermatologos.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					{
						dermatologoDirectoId !== values.dermatologo._id ?
							<Grid item xs={12} sm={2}>
								<FormControl variant="outlined" className={classes.formControl}>
									<InputLabel id="simple-select-outlined-tipo-cita">TIPO CITA</InputLabel>
									<Select
										labelId="simple-select-outlined-tipo-cita"
										id="simple-select-outlined-tipo-cita"
										value={values.tipoCita}
										error={Boolean(errors.tipoCita)}
										onChange={onChangeTipoCita}
										label="TIPO CITA" >
										{tipoCitas.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
									</Select>
								</FormControl>
							</Grid>
							: ''
					}
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-promovendedor">PROMOVENDEDOR</InputLabel>
							<Select
								labelId="simple-select-outlined-promovendedor"
								id="simple-select-outlined-promovendedor"
								value={values.promovendedor}
								error={Boolean(errors.promovendedor)}
								onChange={onChangePromovendedor}
								label="PROMOVENDEDOR" >
								{promovendedores.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-cosmetologa">COSMETOLOGA</InputLabel>
							<Select
								labelId="simple-select-outlined-cosmetologa"
								id="simple-select-outlined-cosmetologa"
								value={values.cosmetologa}
								error={Boolean(errors.cosmetologa)}
								onChange={onChangeCosmetologa}
								label="COSMETOLOGA" >
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
									label="FECHA"
									value={values.fecha_hora}
									onChange={onChangeFecha}
									KeyboardButtonProps={{
										'aria-label': 'change date',
									}}
									invalidDateMessage='SELECCIONA UNA FECHA' />
							</Grid>
						</MuiPickersUtilsProvider>
					</Grid>
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-hora">HORA</InputLabel>
							<Select
								labelId="simple-select-outlined-hora"
								id="simple-select-outlined-hora"
								value={values.hora}
								error={Boolean(errors.hora)}
								onChange={onChangeHora}
								disabled={!values.fecha_hora}
								label="HORA" >
								{horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-tipo-cita">MEDIO</InputLabel>
							<Select
								labelId="simple-select-outlined-tipo-cita"
								id="simple-select-outlined-tipo-cita"
								value={values.medio}
								onChange={onChangeMedio}
								label="MEDIO" >
								{medios.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField
							className={classes.button}
							name="tiempo"
							error={Boolean(errors.tiempo)}
							label="TIEMPO"
							value={values.tiempo}
							type='Number'
							onChange={onChangeTiempo}
							onInput={(e) => {
								e.target.value = Math.max(0, parseInt(e.target.value)).toString().slice(0, 3)
							}}
							variant="outlined" />
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField
							className={classes.button}
							name="observaciones"
							error={Boolean(errors.observaciones)}
							label="OBSERVACIONES"
							value={values.observaciones}
							onChange={onChangeObservaciones}
							variant="outlined" />
					</Grid>
					<Grid item xs={12} sm={2}>
						<ButtonCustom
							className={classes.button}
							color="primary"
							variant="contained"
							disabled={!isValid || isSubmitting || !paciente.nombres || !values.servicio
								|| !values.fecha_hora || !values.precio || !values.tiempo}
							onClick={() => onClickAgendar(values)}
							text='GUARDAR' />
					</Grid>
					<Grid item xs={12} sm={2}>
						<h1>TOTAL: {toFormatterCurrency(values.precio)}</h1>
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
							label="FILTRADO LÁSER"
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
				options={options}
				components={components} />

		</Fragment>
	);
}
