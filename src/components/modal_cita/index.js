import React, { useState, useEffect, Fragment } from 'react';
import { 
  getAllServices,
  findTreatmentByServicio,
  getAllSchedules,
  findScheduleByDateAndSucursalAndService,
  updateDate,
  findEmployeesByRolId,
  showAllTipoCitas,
  showAllStatus,
} from "../../services";
import * as Yup from "yup";
import ModalFormCita from './ModalFormCita';
import { Formik } from 'formik';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../utils/utils';

const validationSchema = Yup.object({
  fecha: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos"),
  hora: Yup.string("Ingresa los apellidos")
    .required("Los nombres del pacientes son requeridos"),
  paciente: Yup.string("Ingresa la fecha de nacimiento")
    .required("Los nombres del pacientes son requeridos"),
  servicio: Yup.string("Ingresa la direccion")
    .required("Los nombres del pacientes son requeridos"),
  tratamiento: Yup.string("Ingresa el telefono")
    .required("Los nombres del pacientes son requeridos"),
  numero_sesion: Yup.string("Ingresa los nombres")
    .required("Los nombres del pacientes son requeridos"),
  recepcionista: Yup.string("Ingresa los apellidos")
    .required("Los nombres del pacientes son requeridos"),
  confirmo: Yup.string("Ingresa la fecha de nacimiento")
    .required("Los nombres del pacientes son requeridos"),
  quien_confirma: Yup.string("Ingresa la direccion")
    .required("Los nombres del pacientes son requeridos"),
  asistio: Yup.string("Ingresa el telefono")
    .required("Los nombres del pacientes son requeridos"),
  precio: Yup.string("Ingresa el telefono")
    .required("Los nombres del pacientes son requeridos"),
});

const useStyles = makeStyles(theme => ({
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
}));

const ModalCita = (props) => {

  const classes = useStyles();

  const {
    open,
    onClose,
    cita,
    empleado,
    loadCitas,
    fecha,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [tratamientos, setTratamientos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [promovendedores, setPromovendedores] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [tipoCitas, setTipoCitas] = useState([]);
  const [statements, setStatements] = useState([]);

  const fecha_cita = new Date(cita.fecha_hora);
  const hora =  `${addZero(Number(fecha_cita.getHours()) + 5)}:${addZero(fecha_cita.getMinutes())}`;

  const [values, setValues] = useState({
    fecha_hora: cita.fecha_hora,
    fecha_show: fecha_cita,
    hora: hora,
    paciente: cita.paciente,
    paciente_nombre: `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
    telefono: cita.paciente.telefono,
    servicio: cita.servicio,
    tratamientos: cita.tratamientos,
    numero_sesion: cita.numero_sesion,
    quien_agenda: cita.quien_agenda,
    tipo_cita: cita.tipo_cita ? cita.tipo_cita._id : '',
    confirmo: cita.confirmo,
    quien_confirma: cita.quien_confirma,
    promovendedor: cita.promovendedor ? cita.promovendedor._id : '',
    cosmetologa: cita.cosmetologa ? cita.cosmetologa._id : '',
    status: cita.status ? cita.status._id : '',
    precio: cita.precio,
    motivos: cita.motivos,
    observaciones: cita.observaciones,
    medico: cita.medico ? cita.medico._id : '',
    tiempo: cita.tiempo,
  });

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;

  useEffect(() => {
    const loadTratamientos = async () => {
      const response = await findTreatmentByServicio(cita.servicio);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setTratamientos(response.data);
      }
    }
    const loadHorariosByServicio = async () => {
      const date = new Date(cita.fecha_hora);
      const response = await findScheduleByDateAndSucursalAndService(date.getDate(), Number(date.getMonth() + 1), date.getFullYear(), cita.sucursal._id, cita.servicio._id);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        response.data.push({ hora: values.hora });
        setHorarios(response.data);
      }
    }

    const loadPromovendedores = async () => {
      const response = await findEmployeesByRolId(promovendedorRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setPromovendedores(response.data);
      }
    }

    const loadCosmetologas = async () => {
      const response = await findEmployeesByRolId(cosmetologaRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setCosmetologas(response.data);
      }
    }

    const loadDoctores = async () => {
      const response = await findEmployeesByRolId(doctorRolId);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setDoctores(response.data);
      }
    }

    const loadTipoCitas = async () => {
			const response = await showAllTipoCitas();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setTipoCitas(response.data);
			}
			setIsLoading(false);
    }
    
    const loadStaus = async () => {
      const response = await showAllStatus();
			if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
				setStatements(response.data);
			}
			setIsLoading(false);
    }

    setIsLoading(true);
    loadTratamientos();
    loadHorariosByServicio();
    loadPromovendedores();
    loadCosmetologas();
    loadDoctores();
    loadTipoCitas();
    loadStaus();
    setIsLoading(false);
  }, [cita, promovendedorRolId, cosmetologaRolId, medicoRolId]);

  const loadTratamientos = async (servicio) => {
    const response = await findTreatmentByServicio(servicio);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setTratamientos(response.data);
    }
  }

  const loadHorarios = async () => {
    const response = await getAllSchedules();
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setHorarios(response.data);
    }
  }

  const handleChangeServicio = e => {
    setValues({
      ...values,
      servicio: e.target.value,
      tratamiento: '',
      fecha_show: new Date(),
      fecha: '',
      hora: '',
      precio: '',
    });
    loadTratamientos(e.target.value);
  };

  const handleChangeTratamientos = (items) => {
    setValues({ ...values, tratamientos: items });
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
		const date = new Date(values.fecha_hora);
		date.setHours(Number(hora[0]) - 5); // -5 por zona horaria
		date.setMinutes(hora[1]);
		date.setSeconds(0);
		setValues({ ...values, fecha_hora: date, hora: e.target.value });
		setIsLoading(false);
	};

  const handleChangeTipoCita = e => {
    setValues({ ...values, tipo_cita: e.target.value });
  }

  const handleChangePromovendedor = e => {
    setValues({ ...values, promovendedor: e.target.value });
  }

  const handleChangeCosmetologa = e => {
    setValues({ ...values, cosmetologa: e.target.value });
  }

  const handleChangeStatus = e => {
    setValues({ ...values, status: e.target.value });
    console.log('ESTADOS', values.status);
  }

  const handleChangeObservaciones = e => {
    setValues({ ...values, observaciones: e.target.value });
  }

  const getTimeToTratamiento = (tratamientos) => {
    tratamientos.sort((a, b) => {
      if (a.tiempo < b.tiempo) return 1;
      if (a.tiempo > b.tiempo) return -1;
      return 0;
    });
    let tiempo = 0;
    tratamientos.forEach((item, index) => {
      tiempo += Number(index === 0 ? item.tiempo : (item.tiempo - 20));
    });
    return tiempo;
  }

  const handleOnClickActualizarCita = async (event, rowData) => {
    if (rowData.status._id !== pendienteStatusId) {
      rowData.quien_confirma = empleado._id;
    }
    //rowData.tiempo = getTimeToTratamiento(rowData.tratamientos);
    await updateDate(cita._id, rowData);
    onClose();
    await loadCitas(rowData.fecha_show);
  }

  const handleChangeSesion = e => {
    setValues({ ...values, numero_sesion: e.target.value });
  };

  const handleChangePrecio = e => {
    setValues({ ...values, precio: e.target.value });
  };

  const handleChangeMotivos = e => {
    setValues({ ...values, motivos: e.target.value });
  }

  const handleChangeMedico = (e) => {
    setValues({ ...values, medico: e.target.value });
  }

  const handleChangeTiempo = e => {
    setValues({ ...values, tiempo: e.target.value });
  };

  return (
    <Fragment>
      {
        !isLoading ?
          <Formik
            enableReinitialize
            initialValues={values}
            validationSchema={validationSchema} >
            {
              props => <ModalFormCita
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={open}
                onClickCancel={onClose}
                cita={cita}
                onClickActualizarCita={handleOnClickActualizarCita}
                onChangeServicio={(e) => handleChangeServicio(e)}
                onChangeTratamientos={(e) => handleChangeTratamientos(e)}
                onChangeFecha={(e) => handleChangeFecha(e)}
                onChangeHora={(e) => handleChangeHora(e)}
                onChangeTipoCita={(e) => handleChangeTipoCita(e)}
                onChangeStatus={(e) => handleChangeStatus(e)}
                onChangePromovendedor={(e) => handleChangePromovendedor(e)}
                onChangeCosmetologa={(e) => handleChangeCosmetologa(e)}
                onChangeMedico={(e) => handleChangeMedico(e)}
                onChangeTiempo={(e) => handleChangeTiempo(e)}
                tratamientos={tratamientos}
                horarios={horarios}
                promovendedores={promovendedores}
                cosmetologas={cosmetologas}
                doctores={doctores}
                tipoCitas={tipoCitas}
                statements={statements}
                onChangeSesion={handleChangeSesion}
                onChangePrecio={handleChangePrecio}
                onChangeMotivos={handleChangeMotivos}
                onChangeObservaciones={handleChangeObservaciones}
                {...props} />
            }
          </Formik> :
          <Backdrop className={classes.backdrop} open={isLoading} >
            <CircularProgress color="inherit" />
          </Backdrop>
      }
    </Fragment>

  );
}

export default ModalCita;