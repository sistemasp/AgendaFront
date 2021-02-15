import React, { useState, Fragment, useEffect } from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { MainDermatologosContainer } from "./main";

const Alert = (props) => {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuMainDermatologos = (props) => {

	const [pacienteAgendado, setPacienteAgendado] = useState({});
	const [value, setValue] = useState(0);
	const [openModalPassword, setOpenModalPassword] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		dermatologo,
		sucursal,
	} = props.location.state;

	const { permisos } = dermatologo.rol;

	const {
		history,
	} = props;

	const handleChangeTab = (event, newValue, close) => {
		setValue(newValue);
		close();
	};

	const handleAgendar = (event, rowData) => {
		setPacienteAgendado(rowData);
		setValue(Number(process.env.REACT_APP_PAGE_AGENDAR_CONSULTA));
	}

	const handleLogout = () => {
		history.push('/', { dermatologo: {}, sucursal: {} });
	}

	const handleClickCambioPassword = () => {
		setOpenModalPassword(true);
	}

	const handleOpen = () => {
		setOpenModalPassword(true);
	}

	const handleClose = () => {
		setOpenModalPassword(false);
	}

	const handleCloseAlert = () => {
		setOpenAlert(false);
	};

	return (
		<Fragment>
			<MainDermatologosContainer
				dermatologo={dermatologo}
				sucursal={sucursal}
				value={value}
				onChangeTab={handleChangeTab}
				onClickLogout={handleLogout} />
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default MenuMainDermatologos;