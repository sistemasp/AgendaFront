import React, { useState, Fragment, useEffect } from "react";
import { MainContainer } from "./main";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert';
import { MainCosmetologasContainer } from "./main_cosmetologas";

const Alert = (props) => {
	return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MenuMain = (props) => {

	const [pacienteAgendado, setPacienteAgendado] = useState({});
	const [value, setValue] = useState(0);
	const [openModalPassword, setOpenModalPassword] = useState(false);
	const [openAlert, setOpenAlert] = useState(false);
	const [message, setMessage] = useState('');
	const [severity, setSeverity] = useState('success');

	const {
		empleado,
		sucursal,
	} = props.location.state;

	const { permisos } = empleado.rol;

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
		history.push('/', { empleado: {}, sucursal: {} });
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

	let fragment;

	if (empleado.rol.nombre === "GERENTE" || empleado.rol.nombre === "DIOS SUPREMO" || empleado.rol.nombre === "RECEPCIONISTA" || empleado.rol.nombre === "ENCARGADO SUCURSAL") {
		fragment = <Fragment>
			<MainContainer
				pacienteAgendado={pacienteAgendado}
				setPacienteAgendado={setPacienteAgendado}
				onChangeTab={handleChangeTab}
				onClickAgendar={handleAgendar}
				empleado={empleado}
				sucursal={sucursal}
				openModalPassword={openModalPassword}
				onClickLogout={handleLogout}
				onClickCambioPassword={handleClickCambioPassword}
				onOpen={handleOpen}
				onClose={handleClose}
				value={value}
				setMessage={setMessage}
				setSeverity={setSeverity}
				setOpenAlert={setOpenAlert}
				history={history} />
		</Fragment>
	} else if (empleado.rol.nombre === "ENCARGADO COSMETOLOGAS" || empleado.rol.nombre === "COSMETOLOGA") {
		fragment = <Fragment>
			<MainCosmetologasContainer
				pacienteAgendado={pacienteAgendado}
				setPacienteAgendado={setPacienteAgendado}
				onChangeTab={handleChangeTab}
				onClickAgendar={handleAgendar}
				empleado={empleado}
				sucursal={sucursal}
				openModalPassword={openModalPassword}
				onClickLogout={handleLogout}
				onClickCambioPassword={handleClickCambioPassword}
				onOpen={handleOpen}
				onClose={handleClose}
				value={value}
				setMessage={setMessage}
				setSeverity={setSeverity}
				setOpenAlert={setOpenAlert} />
		</Fragment>
	} else if (empleado.rol.nombre === "MEDICO") {
		fragment = <Fragment>
			<h1>TRABAJANDO EN MEDICOS</h1>
		</Fragment>
	} else if (empleado.rol.nombre === "PROMOCION") {
		fragment = <Fragment>
			<h1>TRABAJANDO EN PROMOCION</h1>
		</Fragment>
	} else {
		fragment = <Fragment>
			<h1>NO SE ENCONTRO ROL</h1>
		</Fragment>
	}

	return (
		<Fragment>
			{fragment}
			<Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
				<Alert onClose={handleCloseAlert} severity={severity}>
					{message}
				</Alert>
			</Snackbar>
		</Fragment>
	);
}

export default MenuMain;