import React, { useState, useEffect, Fragment } from 'react';
import ModalFormRazonSocial from './ModalFormRazonSocial';
import { sepomexGetEstados, sepomexGetMunicipos, sepomexGetColonia, sepomexGetAllInfoByCP, createRazonSocial, updateRazonSocial } from '../../../services';
import { Formik } from 'formik';
import { Snackbar } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ModalRazonSocial = (props) => {
  const {
    open,
    onClose,
    razonSocial,
    loadRazonSocial,
  } = props;

  const [openAlert, setOpenAlert] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('success');

  const [estados, setEstados] = useState([]);
  const [municipios, setMunicipios] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [colonias, setColonias] = useState([]);

  const [values, setValues] = useState({
    _id: razonSocial._id,
    rfc: razonSocial.rfc,
    nombre_completo: razonSocial.nombre_completo,
    domicilio: razonSocial.domicilio,
    numero: razonSocial.numero,
    colonia: razonSocial.colonia,
    ciudad: razonSocial.ciudad,
    municipio: razonSocial.municipio,
    estado: razonSocial.estado,
    codigo_postal: razonSocial.codigo_postal,
    telefono: razonSocial.telefono,
    email: razonSocial.email
  });

  const dataComplete = !values.rfc || !values.nombre_completo;

  useEffect(() => {
    const loadEstados = async () => {
      const response = await sepomexGetEstados();
      if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
        setEstados(response.data.response.estado);
      }
    }
    loadEstados();
  }, []);

  const loadMunicipios = async (estado) => {
    const response = await sepomexGetMunicipos(estado);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setMunicipios(response.data.response.municipios);
    }
  }

  const loadColonias = async (municipio) => {
    const response = await sepomexGetColonia(municipio);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      setColonias(response.data.response.colonia);
    }
  }

  const handleClickBuscar = async () => {
    const response = await sepomexGetAllInfoByCP(values.codigo_postal);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK) {
      const res = response.data.response;
      setEstados([res.estado]);
      setMunicipios([res.municipio]);
      setColonias(res.asentamiento);
      setValues({
        ...values,
        estado: res.estado,
        municipio: res.municipio,
        ciudad: res.ciudad,
      });
    } else {
      setOpenAlert(true);
      setSeverity('warning');
      setMessage(response.descripcion.response.data.error_message);
    }
  }

  const handleChangeEstado = async (event) => {
    setValues({ ...values, estado: event.target.value });
    await loadMunicipios(event.target.value);
  }

  const handleChangeMunicipio = async (event) => {
    setValues({ ...values, municipio: event.target.value });
    await loadColonias(event.target.value);
  }

  const handleChangeColonia = (event) => {
    setValues({ ...values, colonia: event.target.value });
  }

  const handleChangeCP = (event) => {
    setValues({ ...values, codigo_postal: event.target.value });
  }

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleChangeDomicilio = (event) => {
    setValues({ ...values, domicilio: event.target.value });
  }

  const handleChangeEmail = (event) => {
    setValues({ ...values, email: event.target.value });
  }

  const handleChangeNombre = (event) => {
    setValues({ ...values, nombre_completo: event.target.value });
  }

  const handleChangeNumero = (event) => {
    setValues({ ...values, numero: event.target.value });
  }

  const handleChangeRfc = (event) => {
    setValues({ ...values, rfc: event.target.value });
  }

  const handleChangeTelefono = (event) => {
    setValues({ ...values, telefono: event.target.value });
  }

  const handleChangeCiudad = (event) => {
    setValues({ ...values, ciudad: event.target.value });
  }

  const handleClickGuardar = async(e) => {
    const response = razonSocial._id ? await updateRazonSocial(razonSocial._id, values) : await createRazonSocial(values);
    if (`${response.status}` === process.env.REACT_APP_RESPONSE_CODE_OK
			|| `${response.status}` === process.env.REACT_APP_RESPONSE_CODE_CREATED) {
			setSeverity('success');
      setOpenAlert(true);
			setMessage(razonSocial._id ? 'Razon Social actualizada correctamente' : 'Razon Social creada correctamente');
    }
    loadRazonSocial();
    onClose();
  }

  return (
    <Fragment>
      <Formik
        enableReinitialize
        initialValues={values} >
        {
          props => <ModalFormRazonSocial
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClickCancel={onClose}
            razonSocial={razonSocial}
            dataComplete={dataComplete}
            estados={estados}
            municipios={municipios}
            ciudades={ciudades}
            colonias={colonias}
            onChangeEstado={(e) => handleChangeEstado(e)}
            onChangeMunicipio={(e) => handleChangeMunicipio(e)}
            onChangeColonia={(e) => handleChangeColonia(e)}
            onClickBuscar={handleClickBuscar}
            onChangeCP={(e) => handleChangeCP(e)}
            onClickGuardar={handleClickGuardar}
            onChangeDomicilio={(e) => handleChangeDomicilio(e)}
            onChangeEmail={(e) => handleChangeEmail(e)}
            onChangeNombre={(e) => handleChangeNombre(e)}
            onChangeNumero={(e) => handleChangeNumero(e)}
            onChangeRfc={(e) => handleChangeRfc(e)}
            onChangeCiudad={(e) => handleChangeCiudad(e)}
            onChangeTelefono={(e) => handleChangeTelefono(e)}
            {...props} />
        }
      </Formik>
      <Snackbar open={openAlert} autoHideDuration={5000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={severity}>
          {message}
        </Alert>
      </Snackbar>
    </Fragment>

  );
}

export default ModalRazonSocial;