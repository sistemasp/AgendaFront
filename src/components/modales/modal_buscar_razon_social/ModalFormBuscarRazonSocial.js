import React from 'react';
import Modal from '@material-ui/core/Modal';
import TableComponent from '../../table/TableComponent';
import { ButtonCustom } from '../../basic/ButtonCustom';
import ModalUsoCfdi from '../modal_uso_cfdi';
import ModalRazonSocial from '../modal_razon_social';
import myStyles from '../../../css';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const ModalFormBuscarRazonSocial = (props) => {
  const classes = myStyles();

  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const {
    open,
    onClose,
    titulo,
    columns,
    razonSociales,
    actions,
    options,
    factura,
    openModalUsoCfdi,
    onCloseUsoCfdi,
    pago,
    servicio,
    handleOpenNuevaRazonSocial,
    openNuevaRazonSocial,
    loadRazonSocial,
    handleCloseNuevaRazonSocial,
  } = props;

  return (
    <div>
      <Modal
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={open} >
        <div style={modalStyle} className={classes.paper_95}>
          {
            openModalUsoCfdi ?
              <ModalUsoCfdi
                open={openModalUsoCfdi}
                onClose={onCloseUsoCfdi}
                factura={factura}
                pago={pago}
                servicio={servicio}
                closeRazonSocial={onClose}
              /> : ''
          }
          {
            openNuevaRazonSocial ?
              <ModalRazonSocial
                open={openNuevaRazonSocial}
                onClose={handleCloseNuevaRazonSocial}
                razonSocial={{}}
                loadRazonSocial={loadRazonSocial} /> : ''
          }
          <ButtonCustom
            className={classes.button}
            color="primary"
            variant="contained"
            onClick={handleOpenNuevaRazonSocial}
            text='Nuevo razon social' />

          <TableComponent
            titulo={titulo}
            columns={columns}
            data={razonSociales}
            actions={actions}
            options={options} />

          <ButtonCustom
            className={classes.button}
            color="secondary"
            variant="contained"
            onClick={() => onClose(false)}
            text='Cancelar' />
        </div>
      </Modal>
    </div >
  );
}

export default ModalFormBuscarRazonSocial;