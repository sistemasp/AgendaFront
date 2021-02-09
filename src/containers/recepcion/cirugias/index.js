import React, { useEffect, useState, Fragment } from "react";
import { showAllConsultsBySucursalAsistio } from "../../../services";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import { CirugiasContainer } from "./cirugias";

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const Cirugias = (props) => {

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
			const dermatologo = consulta.dermatologo.nombre;
			return {
				id: consulta._id,
				title: dermatologo,
				start: startDate,
				end: endDate,
				dermatologo: consulta.dermatologo
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
					: <CirugiasContainer
						events={events} />
			}
		</Fragment>
	);
}

export default Cirugias;