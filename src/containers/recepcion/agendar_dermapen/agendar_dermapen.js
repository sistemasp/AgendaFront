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
import ModalDermapen from '../../../components/modales/modal_dermapen';
import ModalImprimirDermapen from '../../../components/modales/imprimir/dermapen';

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
	textField: {
		minWidth: 120,
		width: '100%',
	}
}));

export const AgendarDermapenContainer = (props) => {

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
		cosmetologas,
		onChangeDoctors,
		onChangeTipoCita,
		onChangePromovendedor,
		onChangeCosmetologa,
		onChangeMedio,
		medios,
		dermatologoDirectoId,
		materiales,
		onChangeMateriales,
		onChangeItemPrecio,
		onChangeTotal,
		onChangeFrecuencia,
		frecuencias,
		onChangeCosto,
		// TABLE DATES PROPERTIES
		titulo,
		columns,
		dermapens,
		actions,
		options,
		components,
		// MODAL PROPERTIES
		openModal,
		dermapen,
		onClickActualizarCita,
		onClickCancel,
		onChangeAsistio,
		loadDermapens,
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
					<ModalDermapen
						open={openModal}
						dermapen={dermapen}
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
						loadDermapens={loadDermapens}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setFilterDate={setFilterDate} /> : ''
			}
			{
				openModalProxima ?
					<ModalProximaCita
						open={openModalProxima}
						dermapen={dermapen}
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
						loadDermapens={loadDermapens}
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
						servicio={dermapen}
						empleado={empleado}
						sucursal={sucursal}
						setMessage={setMessage}
						setOpenAlert={setOpenAlert}
						onGuardarModalPagos={onGuardarModalPagos}
						tipoServicioId={dermapen.servicio._id} />
					: ''
			}
			{
				openModalImprimirCita ?
					<ModalImprimirDermapen
						open={openModalImprimirCita}
						onClose={onCloseImprimirConsulta}
						datos={datosImpresion} />
					: ''
			}
			<Paper>
				<h1>{paciente.nombres ? `${paciente.nombres} ${paciente.apellidos}` : 'SELECCIONA DESDE UNA CONSULTA'}</h1>
				<Grid container spacing={3}>
					<Grid item xs={12} sm={2}>
						<TextField
							className={classes.textField}
							name="total"
							label="TOTAL DERMAPEN"
							value={values.precio}
							type='Number'
							onChange={onChangeTotal}
							onInput={(e) => {
								e.target.value = e.target.value < 0 ? 0 : e.target.value;
								e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 6)
							}}
							variant="outlined" />
					</Grid>
					<Grid item xs={12} sm={2}>
						<TextField
							className={classes.textField}
							name="costo"
							label="COSTO DERMAPEN"
							value={values.costo}
							type='Number'
							onChange={onChangeCosto}
							onInput={(e) => {
								e.target.value = e.target.value < 0 ? 0 : e.target.value;
								e.target.value = Math.max(0, parseFloat(e.target.value)).toString().slice(0, 6)
							}}
							variant="outlined" />
					</Grid>
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
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-hora">Dermatologo</InputLabel>
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
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-promovendedor">Promovendedor</InputLabel>
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
								label="HORA" >
								{horarios.sort().map((item, index) => <MenuItem key={index} value={item.hora}>{item.hora}</MenuItem>)}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={2}>
						<FormControl variant="outlined" className={classes.formControl}>
							<InputLabel id="simple-select-outlined-tipo-dermapen">MEDIO</InputLabel>
							<Select
								labelId="simple-select-outlined-tipo-dermapen"
								id="simple-select-outlined-tipo-dermapen"
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
							<Grid item xs={12} sm={2}>
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
					<Grid item xs={12} sm={2}>
						<ButtonCustom
							className={classes.button}
							color="primary"
							variant="contained"
							disabled={!isValid || isSubmitting || !paciente.nombres || !values.dermatologo
								|| !values.fecha_hora || !values.tiempo}
							onClick={() => onClickAgendar(values)}
							text='GUARDAR' />
					</Grid>
					<Grid item xs={12} sm={2}>
						<h2>APLICACIÓN: {toFormatterCurrency(values.total_aplicacion)}</h2>
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
							label="FILTRADO DERMAPEN"
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
				data={dermapens}
				actions={actions}
				options={options}
				components={components} />

		</Fragment>
	);
}
