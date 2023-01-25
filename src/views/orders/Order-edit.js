import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    Grid,
    Skeleton,
    Snackbar,
    Stack,
    Box,
    Typography,
    IconButton,
} from '@mui/material';
import { AlertUser, FormikInput, RouteBtn } from 'custom-components';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { axiosInstance } from 'services';
import MainCard from 'ui-component/cards/MainCard';
import * as yup from 'yup';
// icons
import {
    IconPencil,
    IconChevronLeft,
    IconTrash,
    IconTruckDelivery,
    IconReceiptRefund,
    IconCircleX,
    IconFilePlus,
    IconTextPlus,
} from '@tabler/icons';

const OrderEdit = () => {
    const navigate = useNavigate();
    const { id, orderID } = useParams();
    const [isLoading, setLoading] = useState({ open: false, message: '', for: 'loading' });
    const [statusSnackbar, setStatusSnack] = useState({ open: false, message: '', type: 'error' });
    const [editingOrder, setEditing] = useState(null);

    useEffect(() => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const data = await axiosInstance.get(`orders/${id}`);
                setEditing(data.data.data);
                console.log(data.data.data);
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

    // Formik
    const yupValidateShchema = yup.object().shape({
        product_name: yup
            .string()
            .typeError('*Matn kiriting')
            .required("*Bo'sh bo'lishi mumkin emas")
            .min(2, '*2 dan ortiq belgi')
            .max(30, '*30 ta belgidan kam'),
        description: yup.string().typeError('*Matn kiriting').min(2, '*2 dan ortiq belgi').max(100, '*100 ta belgidan kam'),
    });

    const handleOrderEdit = ({ product_name, description }) => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                await axiosInstance.put(`orders/${orderID}`, {
                    ...editingOrder,
                    product_name,
                    description: description.trim(),
                });
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

    return (
        <>
            {/* Snackbars */}

            <AlertUser alertInfo={statusSnackbar} onClose={handleSnackStatusClose} />
            <AlertUser onClose={handleSnackLoadingClose} loading={isLoading} />

            <MainCard title="Edit order">
                <Grid
                    container
                    spacing={5}
                    sx={{
                        flexDirection: 'column',
                    }}
                >
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
                                        <RouteBtn to={'goBack'} relative="path" variant="text" startIcon={<IconChevronLeft />}>
                                            Ortga
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
                                {editingOrder ? (
                                    <Formik
                                        initialValues={{
                                            product_name: editingOrder?.product_name || '',
                                            description: editingOrder?.description || '',
                                        }}
                                        validationSchema={yupValidateShchema}
                                        onSubmit={handleOrderEdit}
                                        validateOnChange
                                    >
                                        <Form>
                                            <Grid container justifyContent="center">
                                                <Grid item container spacing={4} direction="column" my={5} md={6}>
                                                    <Grid item>
                                                        <Typography variant="h2">"{editingOrder?.product_name}"ni oʻzgartirish</Typography>
                                                    </Grid>
                                                    <Grid item container direction="column" spacing={1} my={5} md={6}>
                                                        <Grid item mt={1}>
                                                            <Typography>Ordering product Name</Typography>
                                                            <FormikInput name="product_name" inputText="Mahsulot nomini kiriting" />
                                                        </Grid>

                                                        <Grid item>
                                                            <Typography>Tavsif</Typography>
                                                            <FormikInput name="description" inputText="Tavsif" />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                            }}
                                                        >
                                                            <RouteBtn
                                                                to="goBack"
                                                                variant="contained"
                                                                color="error"
                                                                startIcon={<IconCircleX />}
                                                            >
                                                                Bekor qilish
                                                            </RouteBtn>
                                                            <Button
                                                                disabled={isLoading?.open}
                                                                type="submit"
                                                                variant="contained"
                                                                color="info"
                                                                startIcon={<IconPencil />}
                                                            >
                                                                Oʻzgartirish
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
                                                <Skeleton variant="text" animation="wave" width="70%" />
                                            </Grid>
                                            <Grid item container direction="column" spacing={1} my={5} md={6}>
                                                <Grid item my={1}>
                                                    <Skeleton variant="rectangular" animation="wave" height="40px" />
                                                </Grid>

                                                <Grid item my={1}>
                                                    <Skeleton variant="rectangular" animation="wave" height="40px" />
                                                </Grid>
                                                <Grid
                                                    item
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <Skeleton variant="rectangular" animation="wave" height="30px" width="60px" />
                                                    <Skeleton variant="rectangular" animation="wave" height="30px" width="60px" />
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

export default OrderEdit;
