import { makeStyles } from "@material-ui/core";

const myStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        paddingLeft: 15
    },
    textField: {
        width: '100%',
    },
    formControl: {
        minWidth: 120,
        width: '100%',
    },
    button: {
        width: '100%',
        color: '#FFFFFF',
    },
    label: {
        marginTop: '0px',
        marginBottom: '0px',
        textAlign: 'center',
    },
    label_left: {
        marginTop: '0px',
        marginBottom: '0px',
        marginLeft: '10px',
        textAlign: 'left',
    },
    label_right: {
        marginTop: '0px',
        marginBottom: '0px',
        marginRight: '10px',
        textAlign: 'right',
    },
    label_foot: {
        fontSize: '11px',
        marginTop: '0px',
        marginRight: '10px',
        marginBottom: '10px',
        textAlign: 'right',
        fontWeight: 'bold',
    },
    labelItemLeft: {
        marginTop: '0px',
        marginBottom: '0px',
        textAlign: 'left',
    },
    labelSubItemLeft: {
        marginTop: '0px',
        marginBottom: '0px',
        marginLeft: '15px',
        marginRight: '15px',
        textAlign: 'left',
    },
    labelItemRight: {
        marginTop: '0px',
        marginBottom: '0px',
        marginRight: '10px',
        textAlign: 'right',
    },
    gridItem: {
        display: 'flex',
        flexWrap: 'wrap',
    }
}));

export default myStyles;