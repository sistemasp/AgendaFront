import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AgendarConsultaContainer } from "./agendar_consulta";
import { findScheduleInConsultByDateAndSucursal, findConsultsByDateAndSucursal, createConsult, findEmployeesByRolId } from "../../services";
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

const AgendarConsulta = (props) => {

	const classes = useStyles();

	const {
		paciente,
		empleado,
		setPacienteAgendado,
		sucursal,
	} = props;

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [horarios, setHorarios] = useState([]);
	const [medicos, setMedicos] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
	const [values, setValues] = useState({
		fecha_show: '',
		fecha: '',
		hora: '',
		paciente: `${paciente._id}`,
		precio: '',
	});
	const [citas, setConsultas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [cita, setConsulta] = useState();

	const date = new Date();
	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [filterDate, setFilterDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const columns = [
		{ title: 'Hora', field: 'hora' },
		{ title: 'Paciente', field: 'paciente_nombre' },
		{ title: 'Telefono', field: 'paciente.telefono' },
		{ title: 'Hora atendido', field: 'hora' },
		{ title: 'Hora salida', field: 'hora' },
		{ title: 'Quien agenda', field: 'quien_agenda.nombre' },
		{ title: 'Tipo Consulta', field: 'tipo_cita' },
		{ title: 'Quien confirma', field: 'quien_confirma.nombre' },
		{ title: 'Promovendedor', field: 'promovendedor_nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
		{ title: 'Estado', field: 'asistio' },
		{ title: 'Precio', field: 'precio_moneda' },
		{ title: 'Observaciones', field: 'observaciones' },
	];

	const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
	const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;

	const options = {
		rowStyle: rowData => {
			const { asistio } = rowData;
			if (asistio === 'NO ASISTIO') {
				return { color: '#B7B4A1' };
			} else if (asistio === 'CANCELO') {
				return { color: '#FF0000', fontWeight: 'bold' };
			} else if (asistio === 'REAGENDO') {
				return { color: '#FBD014' };
			}
		},
		headerStyle: {
			backgroundColor: '#2BA6C6',
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		}
	}

	useEffect(() => {

		const loadConsultas = async () => {
			const response = await findConsultsByDateAndSucursal(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal);

			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					item.precio_moneda = toFormatterCurrency(item.precio);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
					item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
					item.show_tratamientos = item.tratamientos.map(tratamiento => {
						return `${tratamiento.nombre}, `;
					});
				});
				setConsultas(response.data);
			}
		}

		const loadMedicos = async () => {
			const response = await findEmployeesByRolId(medicoRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setMedicos(response.data);
			}
		}

		const loadPromovendedores = async () => {
			const response = await findEmployeesByRolId(promovendedorRolId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setPromovendedores(response.data);
			}
		}

		setIsLoading(true);
		loadConsultas();
		loadMedicos();
		loadPromovendedores();
		setIsLoading(false);
	}, [sucursal, medicoRolId, promovendedorRolId]);

	const loadHorarios = async (date) => {
		const dia = date ? date.getDate() : values.fecha_show.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
		const anio = date ? date.getFullYear() : values.fecha_show.getFullYear();
		const response = await findScheduleInConsultByDateAndSucursal(consultaServicioId, dia, mes, anio, sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setHorarios(response.data);
		}
	}

	const handleChangeFecha = async (date) => {
		setIsLoading(true);
		const fecha = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
		await setValues({
			...values,
			fecha_show: date,
			fecha: fecha
		});
		await loadHorarios(date);
		setIsLoading(false);
	};

	const handleChangeHora = e => {
		setIsLoading(true);
		setValues({ ...values, hora: e.target.value });
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
		const response = await findConsultsByDateAndSucursal(filterDate.getDate(), (filterDate.getMonth() + 1), filterDate.getFullYear(), sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.cosmetologa_nombre = item.cosmetologa ? item.cosmetologa.nombre : 'SIN ASIGNAR';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
				item.show_tratamientos = item.tratamientos.map(tratamiento => {
					return `${tratamiento.nombre}, `;
				});
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

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		data.tipo_cita = 'CITADO';
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal;
		data.estado = 'PENDIENTE';
		console.log("DATA", data);
		// data.tiempo = getTimeToTratamiento(data.tratamientos);
		/*const response = await createConsult(data);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setOpenAlert(true);
			setMessage('La Consulta se agendo correctamente');
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
			});
			setDisableDate(true);
			setPacienteAgendado({});
			loadConsultas(new Date());
		}*/

		setIsLoading(false);
	};

	const handleChangePrecio = (e) => {
		setValues({ ...values, precio: e.target.value });
	}

	const handleChangeTiempo = (e) => {
		setValues({ ...values, tiempo: e.target.value });
	}

	const handleChangeMedicos = (e) => {
		setValues({ ...values, medico: e.target.value });
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleCloseModal = () => {
		setOpenModal(false);
	};

	const handleOnClickEditarConsulta = async (event, rowData) => {
		setIsLoading(true);
		setConsulta(rowData);
		// await loadTratamientos(rowData.servicio);
		const splitDate = (rowData.fecha).split('/');
		await loadHorarios(new Date(splitDate[2], (splitDate[1] - 1), splitDate[0]));
		setOpenModal(true);
		setIsLoading(false);
	}

	const actions = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: EditIcon,
			tooltip: 'Editar cita',
			onClick: handleOnClickEditarConsulta
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
							props => <AgendarConsultaContainer
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
								titulo={`CONSULTAS (${filterDate.fecha})`}
								columns={columns}
								options={options}
								citas={citas}
								actions={actions}
								cita={cita}
								openModal={openModal}
								empleado={empleado}
								onClickCancel={handleCloseModal}
								loadConsultas={loadConsultas}
								medicos={medicos}
								promovendedores={promovendedores}
								onChangeMedicos={(e) => handleChangeMedicos(e)}
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

export default AgendarConsulta;