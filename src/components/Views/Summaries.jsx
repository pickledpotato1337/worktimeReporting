import React, { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import {Paper} from "@material-ui/core";
import {ButtonBase} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";
import {Link} from "react-router-dom";

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




const Summaries =(props) => {

    const classes = useStyles();
    const [reports, getReports] = useState('');
    const [users, getUsers] = useState('');
    let hourCount= Number(0);

    function fetchUsers()
    {


            axios.get('http://127.0.0.1:8000/users/')
                .then(response => {
                    getUsers(response.data);
                    {
                        users.map((user, i) => {
                                hourCount=Number(0);
                                const {id, username, email, groups} = user;

                                return (<div className={classes.paper} key={i}>
                                        <Typography component="h2" variant="h5">
                                            {username} {email}</Typography>
                                        {fetchReports(id)};
                                        <Typography component="h2" variant="h5">
                                            Total Time {hourCount}</Typography>

                                </div>
                                );

                            }
                        );


                    }
                });

    }
    function fetchReports(userId) {

            axios.get('http://127.0.0.1:8000/reports/'+ userId)
                .then(response => {
                    getReports(response.data);
                    {
                        reports.map((report, j) => {

                                const {type, description, created, time, user} = report;
                                let creationDate=new Date(created);
                                let currentDate= new Date().getMonth();

                                 if(creationDate.getMonth().equals(currentDate)){
                                     hourCount+=Number(time);
                                    return (
                                    <div className={classes.paper} key={j}>
                                        <h2>{type}</h2>
                                        <h3>{description}</h3>
                                        <p>{time}</p>

                                    </div>);}
                                return null;
                            }
                        )
                    }
                })

    }
    return (
        <Grid container component="main" className={classes.root}>

            <CssBaseline/>
            <Grid item xs={12} sm={8} md={10} component={Paper} elevation={5} square>

                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                    Miesięczne podsumowania pracowników
                    </Typography>
                    <ButtonBase>
                        <Button className={classes.registerButton} variant="outlined" color="primary" component={Link} to="/reports">Podsumowania Dzienne</Button>
                        <Button className={classes.registerButton} variant="outlined" color="primary" component={Link} to="/projectSummaries">Podsumowania Zespołów</Button>
                    </ButtonBase>
                    {fetchUsers()}
                </div>
            </Grid>
        </Grid>

    );


};


const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(Summaries);
