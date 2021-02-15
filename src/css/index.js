import { makeStyles } from "@material-ui/core";

const drawerWidth = 250;

const myStyles = makeStyles(theme => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        paddingLeft: 15
    },
    paper_95: {
        position: 'absolute',
        width: "95%",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    paper_principal: {
        width: "95%",
        margin: 25,
        boxShadow: theme.shadows[5],
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
    },
    root: {
        display: 'flex',
    },
    appBar: {
        backgroundColor: process.env.REACT_APP_TOP_BAR_COLOR,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -drawerWidth,
        padding: '0px',
    },
    contentShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
        padding: '0px',
    },
    title: {
        flexGrow: 1,
    },
    fragment: {
        width: '100%',
        padding: '0px',
    },
}));

export default myStyles;