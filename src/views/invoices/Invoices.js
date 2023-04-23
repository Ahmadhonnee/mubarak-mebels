import {
    Card,
    CardMedia,
    Chip,
    Grid,
    Pagination,
    Stack,
    Table,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
    CardActionArea,
    CardContent,
    CardActions,
    Dialog,
    DialogContent,
    Button,
    Typography,
    Skeleton,
    Zoom,
    Slide,
    IconButton,
} from '@mui/material';
import MuiTypography from '@mui/material/Typography';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { axiosInstance } from 'services';
import { GET_INVOICES } from 'store/actions';
import { useState } from 'react';
import { AlertUser, FormikInput, Invoice, RouteBtn } from 'custom-components';
import * as yup from 'yup';

// icons
import { IconChevronLeft, IconCircleX, IconPencil } from '@tabler/icons';
import { Form, Formik } from 'formik';
import { forwardRef } from 'react';
import { getDate } from 'hooks';

// ==============================|| INVOICES ROLL ||============================== //

const Invoices = () => {
    const dispatch = useDispatch();

    const invoices = useSelector((state) => state.invoices);
    const [isLoading, setLoading] = useState({ open: false, message: '', for: 'loading' });
    const [pagination, setPagination] = useState({ currentPage: 1, allPages: 1 });
    const [statusSnackbar, setStatusSnack] = useState({ open: false, message: '', type: 'error' });
    const [isDialogsOpen, setDialogs] = useState({ editingUserDialog: false, editingOrderDialog: false });
    const [editingUser, setEditingUser] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);

    function getClientsList() {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const data = await axiosInstance.get('customers');
                dispatch({ type: GET_INVOICES, invoices: data.data });
                data?.data && handleSnackStatusClose();
                setPagination({ ...pagination, allPages: data.data.pagination.last_page });
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
    }

    useEffect(() => {
        getClientsList();
    }, []);

    const handlePaginationChange = (event, value) => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const data = await axiosInstance.get(`users?page=${value}`);
                dispatch({ type: GET_INVOICES, invoices: data.data });
                data?.data && handleSnackStatusClose();
            } catch (err) {
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
                setPagination({ ...pagination, currentPage: value });
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

    // Edit User Dialog funcs
    const handleEditUserDialogOpen = ({ id }) => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const data = await axiosInstance.get(`/customers/${id}`);
                console.log(data);
                setEditingUser(data.data.data);
                data?.data && handleSnackStatusClose();
            } catch (err) {
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
                setDialogs({ ...isDialogsOpen, editingUserDialog: true });
            }
        })();
    };

    // Edit Order Dialog funcs
    const handleEditOrderDialogOpen = (orderId) => {
        handleSnackLoadingOpen();

        (async () => {
            try {
                const data = await axiosInstance.get(`orders/${orderId}`);
                console.log(data);
                setEditingOrder(data.data.data);
                data?.data && handleSnackStatusClose();
            } catch (err) {
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
                setDialogs({ ...isDialogsOpen, editingOrderDialog: true });
            }
        })();
    };

    // Edit user func
    const handleUserEditFormSubmit = (userData) => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                await axiosInstance.put(`/customers/${editingUser?.id}`, userData);
                setDialogs({ ...isDialogsOpen, editingUserDialog: false });
                getClientsList();
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

    // Edit order func
    const handleOrderEditFormSubmit = (orderData) => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                await axiosInstance.put(`/orders/${editingOrder?.id}`, orderData);
                setDialogs({ ...isDialogsOpen, editingOrderDialog: false });
                getClientsList();
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

    const yupValidateSchemaOfEditingUser = yup.object().shape({
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

    const yupValidateSchemaOfEditingOrder = yup.object().shape({
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

    return (
        <>
            <AlertUser onClose={handleSnackLoadingClose} loading={isLoading} />
            <AlertUser alertInfo={statusSnackbar} onClose={handleSnackStatusClose} />

            {/* Edit user Dialog */}
            <Dialog
                open={isDialogsOpen.editingUserDialog}
                onClose={() => {
                    setDialogs({ ...isDialogsOpen, editingUserDialog: false });
                }}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogContent>
                    <Card>
                        <CardContent>
                            {editingUser ? (
                                <Formik
                                    initialValues={{
                                        name: editingUser?.name,
                                        phone: editingUser?.phone,
                                    }}
                                    validationSchema={yupValidateSchemaOfEditingUser}
                                    validateOnChange
                                    onSubmit={handleUserEditFormSubmit}
                                >
                                    <Form>
                                        <Grid container justifyContent="center">
                                            <Grid item container spacing={4} direction="column">
                                                <Grid item>
                                                    <Typography color="darkblue" variant="h2">
                                                        "{editingUser?.name}"ni ozgartirish
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
                                                                setDialogs({ ...isDialogsOpen, editingUserDialog: false });
                                                            }}
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
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
                                                            size="small"
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
                                                        height: '400px',
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
                </DialogContent>
            </Dialog>

            {/* Edit Order Dialog */}
            <Dialog
                open={isDialogsOpen.editingOrderDialog}
                onClose={() => {
                    setDialogs({ ...isDialogsOpen, editingOrderDialog: false });
                }}
                aria-describedby="alert-dialog-slide-description"
                maxWidth="lg"
            >
                <DialogContent>
                    <Card>
                        <CardContent>
                            {editingOrder ? (
                                <Formik
                                    initialValues={{
                                        product_name: editingOrder?.product_name,
                                        ordered_at: getDate(editingOrder?.ordered_at),
                                        price: editingOrder?.price,
                                        editingUsersold_amount: editingOrder?.editingUsersold_amount,
                                        remaining_amount: editingOrder?.remaining_amount,
                                        returned_amount: editingOrder?.returned_amount,
                                        total_debt: editingOrder?.total_debt,
                                    }}
                                    validationSchema={yupValidateSchemaOfEditingOrder}
                                    validateOnChange
                                    onSubmit={handleOrderEditFormSubmit}
                                >
                                    <Form>
                                        <Grid container justifyContent="center">
                                            <Grid item container spacing={0} direction="column">
                                                <Grid item container spacing={0.5} direction="row">
                                                    <Grid item xs={1.5}>
                                                        <FormikInput size="small" name="product_name" inputText="Mahsulot nomi" />
                                                    </Grid>
                                                    <Grid item xs={1.5}>
                                                        <FormikInput size="small" name="ordered_at" inputText="Sana" />
                                                    </Grid>
                                                    <Grid item xs={1.5}>
                                                        <FormikInput size="small" name="price" inputText="Narxi" />
                                                    </Grid>
                                                    <Grid item xs={1.5}>
                                                        <FormikInput size="small" name="sold_amount" inputText="Sotilgan" />
                                                    </Grid>
                                                    <Grid item xs={1.5}>
                                                        <FormikInput size="small" name="remaining_amount" inputText="Qolgan" />
                                                    </Grid>
                                                    <Grid item xs={1.5}>
                                                        <FormikInput size="small" name="returned_amount" inputText="Qaytarilgan" />
                                                    </Grid>
                                                    <Grid item xs={1.5}>
                                                        <FormikInput size="small" name="total_debt" inputText="Qarz" />
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        <IconButton onClick={() => {}} variant="contained" color="info" size="small">
                                                            <IconPencil />
                                                        </IconButton>
                                                    </Grid>
                                                </Grid>
                                                {/* <Grid item container justifyContent="space-between">
                                                    <Grid item>
                                                        <Button
                                                            onClick={() => {
                                                                setDialogs({ ...isDialogsOpen, editingOrderDialog: false });
                                                            }}
                                                            variant="contained"
                                                            color="error"
                                                            size="small"
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
                                                            size="small"
                                                            startIcon={<IconPencil />}
                                                        >
                                                            Oʻzgartirish
                                                        </Button>
                                                    </Grid>
                                                </Grid> */}
                                            </Grid>
                                        </Grid>
                                    </Form>
                                </Formik>
                            ) : (
                                <Grid container justifyContent="center">
                                    {/* <Grid item container spacing={4} direction="column" my={5} md={6}>
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
                                    </Grid> */}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </DialogContent>
            </Dialog>

            <MainCard
                border={false}
                title="Mijozlar"
                secondary={<SecondaryAction link="https://next.material-ui.com/system/typography/" />}
            >
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
                                            Boshqaruv paneliga
                                        </RouteBtn>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item>
                        <Card
                            sx={{
                                bgcolor: '#F9FAFE',
                            }}
                        >
                            <CardMedia>
                                <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell></TableCell>
                                                <TableCell>Ism</TableCell>
                                                <TableCell align="right">Qarz</TableCell>
                                                <TableCell align="right">Ostatka</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {!invoices?.data ? (
                                                <Invoice loading={true} amount={5} />
                                            ) : (
                                                invoices?.data?.map((invoice) => (
                                                    <Invoice
                                                        key={invoice?.id}
                                                        invoice={invoice}
                                                        to={`/invocies/clients-list/${invoice?.id}`}
                                                        handleSnackLoadingClose={handleSnackLoadingClose}
                                                        handleSnackLoadingOpen={handleSnackLoadingOpen}
                                                        handleSnackStatusOpen={handleSnackStatusOpen}
                                                        handleEditUserDialogOpen={handleEditUserDialogOpen}
                                                        handleEditOrderDialogOpen={handleEditOrderDialogOpen}
                                                    />
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardMedia>
                            <CardActions>
                                {pagination.allPages !== 1 ? (
                                    <Grid
                                        item
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            width: '100%',
                                        }}
                                    >
                                        <Pagination
                                            disabled={isLoading?.open}
                                            count={pagination.allPages}
                                            page={pagination.currentPage}
                                            onChange={handlePaginationChange}
                                        />
                                    </Grid>
                                ) : null}
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default Invoices;
