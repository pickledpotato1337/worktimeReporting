import React, { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import {Paper} from "@material-ui/core";
import Typography from '@material-ui/core/Typography';
import {makeStyles} from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import { Redirect, withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';

import Autocomplete from "@material-ui/lab/Autocomplete";


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
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

let projects=["Realizacja", "Problemy techniczne", "Konsultacje", "Inne"];


const Home =(props) => {

    const classes = useStyles();
    const [type, setType]=useState('');
    const [description, setDescription]= useState('');
    const [time, setTime]=useState('');
    const [author, setAuthor]=useState('admin');
    const [reportTypes, getReportTypes]=useState('');
    const [project, getProjects] = useState('');
    const [callResponse, getResponse] = useState('');
    const [selectValue, setValue] = React.useState(projects[0]);
    const [inputValue, setInputValue] = React.useState('');



    const handleSetType=(event) =>{setType(event.target.value);};
    const handleSetDescription=(event) =>{setDescription(event.target.value);};
    const handleSetTime=(event) =>{setTime(event.target.value);};


    function UpdateProject() {


            axios.get('http://127.0.0.1:8000/projects/'+type)
                .then(response => {
                    getProjects(response.data);
                    {

                        const {id, name, budget, timePredicted, timeSpent} = project;
                        let timeElapsed = Number(timeSpent) + Number(time);
                        axios.put('http://127.0.0.1:8000/projects/'+type, { id, name, budget,timePredicted, timeElapsed })
                            .then(response =>getResponse(response.data).then(alert(response)));

                    }
                })


            }

    const submitHandler = (event) => {
        event.preventDefault();
        UpdateProject();
        setAuthor('admin');
        axios.post('http://127.0.0.1:8000/reports/', {type, description, time, author}).then(response =>alert(console.log(response)) );

    };


    function fetchReportTypes(){
        axios.get("http://127.0.0.1:8000/report_types/")
            .then(response => {
                getReportTypes(response.data);
                reportTypes.map((reportType) =>{
                    projects.push(reportType);
                    return null;

                });
            })}



    return (
        <Grid container component="main" className={classes.root}>

            <CssBaseline />
            <Grid item xs={12} sm={8} md={10} component={Paper} elevation={5} square>

                <div className={classes.paper}>

                    <Typography component="h1" variant="h5">
                        Zgłoszenie czasu pracy
                    </Typography>
                    {alert}
                    <form className={classes.form} onSubmit={submitHandler}>
                        <Button className={classes.button} variant="outlined" color="primary" onclick={fetchReportTypes()}
                                >pobierz projekty</Button>
                        <Autocomplete
                            value={selectValue}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                                setType(selectValue);
                            }}
                            inputValue={inputValue}
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
                                setType(selectValue);
                            }}
                            id="controllable-states"
                            options={projects}
                            style={{ width: 300 }}
                            renderInput={(params) => <TextField {...params} label="Controllable" variant="outlined" />}
                        />
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

                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="czas"
                            label="czas (godziny)"
                            id="text"
                            autoComplete="current-password"
                            value={time}
                            onChange={handleSetTime}
                            disabled={props.loading}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            disabled={props.loading}

                        >
                            Zgłoś
                            {props.loading ? <CircularProgress color="secondary" className={classes.circularProgress} size={20} /> : null}
                        </Button>

                    </form>
                </div>
            </Grid>
            <Grid item xs={false} sm={4} md={9} className={classes.image} />
        </Grid>
    );
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    loading: state.auth.loading,
    isAuthenticated: state.auth.token,
});

const mapDispatchToProps = (dispatch) => ({
    onSubmit: (type, description, time, author) => dispatch(axios.post('http://127.0.0.1:8000/reports/', { type, description, time, author })),
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
