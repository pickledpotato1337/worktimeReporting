import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connect } from 'react-redux';
import {Redirect, withRouter} from 'react-router-dom';
import { Paper } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { auth } from '../../store/actions/index';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from "@material-ui/core/IconButton";

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
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    circularProgress: {
        marginLeft: '10px',
    },
}));

const Login = (props) => {
    const classes = useStyles();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleChangeEmail = (event) => {
        setUsername(event.target.value);
    };
    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };

    const submitHandler = (event) => {
        event.preventDefault();
        props.onAuth(username, password);
    };

    let authRedirect = null;
    if (props.isAuthenticated) {
        authRedirect = <Redirect to="/" />;
    }

    let alert = null;
    if (props.error) {
        alert = (
            <Alert severity="error">
                {props.error}
            </Alert>
        );
    }

    return (
        <Grid container component="main" className={classes.root}>
            {authRedirect}
            <CssBaseline />
            <Grid item xs={12} sm={8} md={3} component={Paper} elevation={5} square>
                <IconButton aria-label="close" onClick={props.history.goBack}>
                    <CloseIcon />
                </IconButton>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    {alert}
                    <form className={classes.form} onSubmit={submitHandler}>
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="text"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={username}
                            onChange={handleChangeEmail}
                            disabled={props.loading}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={password}
                            onChange={handleChangePassword}
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
                            Login
                            {props.loading ? <CircularProgress color="secondary" className={classes.circularProgress} size={20} /> : null}
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="register" variant="body2">
                                    Don't have an account? Sign Up
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Grid>
            <Grid item xs={false} sm={4} md={9} className={classes.image} />
        </Grid>
    );
};

const mapStateToProps = (state) => ({
    loading: state.auth.loading,
    error: state.auth.error,
    isAuthenticated: state.auth.token !== null,
});

const mapDispatchToProps = (dispatch) => ({
    onAuth: (username, password) => dispatch(auth(username, password)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
