import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { ListaEsperaContainer } from './lista_espera';
import { findSurgeryBySucursalId, createSurgery, waitingList, updateSurgery, updateConsult, breakFreeSurgeryById } from '../../services';
import InputIcon from '@material-ui/icons/Input';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import Edit from '@material-ui/icons/Edit';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import { addZero } from "../../utils/utils";

function Alert(props) {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	root: {
		width: '100%',
		'& > * + *': {
			marginTop: theme.spacing(2),
		},
	},
	paper: {
		position: 'absolute',
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: '2px solid #000',
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	}
}));

const ListaEspera = (props) => {

	const classes = useStyles();

	const [openAlert, setOpenAlert] = useState(false);
	const [consultorios, setConsultorios] = useState([]);
	const [listaEspera, setListaEspera] = useState([]);
	const [consultorio, setConsultorio] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');
	const [openModalAsignar, setOpenModalAsignar] = useState(false);
	const [consulta, setConsulta] = useState('');

	const {
		sucursal,
	} = props;

	const columnsConsultorios = [
		{ title: 'Consultorio', field: 'nombre' },
		{ title: 'Nombre', field: 'paciente_nombre' },
		{ title: 'Medico', field: 'medico_nombre' },
	];

	const columnsEspera = [
		{ title: 'Nombre', field: 'paciente_nombre' },
		{ title: 'Hora llegada', field: 'hora_llegada' },
		{ title: 'Medico', field: 'medico_nombre' },
	];

	const optionsConsultorio = {
		rowStyle: rowData => {
			return {
				backgroundColor: rowData.disponible ? process.env.REACT_APP_LIBRE_COLOR : process.env.REACT_APP_OCUPADO_COLOR
			};
		},
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';'
	}

	const optionsEspera = {
		headerStyle: {
			backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';'
	}

	const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
	const atendidoStatusId = process.env.REACT_APP_ATENDIDO_STATUS_ID;

	const loadConsultorios = async () => {
		const response = await findSurgeryBySucursalId(sucursal);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
				item.medico_nombre = item.medico ? item.medico.nombre : 'SIN MEDICO';
			});
			setConsultorios(response.data);
		}
	}

	const loadListaEspera = async () => {
		const response = await waitingList(sucursal, asistioStatusId);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			response.data.forEach(item => {
				item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
				item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
			});
			setListaEspera(response.data);
		}
	}

	const handleOnClickAsignarPaciente = (event, rowData) => {
		setConsulta(rowData);
		setOpenModalAsignar(true);
	}

	const handleOnClickLiberar = async (event, rowData) => {
		const dateNow = new Date();
		let updateConsulta = rowData.consulta;
		updateConsulta.status = atendidoStatusId;
		updateConsulta.hora_salida = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
		await updateConsult(rowData.consulta._id, updateConsulta);
		rowData.disponible = true;
		await updateSurgery(rowData._id, rowData);
		const response = await breakFreeSurgeryById(rowData._id);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setOpenAlert(true);
			setMessage('Salio el paciente');
			await loadConsultorios();
			await loadListaEspera();
		}
	}

	const actionsEspera = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: InputIcon,
			tooltip: 'Asiganar a consultorio',
			onClick: handleOnClickAsignarPaciente
		} //: ''
	];

	const actionsConsultorio = [
		//new Date(anio, mes - 1, dia) < filterDate.fecha_show  ? 
		{
			icon: DirectionsWalkIcon,
			tooltip: 'Salida paciente',
			onClick: handleOnClickLiberar
		} //: ''
	];

	const handleClose = () => {
		setConsultorio({});
		setOpenModalAsignar(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const handleClickGuardar = async (event, data) => {
		setIsLoading(true);
		data.sucursal = sucursal;
		const response = await createSurgery(data);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setOpenAlert(true);
			setMessage('El consultorio se guardo correctamente');
			loadConsultorios();
		}
		setIsLoading(false);
	}

	useEffect(() => {
		const loadConsultorios = async () => {
			const response = await findSurgeryBySucursalId(sucursal);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'LIBRE';
					item.medico_nombre = item.medico ? item.medico.nombre : 'SIN MEDICO';
				});
				setConsultorios(response.data);
			}
		}

		const loadListaEspera = async () => {
			const response = await waitingList(sucursal, asistioStatusId);
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				response.data.forEach(item => {
					item.paciente_nombre = item.paciente ? `${item.paciente.nombres} ${item.paciente.apellidos}` : 'ALGUN ERROR ESTA PASANDO';
					item.medico_nombre = item.medico ? item.medico.nombre : 'DIRECTO';
				});
				setListaEspera(response.data);
			}
		}

		loadConsultorios();
		loadListaEspera();
		setIsLoading(false);
	}, [sucursal, asistioStatusId]);

	return (
		<Fragment>
			{
				!isLoading ?
					<ListaEsperaContainer
						columnsConsultorios={columnsConsultorios}
						columnsEspera={columnsEspera}
						tituloConsultorios='Consultorios'
						tituloEspera='En espera'
						optionsEspera={optionsEspera}
						optionsConsultorio={optionsConsultorio}
						consultorio={consultorio}
						consultorios={consultorios}
						listaEspera={listaEspera}
						actionsEspera={actionsEspera}
						actionsConsultorio={actionsConsultorio}
						openModalAsignar={openModalAsignar}
						consulta={consulta}
						handleClose={handleClose}
						handleClickGuardar={handleClickGuardar}
						loadListaEspera={loadListaEspera}
						loadConsultorios={loadConsultorios}
						sucursal={sucursal}
						setOpenAlert={setOpenAlert}
						setMessage={setMessage} /> :
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

export default ListaEspera;