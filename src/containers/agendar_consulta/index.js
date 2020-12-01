import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AgendarConsultaContainer } from "./agendar_consulta";
import {
	findScheduleInConsultByDateAndSucursal,
	findEmployeesByRolId,
	showAllTipoCitas,
	showAllMedios,
	showAllFrecuencias,
	createConsecutivo,
} from "../../services";
import {
	createConsult,
	findConsultsByDateAndSucursal,
	updateConsult
} from "../../services/consultas";
import {
	findCirugiaByConsultaId,
} from "../../services/cirugias";
import {
	findEsteticaByConsultaId,
} from "../../services/esteticas";
import { Backdrop, CircularProgress, FormControl, InputLabel, MenuItem, Select, Snackbar, TablePagination } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import { toFormatterCurrency, addZero, generateFolio, dateToString } from "../../utils/utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PrintIcon from '@material-ui/icons/Print';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';
import FaceIcon from '@material-ui/icons/Face';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import moment from "moment";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	pagago: {
		color: '#11A532',
	},
	no_pagago: {
		color: '#DC3132',
	},
}));

const AgendarConsulta = (props) => {

	const classes = useStyles();

	const {
		paciente,
		empleado,
		setPacienteAgendado,
		sucursal,
		history,
		onClickAgendarCirugia,
		onClickAgendarEstetica,
		onClickAgendarDermapen,
	} = props;

	const date = new Date();

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [horarios, setHorarios] = useState([]);
	const [dermatologos, setDermatologos] = useState([]);
	const [frecuencias, setFrecuencias] = useState([]);
	const [tipoCitas, setTipoCitas] = useState([]);
	const [medios, setMedios] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
	const [isHoliDay, setIsHoliDay] = useState(false);
	const [values, setValues] = useState({
		hora: '',
		fecha_hora: new Date(),
		paciente: `${paciente._id}`,
		precio: isHoliDay ? sucursal.precio_festivo : // Dia Festivo
			date.getDay() === 6 ? (date.getHours() >= 13 ? sucursal.precio_sabado_vespertino : sucursal.precio_sabado_matutino) // SABADO
				: (date.getHours() >= 14 ? sucursal.precio_vespertino : sucursal.precio_matutino), // L-V
	});

	const [citas, setConsultas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalProxima, setOpenModalProxima] = useState(false);
	const [openModalPagos, setOpenModalPagos] = useState(false);
	const [openModalCirugias, setOpenModalCirugias] = useState(false);
	const [openModalEstetica, setOpenModalEstetica] = useState(false);
	const [consulta, setConsulta] = useState();
	const [openModalImprimirConsultas, setOpenModalImprimirConsultas] = useState(false);
	const [datosImpresion, setDatosImpresion] = useState();
	const [cirugia, setCirugia] = useState({
		materiales: []
	});
	const [estetica, setEstetica] = useState({
		materiales: []
	});

	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [filterDate, setFilterDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const dermatologoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
	const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
	const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
	const enProcedimientoStatusId = process.env.REACT_APP_EN_PROCEDIMIENTO_STATUS_ID;
	const enConsultorioStatusId = process.env.REACT_APP_EN_CONSULTORIO_STATUS_ID;
	const enCabinaStatusId = process.env.REACT_APP_EN_CABINA_STATUS_ID;
	const atendidoStatusId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
	const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
	const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
	const dermatologoDirectoId = process.env.REACT_APP_MEDICO_DIRECTO_ID;
	const promovendedorSinAsignarId = process.env.REACT_APP_PROMOVENDEDOR_SIN_ASIGNAR_ID;
	const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
	const fercuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
	const tipoCitaRevisionId = process.env.REACT_APP_TIPO_CITA_REVISADO_ID;
	const tipoCitaDerivadaId = process.env.REACT_APP_TIPO_CITA_DERIVADO_ID;
	const medioSinCitaId = process.env.REACT_APP_MEDIO_SIN_CITA_ID;

	const columns = [
		{ title: 'FOLIO', field: 'consecutivo' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'TELEFONO', field: 'paciente.telefono' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		{ title: 'HORA ATENDIDO', field: 'hora_atencion' },
		{ title: 'HORA SALIDA', field: 'hora_salida' },
		{ title: 'QUIEN AGENDA', field: 'quien_agenda.nombre' },
		{ title: 'FRECUENCIA', field: 'frecuencia.nombre' },
		sucursal._id === sucursalManuelAcunaId ? { title: 'MEDIO', field: 'medio.nombre' } : {},
		{ title: 'TIPO CONSULTA', field: 'tipo_cita.nombre' },
		sucursal._id === sucursalManuelAcunaId ? { title: 'QUIEN CONFIRMA LLAMADA', field: 'quien_confirma_llamada.nombre' } : {},
		sucursal._id === sucursalManuelAcunaId ? { title: 'QUIEN CONFIRMA ASISTENCIA', field: 'quien_confirma_asistencia.nombre' } : {},
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
		{ title: 'PROMOVENDEDOR', field: 'promovendedor_nombre' },
		{ title: 'ESTADO', field: 'status.nombre' },
		{ title: 'PRECIO', field: 'precio_moneda' },
		{ title: 'OBSERVACIONES', field: 'observaciones' },
	];

	const dataComplete = !paciente.nombres || !values.precio || !values.dermatologo
		|| !values.promovendedor || (sucursal._id === sucursalManuelAcunaId ? (!values.fecha_hora || !values.medio) : false);

	const options = {
		rowStyle: rowData => {
			return {
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? process.env.REACT_APP_PAGADO_COLOR : ''
			};
		},
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		paging: false,
	}

	useEffect(() => {

		const loadConsultas = async () => {
			const response = await findConsultsByDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(), sucursal._id);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					const fecha = new Date(item.fecha_hora);
					item.folio = generateFolio(item);
					item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
					item.precio_moneda = toFormatterCurrency(item.precio);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
					item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
				});
				setConsultas(response.data);
			}
			setIsLoading(false);
		}

		const loadDermatologos = async () => {
			const response = await findEmployeesByRolId(dermatologoRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setDermatologos(response.data);
			}
		}

		const loadPromovendedores = async () => {
			const response = await findEmployeesByRolId(promovendedorRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setPromovendedores(response.data);
			}
		}

		const loadTipoCitas = async () => {
			const response = await showAllTipoCitas();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setTipoCitas(response.data);
			}
		}

		const loadMedios = async () => {
			const response = await showAllMedios();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setMedios(response.data);
			}
		}

		const loadFrecuencias = async () => {
			const response = await showAllFrecuencias();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setFrecuencias(response.data);
			}
		}

		setIsLoading(true);
		loadConsultas();
		loadDermatologos();
		loadPromovendedores();
		loadTipoCitas();
		loadFrecuencias();
		loadMedios();
		loadHorarios(values.fecha_hora);
	}, [sucursal, dermatologoRolId, promovendedorRolId]);

	const loadHorarios = async (date) => {
		const dia = date ? date.getDate() : values.fecha_show.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth());
		const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
		const response = await findScheduleInConsultByDateAndSucursal(consultaServicioId, dia, mes, anio, sucursal._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setHorarios(response.data);
		}
	}

	const handleChangeFecha = async (date) => {
		setIsLoading(true);
		await setValues({
			...values,
			fecha_hora: date,
		});
		await loadHorarios(date);
		setIsLoading(false);
	};

	const handleChangeHora = e => {
		setIsLoading(true);
		const hora = (e.target.value).split(':');
		const date = values.fecha_hora;
		date.setHours(Number(hora[0]));
		date.setMinutes(hora[1]);
		date.setSeconds(0);
		setValues({ ...values, hora: e.target.value, fecha_hora: date });
		setIsLoading(false);
	};

	const handleChangeFilterDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setFilterDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});
		await loadConsultas(date);
		setIsLoading(false);
	};

	const loadConsultas = async (filterDate) => {
		const response = await findConsultsByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				const fecha = new Date(item.fecha_hora);
				item.folio = generateFolio(item);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setConsultas(response.data);
		}
	}

	const getTimeToTratamiento = (tratamientos) => {
		tratamientos.sort((a, b) => {
			if (a.tiempo < b.tiempo) return 1;
			if (a.tiempo > b.tiempo) return -1;
			return 0;
		});
		let tiempo = 0;
		tratamientos.forEach((item, index) => {
			tiempo += Number(index === 0 ? item.tiempo : (item.tiempo - (item.servicio !== 'APARATOLOGÍA' ? 20 : 0)));
		});
		return tiempo;
	}

	const handleChangeTipoCita = (e) => {
		setValues({ ...values, tipo_cita: e.target.value });
	}

	const handleChangeMedio = (e) => {
		setValues({ ...values, medio: e.target.value });
	}

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal._id;
		data.status = pendienteStatusId;
		data.hora_llegada = '--:--';
		data.hora_atencion = '--:--';
		data.hora_salida = '--:--';
		data.servicio = consultaServicioId;
		data.tipo_cita = data.frecuencia === frecuenciaPrimeraVezId ? tipoCitaRevisionId : tipoCitaDerivadaId;
		if (sucursal._id !== sucursalManuelAcunaId) {
			const dateNow = new Date();
			data.hora_llegada = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
			dateNow.setMinutes(0);
			dateNow.setSeconds(0);
			data.fecha_hora = dateNow;
			data.medio = medioSinCitaId;
			data.status = asistioStatusId;
			data.hora_aplicacion = new Date();
			// data.quien_confirma_asistencia = empleado._id;
		}

		const response = await createConsult(data);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			const consecutivo = {
				consecutivo: response.data.consecutivo,
				tipo_servicio: consultaServicioId,
				servicio: response.data._id,
				sucursal: sucursal._id,
				fecha_hora: new Date(),
				status: response.data.status,
			}
			const responseConsecutivo = await createConsecutivo(consecutivo);
			if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
				setOpenAlert(true);
				setMessage('LA CONSULTA SE AGENDO CORRECTAMENTE');
				setValues({
					servicio: '',
					tratamiento: '',
					fecha_show: '',
					fecha: '',
					hora: '',
					paciente: {},
					precio: '',
					tipo_cita: '',
					citado: '',
					pagado: false,
				});
				setDisableDate(true);
				setPacienteAgendado({});
				loadConsultas(new Date());
			}
		}
		setIsLoading(false);
	};

	const handleChangePrecio = (e) => {
		setValues({ ...values, precio: e.target.value });
	}

	const handleChangeTiempo = (e) => {
		setValues({ ...values, tiempo: e.target.value });
	}

	const handleChangeDermatologos = (e) => {
		setValues({ ...values, dermatologo: e.target.value });
	}

	const handleChangeObservaciones = e => {
		setValues({ ...values, observaciones: e.target.value.toUpperCase() });
	}

	const handleChangePromovendedor = (e) => {
		setValues({ ...values, promovendedor: e.target.value });
	}

	const handleChangeFrecuencia = (e) => {
		const frecuencia = e.target.value._id;
		const dermatologo = dermatologos.filter(item => {
			return item._id === dermatologoDirectoId;
		});
		const promovendedor = promovendedores.filter(item => {
			return item._id === promovendedorSinAsignarId;
		});
		setValues({
			...values,
			frecuencia: frecuencia,
			dermatologo: frecuencia === frecuenciaPrimeraVezId ? dermatologo[0] : undefined,
			promovendedor: frecuencia === fercuenciaReconsultaId ? promovendedor[0] : undefined,
		});
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setOpenModalProxima(false);
	};

	const handleOnClickEditarConsulta = async (event, rowData) => {
		setIsLoading(true);
		setConsulta(rowData);
		await loadHorarios(new Date(rowData.fecha_hora));
		setOpenModal(true);
		setIsLoading(false);
	}

	const handleOnClickNuevaConsulta = async (event, rowData) => {
		setIsLoading(true);
		setConsulta(rowData);
		// await loadTratamientos(rowData.servicio);
		await loadHorarios(new Date(rowData.fecha_hora));
		setOpenModalProxima(true);
		setIsLoading(false);
	}

	const handleClickVerPagos = (event, rowData) => {
		setConsulta(rowData);
		setOpenModalPagos(true);
	}

	const handleClickCirugia = async (event, rowData) => {
		const response = await findCirugiaByConsultaId(rowData._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			if (response.data !== '') {
				setCirugia(response.data);
			}
		}
		setConsulta(rowData);
		setOpenModalCirugias(true);
	}

	const handleClickEstetica = async (event, rowData) => {
		const response = await findEsteticaByConsultaId(rowData._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			if (response.data !== '') {
				setEstetica(response.data);
			}
		}
		setConsulta(rowData);
		setOpenModalEstetica(true);
	}

	const handleCloseVerPagos = () => {
		setOpenModalPagos(false);
	}

	const handleCloseCirugia = () => {
		setCirugia({
			materiales: [],
		});
		setOpenModalCirugias(false);
	}

	const handleCloseEstetica = () => {
		setEstetica({
			materiales: [],
		});
		setOpenModalEstetica(false);
	}

	const handleCloseImprimirConsulta = () => {
		setOpenModalImprimirConsultas(false);
	}

	const handlePrint = async (event, rowData) => {
		setDatosImpresion(rowData);
		setOpenModalImprimirConsultas(true);
	}

	const handleGuardarModalPagos = async (servicio) => {
		servicio.pagado = servicio.pagos.length > 0;
		await updateConsult(servicio._id, servicio);
		await loadConsultas(new Date(servicio.fecha_hora));
		setOpenModalPagos(false);
	}

	const actions = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: PrintIcon,
			tooltip: 'IMPRIMIR',
			onClick: handlePrint
		},
		{
			icon: EditIcon,
			tooltip: 'EDITAR CONSULTA',
			onClick: handleOnClickEditarConsulta
		},
		{
			icon: LocalHospitalIcon,
			tooltip: 'AGREGAR CIRUGIA',
			onClick: onClickAgendarCirugia
		},
		{
			icon: LocalHospitalIcon,
			tooltip: 'AGREGAR DERMAPEN',
			onClick: onClickAgendarDermapen
		},
		{
			icon: FaceIcon,
			tooltip: 'TOXINA Y RELLENOS',
			onClick: onClickAgendarEstetica
		},
		{
			icon: EventAvailableIcon,
			tooltip: 'NUEVA CITA',
			onClick: handleOnClickNuevaConsulta
		},
		{
			icon: AttachMoneyIcon,
			tooltip: 'PAGOS',
			onClick: handleClickVerPagos
		}
		//: ''
		/*rowData => {
			return (rowData.status._id === enProcedimientoStatusId || rowData.status._id === enConsultorioStatusId
				|| rowData.status._id === enCabinaStatusId || rowData.status._id === atendidoStatusId)
				? {
					icon: LocalHospitalIcon,
					tooltip: 'AGREGAR CIRUGIA',
					onClick: onClickAgendarCirugia
				} : ''
		},
		rowData => {
			return (rowData.status._id === enProcedimientoStatusId || rowData.status._id === enConsultorioStatusId
				|| rowData.status._id === enCabinaStatusId || rowData.status._id === atendidoStatusId)
				? {
					icon: FaceIcon,
					tooltip: 'TOXINA Y RELLENOS',
					onClick: onClickAgendarEstetica
				} : ''
		},
		rowData => (
			rowData.status._id !== pendienteStatusId ? {
				icon: AttachMoneyIcon,
				tooltip: rowData.pagado ? 'VER PAGO' : 'PAGAR',
				onClick: handleClickVerPagos
			} : ''
		),
		rowData => (
			rowData.status._id === atendidoStatusId ? {
				icon: EventAvailableIcon,
				tooltip: 'NUEVA CITA',
				onClick: handleOnClickNuevaConsulta
			} : ''
		),*/
	];

	const onChangeActions = (e, rowData) => {
		const action = e.target.value;
		switch (action) {
			case 'IMPRIMIR':
				handlePrint(e, rowData);
				break;
			case 'EDITAR CONSULTA':
				handleOnClickEditarConsulta(e, rowData);
				break;
			case 'AGREGAR CIRUGIA':
				onClickAgendarCirugia(e, rowData);
				break;
			case 'TOXINA Y RELLENOS':
				onClickAgendarEstetica(e, rowData);
				break;
			case 'AGREGAR DERMAPEN':
				onClickAgendarDermapen(e, rowData);
				break;
			case 'NUEVA CITA':
				handleOnClickNuevaConsulta(e, rowData);
				break;
			case 'PAGOS':
				handleClickVerPagos(e, rowData);
				break;
		}
	}

	const components = {
		Pagination: props => {
			return <TablePagination
				{...props}
				rowsPerPageOptions={[5, 10, 20, 30, citas.length]}
			/>
		},
		Actions: props => {
			return <Fragment>
				<FormControl variant="outlined" className={classes.formControl}>
					<InputLabel id="simple-select-outlined-hora"></InputLabel>
					<Select
						labelId="simple-select-outlined-actions"
						id="simple-select-outlined-actions"
						onChange={(e) => onChangeActions(e, props.data)}
						label="Acciones">
						{
							props.actions.map((item, index) => {

								return <MenuItem
									key={index}
									value={item.tooltip}
								>{item.tooltip}</MenuItem>
							})
						}
					</Select>
				</FormControl>
			</Fragment>
		}
	}

	return (
		<Fragment>
			{
				!isLoading ?
					<AgendarConsultaContainer
						values={values}
						horarios={horarios}
						onChangeFecha={(e) => handleChangeFecha(e)}
						onChangeFilterDate={(e) => handleChangeFilterDate(e)}
						onChangeHora={(e) => handleChangeHora(e)}
						filterDate={filterDate.fecha_show}
						paciente={paciente}
						disableDate={disableDate}
						onClickAgendar={handleClickAgendar}
						onChangePrecio={(e) => handleChangePrecio(e)}
						onChangeTiempo={(e) => handleChangeTiempo(e)}
						onChangeObservaciones={(e) => handleChangeObservaciones(e)}
						titulo={`CONSULTAS (${dateToString(filterDate.fecha_show)})`}
						columns={columns}
						options={options}
						citas={citas}
						actions={actions}
						components={components}
						consulta={consulta}
						openModal={openModal}
						empleado={empleado}
						sucursal={sucursal}
						onClickCancel={handleCloseModal}
						loadConsultas={loadConsultas}
						tipoCitas={tipoCitas}
						medios={medios}
						onChangeTipoCita={(e) => handleChangeTipoCita(e)}
						onChangeMedio={(e) => handleChangeMedio(e)}
						dermatologos={dermatologos}
						promovendedores={promovendedores}
						onChangeDermatologos={(e) => handleChangeDermatologos(e)}
						onChangePromovendedor={(e) => handleChangePromovendedor(e)}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setFilterDate={setFilterDate}
						OnCloseVerPagos={handleCloseVerPagos}
						openModalPagos={openModalPagos}
						openModalCirugias={openModalCirugias}
						openModalEstetica={openModalEstetica}
						openModalProxima={openModalProxima}
						openModalImprimirConsultas={openModalImprimirConsultas}
						datosImpresion={datosImpresion}
						onCloseImprimirConsulta={handleCloseImprimirConsulta}
						frecuencias={frecuencias}
						onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
						dataComplete={dataComplete}
						onCloseCirugia={handleCloseCirugia}
						onCloseEstetica={handleCloseEstetica}
						cirugia={cirugia}
						estetica={estetica}
						tipoServicioId={consultaServicioId}
						frecuenciaPrimeraVezId={frecuenciaPrimeraVezId}
						fercuenciaReconsultaId={fercuenciaReconsultaId}
						onGuardarModalPagos={handleGuardarModalPagos} /> :
					<Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity="success">
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default AgendarConsulta;