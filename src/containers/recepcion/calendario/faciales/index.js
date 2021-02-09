import React, { useEffect, useState, Fragment } from "react";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import { showAllFacialBySucursalPendiente } from "../../../../services/faciales";
import { FacialesContainer } from "./faciales";

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Faciales = (props) => {

    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState([]);

    const { sucursal } = props;

	const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;

    const parseToEvents = (citas) => {
        return citas.map( cita => {
            const startDate = new Date(cita.fecha_hora);
            const endDate = new Date(cita.fecha_hora);
            const minutos = Number(endDate.getMinutes()) + Number(cita.tiempo);
            endDate.setMinutes(minutos);
            const tratamientos = cita.tratamientos.map(tratamiento => {
                return `${tratamiento.nombre}, `;
            });
            return {
                id: cita._id,
                title: tratamientos,
                start: startDate,
                end: endDate,
                servicio: cita.servicio
            }
        });
    }
    
    useEffect(() => {
        const loadCitas = async() => {
            const response = await showAllFacialBySucursalPendiente(sucursal, pendienteStatusId);
            
            if ( `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK ) {
                setEvents(parseToEvents(response.data));
            }
        }
        setIsLoading(true);
        loadCitas();
        setIsLoading(false);
    }, [sucursal]);

    return (
        <Fragment>
            {
                isLoading 
                ? <Backdrop className={classes.backdrop} open={isLoading} >
                    <CircularProgress color="inherit" />
                </Backdrop>
                : <FacialesContainer 
                    events={events} />
            }
        </Fragment>
    );
}

export default Faciales;