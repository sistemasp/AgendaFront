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
import { Multiselect } from 'multiselect-react-dropdown';
import ModalPagos from '../../../components/modales/modal_pagos';
import { toFormatterCurrency } from '../../../utils/utils';
import { ButtonCustom } from '../../../components/basic/ButtonCustom';
import ModalProximaCita from '../../../components/modales/modal_proxima_cita';
import ModalEstetica from '../../../components/modales/modal_estetica';
import ModalImprimirCirugia from '../../../components/modales/imprimir/cirugia';

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
	},
	labelItemLeft: {
		marginTop: '0px',
		marginBottom: '0px',
		textAlign: 'left',
		//display: "flex",
		alignItems: "center",
	},
	labelItemRight: {
		marginTop: '0px',
		marginBottom: '0px',
		textAlign: 'right',
		alignSelf: 'center',
		//display: "flex",
		alignItems: "center",
	},
	labelItemCenter: {
		marginTop: '0px',
		marginBottom: '0px',
		alignSelf: 'center',
		textAlign: 'center',
		//display: "flex",
		alignItems: "center",
	},
}));

export const AgendarEsteticaContainer = (props) => {

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
		dermatologos,
		promovendedores,
		onChangeToxinasRellenos,
		onChangeDoctors,
		onChangeTipoCita,
		onChangeTotal,
		onChangeItemUnidades,
		onChangeMedio,
		medios,
		toxinasRellenos,
		materiales,
		onChangeMateriales,
		onChangeItemPrecio,
		productos,
		frecuencias,
		onChangeProductos,
		onChangeFrecuencia,
		frecuenciaPrimeraVezId,
		frecuenciaReconsultaId,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		esteticas,
		actions,
		options,
		components,
		// MODAL PROPERTIES
		openModal,
		estetica,
		onClickActualizarCita,
		onClickCancel,
		onChangeAsistio,
		loadEsteticas,
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
					<ModalEstetica
						open={openModal}
						estetica={estetica}
						paciente={paciente}
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
						loadEsteticas={loadEsteticas}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalProxima ?
					<ModalProximaCita
						open={openModalProxima}
						estetica={estetica}
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
						loadEsteticas={loadEsteticas}
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
						servicio={estetica}
						empleado={empleado}
						sucursal={sucursal}
						setMessage={setMessage}
						setOpenAlert={setOpenAlert}
						onGuardarModalPagos={onGuardarModalPagos}
						tipoServicioId={estetica.servicio._id} />
					: ''
			}
			{
				openModalImprimirCita ?
					<ModalImprimirCirugia
						open={openModalImprimirCita}
						onClose={onCloseImprimirConsulta}
						servicio="TOXINAS Y RELLENOS"
						datos={datosImpresion} />
					: ''
			}
			<Paper>
				<h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'SELECCIONA DESDE UNA CONSULTA'}</h1>
				<Grid container spacing={3}>
					<Grid container spacing={1} xs={12} sm={6}>
						<Grid item xs={12} sm={4}>
							<TextField
								className={classes.textField}
								name="total"
								label="TOTAL DE LA ESTETICA"
								value={values.precio}
								type='Number'
								onChange={onChangeTotal}
								onInput={(e) => {
									e.target.value = e.target.value < 0 ? 0 : e.target.value;
									e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 6)
								}}
								variant="outlined" />
						</Grid>
						<Grid item xs={12} sm={4}>
							<FormControl variant="outlined" className={classes.formControl}>
								<InputLabel id="simple-select-outlined-frecuencia">FRECUENCIA</InputLabel>
								<Select
									labelId="simple-select-outlined-frecuencia"
									id="simple-select-outlined-frecuencia"
									value={values.frecuencia}
									onChange={onChangeFrecuencia}
									label="FRECUENCIA" >
									{frecuencias.sort().map((item, index) => <MenuItem key={index} value={item}>{item.nombre}</MenuItem>)}
								</Select>
							</FormControl>
						</Grid>
						{
							values.frecuencia === frecuenciaReconsultaId
								? <Grid item xs={12} sm={4}>
									<FormControl variant="outlined" className={classes.formControl}>
										<InputLabel id="simple-select-outlined-hora">PRODUCTO</InputLabel>
										<Select
											labelId="simple-select-outlined-producto"
											id="simple-select-outlined-producto"
											value={values.producto}
											onChange={onChangeProductos}
											label="PRODUCTO" >
											{productos.sort().map((item, index) => <MenuItem key={index} value={item._id}>{item.nombre}</MenuItem>)}
										</Select>
									</FormControl>
								</Grid>
								: ''
						}
						<Grid item xs={12} sm={4}>
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
						<Grid item xs={12} sm={4}>
							<Multiselect
								options={toxinasRellenos} // Options to display in the dropdown
								displayValue="nombre" // Property name to display in the dropdown options
								onSelect={(e) => onChangeToxinasRellenos(e)} // Function will trigger on select event
								onRemove={(e) => onChangeToxinasRellenos(e)} // Function will trigger on remove event
								placeholder="TOXINAS Y RELLENOS"
								selectedValues={values.toxinas_rellenos} // Preselected value to persist in dropdown
							/>
						</Grid>
						<Grid item xs={12} sm={4}>
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
										invalidDateMessage='Selecciona una fecha' />
								</Grid>
							</MuiPickersUtilsProvider>
						</Grid>
						<Grid item xs={12} sm={4}>
							<FormControl variant="outlined" className={classes.formControl}>
								<InputLabel id="simple-select-outlined-hora">Hora</InputLabel>
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
						<Grid item xs={12} sm={4}>
							<Multiselect
								options={materiales} // Options to display in the dropdown
								displayValue="nombre" // Property name to display in the dropdown options
								onSelect={(e) => onChangeMateriales(e)} // Function will trigger on select event
								onRemove={(e) => onChangeMateriales(e)} // Function will trigger on remove event
								placeholder="SELECCIONA MATERIALES"
								selectedValues={values.materiales} // Preselected value to persist in dropdown
							/>
						</Grid>

						{
							values.materiales.map((item, index) =>
								<Grid item xs={12} sm={4}>
									<TextField
										className={classes.button}
										name={item.precio}
										label={`PRECIO: ${item.nombre}`}
										value={item.precio}
										type='Number'
										onChange={(e) => onChangeItemPrecio(e, index)}
										variant="outlined" />
								</Grid>)
						}
						<Grid item xs={12} sm={4}>
							<TextField
								className={classes.button}
								name="observaciones"
								error={Boolean(errors.observaciones)}
								label="OBSERVACIONES"
								value={values.observaciones}
								onChange={onChangeObservaciones}
								variant="outlined" />
						</Grid>
						<Grid item xs={12} sm={4}>
							<ButtonCustom
								className={classes.button}
								color="primary"
								variant="contained"
								disabled={!isValid || isSubmitting || !paciente.nombres || !values.dermatologo
									|| !values.fecha_hora}
								onClick={() => onClickAgendar(values)}
								text='GUARDAR' />
						</Grid>
						<Grid item xs={12} sm={6}>
							<h2>APLICACIÓN: {toFormatterCurrency(values.total_aplicacion)}</h2>
						</Grid>
						<Grid item xs={12} sm={6}>
							<h1>TOTAL: {toFormatterCurrency(values.precio)}</h1>
						</Grid>
					</Grid>
					<Grid container spacing={2} xs={12} sm={6}>
						<Grid item xs={3} >
							<h3 className={classes.labelItemLeft}>{`NOMBRE`}</h3>
						</Grid>
						<Grid item xs={3} >
							<h3 className={classes.labelItemCenter}> {`CANTIDAD UNIDADES`} </h3>
						</Grid>
						<Grid className={classes.labelItemLeft} item xs={3} >
							<h3 className={classes.labelItemCenter}>{`PRECIO POR UNIDAD`}</h3>
						</Grid>
						<Grid item xs={3} >
							<h3 className={classes.labelItemRight}> {`TOTAL`} </h3>
						</Grid>
						{
							values.toxinas_rellenos ?
								values.toxinas_rellenos.map((item, index) =>
									<Fragment>
										<Grid item xs={3} >
											<h3 className={classes.labelItemLeft}>{item.nombre}</h3>
										</Grid>
										<Grid item xs={12} sm={3}>
											<TextField
												className={classes.labelItemCenter}
												name={item.unidades}
												label={`UNIDADES`}
												value={item.unidades}
												type='Number'
												onChange={(e) => onChangeItemUnidades(e, index)}
												onInput={(e) => {
													e.target.value = e.target.value < 0 ? 0 : e.target.value;
													e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 3)
												}}
												variant="outlined" />
										</Grid>
										<Grid item xs={3} >
											<h3 className={classes.labelItemCenter}>{toFormatterCurrency(item.precio)}</h3>
										</Grid>
										<Grid item xs={3} >
											<h3 className={classes.labelItemRight}>{toFormatterCurrency(item.unidades * item.precio)}</h3>
										</Grid>
									</Fragment>) : ''
						}
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
							label="FILTRADO ESTETICA"
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
				data={esteticas}
				actions={actions}
				options={options}
				components={components} />

		</Fragment>
	);
}
