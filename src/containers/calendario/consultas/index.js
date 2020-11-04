import React, { useEffect, useState, Fragment } from "react";
import { ConsultasContainer } from "./consultas";
import { showAllConsultsBySucursalAsistio } from "../../../services/consultas";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const Consultas = (props) => {

	const classes = useStyles();

	const [isLoading, setIsLoading] = useState(true);
	const [events, setEvents] = useState([]);

	const { sucursal } = props;

	const parseToEvents = (consultas) => {
		return consultas.map(consulta => {
			const startDate = new Date(consulta.fecha_hora);
			const endDate = new Date(consulta.fecha_hora);
			// const minutos = Number(endDate.getMinutes()) + Number(consulta.tiempo);
			// endDate.setMinutes(minutos);
			const medico = consulta.medico.nombre;
			return {
				id: consulta._id,
				title: medico,
				start: startDate,
				end: endDate,
				medico: consulta.medico
			}
		});
	}

	useEffect(() => {
		const loadConsultas = async () => {
			const response = await showAllConsultsBySucursalAsistio(sucursal);

			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setEvents(parseToEvents(response.data));
			}
		}
		setIsLoading(true);
		loadConsultas();
		setIsLoading(false);
	}, [sucursal]);

	return (
		<Fragment>
			{
				isLoading
					? <Backdrop className={classes.backdrop} open={isLoading} >
						<CircularProgress color="inherit" />
					</Backdrop>
					: <ConsultasContainer
						events={events} />
			}
		</Fragment>
	);
}

export default Consultas;