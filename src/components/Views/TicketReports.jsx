import React, { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import {Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField/TextField";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {

        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    button: {
        marginLeft: '10px',
    },

    circularProgress: {
        marginLeft: '10px',
    },
}));




const TicketReports =(props) => {

    const classes = useStyles();
    let defaultStatus="http://127.0.0.1:8000/notification_statuses/3/";
    const [author, setAuthor]= useState('admin');
    const [description, setDescription]=useState('');
    const [status, setStatus]=useState('');
    const [tickets, getTickets]=useState('');
    function handleSetAuthor(){setAuthor(props.user.name);}
    function handleSetStatus(){setStatus(defaultStatus);}

    const handleSetDescription=(event) =>{setDescription(event.target.value);};
    const submitHandler = (event) => {
        event.preventDefault();

        handleSetStatus();
        axios.post('http://127.0.0.1:8000/reports',{author, description, status}).then(response =>console.log(response).then(alert(console.log)) );
    };

    function fetchTickets(){
        axios.get('http://127.0.0.1:8000/reports').then(
            response => {
                getTickets(response);
                tickets.map((ticket, i) =>{
                    const{created, author, description, status}=ticket;

                    return(<div className={classes.paper} key={i}>
                        <Typography component="h2" variant="h5">
                           Autor: {author}   Data: {created}</Typography>
                        <Typography component="h2" variant="h5">
                           {description}</Typography>
                        <Typography component="h2" variant="h5">
                            Status: {status}</Typography>
                    </div>);

                });
            }
        )
    }

    return (
        <Grid container component="main" className={classes.root}>

            <CssBaseline />
            <Grid item xs={12} sm={8} md={10} component={Paper} elevation={5} square>

                <div className={classes.paper}>
                    <form className={classes.form} onSubmit={submitHandler}>
                    <Typography component="h1" variant="h5">
                        Zgłaszanie problemów
                    </Typography>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="text"
                        label="Uwagi"
                        name="Uwagi"

                        autoFocus
                        value={description}
                        onChange={handleSetDescription}
                        disabled={props.loading}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        disabled={props.loading}
                        onSubmit={submitHandler}
                    >
                        Zgłoś
                        {props.loading ? <CircularProgress color="secondary" className={classes.circularProgress} size={20} /> : null}
                    </Button>
                    </form>
                </div>
            </Grid>
        </Grid>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(TicketReports);
