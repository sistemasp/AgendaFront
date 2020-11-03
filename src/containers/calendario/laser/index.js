import React, { useEffect, useState, Fragment } from "react";
import { Backdrop, CircularProgress, makeStyles } from "@material-ui/core";
import { LaserContainer } from "./laser";
import { showAllLaserBySucursalAsistio } from "../../../services/laser";

const useStyles = makeStyles(theme => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Laser = (props) => {

    const classes = useStyles();

    const [isLoading, setIsLoading] = useState(true);
    const [events, setEvents] = useState([]);

    const { sucursal } = props;

    const parseToEvents = (lasers) => {
        return lasers.map( laser => {
            const startDate = new Date(laser.fecha_hora);
            const endDate = new Date(laser.fecha_hora);
            const minutos = Number(endDate.getMinutes()) + Number(laser.tiempo);
            endDate.setMinutes(minutos);
            const areas = laser.areas.map(area => {
                return `${area.nombre}, `;
            });
            return {
                id: laser._id,
                title: areas,
                start: startDate,
                end: endDate,
                servicio: laser.servicio
            }
        });
    }
    
    useEffect(() => {
        const loadCitas = async() => {
            const response = await showAllLaserBySucursalAsistio(sucursal);
            
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
                : <LaserContainer 
                    events={events} />
            }
        </Fragment>
    );
}

export default Laser;