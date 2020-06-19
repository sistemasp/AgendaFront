import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AgendarContainer } from "./agendar";
import {
	getAllServices,
	findTreatmentByServicio,
	findScheduleByDateAndSucursalAndService,
	findDatesByDateAndSucursal,
	createDate,
	findEmployeesByRolId,
	showAllTipoCitas
} from "../../services";
import { Backdrop, CircularProgress, Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { Formik } from 'formik';
import EditIcon from '@material-ui/icons/Edit';
import * as Yup from "yup";
import { toFormatterCurrency, addZero } from "../../utils/utils";

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

const Agendar = (props) => {
	const classes = useStyles();

	const {
		paciente,
		empleado,
		setPacienteAgendado,
		sucursal,
	} = props;

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [servicios, setServicios] = useState([]);
	const [tratamientos, setTratamientos] = useState([]);
	const [horarios, setHorarios] = useState([]);
	const [medicos, setMedicos] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [cosmetologas, setCosmetologas] = useState([]);
	const [tipoCitas, setTipoCitas] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
	const [values, setValues] = useState({
		servicio: '',
		tratamientos: [],
		paciente: `${paciente._id}`,
		precio: '',
		tipo_cita: {},
		tiempo: '',
		observaciones: '',
	});
	const [citas, setCitas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [cita, setCita] = useState();

	const date = new Date();
	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [filterDate, setFilterDate] = useState({
		fecha_hora: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const columns = [
		{ title: 'Hora', field: 'hora' },
		{ title: 'Paciente', field: 'paciente_nombre' },
		{ title: 'Telefono', field: 'paciente.telefono' },
		{ title: 'Servicio', field: 'servicio.nombre' },
		{ title: 'Tratamientos', field: 'show_tratamientos' },
		{ title: 'Numero Sesion', field: 'numero_sesion' },
		{ title: 'Quien agenda', field: 'quien_agenda.nombre' },
		{ title: 'Tipo Cita', field: 'tipo_cita.nombre' },
		{ title: 'Quien confirma', field: 'quien_confirma.nombre' },
		{ title: 'Promovendedor', field: 'promovendedor_nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
		{ title: 'Cosmetologa', field: 'cosmetologa_nombre' },
		{ title: 'Estado', field: 'status.nombre' },
		{ title: 'Precio', field: 'precio_moneda' },
		{ title: 'Tiempo (minutos)', field: 'tiempo' },
		{ title: 'Observaciones', field: 'observaciones' },
	];

	const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
	const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;

	const options = {
		rowStyle: rowData => {
			return { 
				color: rowData.status.color,
				backgroundColor: rowData.pagado ? '#10CC88' : ''
			};
		},
		headerStyle: {
			backgroundColor: '#2BA6C6',
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		}
	}

	useEffect(() => {
		const loadServicios = async () => {
			const response = await getAllServices();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setServicios(response.data);
			}
		}

		const loadCitas = async () => {
			const response = await findDatesByDateAndSucursal(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					const fecha = new Date(item.fecha_hora);
					item.hora = `${addZero(fecha.getHours() + 5)}:${addZero(fecha.getMinutes())}`;
					item.precio_moneda = toFormatterCurrency(item.precio);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
					item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
					item.show_tratamientos = item.tratamientos.map(tratamiento => {
						return `${tratamiento.nombre}, `;
					});
				});
				setCitas(response.data);
			}
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

		setIsLoading(true);
		loadCitas();
		loadPromovendedores();
		loadCosmetologas();
		loadServicios();
		loadMedicos();
		loadTipoCitas();
		setIsLoading(false);
	}, [sucursal]);

	const loadTratamientos = async (servicio) => {
		const response = await findTreatmentByServicio(servicio._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setTratamientos(response.data);
		}
	}

	const loadHorarios = async (date) => {
		const dia = date ? date.getDate() : values.fecha_hora.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_hora.getMonth()) + 1;
		const anio = date ? date.getFullYear() : values.fecha_hora.getFullYear();
		const response = await findScheduleByDateAndSucursalAndService(dia, mes, anio, sucursal, values.servicio._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setHorarios(response.data);
		}
	}

	const loadHorariosByServicio = async (date, servicio) => {
		const dia = date ? date.getDate() : values.fecha_hora.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_hora.getMonth()) + 1;
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
			precio: '',
		});
		loadTratamientos(e.target.value);
		setIsLoading(false);
	};

	const handleChangeTratamientos = async (items) => {
		setIsLoading(true);
		setValues({
			...values,
			fecha_hora: '',
			precio: '',
			tratamientos: items
		});
		setDisableDate(false);
		setIsLoading(false);
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
		date.setHours(Number(hora[0]) - 5); // -5 por zona horaria
		date.setMinutes(hora[1]);
		date.setSeconds(0);
		setValues({ ...values, hora: e.target.value, fecha_hora: date });
		setIsLoading(false);
	};

	const handleChangeObservaciones = e => {
		setValues({ ...values, observaciones: e.target.value });
	}

	const handleChangeFilterDate = async (date) => {
		setIsLoading(true);
		const dia = addZero(date.getDate());
		const mes = addZero(date.getMonth() + 1);
		const anio = date.getFullYear();
		setFilterDate({
			fecha_hora: date,
			fecha: `${dia}/${mes}/${anio}`
		});
		await loadCitas(date);
		setIsLoading(false);
	};

	const loadCitas = async (filterDate) => {
		const response = await findDatesByDateAndSucursal(filterDate.getDate(), (filterDate.getMonth() + 1), filterDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				const fecha = new Date(item.fecha_hora);
				item.hora = `${addZero(fecha.getHours() + 5)}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
				item.show_tratamientos = item.tratamientos.map(tratamiento => {
					return `${tratamiento.nombre}, `;
				});
			});
			setCitas(response.data);
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
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal;
		data.numero_sesion = 1;
		data.status = pendienteStatusId;
		// data.tiempo = getTimeToTratamiento(data.tratamientos);
		const response = await createDate(data);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setOpenAlert(true);
			setMessage('La Cita se agendo correctamente');
			setValues({
				servicio: '',
				tratamientos: [],
				medico: '',
				promovendedor: '',
				cosmetologa: '',
				paciente: `${paciente._id}`,
				precio: '',
				tipo_cita: {},
			});
			setDisableDate(true);
			setPacienteAgendado({});
			loadCitas(new Date());
		}

		setIsLoading(false);
	};

	const handleChangePrecio = (e) => {
		setValues({ ...values, precio: e.target.value });
	}

	const handleChangeTiempo = (e) => {
		setValues({ ...values, tiempo: e.target.value });
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
		console.log('rowData', rowData);
		await loadHorariosByServicio(new Date(rowData.fecha_hora), rowData.servicio._id);
		setOpenModal(true);
		setIsLoading(false);
	}

	const actions = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_hora  ? 
		{
			icon: EditIcon,
			tooltip: 'Editar cita',
			onClick: handleOnClickEditarCita
		} //: ''
	];

	return (
		<Fragment>
			{
				!isLoading ?
					<Formik
						enableReinitialize
						initialValues={values}
						validationSchema={validationSchema} >
						{
							props => <AgendarContainer
								servicios={servicios}
								tratamientos={tratamientos}
								horarios={horarios}
								onChangeServicio={(e) => handleChangeServicio(e)}
								onChangeTratamientos={(e) => handleChangeTratamientos(e)}
								onChangeFecha={(e) => handleChangeFecha(e)}
								onChangeFilterDate={(e) => handleChangeFilterDate(e)}
								onChangeHora={(e) => handleChangeHora(e)}
								onChangeObservaciones={(e) => handleChangeObservaciones(e)}
								filterDate={filterDate.fecha_hora}
								paciente={paciente}
								disableDate={disableDate}
								promovendedores={promovendedores}
								cosmetologas={cosmetologas}
								onClickAgendar={handleClickAgendar}
								onChangePrecio={(e) => handleChangePrecio(e)}
								onChangeTiempo={(e) => handleChangeTiempo(e)}
								titulo={`CITAS (${filterDate.fecha})`}
								columns={columns}
								options={options}
								citas={citas}
								actions={actions}
								cita={cita}
								openModal={openModal}
								empleado={empleado}
								onClickCancel={handleCloseModal}
								loadCitas={loadCitas}
								medicos={medicos}
								tipoCitas={tipoCitas}
								onChangeTipoCita={(e) => handleChangeTipoCita(e)}
								onChangeDoctors={(e) => handleChangeDoctors(e)}
								onChangePromovendedor={(e) => handleChangePromovendedor(e)}
								onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
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

export default Agendar;