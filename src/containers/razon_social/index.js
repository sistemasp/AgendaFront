import React, { useState, useEffect, Fragment } from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Backdrop, CircularProgress } from '@material-ui/core';
import { RazonSocialContainer } from './razon_social';
import { showAllRazonSocials, updatePatient, createPatient, findPatientByPhoneNumber, sepomexGetEstados } from '../../services';
import EditIcon from '@material-ui/icons/Edit';
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

const RazonSocial = (props) => {

	const classes = useStyles();

	const [open, setOpen] = useState(false);
	const [openHistoric, setOpenHistoric] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [razonSociales, setRazonSociales] = useState([]);
	const [razonSocial, setRazonSocial] = useState({});
	const [isLoading, setIsLoading] = useState(true);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		onClickAgendar,
		onClickAgendarTratamiento,
		onClickAgendarConsulta
	} = props;

	const columns = [
		{ title: 'Nombre completo', field: 'nombre_completo' },
		{ title: 'RFC', field: 'rfc' },
		{ title: 'Email', field: 'email' },
		{ title: 'domicilio', field: 'domicilio_completo' },
		{ title: 'Codigo postal', field: 'codigo_postal' },
		{ title: 'Colonia', field: 'colonia' },
		{ title: 'Ciudad', field: 'ciudad' },
		{ title: 'Municipio', field: 'municipio' },
		{ title: 'Estado', field: 'estado' },
		{ title: 'Telefono', field: 'telefono' },
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
		setRazonSocial({});
		setOpen(false);
		setOpenHistoric(false);
	};

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	const loadRazonSocial = async () => {
		const response = await showAllRazonSocials();
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
			await response.data.forEach(item => {
				item.domicilio_completo = `${item.domicilio} #${item.numero}`;
			});
			setRazonSociales(response.data);
		}
		setIsLoading(false);
	}

	const handleOnClickGuardar = async (e, val) => {
		setIsLoading(true);
		/*const existPatient = razonSocial._id ? '' : await findPatientByPhoneNumber(val.telefono);
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

		const response = razonSocial._id ? await updatePatient(razonSocial._id, val) : await createPatient(val);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
			|| `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setSeverity('success');
			loadPacientes();
			setMessage(razonSocial._id ? 'Paciente actualizado correctamente' : 'Paciente creado correctamente');
		}

		handleClose();*/
		setIsLoading(false);
	}

	const handleOnClickGuardarAgendar = async (e, val) => {
		setIsLoading(true);
		const existPatient = razonSocial._id ? '' : await findPatientByPhoneNumber(val.telefono);
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

		const response = razonSocial._id ? await updatePatient(razonSocial._id, val) : await createPatient(val);
		if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
			|| `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setSeverity('success');
			loadRazonSocial();
			onClickAgendar(e, val);
			setMessage(razonSocial._id ? 'Paciente actualizado correctamente' : 'Paciente creado correctamente');
		}

		handleClose();
		setIsLoading(false);
	}

	const handleOnClickEditar = (event, rowData) => {
		setRazonSocial(rowData);
		setOpen(true);
	}

	const handleClickHistorico = (event, rowData) => {
		setRazonSocial(rowData);
		setOpenHistoric(true);
	}

	const actions = [
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
		const loadRazonSocial = async () => {
			const response = await showAllRazonSocials();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				await response.data.forEach(item => {
					item.domicilio_completo = `${item.domicilio} #${item.numero}`;
				});
				setRazonSociales(response.data);
			}
			setIsLoading(false);
		}
		loadRazonSocial();
	}, []);

	return (
		<Fragment>
			{
				!isLoading ?
					<RazonSocialContainer
						razonSociales={razonSociales}
						columns={columns}
						titulo='Razon social'
						actions={actions}
						options={options}
						open={open}
						openHistoric={openHistoric}
						razonSocial={razonSocial}
						telefono={razonSocial.telefono}
						onClickGuardar={handleOnClickGuardar}
						onClickGuardarAgendar={handleOnClickGuardarAgendar}
						handleOpen={handleOpen}
						handleClose={handleClose}
						loadRazonSocial={loadRazonSocial} /> :
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

export default RazonSocial;