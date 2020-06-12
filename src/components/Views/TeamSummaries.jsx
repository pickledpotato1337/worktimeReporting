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




const TeamSummaries =(props) => {

    const classes = useStyles();
    const [rewardPerTeammate, setReward]= useState('');
    const [reports, getReports] = useState('');
    const [users, getUsers] = useState('');
    const [projects, getProjects] = useState('');
    let hourCount= Number(0);

    const handleSetReward = (event) => {
        setReward(event.target.value);
    };
    function fetchProjects() {


        axios.get('http://127.0.0.1:8000/projects/')
            .then(response => {
                getProjects(response.data);
                {
                    projects.map((project, i) => {
                        hourCount=Number(0);
                        const {id, name, budget, timePredicted, timeSpent} = project;
                        let timeElapsed = Number(timeSpent);
                        let moneySpent = timeElapsed * Number(rewardPerTeammate);
                        let moneyPercentile = moneySpent / 100;
                        return (
                            <div className={classes.paper} key={i}>
                                <Typography component="h2" variant="h5">
                                    {name}</Typography>
                                <Typography component="h3" variant="h5">
                                    Budżet: {moneyPercentile}wykorzystane</Typography>
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
                        users.map((user, j) => {

                                const {id, username, email, groups} = user;
                                groups.map((group, j)=>{
                                if(groupName.equals(group)){
                                return (<div className={classes.paper} key={j}>
                                        <Typography component="h2" variant="h5">
                                            {username} {email}</Typography>
                                        {fetchReports(id)};
                                        <Typography component="h2" variant="h5">
                                            Czas Wykonany {hourCount}</Typography>

                                    </div>
                                );}
                                return null});

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
                        <Button className={classes.registerButton} variant="outlined" color="primary" component={Link} to="/reports">Podsumowania</Button>
                    </ButtonBase>
                    <form className={classes.form} onSubmit={submitHandler}>
                        <Typography component="h1" variant="h5">
                            Wynagrodzenie na członka zespołu
                        </Typography>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="text"
                            label="Wynagrodzenie(pln)"
                            name="Wynagrodzenie(pln)"

                            autoFocus
                            value={rewardPerTeammate}
                            onChange={handleSetReward}
                            disabled={props.loading}
                        />
                    </form>
                    {fetchProjects()}
                </div>
            </Grid>
        </Grid>

    );


};


const mapStateToProps = (state) => ({
    user: state.auth.user,
});

export default connect(mapStateToProps)(TeamSummaries);
