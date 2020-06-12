import React, { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import {Paper} from "@material-ui/core";
import {ButtonBase} from '@material-ui/core';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Avatar from "@material-ui/core/Avatar";
import {makeStyles} from "@material-ui/core/styles";
import Link from '@material-ui/core/Link';
import { Redirect, withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(https://source.unsplash.com/random)',
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

const DailyReports =(props) => {


    const classes = useStyles();
    const [reports, getReports] = useState('');
    const [users, getUsers] = useState('');
    let hourCount = Number(0);

    function fetchUsers() {
        if (props.user) {

            axios.get('http://127.0.0.1:8000/user')
                .then(response => {
                    getUsers(response.data);
                    {
                        users.map((user) => {
                                hourCount = Number(0);
                                const {id, username, email, groups} = user;


                                return (<div className={classes.paper} key={id}>
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
    }

    function fetchReports(userId) {
            let fullfilledFlag='false';
            axios.get('http://127.0.0.1:8000/reports/' + userId)
                .then(response => {
                    getReports(response.data);
                    {
                        reports.map((report) => {

                                const {type, description, created, time, user} = report;
                                let creationDate = new Date(created);
                                let currentDate = new Date().getDay();


                                if (creationDate.getMonth().equals(currentDate)) {
                                    hourCount += Number(time);
                                    fullfilledFlag='true';
                                    return (
                                        <div className={'post'} key={type}>
                                            <h2>{type}</h2>
                                            <h3>{description}</h3>
                                            <p>{time}</p>

                                        </div>);
                                }
                                else if(fullfilledFlag.equals('false')){
                                    return(  <div className={'post'} key={type}>
                                        <h3>Nie znaleziono raportów</h3>
                                    </div>);
                                }
                            }
                        )
                    }
                })

    }

    return (
        <Grid container component="main" className={classes.root}>

            <CssBaseline/>
            <Grid item xs={12} sm={8} md={8} component={Paper} elevation={5} square>

                <div className={classes.paper}>
                    {fetchUsers()}
                </div>
            </Grid>
        </Grid>

    );

};



const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(DailyReports);
