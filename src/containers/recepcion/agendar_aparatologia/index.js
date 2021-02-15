import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
	findScheduleByDateAndSucursalAndService,
	findEmployeesByRolId,
	showAllTipoCitas,
	createConsecutivo,
	showAllMedios,
	showAllFrecuencias,
} from "../../../services";
import {
	findTreatmentByServicio,
} from "../../../services/tratamientos";
import {
	findAreasByTreatmentServicio,
} from "../../../services/areas";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import * as Yup from "yup";
import { toFormatterCurrency, addZero, generateFolio, dateToString } from "../../../utils/utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PrintIcon from '@material-ui/icons/Print';
import { AgendarAparatologiaContainer } from "./agendar_aparatologia";
import { createAparatologia, findAparatologiaByDateAndSucursal, updateAparatologia } from "../../../services/aparatolgia";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const validationSchema = Yup.object({
	servicio: Yup.string("Ingresa los nombres")
		.required("El servicio es requerido."),
	tratamiento: Yup.string("Ingresa los apellidos")
		.required("El tratamiento es requerido"),
	fecha: Yup.string("Ingresa la fecha de nacimiento")
		.required("Los nombres del pacientes son requeridos"),
	hora: Yup.string("Ingresa la direccion")
		.required("Los nombres del pacientes son requeridos")
});

const AgendarAparatologia = (props) => {
	const classes = useStyles();

	const {
		info,
		empleado,
		setPacienteAgendado,
		sucursal,
	} = props;

	const paciente = info.paciente ? info.paciente : info;

	const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
	const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
	const atendidoStatusId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
	const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
	const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
	const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const directoTipoCitaId = process.env.REACT_APP_TIPO_CITA_DIRECTO_ID;
	const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;
	const cosmetologaSinAsignarId = process.env.REACT_APP_COSMETOLOGA_SIN_ASIGNAR_ID;
	const promovendedorSinAsignarId = process.env.REACT_APP_PROMOVENDEDOR_SIN_ASIGNAR_ID;
	const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [servicios, setServicios] = useState([]);
	const [tratamientos, setTratamientos] = useState([]);
	const [horarios, setHorarios] = useState([]);
	const [dermatologos, setDermatologos] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [cosmetologas, setCosmetologas] = useState([]);
	const [tipoCitas, setTipoCitas] = useState([]);
	const [medios, setMedios] = useState([]);
	const [frecuencias, setFrecuencias] = useState([]);
	const [productos, setProductos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
	const [values, setValues] = useState({
		servicio: servicioAparatologiaId,
		tratamientos: [],
		areas: [],
		paciente: `${paciente._id}`,
		precio: 0,
		total: 0,
		tipo_cita: directoTipoCitaId,
		observaciones: '',
		dermatologo: dermatologoDirectoId,
		consulta: info.dermatologo ? info._id : undefined,
		porcentaje_descuento_clinica: 0,
		descuento_clinica: 0,
		descuento_dermatologo: 0,
		cosmetologa: cosmetologaSinAsignarId,
		promovendedor: promovendedorSinAsignarId,
		frecuencia: frecuenciaPrimeraVezId,
	});
	const [aparatologias, setAparatologia] = useState([]);
	const [areas, setAreas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalProxima, setOpenModalProxima] = useState(false);
	const [cita, setCita] = useState();
	const [openModalPagos, setOpenModalPagos] = useState(false);
	const [openModalImprimirCita, setOpenModalImprimirCita] = useState(false);
	const [datosImpresion, setDatosImpresion] = useState();

	const date = new Date();
	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [filterDate, setFilterDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`
	});

	const columns = [
		{ title: 'FOLIO', field: 'folio' },
		{ title: 'HORA', field: 'hora' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'TELÉFONO', field: 'paciente.telefono' },
		{ title: 'SERVICIO', field: 'servicio.nombre' },
		{ title: 'TRATAMIENTOS (AREAS)', field: 'show_tratamientos' },
		{ title: 'QUIEN AGENDA', field: 'quien_agenda.nombre' },
		{ title: 'MEDIO', field: 'medio.nombre' },
		{ title: 'QUIEN CONFIRMA LLAMADA', field: 'quien_confirma_llamada.nombre' },
		{ title: 'QUIEN CONFIRMA ASISTENCIA', field: 'quien_confirma_asistencia.nombre' },
		{ title: 'PROMOVENDEDOR', field: 'promovendedor_nombre' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
		{ title: 'TIPO CITA', field: 'tipo_cita.nombre' },
		{ title: 'COSMETOLOGA', field: 'cosmetologa_nombre' },
		{ title: 'ESTADO', field: 'status.nombre' },
		{ title: 'PRECIO', field: 'precio_moneda' },
		{ title: 'TOTAL', field: 'total_moneda' },
		{ title: 'OBSERVACIONES', field: 'observaciones' },
		{ title: 'HORA LLEGADA', field: 'hora_llegada' },
		{ title: 'HORA ATENDIDO', field: 'hora_atencion' },
		{ title: 'HORA SALIDA', field: 'hora_salida' },
	];

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

	const loadTratamientos = async () => {
		const response = await findTreatmentByServicio(servicioAparatologiaId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setTratamientos(response.data);
		}
	}

	const loadAreas = async (tratamiento) => {
		const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setAreas(response.data);
		}
	}

	const loadHorarios = async (date) => {
		const dia = date ? date.getDate() : values.fecha_hora.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_hora.getMonth());
		const anio = date ? date.getFullYear() : values.fecha_hora.getFullYear();
		const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, values.servicio);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setHorarios(response.data);
		}
	}

	const loadHorariosByServicio = async (date, servicio) => {
		const dia = date ? date.getDate() : values.fecha_hora.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_hora.getMonth());
		const anio = date ? date.getFullYear() : values.fecha_hora.getFullYear();
		const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, servicio);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setHorarios(response.data);
		}
	}

	const handleChangeServicio = async (e) => {
		setIsLoading(true);

		setValues({
			...values,
			servicio: e.target.value,
			fecha_hora: '',
			precio: 0,
			total: 0,
			tratamientos: []
		});
		loadTratamientos(e.target.value);
		setIsLoading(false);
	};

	const handleChangeTratamientos = (e) => {
		e.map(async (tratamiento) => {
			setIsLoading(true);
			const response = await findAreasByTreatmentServicio(tratamiento.servicio, tratamiento._id);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				tratamiento.areas = response.data;
				setIsLoading(false);
				setValues({
					...values,
					fecha_hora: '',
					precio: 0,
					total: 0,
					tratamientos: e,
				});
			}
		});
	};

	const handleChangeAreas = async (items, tratamiento) => {
		tratamiento.areasSeleccionadas = items;
		setIsLoading(true);
		let precio = 0;
		values.tratamientos.forEach(tratam => {
			if (tratam.areasSeleccionadas) {
				tratam.areasSeleccionadas.map((item) => {
					const itemPrecio =
						sucursal === sucursalManuelAcunaId ? item.precio_ma // Precio Manuel Acuña
							: (sucursal === sucursalOcciId ? item.precio_oc // Precio Occidental
								: (sucursal === sucursalFedeId ? item.precio_fe // Precio Federalismo
									: 0)); // Error
					precio = Number(precio) + Number(itemPrecio);
				});
			}
		});
		setValues({
			...values,
			fecha_hora: '',
			precio: precio,
			total: precio,
		});
		setDisableDate(false);
		setIsLoading(false);
	}
	const handleChangeFecha = (date) => {
		setIsLoading(true);
		setValues({
			...values,
			fecha_hora: date,
		});
		loadHorarios(date);
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

	const handleChangeObservaciones = e => {
		setValues({ ...values, observaciones: e.target.value.toUpperCase() });
	}

	const handleChangeFilterDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setFilterDate({
			fecha_show: date,
			fecha: `${dia}/${mes}/${anio}`
		});
		await loadAparatologias(date);
		setIsLoading(false);
	};

	const loadAparatologias = async (filterDate) => {
		const response = await findAparatologiaByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				const fecha = new Date(item.fecha_hora);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.total_moneda = toFormatterCurrency(item.total);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
				item.show_tratamientos = item.tratamientos.map(tratamiento => {
					const show_areas = tratamiento.areasSeleccionadas.map(area => {
						return `${area.nombre}`;
					});
					return `►${tratamiento.nombre}(${show_areas}) `;
				});
			});
			setAparatologia(response.data);
		}
	}

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		data.tratamientos.forEach(tratamiento => {
			tratamiento.areas = undefined;
		});
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal;
		data.status = pendienteStatusId;
		data.hora_llegada = '--:--';
		data.hora_atencion = '--:--';
		data.hora_salida = '--:--';
		data.tipo_cita = data.dermatologo._id === dermatologoDirectoId ? directoTipoCitaId : data.tipo_cita;
		const response = await createAparatologia(data);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			const consecutivo = {
				consecutivo: response.data.consecutivo,
				tipo_servicio: response.data.servicio,
				servicio: response.data._id,
				sucursal: sucursal,
				fecha_hora: new Date(),
				status: response.data.status,
			}
			const responseConsecutivo = await createConsecutivo(consecutivo);
			if (`${responseConsecutivo.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
				setOpenAlert(true);
				setSeverity('success');
				setMessage('APARATOLOGIA AGREGADA CORRECTAMENTE');
				setValues({
					servicio: '',
					tratamientos: [],
					dermatologo: '',
					promovendedor: '',
					cosmetologa: '',
					paciente: `${paciente._id}`,
					precio: 0,
					total: 0,
					tipo_cita: {},
					tiempo: '30',
				});
				setTratamientos([]);
				setAreas([]);
				setDisableDate(true);
				setPacienteAgendado({});
				loadAparatologias(new Date());
			}
		}

		setIsLoading(false);
	};

	const handleChangeItemPrecio = (e, index) => {
		const newTratamientos = values.tratamientos;
		newTratamientos[index].precio = e.target.value;
		let precio = 0;
		newTratamientos.map((item) => {
			precio = Number(precio) + Number(item.precio);
		});
		setValues({
			...values,
			tratamientos: newTratamientos,
			precio: precio,
			total: precio,
		});
	}

	const handleChangeDoctors = (e) => {
		setValues({ ...values, dermatologo: e.target.value });
	}

	const handleChangePromovendedor = (e) => {
		setValues({ ...values, promovendedor: e.target.value });
	}

	const handleChangeCosmetologa = (e) => {
		setValues({ ...values, cosmetologa: e.target.value });
	}

	const handleChangeTipoCita = (e) => {
		setValues({ ...values, tipo_cita: e.target.value });
	}

	const handleChangeMedio = (e) => {
		setValues({ ...values, medio: e.target.value });
	}

	const handleChangeTiempo = (e) => {
		setValues({ ...values, tiempo: e.target.value });
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setTratamientos([]);
		setOpenModalProxima(false);
	};

	const handleOnClickEditarCita = async (event, rowData) => {
		setIsLoading(true);
		setCita(rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModal(true);
		setIsLoading(false);
	}

	const handleOnClickNuevaCita = async (event, rowData) => {
		setIsLoading(true);
		setCita(rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModalProxima(true);
		setIsLoading(false);
	}

	const handleClickVerPagos = (event, rowData) => {
		setCita(rowData);
		setOpenModalPagos(true);
	}

	const handleCloseVerPagos = (event, rowData) => {
		setOpenModalPagos(false);
	}

	const handleCloseImprimirConsulta = (event, rowData) => {
		setOpenModalImprimirCita(false);
	}

	const handlePrint = async (event, rowData) => {
		setDatosImpresion(rowData);
		setOpenModalImprimirCita(true);
	}

	const actions = [
		{
			icon: PrintIcon,
			tooltip: 'Imprimir',
			onClick: handlePrint
		},
		//new Date(anio, mes - 1, dia) < filterDate.fecha_hora  ? 
		{
			icon: EditIcon,
			tooltip: 'Editar cita',
			onClick: handleOnClickEditarCita
		}, //: ''
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
				onClick: handleOnClickNuevaCita
			} : ''
		),
	];

	const handleGuardarModalPagos = async (servicio) => {
		servicio.pagado = servicio.pagos.length > 0;
		await updateAparatologia(servicio._id, servicio);
		await loadAparatologias(new Date(servicio.fecha_hora));
		setOpenModalPagos(false);
	}

	const handleChangeFrecuencia = (e) => {
		setValues({
			...values,
			frecuencia: e.target.value,
			//producto: frecuencia === frecuenciaPrimeraVezId ? productoConsultaId : values.producto,
		});
	}

	useEffect(() => {

		const loadAparatologias = async () => {
			const response = await findAparatologiaByDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(), sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					item.folio = generateFolio(item);
					const fecha = new Date(item.fecha_hora);
					item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
					item.precio_moneda = toFormatterCurrency(item.precio);
					item.total_moneda = toFormatterCurrency(item.total);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
					item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
					item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
					item.show_tratamientos = item.tratamientos.map(tratamiento => {
						const show_areas = tratamiento.areasSeleccionadas.map(area => {
							return `${area.nombre}`;
						});
						return `►${tratamiento.nombre}(${show_areas}) `;
					});
				});
				setAparatologia(response.data);
			}
			setIsLoading(false);
		}

		const loadPromovendedores = async () => {
			const response = await findEmployeesByRolId(promovendedorRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setPromovendedores(response.data);
			}
		}

		const loadCosmetologas = async () => {
			const response = await findEmployeesByRolId(cosmetologaRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setCosmetologas(response.data);
			}
		}

		const loadDermatologos = async () => {
			const response = await findEmployeesByRolId(dermatologoRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setDermatologos(response.data);
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

		const loadProductos = async () => {
			/*const response = await findProductoByServicio(consultaServicioId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setProductos(response.data);
			}*/
		}

		setIsLoading(true);
		loadTratamientos();
		loadAparatologias();
		loadPromovendedores();
		loadCosmetologas();
		loadDermatologos();
		loadTipoCitas();
		loadFrecuencias();
		loadMedios();
	}, [sucursal]);

	return (
		<Fragment>
			{
				!isLoading ?
					<Formik
						enableReinitialize
						initialValues={values}
						validationSchema={validationSchema} >
						{
							props => <AgendarAparatologiaContainer
								tratamientos={tratamientos}
								areas={areas}
								horarios={horarios}
								onChangeTratamientos={(e) => handleChangeTratamientos(e)}
								onChangeAreas={handleChangeAreas}
								onChangeFecha={(e) => handleChangeFecha(e)}
								onChangeFilterDate={(e) => handleChangeFilterDate(e)}
								onChangeHora={(e) => handleChangeHora(e)}
								onChangeObservaciones={(e) => handleChangeObservaciones(e)}
								filterDate={filterDate.fecha_show}
								paciente={paciente}
								disableDate={disableDate}
								promovendedores={promovendedores}
								cosmetologas={cosmetologas}
								onClickAgendar={handleClickAgendar}
								titulo={`APARATOLOGIAS (${dateToString(filterDate.fecha_show)})`}
								columns={columns}
								options={options}
								aparatologias={aparatologias}
								actions={actions}
								cita={cita}
								openModal={openModal}
								openModalProxima={openModalProxima}
								empleado={empleado}
								onClickCancel={handleCloseModal}
								loadAparatologias={loadAparatologias}
								dermatologos={dermatologos}
								tipoCitas={tipoCitas}
								medios={medios}
								frecuencias={frecuencias}
								productos={productos}
								onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
								onChangeTipoCita={(e) => handleChangeTipoCita(e)}
								onChangeMedio={(e) => handleChangeMedio(e)}
								onChangeDoctors={(e) => handleChangeDoctors(e)}
								onChangePromovendedor={(e) => handleChangePromovendedor(e)}
								onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
								onChangeTiempo={(e) => handleChangeTiempo(e)}
								onCloseVerPagos={handleCloseVerPagos}
								openModalPagos={openModalPagos}
								openModalImprimirCita={openModalImprimirCita}
								datosImpresion={datosImpresion}
								onCloseImprimirConsulta={handleCloseImprimirConsulta}
								sucursal={sucursal}
								onChangeItemPrecio={handleChangeItemPrecio}
								setOpenAlert={setOpenAlert}
								setMessage={setMessage}
								setSeverity={setSeverity}
								setFilterDate={setFilterDate}
								dermatologoDirectoId={dermatologoDirectoId}
								onGuardarModalPagos={handleGuardarModalPagos}
								{...props} />
						}
					</Formik> :
					<Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
			}
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default AgendarAparatologia;