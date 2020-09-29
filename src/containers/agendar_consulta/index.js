import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { AgendarConsultaContainer } from "./agendar_consulta";
import {
	findScheduleInConsultByDateAndSucursal,
	findConsultsByDateAndSucursal,
	createConsult,
	findEmployeesByRolId,
	showAllTipoCitas,
	showAllFrecuencias,
	findCirugiaByConsultaId,
	createConsecutivo,
} from "../../services";
import { Backdrop, CircularProgress, Snackbar, TablePagination } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import EditIcon from '@material-ui/icons/Edit';
import { toFormatterCurrency, addZero, generateFolioCita } from "../../utils/utils";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import PrintIcon from '@material-ui/icons/Print';
import LocalHospitalIcon from '@material-ui/icons/LocalHospital';

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
	} = props;

	const date = new Date();

	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [horarios, setHorarios] = useState([]);
	const [medicos, setMedicos] = useState([]);
	const [frecuencias, setFrecuencias] = useState([]);
	const [tipoCitas, setTipoCitas] = useState([]);
	const [promovendedores, setPromovendedores] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [disableDate, setDisableDate] = useState(true);
	const [isHoliDay, setIsHoliDay] = useState(false);
	const [values, setValues] = useState({
		hora: '',
		paciente: `${paciente._id}`,
		precio: isHoliDay ? sucursal.precio_festivo : // Dia Festivo
			date.getDay() === 6 ? (date.getHours() >= 13 ? sucursal.precio_sabado_vespertino : sucursal.precio_sabado_matutino) // SABADO
				: (date.getHours() >= 14 ? sucursal.precio_vespertino : sucursal.precio_matutino), // L-V
	});

	const [citas, setConsultas] = useState([]);
	const [openModal, setOpenModal] = useState(false);
	const [openModalPagos, setOpenModalPagos] = useState(false);
	const [openModalCirugias, setOpenModalCirugias] = useState(false);
	const [consulta, setConsulta] = useState();
	const [openModalImprimirConsultas, setOpenModalImprimirConsultas] = useState(false);
	const [datosImpresion, setDatosImpresion] = useState();
	const [cirugia, setCirugia] = useState(
		{
			materiales: []
		});

	const dia = addZero(date.getDate());
	const mes = addZero(date.getMonth() + 1);
	const anio = date.getFullYear();

	const [filterDate, setFilterDate] = useState({
		fecha_show: date,
		fecha: `${dia}/${mes}/${anio}`,
	});

	const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
	const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
	const consultaServicioId = process.env.REACT_APP_CONSULTA_SERVICIO_ID;
	const sucursalManuelAcunaId = process.env.REACT_APP_SUCURSAL_MANUEL_ACUNA_ID;
	const tipoCitaSinCitaId = process.env.REACT_APP_TIPO_CITA_SIN_CITA;
	const medicoDirectoId = process.env.REACT_APP_MEDICO_DIRECTO_ID;
	const promovendedorSinAsignarId = process.env.REACT_APP_PROMOVENDEDOR_SIN_ASIGNAR_ID;
	const frecuenciaPrimeraVezId = process.env.REACT_APP_FRECUENCIA_PRIMERA_VEZ_ID;
	const fercuenciaReconsultaId = process.env.REACT_APP_FRECUENCIA_RECONSULTA_ID;
	const tipoCitaRevisionId = process.env.REACT_APP_TIPO_CITA_REVISION_ID;
	const tipoCitaDerivadaId = process.env.REACT_APP_TIPO_CITA_DERIVADA_ID;

	const columns = [
		{ title: 'Folio', field: 'consecutivo' },
		{ title: 'Hora', field: 'hora' },
		{ title: 'Paciente', field: 'paciente_nombre' },
		{ title: 'Telefono', field: 'paciente.telefono' },
		{ title: 'Hora llegada', field: 'hora_llegada' },
		{ title: 'Hora atendido', field: 'hora_atencion' },
		{ title: 'Hora salida', field: 'hora_salida' },
		{ title: 'Quien agenda', field: 'quien_agenda.nombre' },
		{ title: 'Frecuencia', field: 'frecuencia.nombre' },
		{ title: 'Tipo Consulta', field: 'tipo_cita.nombre' },
		sucursal._id === sucursalManuelAcunaId ? { title: 'Quien confirma llamada', field: 'quien_confirma_llamada.nombre' } : {},
		{ title: 'Quien confirma asistencia', field: 'quien_confirma_asistencia.nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
		{ title: 'Promovendedor', field: 'promovendedor_nombre' },
		{ title: 'Estado', field: 'status.nombre' },
		{ title: 'Precio', field: 'precio_moneda' },
		{ title: 'Observaciones', field: 'observaciones' },
	];

	const components = {
		Pagination: props => {
			return <TablePagination
				{...props}
				rowsPerPageOptions={[5, 10, 20, 30, citas.length]}
			/>
		}
	}

	const dataComplete = !paciente.nombres || !values.precio
		|| !values.medico || !values.promovendedor || (sucursal._id === sucursalManuelAcunaId ? !values.fecha_hora : false);

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
		}
	}

	useEffect(() => {

		const loadConsultas = async () => {
			const response = await findConsultsByDateAndSucursal(date.getDate(), (date.getMonth() + 1), date.getFullYear(), sucursal._id);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					const fecha = new Date(item.fecha_hora);
					item.folio = generateFolioCita(item);
					item.hora = `${addZero(fecha.getHours() + 5)}:${addZero(fecha.getMinutes())}`;
					item.precio_moneda = toFormatterCurrency(item.precio);
					item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
					item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
				});
				setConsultas(response.data);
			}
			setIsLoading(false);
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

		const loadTipoCitas = async () => {
			const response = await showAllTipoCitas();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setTipoCitas(response.data);
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
		loadMedicos();
		loadPromovendedores();
		loadTipoCitas();
		loadFrecuencias();
	}, [sucursal, medicoRolId, promovendedorRolId]);

	const loadHorarios = async (date) => {
		const dia = date ? date.getDate() : values.fecha_show.getDate();
		const mes = Number(date ? date.getMonth() : values.fecha_show.getMonth()) + 1;
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
		date.setHours(Number(hora[0]) - 5); // -5 por zona horaria
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
		const response = await findConsultsByDateAndSucursal(filterDate.getDate(), (filterDate.getMonth() + 1), filterDate.getFullYear(), sucursal._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				const fecha = new Date(item.fecha_hora);
				item.folio = generateFolioCita(item);
				item.hora = `${addZero(fecha.getHours() + 5)}:${addZero(fecha.getMinutes())}`;
				item.precio_moneda = toFormatterCurrency(item.precio);
				item.paciente_nombre = `${item.paciente.nombres} ${item.paciente.apellidos}`;
				item.promovendedor_nombre = item.promovendedor ? item.promovendedor.nombre : 'SIN ASIGNAR';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
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

	const handleClickAgendar = async (data) => {
		setIsLoading(true);
		data.quien_agenda = empleado._id;
		data.sucursal = sucursal._id;
		data.status = pendienteStatusId;
		data.hora_llegada = '--:--';
		data.hora_atencion = '--:--';
		data.hora_salida = '--:--';
		data.servicio = consultaServicioId;
		// data.tiempo = getTimeToTratamiento(data.tratamientos);

		if (sucursal._id !== sucursalManuelAcunaId) {
			const dateNow = new Date();
			data.hora_llegada = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
			dateNow.setHours(dateNow.getHours() - 5);
			dateNow.setMinutes(0);
			dateNow.setSeconds(0);
			data.fecha_hora = dateNow;
			data.tipo_cita = data.frecuencia === frecuenciaPrimeraVezId ? tipoCitaRevisionId : tipoCitaDerivadaId;
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

	const handleChangeMedicos = (e) => {
		setValues({ ...values, medico: e.target.value });
	}

	const handleChangeObservaciones = e => {
		setValues({ ...values, observaciones: e.target.value.toUpperCase() });
	}

	const handleChangePromovendedor = (e) => {
		setValues({ ...values, promovendedor: e.target.value });
	}

	const handleChangeFrecuencia = (e) => {
		const frecuencia = e.target.value._id;
		const medico = medicos.filter( item => {
			return item._id === medicoDirectoId;
		});
		const promovendedor = promovendedores.filter( item => {
			return item._id === promovendedorSinAsignarId;
		});
		setValues({
			...values,
			frecuencia: frecuencia,
			medico: frecuencia === frecuenciaPrimeraVezId ? medico[0] : {},
			promovendedor: frecuencia === fercuenciaReconsultaId ? promovendedor[0] : {},
		});
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
		await loadHorarios(new Date(rowData.fecha_hora));
		setOpenModal(true);
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

	const handleCloseVerPagos = () => {
		setOpenModalPagos(false);
	}

	const handleCloseCirugia = () => {
		setCirugia({
			materiales: [],
		});
		setOpenModalCirugias(false);
	}

	const handleCloseImprimirConsulta = () => {
		setOpenModalImprimirConsultas(false);
	}

	const handlePrint = async (event, rowData) => {
		setDatosImpresion(rowData);
		setOpenModalImprimirConsultas(true);
	}

	const actions = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: PrintIcon,
			tooltip: 'Imprimir',
			onClick: handlePrint
		},
		{
			icon: EditIcon,
			tooltip: 'Editar consulta',
			onClick: handleOnClickEditarConsulta
		}, //: ''
		rowData => (
			rowData.pagado ? {
				icon: AttachMoneyIcon,
				tooltip: 'Ver pago',
				onClick: handleClickVerPagos,
			} : ''
		),
		rowData => (
			rowData.pagado ? {
				icon: LocalHospitalIcon,
				tooltip: 'Pasar a Cirugias',
				onClick: handleClickCirugia
			} : ''
		),
	];

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
						titulo={`CONSULTAS (${filterDate.fecha})`}
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
						onChangeTipoCita={(e) => handleChangeTipoCita(e)}
						medicos={medicos}
						promovendedores={promovendedores}
						onChangeMedicos={(e) => handleChangeMedicos(e)}
						onChangePromovendedor={(e) => handleChangePromovendedor(e)}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage}
						setFilterDate={setFilterDate}
						OnCloseVerPagos={handleCloseVerPagos}
						openModalPagos={openModalPagos}
						openModalCirugias={openModalCirugias}
						openModalImprimirConsultas={openModalImprimirConsultas}
						datosImpresion={datosImpresion}
						onCloseImprimirConsulta={handleCloseImprimirConsulta}
						frecuencias={frecuencias}
						onChangeFrecuencia={(e) => handleChangeFrecuencia(e)}
						dataComplete={dataComplete}
						onCloseCirugia={handleCloseCirugia}
						cirugia={cirugia}
						tipoServicioId={consultaServicioId}
						frecuenciaPrimeraVezId={frecuenciaPrimeraVezId}
						fercuenciaReconsultaId={fercuenciaReconsultaId} /> :
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