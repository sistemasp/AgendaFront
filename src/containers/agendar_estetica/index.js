import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
	findScheduleByDateAndSucursalAndService,
	findEmployeesByRolId,
	createConsecutivo,
	showAllMaterials,
	showAllMaterialEsteticas,
	showAllFrecuencias,
} from "../../services";
import {
	createEstetica,
	findEsteticaByDateAndSucursal,
	updateEstetica
} from "../../services/esteticas";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import * as Yup from "yup";
import { toFormatterCurrency, addZero, generateFolio, dateToString } from "../../utils/utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PrintIcon from '@material-ui/icons/Print';
import { AgendarEsteticaContainer } from "./agendar_estetica";
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import { findProductoByServicio } from "../../services/productos";

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
	fecha: Yup.string("Ingresa la fecha de nacimiento")
		.required("Los nombres del pacientes son requeridos"),
	hora: Yup.string("Ingresa la direccion")
		.required("Los nombres del pacientes son requeridos")
});

const AgendarEstetica = (props) => {
	const classes = useStyles();

	const {
		empleado,
		consultaAgendada,
		sucursal,
	} = props;

	const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;

	const paciente = consultaAgendada.paciente ? consultaAgendada.paciente : {};

	const dermatologoRolId = process.env.REACT_APP_DERMATOLOGO_ROL_ID;
	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
	const dermatologoDirectoId = process.env.REACT_APP_DERMATOLOGO_DIRECTO_ID;
	const tipoCitaRealizadoId = process.env.REACT_APP_TIPO_CITA_REALIZADO_ID;
	const esteticaServicioId = process.env.REACT_APP_ESTETICA_SERVICIO_ID;
	const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
	const frecuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
	const productoAplicacionToxinaBotulinicaDituroxalId = process.env.REACT_APP_PRO_APL_TOX_BOT_DIT_ID;

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [horarios, setHorarios] = useState([]);
	const [dermatologos, setDermatologos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(false);
	const [frecuencias, setFrecuencias] = useState([]);
	const [productos, setProductos] = useState([]);
	const [toxinasRellenos, setToxinaRellenos] = useState([]);

	const [values, setValues] = useState({
		servicio: esteticaServicioId,
		fecha_hora: new Date(),
		precio: 0,
		total: 0,
		observaciones: '',
		materiales: [],
		producto: productoAplicacionToxinaBotulinicaDituroxalId,
		tipo_cita: tipoCitaRealizadoId,
	});
	const [esteticas, setEsteticas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalProxima, setOpenModalProxima] = useState(false);
	const [estetica, setEstetica] = useState();
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
		{ title: 'DERMATÓLOGO', field: 'dermatologo_nombre' },
		{ title: 'ESTADO', field: 'status.nombre' },
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
		loadHorariosByServicio(date, esteticaServicioId);
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
		await loadEsteticas(date);
		setIsLoading(false);
	};

	const loadEsteticas = async (filterDate) => {
		const response = await findEsteticaByDateAndSucursal(filterDate.getDate(), filterDate.getMonth(), filterDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.folio = generateFolio(item);
				const fecha = new Date(item.fecha_hora);
				item.hora = `${addZero(fecha.getHours())}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.total_moneda = toFormatterCurrency(item.total);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.dermatologo_nombre = item.dermatologo ? item.dermatologo.nombre : 'DIRECTO';
			});
			setEsteticas(response.data);
		}
	}

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		const dateNow = new Date();
		data.consulta = consultaAgendada._id;
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal;
		data.status = pendienteStatusId;
		data.paciente = paciente._id;
		data.status = asistioStatusId;
		data.hora_aplicacion = dateNow;
		data.hora_llegada = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;;
		data.hora_atencion = '--:--';
		data.hora_salida = '--:--';
		const response = await createEstetica(data);
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
				setMessage('EL ESTETICA SE AGREGO CORRECTAMENTE');
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
				loadEsteticas(data.fecha_hora);
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

	const handleChangeMedio = (e) => {
		setValues({ ...values, medio: e.target.value });
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
		setOpenModalProxima(false);
	};

	const handleOnClickEditarCita = async (event, rowData) => {
		setIsLoading(true);
		setEstetica(rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModal(true);
		setIsLoading(false);
	}

	const handleOnClickNuevaCita = async (event, rowData) => {
		setIsLoading(true);
		setEstetica(rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModalProxima(true);
		setIsLoading(false);
	}

	const handleClickVerPagos = (event, rowData) => {
		setEstetica(rowData);
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
			tooltip: 'EDITAR ESTETICA',
			onClick: handleOnClickEditarCita
		}, //: ''
		rowData => (
			rowData.status._id !== pendienteStatusId ? {
				icon: AttachMoneyIcon,
				tooltip: rowData.pagado ? 'VER PAGO' : 'PAGAR',
				onClick: handleClickVerPagos
			} : ''
		),
		/*rowData => (
			rowData.status._id === atendidoStatusId ? {
				icon: EventAvailableIcon,
				tooltip: 'NUEVA ESTETICA',
				onClick: handleOnClickNuevaCita
			} : ''
		),*/
	];

	const handleGuardarModalPagos = async (servicio) => {
		servicio.pagado = servicio.pagos.length > 0;
		await updateEstetica(servicio._id, servicio);
		await loadEsteticas(new Date(servicio.fecha_hora));
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
		let precio = Number(values.total);

		newMateriales.map((item) => {
			precio -= Number(item.precio);
		});

		setValues({
			...values,
			materiales: newMateriales,
			precio: precio,
		});
	}

	const handleChangeTotal = e => {
		let precio = Number(e.target.value);
		values.materiales.map(item => {
			precio -= Number(item.precio);
		});
		setValues({
			...values,
			total: e.target.value,
			precio: precio,
		});
	};

	const handleChangeToxinasRellenos = async (items) => {
		setIsLoading(true);
		setValues({
			...values,
			toxinas_rellenos: items
		});
		setIsLoading(false);
	}

	const handleChangeItemUnidades = (e, index) => {
		const newToxinasRellenos = values.toxinas_rellenos;
		newToxinasRellenos[index].unidades = e.target.value;
		newToxinasRellenos[index].total = Number(newToxinasRellenos[index].precio) * Number(e.target.value)
		let precio = values.total;
		newToxinasRellenos.map((item) => {
			precio -= Number(item.precio) * Number(item.unidades);
		});
		values.materiales.map(item => {
			precio -= Number(item.precio);
		});

		setValues({
			...values,
			toxinas_rellenos: newToxinasRellenos,
			precio: precio,
		});
	}

	const handleChangeProductos = (e) => {
		setValues({ ...values, producto: e.target.value });
	}

	const handleChangeFrecuencia = (e) => {
		const frecuencia = e.target.value._id;
		setValues({
			...values,
			frecuencia: frecuencia,
			producto: frecuencia === frecuenciaPrimeraVezId ? productoAplicacionToxinaBotulinicaDituroxalId : values.producto,
		});
	}

	useEffect(() => {
		const loadToxinasRellenos = async () => {
			const response = await showAllMaterialEsteticas();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setToxinaRellenos(response.data);
			}
		}

		const loadEsteticas = async () => {
			const response = await findEsteticaByDateAndSucursal(date.getDate(), date.getMonth(), date.getFullYear(), sucursal);
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
				});
				setEsteticas(response.data);
			}
			setIsLoading(false);
		}

		const loadDermatologos = async () => {
			const response = await findEmployeesByRolId(dermatologoRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setDermatologos(response.data);
			}
		}

		const loadMateriales = async () => {
			const response = await showAllMaterials();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setMateriales(response.data);
			}
		}

		const loadFrecuencias = async () => {
			const response = await showAllFrecuencias();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setFrecuencias(response.data);
			}
		}

		const loadProductos = async () => {
			const response = await findProductoByServicio(esteticaServicioId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setProductos(response.data);
			}
		}

		setIsLoading(true);
		loadToxinasRellenos();
		loadEsteticas();
		loadFrecuencias();
		loadProductos();
		loadHorariosByServicio(new Date(), esteticaServicioId);
		loadDermatologos();
		loadMateriales();
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
							props => <AgendarEsteticaContainer
								horarios={horarios}
								onChangeFecha={(e) => handleChangeFecha(e)}
								onChangeFilterDate={(e) => handleChangeFilterDate(e)}
								onChangeHora={(e) => handleChangeHora(e)}
								onChangeMateriales={(e) => handleChangeMateriales(e)}
								onChangeItemPrecio={handleChangeItemPrecio}
								onChangeObservaciones={(e) => handleChangeObservaciones(e)}
								onChangeItemUnidades={handleChangeItemUnidades}
								filterDate={filterDate.fecha_show}
								paciente={paciente}
								disableDate={disableDate}
								onClickAgendar={handleClickAgendar}
								onChangeTiempo={(e) => handleChangeTiempo(e)}
								titulo={`ESTETICA (${dateToString(filterDate.fecha_show)})`}
								onChangeToxinasRellenos={(e) => handleChangeToxinasRellenos(e)}
								onChangeTotal={handleChangeTotal}
								columns={columns}
								options={options}
								esteticas={esteticas}
								actions={actions}
								estetica={estetica}
								openModal={openModal}
								empleado={empleado}
								toxinasRellenos={toxinasRellenos}
								onClickCancel={handleCloseModal}
								loadEsteticas={loadEsteticas}
								dermatologos={dermatologos}
								onChangeMedio={(e) => handleChangeMedio(e)}
								onChangeDoctors={(e) => handleChangeDoctors(e)}
								onCloseVerPagos={handleCloseVerPagos}
								openModalPagos={openModalPagos}
								openModalProxima={openModalProxima}
								openModalImprimirCita={openModalImprimirCita}
								datosImpresion={datosImpresion}
								onCloseImprimirConsulta={handleCloseImprimirConsulta}
								sucursal={sucursal}
								setOpenAlert={setOpenAlert}
								setMessage={setMessage}
								setFilterDate={setFilterDate}
								dermatologoDirectoId={dermatologoDirectoId}
								onGuardarModalPagos={handleGuardarModalPagos}
								materiales={materiales}
								onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
								frecuencias={frecuencias}
								onChangeProductos={(e) => handleChangeProductos(e)}
								productos={productos}
								frecuenciaReconsultaId={frecuenciaReconsultaId}
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

export default AgendarEstetica;