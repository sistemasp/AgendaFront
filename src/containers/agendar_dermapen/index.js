import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
	findScheduleByDateAndSucursalAndService,
	findEmployeesByRolId,
	createConsecutivo,
	showAllMedios,
	showAllMaterials,
	showAllFrecuencias,
} from "../../services";
import {
	createDermapen,
	findDermapenByDateAndSucursal,
	updateDermapen
} from "../../services/dermapens";
import {
	findAreaById, findAreasByTreatmentServicio,
} from "../../services/areas";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import * as Yup from "yup";
import { toFormatterCurrency, addZero, generateFolio, dateToString } from "../../utils/utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PrintIcon from '@material-ui/icons/Print';
import { AgendarDermapenContainer } from "./agendar_dermapen";
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

const AgendarDermapen = (props) => {
	const classes = useStyles();

	const {
		consultaAgendada,
		empleado,
		sucursal,
	} = props;

	const paciente = consultaAgendada.paciente ? consultaAgendada.paciente : {};

	const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
	const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
	const atendidoStatusId = process.env.REACT_APP_ATENDIDO_STATUS_ID;
	const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
	const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
	const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
	const sucursalRubenDarioId = process.env.REACT_APP_SUCURSAL_RUBEN_DARIO_ID;
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const tipoCitaRealizadoId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
	const dermapenServicioId = process.env.REACT_APP_DERMAPEN_SERVICIO_ID;
	const dermapenTratamientoId = process.env.REACT_APP_DERMAPEN_TRATAMIENTO_ID;
	const dermapenAreaId = process.env.REACT_APP_DERMAPEN_AREA_ID;
	const productoMicropuncionId = process.env.REACT_APP_PRODUCTO_MICROPUNCION_ID;

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [tratamientos, setTratamientos] = useState([]);
	const [horarios, setHorarios] = useState([]);
	const [dermatologos, setDermatologos] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [frecuencias, setFrecuencias] = useState([]);
	const [cosmetologas, setCosmetologas] = useState([]);
	const [tipoCitas, setTipoCitas] = useState([]);
	const [medios, setMedios] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(false);
	const [values, setValues] = useState({
		servicio: dermapenServicioId,
		fecha_hora: new Date(),
		tratamientos: [{ _id: dermapenTratamientoId }],
		areas: [],
		paciente: `${paciente._id}`,
		precio: 0,
		tipo_cita: tipoCitaRealizadoId,
		producto: productoMicropuncionId,
		tiempo: '',
		observaciones: '',
		materiales: [],
	});
	const [dermapens, setDermapens] = useState([]);
	const [areas, setAreas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalProxima, setOpenModalProxima] = useState(false);
	const [dermapen, setDermapen] = useState();
	const [openModalPagos, setOpenModalPagos] = useState(false);
	const [openModalImprimirCita, setOpenModalImprimirCita] = useState(false);
	const [datosImpresion, setDatosImpresion] = useState();
	const [materiales, setMateriales] = useState([]);

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
		{ title: 'FOLIO CONSULTA', field: 'consulta.consecutivo' },
		{ title: 'PACIENTE', field: 'paciente_nombre' },
		{ title: 'TELEFONO', field: 'paciente.telefono' },
		{ title: 'QUIEN AGENDA', field: 'quien_agenda.nombre' },
		sucursal._id === sucursalManuelAcunaId ? { title: 'MEDIO', field: 'medio.nombre' } : {},
		{ title: 'TIPO CONSULTA', field: 'tipo_cita.nombre' },
		sucursal._id === sucursalManuelAcunaId ? { title: 'QUIEN CONFIRMA LLAMADA', field: 'quien_confirma_llamada.nombre' } : {},
		sucursal._id === sucursalManuelAcunaId ? { title: 'QUIEN CONFIRMA ASISTENCIA', field: 'quien_confirma_asistencia.nombre' } : {},
		{ title: 'PROMOVENDEDOR', field: 'promovendedor_nombre' },
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
		{ title: 'ESTADO', field: 'status.nombre' },
		{ title: 'PRECIO', field: 'precio_moneda' },
		{ title: 'TOTAL', field: 'total_moneda' },
		{ title: 'TIEMPO (MINUTOS)', field: 'tiempo' },
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

	const loadHorariosByServicio = async (date, servicio) => {
		const dia = date ? date.getDate() : values.fecha_hora.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_hora.getMonth());
		const anio = date ? date.getFullYear() : values.fecha_hora.getFullYear();
		const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, servicio);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setHorarios(response.data);
		}
	}

	const handleChangeFecha = (date) => {
		setIsLoading(true);
		setValues({
			...values,
			fecha_hora: date,
		});
		loadHorariosByServicio(date, dermapenServicioId);
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
		await loadDermapens(date);
		setIsLoading(false);
	};

	const loadDermapens = async (filterDate) => {
		const response = await findDermapenByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				const fecha = new Date(item.fecha_hora);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.total_moneda = toFormatterCurrency(item.total);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
				item.show_tratamientos = item.tratamientos.map(tratamiento => {
					return `${tratamiento.nombre}, `;
				});
				item.show_areas = item.areas.map(area => {
					return `${area.nombre}, `;
				});
			});
			setDermapens(response.data);
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

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		data.consulta = consultaAgendada._id;
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal;
		data.status = pendienteStatusId;
		data.hora_llegada = '--:--';
		data.hora_atencion = '--:--';
		data.hora_salida = '--:--';
		data.total = data.precio;
		// data.tiempo = getTimeToTratamiento(data.tratamientos);

		const response = await createDermapen(data);
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
				setMessage('EL DERMAPEN SE AGREGO CORRECTAMENTE');
				setValues({
					materiales: [],
					dermatologo: '',
					promovendedor: '',
					cosmetologa: '',
					paciente: `${paciente._id}`,
					precio: '',
					total: '',
					tipo_cita: {},
				});
				setTratamientos([]);
				setAreas([]);
				loadDermapens(data.fecha_hora);
				setFilterDate({
					fecha_show: data.fecha_hora,
					fecha: dateToString(data.fecha_hora),
				});
			}
		}

		setIsLoading(false);
	};

	const handleChangeTiempo = (e) => {
		setValues({ ...values, tiempo: e.target.value });
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
		setDermapen(rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModal(true);
		setIsLoading(false);
	}

	const handleOnClickNuevaCita = async (event, rowData) => {
		setIsLoading(true);
		setDermapen(rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModalProxima(true);
		setIsLoading(false);
	}

	const handleClickVerPagos = (event, rowData) => {
		setDermapen(rowData);
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
			tooltip: 'IMPRIMIR',
			onClick: handlePrint
		},
		//new Date(anio, mes - 1, dia) < filterDate.fecha_hora  ? 
		{
			icon: EditIcon,
			tooltip: 'EDITAR DERMAPEN',
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
				tooltip: 'NUEVO DERMAPEN',
				onClick: handleOnClickNuevaCita
			} : ''
		),
	];

	const handleGuardarModalPagos = async (servicio) => {
		servicio.pagado = servicio.pagos.length > 0;
		await updateDermapen(servicio._id, servicio);
		await loadDermapens(new Date(servicio.fecha_hora));
		setOpenModalPagos(false);
	}

	const handleChangeMateriales = async (items) => {
		setIsLoading(true);
		setValues({
			...values,
			materiales: items
		});
		setIsLoading(false);
	}

	const handleChangeItemPrecio = (e, index) => {
		const newMateriales = values.materiales;
		newMateriales[index].precio = e.target.value;
		let total_aplicacion = Number(values.precio) - Number(values.costo);
		newMateriales.map((item) => {
			total_aplicacion -= Number(item.precio);
		});
		setValues({
			...values,
			materiales: newMateriales,
			total_aplicacion: total_aplicacion,
		});
	}

	const handleChangeTotal = (event) => {
		const precio = event.target.value;
		let total_aplicacion = precio - values.costo;
		setValues({
			...values,
			precio: event.target.value,
			total_aplicacion: total_aplicacion,
		})
	}

	const handleChangeCosto = (event) => {
		const costo = event.target.value;
		const total_aplicacion = Number(values.precio) - Number(costo);
		setValues({
			...values,
			total_aplicacion: total_aplicacion,
			costo: costo,
		});
	}

	const loadAreas = async () => {
		const response = await findAreasByTreatmentServicio(dermapenServicioId, dermapenTratamientoId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setAreas(response.data);
		}
	}

	const handleChangeAreas = async (items) => {
		setIsLoading(true);
		setValues({
			...values,
			tratamientos: [
				{
					_id: dermapenTratamientoId,
					nombre: "DERMAPEN",
					areasSeleccionadas: items,
				}
			],
			fecha_hora: '',
		});
		setDisableDate(false);
		setIsLoading(false);
	}
	const handleChangeFrecuencia = (e) => {
		const frecuencia = e.target.value._id;
		setValues({
			...values,
			frecuencia: frecuencia,
		});
	}

	useEffect(() => {
		const loadDermapens = async () => {
			const response = await findDermapenByDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(), sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					item.folio = generateFolio(item);
					const fecha = new Date(item.fecha_hora);
					item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
					item.precio_moneda = toFormatterCurrency(item.precio);
					item.total_moneda = toFormatterCurrency(item.total);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
					item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
					item.show_tratamientos = item.tratamientos.map(tratamiento => {
						return `${tratamiento.nombre}, `;
					});
					item.show_areas = item.areas.map(area => {
						return `${area.nombre}, `;
					});
				});
				setDermapens(response.data);
			}
			setIsLoading(false);
		}

		const findDermapen = async () => {
			const response = await findAreaById(dermapenAreaId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				const dermapen = response.data;
				const precio =
					sucursal === sucursalManuelAcunaId ? dermapen.precio_ma // Precio Manuel Acuña
						: (sucursal === sucursalOcciId ? dermapen.precio_oc // Precio Occidental
							: (sucursal === sucursalFedeId ? dermapen.precio_fe // Precio Federalismo}
								: (sucursal === sucursalRubenDarioId ? dermapen.precio_rd // PRECIO RUBEN DARIO
									: 0))); // Error
				setValues({
					...values,
					total: 0,
					precio: 0 - Number(precio),
					costo: precio,
				});
			}
		}

		const loadPromovendedores = async () => {
			const response = await findEmployeesByRolId(promovendedorRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setPromovendedores(response.data);
			}
		}

		const loadFrecuencias = async () => {
			const response = await showAllFrecuencias();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setFrecuencias(response.data);
			}
		}

		const loadDermatologos = async () => {
			const response = await findEmployeesByRolId(dermatologoRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setDermatologos(response.data);
			}
		}

		const loadMedios = async () => {
			const response = await showAllMedios();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setMedios(response.data);
			}
		}

		const loadMateriales = async () => {
			const response = await showAllMaterials();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setMateriales(response.data);
			}
		}

		setIsLoading(true);
		findDermapen();
		loadDermapens();
		loadFrecuencias();
		loadAreas();
		loadHorariosByServicio(new Date(), dermapenServicioId);
		loadPromovendedores();
		loadDermatologos();
		loadMateriales();
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
							props => <AgendarDermapenContainer
								tratamientos={tratamientos}
								areas={areas}
								horarios={horarios}
								onChangeFecha={(e) => handleChangeFecha(e)}
								onChangeFilterDate={(e) => handleChangeFilterDate(e)}
								onChangeHora={(e) => handleChangeHora(e)}
								onChangeMateriales={(e) => handleChangeMateriales(e)}
								onChangeItemPrecio={handleChangeItemPrecio}
								onChangeObservaciones={(e) => handleChangeObservaciones(e)}
								filterDate={filterDate.fecha_show}
								paciente={paciente}
								disableDate={disableDate}
								promovendedores={promovendedores}
								cosmetologas={cosmetologas}
								onClickAgendar={handleClickAgendar}
								onChangeTiempo={(e) => handleChangeTiempo(e)}
								titulo={`DERMAPEN (${dateToString(filterDate.fecha_show)})`}
								columns={columns}
								options={options}
								dermapens={dermapens}
								actions={actions}
								dermapen={dermapen}
								openModal={openModal}
								empleado={empleado}
								onClickCancel={handleCloseModal}
								loadDermapens={loadDermapens}
								dermatologos={dermatologos}
								tipoCitas={tipoCitas}
								medios={medios}
								onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
								frecuencias={frecuencias}
								onChangeTipoCita={(e) => handleChangeTipoCita(e)}
								onChangeAreas={(e) => handleChangeAreas(e)}
								onChangeMedio={(e) => handleChangeMedio(e)}
								onChangeDoctors={(e) => handleChangeDoctors(e)}
								onChangePromovendedor={(e) => handleChangePromovendedor(e)}
								onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
								onCloseVerPagos={handleCloseVerPagos}
								openModalPagos={openModalPagos}
								openModalProxima={openModalProxima}
								openModalImprimirCita={openModalImprimirCita}
								datosImpresion={datosImpresion}
								onChangeTotal={handleChangeTotal}
								onChangeCosto={handleChangeCosto}
								onCloseImprimirConsulta={handleCloseImprimirConsulta}
								sucursal={sucursal}
								setOpenAlert={setOpenAlert}
								setMessage={setMessage}
								setFilterDate={setFilterDate}
								dermatologoDirectoId={dermatologoDirectoId}
								onGuardarModalPagos={handleGuardarModalPagos}
								materiales={materiales}
								{...props} />
						}
					</Formik> :
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

export default AgendarDermapen;