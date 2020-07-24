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
  createDate,
} from "../../../services";
import * as Yup from "yup";
import ModalFormCita from './ModalFormCita';
import { Formik } from 'formik';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';
import { addZero } from '../../../utils/utils';

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
    sucursal,
    setOpenAlert,
    setMessage,
    setFilterDate,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [tratamientos, setTratamientos] = useState([]);
  const [horarios, setHorarios] = useState([]);
  const [promovendedores, setPromovendedores] = useState([]);
  const [cosmetologas, setCosmetologas] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [tipoCitas, setTipoCitas] = useState([]);
  const [statements, setStatements] = useState([]);

  const [openModalPagos, setOpenModalPagos] = useState(false);

  const fecha_cita = new Date(cita.fecha_hora);
  const fecha = `${addZero(fecha_cita.getDate())}/${addZero(Number(fecha_cita.getMonth() + 1))}/${addZero(fecha_cita.getFullYear())}`;
  const hora = `${addZero(Number(fecha_cita.getHours()) + 5)}:${addZero(fecha_cita.getMinutes())}`;

  const [values, setValues] = useState({
    fecha_hora: cita.fecha_hora,
    fecha_show: fecha_cita,
    fecha: fecha,
    hora: hora,
    fecha_actual: fecha,
    hora_actual: hora,
    paciente: cita.paciente,
    paciente_nombre: `${cita.paciente.nombres} ${cita.paciente.apellidos}`,
    telefono: cita.paciente.telefono,
    servicio: cita.servicio,
    tratamientos_precios: cita.tratamientos_precios,
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
    pagado: cita.pagado,
  });

  const promovendedorRolId = process.env.REACT_APP_PROMOVENDEDOR_ROL_ID;
  const cosmetologaRolId = process.env.REACT_APP_COSMETOLOGA_ROL_ID;
  const medicoRolId = process.env.REACT_APP_MEDICO_ROL_ID;
  const pendienteStatusId = process.env.REACT_APP_PENDIENTE_STATUS_ID;
  const asistioStatusId = process.env.REACT_APP_ASISTIO_STATUS_ID;
  const reagendoStatusId = process.env.REACT_APP_REAGENDO_STATUS_ID;

  useEffect(() => {
    const loadTratamientos = async () => {
      const response = await findTreatmentByServicio(cita.servicio._id);
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
      const response = await findEmployeesByRolId(medicoRolId);
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
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${values.hora} hrs`;
		await setValues({
			...values,
      nueva_fecha_hora: date,
      observaciones: fechaObservaciones,
		});
		await loadHorarios(date);
    setIsLoading(false);
	};

  console.log("VALUES", values);

	const handleChangeHora = e => {
		setIsLoading(true);
		const hora = (e.target.value).split(':');
		const date = new Date(values.nueva_fecha_hora);
		date.setHours(Number(hora[0]) - 5); // -5 por zona horaria
		date.setMinutes(hora[1]);
    date.setSeconds(0);
    const fechaObservaciones = `${addZero(date.getDate())}/${addZero(Number(date.getMonth() + 1))}/${date.getFullYear()} - ${e.target.value} hrs`;
		setValues({
      ...values,
      nueva_fecha_hora: date,
      hora: e.target.value,
      observaciones: fechaObservaciones,
    });
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
      if (rowData.status === asistioStatusId) {
        const dateNow = new Date();
        rowData.hora_llegada = `${addZero(dateNow.getHours())}:${addZero(dateNow.getMinutes())}`;
      }
    }

    //rowData.tiempo = getTimeToTratamiento(rowData.tratamientos);
    if (rowData.status === reagendoStatusId) {
      await updateDate(cita._id, rowData);
      rowData.quien_agenda = empleado._id;
      rowData.sucursal = sucursal;
      rowData.status = pendienteStatusId;
      rowData.hora_llegada = '--:--';
      rowData.hora_atencion = '--:--';
      rowData.hora_salida = '--:--';
      rowData.observaciones = `Tratamiento reagendado ${values.fecha_actual} - ${values.hora_actual} hrs`;
      rowData.fecha_hora = rowData.nueva_fecha_hora;
      const response = await createDate(rowData);
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
        setOpenAlert(true);
        setMessage('El Tratamiento se reagendo correctamente');
      }
      const dia = addZero(rowData.fecha_hora.getDate());
      const mes = addZero(rowData.fecha_hora.getMonth() + 1);
      const anio = rowData.fecha_hora.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_hora,
        fecha: `${dia}/${mes}/${anio}`
      });
      await loadCitas(rowData.fecha_hora);
    } else {
      const dia = addZero(rowData.fecha_show.getDate());
      const mes = addZero(rowData.fecha_show.getMonth() + 1);
      const anio = rowData.fecha_show.getFullYear();
      setFilterDate({
        fecha_show: rowData.fecha_show,
        fecha: `${dia}/${mes}/${anio}`
      });
      await updateDate(cita._id, rowData);
      await loadCitas(rowData.fecha_show);
    }
    onClose();
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

  const handleChangePagado = (e) => {
    setValues({ ...values, pagado: !values.pagado });
    setOpenModalPagos(!values.pagado);
  }

  const handleCloseModalPagos = () => {
    setOpenModalPagos(false);
    setValues({ ...values, pagado: false });
  }

  const handleGuardarModalPagos = () => {
    setOpenModalPagos(false);
  }

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
                onChangePagado={(e) => handleChangePagado(e)}
                openModalPagos={openModalPagos}
                onCloseModalPagos={handleCloseModalPagos}
                onGuardarModalPagos={handleGuardarModalPagos}
                sucursal={sucursal}
                empleado={empleado}
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