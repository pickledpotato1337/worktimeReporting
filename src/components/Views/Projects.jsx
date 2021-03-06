import React, { useState } from 'react';
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline/CssBaseline";
import {Paper} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import { connect } from 'react-redux';
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




const Projects =(props) => {

    const classes = useStyles();
    const [projects, getProjects] = useState('');
    const [users, getUsers]=useState('');

    function fetchProjects() {


            axios.get('http://127.0.0.1:8000/projects/')
                .then(response => {
                    getProjects(response.data);
                    {
                        projects.map((project, i) => {
                            const {id, name, budget, timePredicted, timeSpent} = project;
                            let timeElapsed = Number(timeSpent);
                            let moneySpent = timeElapsed * 14.00;
                            let moneyPercentile = moneySpent / 100;
                            return (
                                <div className={classes.paper} key={i}>
                                    <Typography component="h2" variant="h5">
                                        {name}</Typography>
                                    <Typography component="h3" variant="h5">
                                        Budżet: {moneyPercentile}% wykorzystane</Typography>
                                    <Typography component="h3" variant="h5">
                                        {moneySpent} / {budget}</Typography>

                                    <Typography component="h3" variant="h5">
                                        {timePredicted} / {timeSpent}</Typography>

                                    <Typography component="h3" variant="h5">
                                        Członkowie grupy</Typography>

                                    {fetchUsers(name)}
                                </div>);
                        });
                    }

                });

    }
    function fetchUsers(groupName)
    {

            axios.get('http://127.0.0.1:8000/users/')
                .then(response => {
                    getUsers(response.data);
                    {
                        users.map((user) => {
                            const {id, username, email, groups} = user;
                            groups.map((group, j)=>{
                            if(groupName.equals(group)){
                            return( <div className={classes.paper} key={j}>
                                <Typography component="h2" variant="h5">
                                    {username}   {email}</Typography></div>);}
                            return null
                            })
                            })
                        }
                });

    }


    return (
        <Grid container component="main" className={classes.root}>

            <CssBaseline/>
            <Grid item xs={12} sm={8} md={10} component={Paper} elevation={5} square>

                <div className={classes.paper}>
                    {fetchProjects()}
                </div>
            </Grid>
        </Grid>

    );

};
    const mapStateToProps = (state) => ({
        user: state.auth.user,
    });

    export default connect(mapStateToProps)(Projects);
