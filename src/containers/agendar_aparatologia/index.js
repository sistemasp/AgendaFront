import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import {
	findScheduleByDateAndSucursalAndService,
	findEmployeesByRolId,
	showAllTipoCitas,
	findAreasByTreatmentServicio,
	createConsecutivo,
	showAllMedios,
} from "../../services";
import {
	findTreatmentByServicio,
} from "../../services/tratamientos";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import * as Yup from "yup";
import { toFormatterCurrency, addZero, generateFolio, dateToString } from "../../utils/utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PrintIcon from '@material-ui/icons/Print';
import { AgendarAparatologiaContainer } from "./agendar_aparatologia";
import { createAparatologia, findAparatologiaByDateAndSucursal, updateAparatologia } from "../../services/aparatolgia";

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
		paciente,
		empleado,
		setPacienteAgendado,
		sucursal,
	} = props;

	const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
	const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
	const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
	const sucursalOcciId = process.env.REACT_APP_SUCURSAL_OCCI_ID;
	const sucursalFedeId = process.env.REACT_APP_SUCURSAL_FEDE_ID;
	const medicoDirectoId = process.env.REACT_APP_MEDICO_DIRECTO_ID;
	const tipoCitaNoAplicaId = process.env.REACT_APP_TIPO_CITA_NO_APLICA_ID;
	const servicioAparatologiaId = process.env.REACT_APP_APARATOLOGIA_SERVICIO_ID;

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [servicios, setServicios] = useState([]);
	const [tratamientos, setTratamientos] = useState([]);
	const [horarios, setHorarios] = useState([]);
	const [medicos, setMedicos] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [cosmetologas, setCosmetologas] = useState([]);
	const [tipoCitas, setTipoCitas] = useState([]);
	const [medios, setMedios] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
	const [values, setValues] = useState({
		servicio: servicioAparatologiaId,
		tratamientos: [],
		areas: [],
		paciente: `${paciente._id}`,
		precio: 0,
		tipo_cita: tipoCitaNoAplicaId,
		observaciones: '',
		medico: { _id: medicoDirectoId},
		tiempo: '30',
	});
	const [aparatologias, setAparatologia] = useState([]);
	const [areas, setAreas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
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
		{ title: 'Folio', field: 'folio' },
		{ title: 'Hora', field: 'hora' },
		{ title: 'Paciente', field: 'paciente_nombre' },
		{ title: 'Telefono', field: 'paciente.telefono' },
		{ title: 'Servicio', field: 'servicio.nombre' },
		{ title: 'Tratamientos', field: 'show_tratamientos' },
		{ title: 'Areas', field: 'show_areas' },
		{ title: 'Quien agenda', field: 'quien_agenda.nombre' },
		{ title: 'Medio', field: 'medio.nombre' },
		{ title: 'Quien confirma llamada', field: 'quien_confirma_llamada.nombre' },
		{ title: 'Quien confirma asistencia', field: 'quien_confirma_asistencia.nombre' },
		{ title: 'Promovendedor', field: 'promovendedor_nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
		{ title: 'Tipo Cita', field: 'tipo_cita.nombre' },
		{ title: 'Cosmetologa', field: 'cosmetologa_nombre' },
		{ title: 'Estado', field: 'status.nombre' },
		{ title: 'Precio', field: 'precio_moneda' },
		{ title: 'Observaciones', field: 'observaciones' },
		{ title: 'Hora llegada', field: 'hora_llegada' },
		{ title: 'Hora atendido', field: 'hora_atencion' },
		{ title: 'Hora salida', field: 'hora_salida' },
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
			tratamientos: []
		});
		loadTratamientos(e.target.value);
		setIsLoading(false);
	};

	const handleChangeTratamientos = async (e) => {
		setIsLoading(true);
		setValues({
			...values,
			fecha_hora: '',
			precio: 0,
			tratamientos: [e.target.value],
		});
		loadAreas(e.target.value);
		setIsLoading(false);
	};

	const handleChangeAreas = async (items) => {
		setIsLoading(true);
		let precio = 0;
		items.map((item) => {
			const itemPrecio =
				sucursal === sucursalManuelAcunaId ? item.precio_ma // Precio Manuel Acuña
					: (sucursal === sucursalOcciId ? item.precio_oc // Precio Occidental
						: (sucursal === sucursalFedeId ? item.precio_fe // Precio Federalismo
							: 0)); // Error
			precio = Number(precio) + Number(itemPrecio);
		});
		setValues({
			...values,
			fecha_hora: '',
			precio: precio,
			areas: items
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
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
				item.show_tratamientos = item.tratamientos.map(tratamiento => {
					return `${tratamiento.nombre}, `;
				});
				item.show_areas = item.areas.map(area => {
					return `${area.nombre}, `;
				});
			});
			setAparatologia(response.data);
		}
	}

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal;
		data.status = pendienteStatusId;
		data.hora_llegada = '--:--';
		data.hora_atencion = '--:--';
		data.hora_salida = '--:--';
		data.tipo_cita = data.medico._id === medicoDirectoId ? tipoCitaNoAplicaId : data.tipo_cita;

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
				setMessage('APARATOLOGIA AGREGADA CORRECTAMENTE');
				setValues({
					servicio: '',
					tratamientos: [],
					medico: '',
					promovendedor: '',
					cosmetologa: '',
					paciente: `${paciente._id}`,
					precio: '',
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
		});
	}

	const handleChangeDoctors = (e) => {
		setValues({ ...values, medico: e.target.value });
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
	};

	const handleOnClickEditarCita = async (event, rowData) => {
		setIsLoading(true);
		setCita(rowData);
		// await loadTratamientos(rowData.servicio);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModal(true);
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
	];

	const handleGuardarModalPagos = async (servicio) => {
		servicio.pagado = servicio.pagos.length > 0;
		await updateAparatologia(servicio._id, servicio);
		await loadAparatologias(new Date(servicio.fecha_hora));
		setOpenModalPagos(false);
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
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
					item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
					item.show_tratamientos = item.tratamientos.map(tratamiento => {
						return `${tratamiento.nombre}, `;
					});
					item.show_areas = item.areas.map(area => {
						return `${area.nombre}, `;
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

		const loadMedicos = async () => {
			const response = await findEmployeesByRolId(medicoRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setMedicos(response.data);
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

		setIsLoading(true);
		loadTratamientos();
		loadAparatologias();
		loadPromovendedores();
		loadCosmetologas();
		loadMedicos();
		loadTipoCitas();
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
								onChangeAreas={(e) => handleChangeAreas(e)}
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
								empleado={empleado}
								onClickCancel={handleCloseModal}
								loadAparatologias={loadAparatologias}
								medicos={medicos}
								tipoCitas={tipoCitas}
								medios={medios}
								onChangeTipoCita={(e) => handleChangeTipoCita(e)}
								onChangeMedio={(e) => handleChangeMedio(e)}
								onChangeDoctors={(e) => handleChangeDoctors(e)}
								onChangePromovendedor={(e) => handleChangePromovendedor(e)}
								onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
								onCloseVerPagos={handleCloseVerPagos}
								openModalPagos={openModalPagos}
								openModalImprimirCita={openModalImprimirCita}
								datosImpresion={datosImpresion}
								onCloseImprimirConsulta={handleCloseImprimirConsulta}
								sucursal={sucursal}
								onChangeItemPrecio={handleChangeItemPrecio}
								setOpenAlert={setOpenAlert}
								setMessage={setMessage}
								setFilterDate={setFilterDate}
								medicoDirectoId={medicoDirectoId}
								onGuardarModalPagos={handleGuardarModalPagos}
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

export default AgendarAparatologia;