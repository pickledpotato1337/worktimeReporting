import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CircularProgress from '@material-ui/core/CircularProgress';
import PropTypes from 'prop-types';
import axios from '../../services/axios';

export default function Asynchronous(props) {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;

    React.useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            // eslint-disable-next-line react/prop-types
            const response = await axios.get(props.url);

            if (active) {
                setOptions(response.data['hydra:member']);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading, props.url]);

    React.useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            style={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            getOptionSelected={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            size={props.size}
            options={options}
            loading={loading}
            onChange={(event, newValue) => {
                console.log(newValue);
            }}
            defaultValue={props.value ? { name: props.value } : null}
            renderInput={(params) => (
                <TextField
                    /* eslint-disable-next-line react/jsx-props-no-spreading */
                    {...params}
                    /* eslint-disable-next-line react/prop-types */
                    label={props.label}
                    variant="outlined"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <>
                                {loading ? (
                                    <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                            </>
                        ),
                    }}
                />
            )}
        />
    );
}
Asynchronous.defaultProps = {
    label: 'Label',
    value: null,
    size: null,
};
Asynchronous.propTypes = {
    url: PropTypes.string.isRequired,
    label: PropTypes.string,
    value: PropTypes.string,
    size: PropTypes.string,
};
