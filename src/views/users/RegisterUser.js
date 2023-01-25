import PropTypes from 'prop-types';

// material-ui
import { Box, Button, Card, CardContent, Grid, Typography } from '@mui/material';

// project imports
import SubCard from 'ui-component/cards/SubCard';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { gridSpacing } from 'store/constant';
import { AlertUser, FormikInput, Input, RouteBtn } from 'custom-components';
import { PersonAddAlt1Rounded } from '@mui/icons-material';
import { IconChevronLeft, IconTrash, IconCircleX } from '@tabler/icons';
import { Form, Formik } from 'formik';

import * as yup from 'yup';
import { axiosInstance } from 'services';
import { useNavigate } from 'react-router';
import { useState } from 'react';

// ===============================|| RegisterUser ||=============================== //

const yupValidateShchema = yup.object().shape({
    name: yup.string().typeError('*Matn kiriting').required('*Boʻsh boʻlishi mumkin emas').min(2, '*2 dan ortiq belgi kiriting'),
    phone: yup.string().typeError('*Matn kiriting').required('*Boʻsh boʻlishi mumkin emas').min(2, '*2 dan ortiq belgi kiriting'),
});

const RegisterUser = () => {
    const navigate = useNavigate();
    const [isLoading, setLoading] = useState({ open: false, message: '', for: 'loading' });
    const [statusSnackbar, setStatusSnack] = useState({ open: false, message: '', type: 'error' });

    const handleSubmit = (userData) => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                await axiosInstance.post('users', userData);
                navigate('/pages/client/clients');
            } catch (err) {
                console.log(err);

                if (Object.keys(err.response.data.errors).length) {
                    const errors = Object.values(err.response.data.errors).map((err, index) => `${index + 1}) ${err} `);
                    handleSnackStatusOpen(errors);
                    return;
                }

                switch (err.code) {
                    case 'ERR_NETWORK':
                        handleSnackStatusOpen('Tarmoq xatosi');
                        return;
                    case 'ERR_BAD_REQUEST':
                        handleSnackStatusOpen('404 holat kodi bilan so‘rov bajarilmadi');
                        return;
                }

                if (!Object.keys(err.response.data.errors).length) {
                    handleSnackStatusOpen(err.response.data.message);
                    return;
                }
            } finally {
                handleSnackLoadingClose();
            }
        })();
    };

    // Status Snackbar
    const handleSnackStatusClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setStatusSnack({ open: false });
    };
    const handleSnackStatusOpen = (message = '', type = 'error') => {
        setStatusSnack({ open: true, message: message, type: type });
    };

    // Loading Snackbar
    const handleSnackLoadingClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setLoading({ open: false, message: '', for: 'loading' });
    };
    const handleSnackLoadingOpen = () => {
        setLoading({ open: true, message: '', for: 'loading' });
    };

    return (
        <>
            <AlertUser onClose={handleSnackLoadingClose} loading={isLoading} />
            <AlertUser alertInfo={statusSnackbar} onClose={handleSnackStatusClose} />

            <MainCard title="Roʻyxatdan oʻtkazish" secondary={<SecondaryAction link="https://next.material-ui.com/system/palette/" />}>
                <Grid container spacing={5} direction="column">
                    <Grid item>
                        <Card
                            raised
                            sx={{
                                bgcolor: '#e3f2fd',
                                boxShadow: 1,
                            }}
                        >
                            <CardContent>
                                <Grid container justifyContent="space-between" alignItems="center">
                                    <Grid item>
                                        <RouteBtn to="/" variant="text" startIcon={<IconChevronLeft />}>
                                            Boshqaruv Paneliga
                                        </RouteBtn>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card
                            raised
                            sx={{
                                bgcolor: '#e3f2fd',
                                boxShadow: 1,
                            }}
                        >
                            <CardContent>
                                <Formik
                                    initialValues={{
                                        name: '',
                                        phone: '',
                                    }}
                                    validationSchema={yupValidateShchema}
                                    onSubmit={handleSubmit}
                                    validateOnChange
                                >
                                    <Form>
                                        <Grid container justifyContent="center">
                                            <Grid item container spacing={4} direction="column" my={5} md={7}>
                                                <Grid item>
                                                    <Typography color="darkblue" variant="h2">
                                                        Yangi mijoz
                                                    </Typography>
                                                </Grid>
                                                <Grid item container spacing={2} direction="column">
                                                    <Grid item>
                                                        <Typography>Mijozning ismi</Typography>
                                                        <FormikInput name="name" inputText="Mijozning ismini kiriting" />
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography>Mijozning raqami</Typography>
                                                        <FormikInput name="phone" inputText="Mijozning raqami kiriting" />
                                                    </Grid>
                                                </Grid>
                                                <Grid item container justifyContent="space-between">
                                                    <Grid item>
                                                        <RouteBtn to="goBack" variant="contained" color="error" startIcon={<IconCircleX />}>
                                                            Bekor qilish
                                                        </RouteBtn>
                                                    </Grid>
                                                    <Grid item>
                                                        <Button
                                                            disabled={isLoading?.open}
                                                            variant="contained"
                                                            color="info"
                                                            type="submit"
                                                            startIcon={<PersonAddAlt1Rounded />}
                                                        >
                                                            Mijoz qoʻshinsh
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Form>
                                </Formik>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default RegisterUser;
