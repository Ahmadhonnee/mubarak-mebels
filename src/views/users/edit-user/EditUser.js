import PropTypes from 'prop-types';

// material-ui
import { Box, Button, Card, CardContent, Grid, Skeleton, Snackbar, Typography } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { AlertUser, FormikInput, Input, RouteBtn } from 'custom-components';
import { PersonAddAlt1Rounded } from '@mui/icons-material';
import { Form, Formik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { axiosInstance } from 'services';

// icons
import { IconPencil, IconChevronLeft, IconTrash, IconCircleX } from '@tabler/icons';
import { LoadingButton } from '@mui/lab';

// ============================|| Edit User ||============================ //

const EditUser = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [isLoading, setLoading] = useState({ open: false, message: '', for: 'loading' });
    const [statusSnackbar, setStatusSnack] = useState({ open: false, message: '', type: 'error' });
    const [currentUser, setCurrentUser] = useState(null);
    const [isDeleting, setDeleting] = useState(false);
    const [isDeleteSnackbarOpened, setDeleteSnackbarOpen] = useState({ open: false, message: '', type: 'action' });

    useEffect(() => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const data = await axiosInstance.get(`users/${id}`);
                setCurrentUser(data.data.data);
                data && handleSnackStatusClose();
            } catch (err) {
                console.log(err);
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

                if (Object.keys(err.response.data.errors).length) {
                    const errors = Object.values(err.response.data.errors).map((err, index) => `${index + 1}) ${err} `);
                    handleSnackStatusOpen(errors);
                    return;
                }
            } finally {
                handleSnackLoadingClose();
            }
        })();
    }, []);

    const yupValidateSchema = yup.object().shape({
        name: yup
            .string()
            .typeError('*Matn kiriting')
            .required("*Bo'sh bo'lishi mumkin emas")
            .min(2, '*2 dan ortiq belgi')
            .max(30, '*30 ta belgidan kam'),
        phone: yup
            .string()
            .typeError('*Raqam kiriting')
            .required("*Bo'sh bo'lishi mumkin emas")
            .min(2, '*2 dan ortiq belgi')
            .max(20, '*20 ta belgidan kam'),
    });

    const handleFormSubmit = (userData) => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                await axiosInstance.put(`/users/${id}`, userData);
                navigate(-1);
            } catch (err) {
                console.log(err);
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

                if (Object.keys(err.response.data.errors).length) {
                    const errors = Object.values(err.response.data.errors).map((err, index) => `${index + 1}) ${err} `);
                    handleSnackStatusOpen(errors);
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

    // Delete user with orders

    const handleInvoiceDelete = () => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                await axiosInstance.delete(`users/${id}`);
                navigate('/invoices/clients-list/');
            } catch (err) {
                console.log(err);
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

                if (Object.keys(err.response.data.errors).length) {
                    const errors = Object.values(err.response.data.errors).map((err, index) => `${index + 1}) ${err} `);
                    handleSnackStatusOpen(errors);
                    return;
                }
            } finally {
                handleDeleteSnackClose();
                handleDeleteSnackClose();
            }
        })();
    };

    // Delete Snackbar
    const handleDeleteSnackOpen = (message = 'Hisobni oʻchirib tashlamoqchimisiz?') => {
        setDeleteSnackbarOpen({ open: true, message, type: 'action' });
    };
    const handleDeleteSnackClose = (event, reason) => {
        setDeleteSnackbarOpen({ open: false });
    };

    const snackbarContent = (
        <>
            <Button disabled={isLoading?.open} color="secondary" size="small" onClick={handleDeleteSnackClose}>
                Bekor qilish
            </Button>
            <LoadingButton
                loading={isLoading?.open}
                onClick={handleInvoiceDelete}
                size="small"
                aria-label="close"
                color="inherit"
                startIcon={<IconTrash />}
            />
        </>
    );

    return (
        <>
            <AlertUser onClose={handleSnackLoadingClose} loading={isLoading} />
            <AlertUser alertInfo={statusSnackbar} onClose={handleSnackStatusClose} />
            <AlertUser alertInfo={isDeleteSnackbarOpened} onClose={handleDeleteSnackClose} action={snackbarContent} />

            <MainCard title="Edit user">
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
                                        <RouteBtn to={'goBack'} variant="text" startIcon={<IconChevronLeft />}>
                                            Ortga
                                        </RouteBtn>
                                    </Grid>
                                    <Grid
                                        item
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 1,
                                        }}
                                    >
                                        <Grid item>
                                            {currentUser ? (
                                                <Button
                                                    onClick={() => {
                                                        handleDeleteSnackOpen();
                                                    }}
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<IconTrash />}
                                                >
                                                    Oʻchirish
                                                </Button>
                                            ) : (
                                                <Skeleton
                                                    sx={{ bgcolor: 'grrey.900' }}
                                                    variant="contained"
                                                    animation="wave"
                                                    width={90}
                                                    height={36}
                                                />
                                            )}
                                        </Grid>
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
                                {currentUser ? (
                                    <Formik
                                        initialValues={{
                                            name: currentUser?.name,
                                            phone: currentUser?.phone,
                                        }}
                                        validationSchema={yupValidateSchema}
                                        validateOnChange
                                        onSubmit={handleFormSubmit}
                                    >
                                        <Form>
                                            <Grid container justifyContent="center">
                                                <Grid item container spacing={4} direction="column" my={5} md={7}>
                                                    <Grid item>
                                                        <Typography color="darkblue" variant="h2">
                                                            "{currentUser?.name}"ni ozgartirish
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item container spacing={1} direction="column">
                                                        <Grid item>
                                                            <FormikInput name="name" inputText="Mijoz nomi" />
                                                        </Grid>
                                                        <Grid item>
                                                            <FormikInput name="phone" inputText="Mijoz raqami" />
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item container justifyContent="space-between">
                                                        <Grid item>
                                                            <Button
                                                                onClick={() => {
                                                                    navigate('/pages/client/clients/');
                                                                }}
                                                                variant="contained"
                                                                color="error"
                                                                startIcon={<IconCircleX />}
                                                            >
                                                                Bekor qilish
                                                            </Button>
                                                        </Grid>
                                                        <Grid item>
                                                            <Button
                                                                disabled={isLoading?.open}
                                                                type="submit"
                                                                variant="contained"
                                                                color="info"
                                                                startIcon={<IconPencil />}
                                                            >
                                                                Mijozni oʻzgartirish
                                                            </Button>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Form>
                                    </Formik>
                                ) : (
                                    <Grid container justifyContent="center">
                                        <Grid item container spacing={4} direction="column" my={5} md={6}>
                                            <Grid item>
                                                <Skeleton variant="rectangular" animation="wave" />
                                            </Grid>
                                            <Grid
                                                item
                                                container
                                                spacing={1}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    width: '100%',
                                                }}
                                            >
                                                <Grid item width={{ xs: '100%', sm: '100%', md: '100%', lg: '100%' }}>
                                                    <Skeleton
                                                        variant="rectangular"
                                                        animation="wave"
                                                        sx={{
                                                            height: '40px',
                                                            margin: '10px 0',
                                                        }}
                                                    />
                                                </Grid>
                                                <Grid item width={{ xs: '100%', sm: '100%', md: '100%', lg: '100%' }}>
                                                    <Skeleton
                                                        variant="rectangular"
                                                        animation="wave"
                                                        sx={{
                                                            height: '40px',
                                                            margin: '10px 0',
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid item container justifyContent="space-between">
                                                <Grid item>
                                                    <Skeleton variant="rectangular" animation="wave" width="70px" height="30px" />
                                                </Grid>
                                                <Grid item>
                                                    <Skeleton variant="rectangular" animation="wave" width="70px" height="30px" />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default EditUser;
