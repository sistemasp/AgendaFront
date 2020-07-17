import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { PacientesContainer } from './pacientes';
import { getAllPatients, updatePatient, createPatient, findPatientByPhoneNumber } from '../../services';
import EditIcon from '@material-ui/icons/Edit';
import EventAvailableIcon from '@material-ui/icons/EventAvailable';
import TodayIcon from '@material-ui/icons/Today';
import HistoryIcon from '@material-ui/icons/History';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

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

const Pacientes = (props) => {

	const classes = useStyles();

	const [open, setOpen] = useState(false);
	const [openHistoric, setOpenHistoric] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [pacientes, setPacientes] = useState([]);
	const [paciente, setPaciente] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		onClickAgendar,
		onClickAgendarTratamiento,
		onClickAgendarConsulta
	} = props;

	const columns = [
		{ title: 'Nombres', field: 'nombres' },
		{ title: 'Apellidos', field: 'apellidos' },
		{ title: 'Telefono', field: 'telefono' },
		{ title: 'Fecha de nacimiento', field: 'fecha_nacimiento' },
		{ title: 'Direccion', field: 'direccion' },
	];

	const options = {
		headerStyle: {
			backgroundColor: '#2BA6C6',
			color: '#FFF',
			fontWeight: 'bolder',
			fontSize: '18px'
		},
		exportAllData: true,
		exportButton: false,
		exportDelimiter: ';'
	}

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setPaciente({});
		setOpen(false);
		setOpenHistoric(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const loadPacientes = async () => {
		const response = await getAllPatients();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			setPacientes(response.data);
		}
		setIsLoading(false);
	}

	const handleOnClickGuardar = async (e, val) => {
		console.log('VALUE', val);
		setIsLoading(true);
		const existPatient = paciente._id ? '' : await findPatientByPhoneNumber(val.telefono);
		setOpenAlert(true);

		if (`${existPatient.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			if (existPatient.data.length > 0) {
				setSeverity('warning');
				setMessage('YA EXISTE UN REGISTRO CON EL MISMO NUMERO DE TELEFONO');
				setIsLoading(false);
				handleClose();
				return;
			}
		}

		const response = paciente._id ? await updatePatient(paciente._id, val) : await createPatient(val);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
			|| `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setSeverity('success');
			loadPacientes();
			setMessage(paciente._id ? 'Paciente actualizado correctamente' : 'Paciente creado correctamente');
		}

		handleClose();
		setIsLoading(false);
	}

	const handleOnClickGuardarAgendar = async (e, val) => {
		setIsLoading(true);
		const existPatient = paciente._id ? '' : await findPatientByPhoneNumber(val.telefono);
		setOpenAlert(true);

		if (`${existPatient.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			if (existPatient.data.length > 0) {
				setSeverity('warning');
				setMessage('YA EXISTE UN REGISTRO CON EL MISMO NUMERO DE TELEFONO');
				setIsLoading(false);
				handleClose();
				return;
			}
		}

		const response = paciente._id ? await updatePatient(paciente._id, val) : await createPatient(val);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
			|| `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setSeverity('success');
			loadPacientes();
			onClickAgendar(e, val);
			setMessage(paciente._id ? 'Paciente actualizado correctamente' : 'Paciente creado correctamente');
		}

		handleClose();
		setIsLoading(false);
	}

	const handleOnClickEditar = (event, rowData) => {
		setPaciente(rowData);
		setOpen(true);
	}

	const handleClickHistorico = (event, rowData) => {
		setPaciente(rowData);
		setOpenHistoric(true);
	}

	const actions = [
		{
			icon: TodayIcon,
			tooltip: 'Agendar consulta',
			onClick: onClickAgendarConsulta
		},
		{
			icon: EventAvailableIcon,
			tooltip: 'Agendar tratamiento',
			onClick: onClickAgendarTratamiento
		},
		{
			icon: EditIcon,
			tooltip: 'Actualizar registro',
			onClick: handleOnClickEditar
		},
		{
			icon: HistoryIcon,
			tooltip: 'Ver Historico',
			onClick: handleClickHistorico
		}
	];

	useEffect(() => {
		const loadPacientes = async () => {
			const response = await getAllPatients();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setPacientes(response.data);
			}
			setIsLoading(false);
		}
		loadPacientes();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<PacientesContainer
						pacientes={pacientes}
						columns={columns}
						titulo='Pacientes'
						actions={actions}
						options={options}
						open={open}
						openHistoric={openHistoric}
						paciente={paciente}
						telefono={paciente.telefono}
						onClickGuardar={handleOnClickGuardar}
						onClickGuardarAgendar={handleOnClickGuardarAgendar}
						handleOpen={handleOpen}
						handleClose={handleClose} /> :
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

export default Pacientes;