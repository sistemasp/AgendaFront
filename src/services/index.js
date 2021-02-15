import axios from 'axios';

export const baseUrl = process.env.REACT_APP_BASE_URL_LOCAL;
const urlSepomexGetEstados = 'https://api-sepomex.hckdrk.mx/query/get_estados';
const urlSepomexGetMunicipos = 'https://api-sepomex.hckdrk.mx/query/get_municipio_por_estado/';
const urlSepomexGetColonia = 'https://api-sepomex.hckdrk.mx/query/get_colonia_por_municipio/';
const urlSepomexGetAllInfoByCP = 'https://api-sepomex.hckdrk.mx/query/info_cp/';

// PACIENTES

export const getAllPatients = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllPatients', error);
    }
}

export const findPatientByPhoneNumber = async (telefono) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente/phonenumber/${telefono}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findPatientByPhoneNumber', error);
    }
}

export const updatePatient = async (pacienteId, paciente) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente/${pacienteId}`,
            method: 'PUT',
            data: paciente
        });
        return response;
    } catch (error) {
        console.log('updatePatient', error);
    }
}

export const createPatient = async (paciente) => {
    try {
        const response = await axios({
            url: `${baseUrl}/paciente`,
            method: 'POST',
            data: paciente
        });
        return response;
    } catch (error) {
        console.log('createPatient', error);
    }
}

// SERVICIOS

export const getAllServices = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/servicio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllServices', error);
    }
}

// HORARIO

export const getAllSchedules = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllSchedules', error);
    }
}

export const findSchedulesBySucursalAndServicio = async (idSucursal, idServicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/sucursal/${idSucursal}/servicio/${idServicio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSchedulesBySucursalAndServicio', error);
    }
}

export const findScheduleByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleByDate', error);
    }
}

export const findScheduleByDateAndSucursalAndService = async (dia, mes, anio, sucursalId, servicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/${dia}/${mes}/${anio}/${sucursalId}/${servicio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleByDateAndSucursalAndService', error);
    }
}

export const findScheduleInConsultByDateAndSucursal = async (consultaId, dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/horario/consulta/${consultaId}/${dia}/${mes}/${anio}/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findScheduleInConsultByDateAndSucursal', error);
    }
}

// CITAS

export const getAllDates = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllDates', error);
    }
}

export const getAllDatesBySucursal = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('getAllDatesBySucursal', error);
    }
}

export const showAllDatesBySucursalAsistio = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}/asistio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllDatesBySucursalAsistio', error);
    }
}

export const findDatesByDate = async (dia, mes, anio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByDate', error);
    }
}

export const findDatesByDateAndSucursal = async (dia, mes, anio, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByDateAndSucursal', error);
    }
}

export const findDatesByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByRangeDateAndSucursal', error);
    }
}

export const findDatesByRangeDateAndSucursalAndService = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}/service/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByRangeDateAndSucursalAndService', error);
    }
}

export const findHistoricByPaciente = async (pacienteId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/historic/${pacienteId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricByPaciente', error);
    }
}

export const findHistoricByPacienteAndService = async (pacienteId, serviceId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/historic/${pacienteId}/servicio/${serviceId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findHistoricByPacienteAndService', error);
    }
}

export const findDateById = async (citaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${citaId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDateById', error);
    }
}

export const createDate = async (cita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita`,
            method: 'POST',
            data: cita
        });
        return response;
    } catch (error) {
        console.log('createDate', error);
    }
}

export const updateDate = async (dateId, cita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dateId}`,
            method: 'PUT',
            data: cita
        });
        return response;
    } catch (error) {
        console.log('updateDate', error);
    }
}

export const waitingListTratamiento = async (sucursalId, statusAsistioId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/sucursal/${sucursalId}/asistio/${statusAsistioId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('waitingListTratamiento', error);
    }
}
export const findDatesByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, atendidoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cita/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/atendido/${atendidoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findDatesByPayOfDoctorTurno', error);
    }
}

// RECEPCIONISTAS

export const findRecepcionistByEmployeeNumber = async (employeeNumber) => {
    try {
        const response = await axios({
            url: `${baseUrl}/recepcionista/number/${employeeNumber}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findRecepcionistByEmployeeNumber', error);
    }
}

// EMPLEADOS

export const findEmployeeByEmployeeNumber = async (employeeNumber) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/number/${employeeNumber}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEmployeeByEmployeeNumber', error);
    }
}

export const loginEmployee = async (employeeNumber, password) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/login/${employeeNumber}/${password}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('loginEmployee', error);
    }
}

export const findEmployeesByRolId = async (rolId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/rol/${rolId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEmployeesByRolId', error);
    }
}

export const findEmployeesByRolIdAvailable = async (rolId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/rol/${rolId}/available`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEmployeesByRolIdAvailable', error);
    }
}

export const updateEmployee = async (employeeId, employee) => {
    try {
        const response = await axios({
            url: `${baseUrl}/empleado/${employeeId}`,
            method: 'PUT',
            data: employee
        });
        return response;
    } catch (error) {
        console.log('updateEmployee', error);
    }
}

// SUCURSALES

export const showAllOffices = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/sucursal`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllOffices', error);
    }
}

export const findOfficeById = async (idSucursal) => {
    try {
        const response = await axios({
            url: `${baseUrl}/sucursal/${idSucursal}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findOfficeById', error);
    }
}

// SALA DE CIRUGIA

export const findSalaCirugiaBySucursalId = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSalaCirugiaBySucursalId', error);
    }
}

export const findSalaCirugiaBySucursalIdWaitingList = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/waitinglist/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSalaCirugiaBySucursalIdWaitingList', error);
    }
}

export const findSalaCirugiaBySucursalIdAndFree = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/sucursal/${sucursalId}/libre`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findSalaCirugiaBySucursalIdAndFree', error);
    }
}

export const createSalaCirugia = async (consultorio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia`,
            method: 'POST',
            data: consultorio
        });
        return response;
    } catch (error) {
        console.log('createSalaCirugia', error);
    }
}

export const updateSalaCirugia = async (salaCirugiaId, surgery) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/${salaCirugiaId}`,
            method: 'PUT',
            data: surgery
        });
        return response;
    } catch (error) {
        console.log('updateSalaCirugia', error);
    }
}

export const breakFreeSalaCirugiaByIdPaciente = async (salaCirugiaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/liberar/paciente/${salaCirugiaId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSalaCirugiaByIdPaciente', error);
    }
}

export const breakFreeSalaCirugiaByIdDermatologo = async (salaCirugiaId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/salacirugia/liberar/dermatologo/${salaCirugiaId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeSalaCirugiaByIdDermatologo', error);
    }
}

// CABINAS

export const findCabinaBySucursalId = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCabinaBySucursalId', error);
    }
}

export const findCabinaBySucursalIdWaitingList = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/waitinglist/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCabinaBySucursalIdWaitingList', error);
    }
}

export const findCabinaBySucursalIdAndFree = async (sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/sucursal/${sucursalId}/libre`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCabinaBySucursalIdAndFree', error);
    }
}

export const createCabina = async (cabina) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina`,
            method: 'POST',
            data: cabina
        });
        return response;
    } catch (error) {
        console.log('createCabina', error);
    }
}

export const updateCabina = async (surgeryId, surgery) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/${surgeryId}`,
            method: 'PUT',
            data: surgery
        });
        return response;
    } catch (error) {
        console.log('updateCabina', error);
    }
}

export const breakFreeCabinaByIdPaciente = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/liberar/paciente/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeCabinaByIdPaciente', error);
    }
}

export const breakFreeCabinaByIdDermatologo = async (surgeryId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cabina/liberar/dermatologo/${surgeryId}`,
            method: 'PUT'
        });
        return response;
    } catch (error) {
        console.log('breakFreeCabinaByIdDermatologo', error);
    }
}

// TIPO CITAS

export const showAllTipoCitas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipocita`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoCitas', error);
    }
}

// MEDIO

export const showAllMedios = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/medio`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMedios', error);
    }
}

// BANCOS

export const showAllBanco = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/banco`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllBanco', error);
    }
}

// MÉTODO PAGO

export const showAllMetodoPago = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/formapago`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMetodoPago', error);
    }
}

// TIPO TARJETA

export const showAllTipoTarjeta = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipotarjeta`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoTarjeta', error);
    }
}

// PAGOS

export const createPago = async (pago) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago`,
            method: 'POST',
            data: pago
        });
        return response;
    } catch (error) {
        console.log('createPago', error);
    }
}

export const findPaysByRangeDateAndSucursal = async (diai, mesi, anioi, diaf, mesf, aniof, sucursalId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/fecha_inicio/${diai}/${mesi}/${anioi}/fecha_fin/${diaf}/${mesf}/${aniof}/sucursal/${sucursalId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findPaysByRangeDateAndSucursal', error);
    }
}

export const findPagoByIds = async (pagosIds) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/${pagosIds}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagoByIds', error);
    }
}

export const findPagosByCita = async (idCita) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/cita/${idCita}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagosByCita', error);
    }
}

export const findPagosByTipoServicioAndServicio = async (idTipoServicio, idServicio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/pagos/tipo_servicio/${idTipoServicio}/servicio/${idServicio}`,
            method: 'GET',
        });
        return response;
    } catch (error) {
        console.log('findPagosByTipoServicioAndServicio', error);
    }
}

export const updatePago = async (pagoId, pago) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/${pagoId}`,
            method: 'PUT',
            data: pago
        });
        return response;
    } catch (error) {
        console.log('updatePago', error);
    }
}

export const deletePago = async (pagoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/pago/${pagoId}`,
            method: 'DELETE'
        });
        return response;
    } catch (error) {
        console.log('deletePago', error);
    }
}

// SEPOMEX

export const sepomexGetEstados = async () => {
    try {
        const response = await axios({
            url: urlSepomexGetEstados,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetEstados', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetMunicipos = async (estado) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetMunicipos}${estado}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetMunicipos', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetColonia = async (municipio) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetColonia}${municipio}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetColonia', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

export const sepomexGetAllInfoByCP = async (cp) => {
    try {
        const response = await axios({
            url: `${urlSepomexGetAllInfoByCP}${cp}?type=simplified`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('sepomexGetAllInfoByCP', error);
        return {
            'error': process.env.REACT_APP_RESPONSE_CODE_ERROR,
            'descripcion': error
        };
    }
}

// USO CFDI

export const showAllUsoCfdis = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/usocfdi`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllUsoCfdis', error);
    }
}

// TRATAMIENTO-PRECIO

export const createTreatmentPrice = async (tratamientoprecio) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tratamientoprecio`,
            method: 'POST',
            data: tratamientoprecio
        });
        return response;
    } catch (error) {
        console.log('createTreatmentPrice', error);
    }
}

// FRECUENCIAS

export const showAllFrecuencias = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/frecuencia`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllFrecuencias', error);
    }
}

// SEXOS

export const showAllSexos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/sexo`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllSexos', error);
    }
}

// DERMATÓLOGOS

export const findCirugiasByPayOfDoctor = async (dia, mes, anio, sucursalId, dermatologoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByPayOfDoctor', error);
    }
}

export const findCirugiasByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/cirugia/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findCirugiasByPayOfDoctorTurno', error);
    }
}

export const findEsteticasByPayOfDoctorTurno = async (dia, mes, anio, sucursalId, dermatologoId, turno) => {
    try {
        const response = await axios({
            url: `${baseUrl}/estetica/${dia}/${mes}/${anio}/sucursal/${sucursalId}/dermatologo/${dermatologoId}/turno/${turno}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findEsteticasByPayOfDoctorTurno', error);
    }
}

// MATERIALES

export const showAllMaterials = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/material`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMaterials', error);
    }
}

// CONSECUTIVOS 

export const createConsecutivo = async (consecutivo) => {
    try {
        const response = await axios({
            url: `${baseUrl}/consecutivo`,
            method: 'POST',
            data: consecutivo
        });
        return response;
    } catch (error) {
        console.log('createConsecutivo', error);
    }
}

// TIPO ESTETICA

export const showAllTipoEsteticas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoestetica`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoEsteticas', error);
    }
}

// MATERIALES ESTETICA

export const showAllMaterialEsteticas = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/materialestetica`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllMaterialEsteticas', error);
    }
}

// TIPO INGRESO

export const showAllTipoIngresos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoingreso`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoIngresos', error);
    }
}

export const findTipoIngresoById = async (tipoIngresoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoingreso/${tipoIngresoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTipoIngresoById', error);
    }
}

// TIPO EGRESO

export const showAllTipoEgresos = async () => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoegreso`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('showAllTipoEgresos', error);
    }
}

export const findTipoEgresoById = async (tipoEgresoId) => {
    try {
        const response = await axios({
            url: `${baseUrl}/tipoegreso/${tipoEgresoId}`,
            method: 'GET'
        });
        return response;
    } catch (error) {
        console.log('findTipoEgresoById', error);
    }
}