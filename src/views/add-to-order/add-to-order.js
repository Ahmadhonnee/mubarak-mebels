// material-ui
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    Paper,
    Skeleton,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import { AlertUser, FormikInput, Input, RouteBtn } from 'custom-components';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { axiosInstance } from 'services';
import * as yup from 'yup';

// project imports
import MainCard from 'ui-component/cards/MainCard';

// Icons
import { Form, Formik } from 'formik';
import { getDate } from 'hooks';
import { IconReceiptOff, IconChevronLeft, IconCalculator, IconPlaylistAdd, IconTrash, IconPlaylistX, IconFilePencil } from '@tabler/icons';
import { LoadingButton } from '@mui/lab';

// ==============================|| Mark paid orders ||============================== //

const MarkPaid = () => {
    const navigate = useNavigate();
    const { id, orderID } = useParams();
    const [isLoading, setLoading] = useState({ open: false, message: '', for: 'loading' });
    const [statusSnackbar, setStatusSnack] = useState({ open: false, message: '', type: 'error' });
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [calculateOrder, setCalculate] = useState(null);
    const [isDeleteSnackbarOpened, setDeleteSnackbarOpen] = useState({ open: false, message: '', type: 'action' });
    console.log(editingOrder);
    useEffect(() => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const currentUsersOrder = await axiosInstance.get(`users/${id}/orders/${orderID}`);
                setEditingOrder(currentUsersOrder.data.data);
                setCalculate(currentUsersOrder.data.data);
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
    }, [id]);

    const yupValidateShchema = yup.object().shape({
        remained: yup
            .number()
            .typeError('*Raqam kiriging!')
            .required("*Bo'sh bo'lishi mumkin emas")
            .moreThan(-1, '*Musbat raqam kiriting')
            .lessThan(255, '*255 eng yuqori miqdor')
            .integer('*Butun son kiriging'),
        sold: yup
            .number()
            .typeError('*Raqam kiriging!')
            .required("*Bo'sh bo'lishi mumkin emas")
            .moreThan(-1, '*Musbat raqam kiriting')
            .lessThan(255, '*255 eng yuqori miqdor')
            .integer('*Butun son kiriging'),
        returned: yup
            .number()
            .typeError('*Raqam kiriging!')
            .required("*Bo'sh bo'lishi mumkin emas")
            .moreThan(-1, '*Musbat raqam kiriting')
            .lessThan(255, '*255 eng yuqori miqdor')
            .integer('*Butun son kiriging'),
        description: yup.string().typeError('*Matn kiriging!').min(2, '*2 dan ortiq belgi').max(100, '*100 ta belgidan kam'),
    });

    const handleOrdersCount = ({ sold, returned, remained, description }) => {
        const countedDebt = (editingOrder?.remainder_amount + remained) * editingOrder?.price;
        setCalculate({
            ...editingOrder,
            price: editingOrder?.price,
            sold_amount: editingOrder?.sold_amount + +sold,
            remainder_amount: editingOrder?.remainder_amount + +remained,
            returned_amount: editingOrder?.returned_amount + +returned,
            debt: countedDebt,
            description: description.trim(),
        });
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

    // Order Dialog funcs
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    const handleDialogSubmit = (evt) => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                await axiosInstance.put(`orders/${orderID}`, calculateOrder);
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

    // Delete Snackbar
    const handleDeleteSnackOpen = (message = 'Hisobni oʻchirib tashlamoqchimisiz?') => {
        setDeleteSnackbarOpen({ open: true, message, type: 'action' });
    };
    const handleDeleteSnackClose = (event, reason) => {
        setDeleteSnackbarOpen({ open: false });
    };

    // Delete order
    const handleInvoiceDelete = () => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                await axiosInstance.delete(`orders/${orderID}`);
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

    const snackbarContent = (
        <>
            <Button color="secondary" size="small" onClick={handleDeleteSnackClose}>
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
            <AlertUser alertInfo={statusSnackbar} onClose={handleSnackStatusClose} />
            <AlertUser onClose={handleSnackLoadingClose} loading={isLoading} />
            <AlertUser alertInfo={isDeleteSnackbarOpened} onClose={handleDeleteSnackClose} action={snackbarContent} />

            <Dialog open={isDialogOpen} keepMounted onClose={handleDialogClose} aria-describedby="alert-dialog-slide-description">
                <DialogContent>
                    <Card>
                        <CardContent>
                            <Grid container spacing={1} direction="column" minWidth="30vw">
                                <Grid item container direction="row" justifyContent="space-between">
                                    <Grid item>Mahsulotni Ismi:</Grid>
                                    <Grid item>
                                        <Typography variant="h4">{calculateOrder?.product_name}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container direction="row" justifyContent="space-between">
                                    <Grid item>Buyurtma sanasi:</Grid>
                                    <Grid item>
                                        <Typography variant="h4">{getDate(calculateOrder?.created_at)}</Typography>
                                    </Grid>
                                </Grid>

                                <Grid item container direction="row" justifyContent="space-between">
                                    <Grid item>Narxi:</Grid>
                                    <Grid item>
                                        <Typography variant="h4">${calculateOrder?.price}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container direction="row" justifyContent="space-between">
                                    <Grid item>Qaytgan:</Grid>
                                    <Grid item>
                                        <Typography variant="h4">{calculateOrder?.returned_amount}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container direction="row" justifyContent="space-between">
                                    <Grid item>Qolgan:</Grid>
                                    <Grid item>
                                        <Typography variant="h4">{calculateOrder?.remainder_amount}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container direction="row" justifyContent="space-between">
                                    <Grid item>Sotilgan:</Grid>
                                    <Grid item>
                                        <Typography variant="h4">{calculateOrder?.sold_amount}</Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container direction="row" justifyContent="space-between">
                                    <Grid item>Joriy qarz:</Grid>
                                    <Grid item>
                                        <Typography variant="h4">${calculateOrder?.debt}</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Yopish</Button>
                    <Button disabled={isLoading?.open} onClick={handleDialogSubmit}>
                        Qoʻshish
                    </Button>
                </DialogActions>
            </Dialog>

            <MainCard
                title={
                    editingOrder ? (
                        <Typography variant="h3">"{editingOrder?.product_name}"ga qoʻshish</Typography>
                    ) : (
                        <Skeleton variant="text" component="h4" animation="wave" width="50%" />
                    )
                }
            >
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Card
                            raised
                            sx={{
                                bgcolor: '#e3f2fd',
                                boxShadow: 1,
                            }}
                        >
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
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
                                            {editingOrder ? (
                                                <RouteBtn
                                                    to={`/invoices/orders-list/${id}&${orderID}/edit`}
                                                    variant="contained"
                                                    color="info"
                                                    startIcon={<IconFilePencil />}
                                                >
                                                    Buyurtmani Oʻzgartirish
                                                </RouteBtn>
                                            ) : (
                                                <Skeleton
                                                    sx={{ bgcolor: 'grrey.900' }}
                                                    variant="contained"
                                                    animation="wave"
                                                    width={200}
                                                    height={36}
                                                />
                                            )}
                                        </Grid>
                                        <Grid item>
                                            {editingOrder ? (
                                                <RouteBtn
                                                    to={`/invoices/clients-list/${id}/mark-paid/${orderID}`}
                                                    variant="contained"
                                                    color="info"
                                                    startIcon={<IconPlaylistX />}
                                                >
                                                    Arirish
                                                </RouteBtn>
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
                                        <Grid item>
                                            {editingOrder ? (
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
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Grid container spacing={2} direction="column">
                                    <Grid item>
                                        <Card
                                            sx={{
                                                bgcolor: '#F9FAFE',
                                                borderEndEndRadius: 0,
                                                borderEndStartRadius: 0,
                                            }}
                                        >
                                            <CardMedia>
                                                <TableContainer component={Paper}>
                                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell>Ismi</TableCell>
                                                                <TableCell align="right">Buyurtma sanasi</TableCell>
                                                                <TableCell align="right">Oxirgi buyurtma</TableCell>
                                                                <TableCell align="right">Narxi</TableCell>
                                                                <TableCell align="right">Qolgan</TableCell>
                                                                <TableCell align="right">Sotilgan</TableCell>
                                                                <TableCell align="right">Qaytgan</TableCell>
                                                                <TableCell align="right">Qarz</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {editingOrder ? (
                                                                <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    <TableCell component="th" scope="row">
                                                                        {editingOrder?.product_name}
                                                                    </TableCell>
                                                                    <TableCell align="right">{getDate(editingOrder?.created_at)}</TableCell>
                                                                    <TableCell align="right">{getDate(editingOrder?.updated_at)}</TableCell>
                                                                    <TableCell align="right">${editingOrder?.price}</TableCell>
                                                                    <TableCell align="right">{editingOrder?.remainder_amount}</TableCell>
                                                                    <TableCell align="right">{editingOrder?.sold_amount}</TableCell>
                                                                    <TableCell align="right">{editingOrder?.returned_amount}</TableCell>
                                                                    <TableCell align="right">${editingOrder?.debt}</TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    <TableCell component="th" scope="row">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardMedia>
                                        </Card>

                                        <Card
                                            sx={{
                                                bgcolor: '#e5eff6',
                                                borderRadius: 0,
                                            }}
                                        >
                                            <CardContent>
                                                {editingOrder ? (
                                                    <Formik
                                                        initialValues={{
                                                            remained: '0',
                                                            sold: '0',
                                                            returned: '0',
                                                            description: editingOrder?.description || '',
                                                        }}
                                                        validationSchema={yupValidateShchema}
                                                        onSubmit={handleOrdersCount}
                                                        validateOnChange
                                                    >
                                                        <Form>
                                                            <Grid container direction="column" spacing={1}>
                                                                <Grid item mt={1}>
                                                                    <Typography>Qoʻlgan mahsulot miqdori</Typography>
                                                                    <FormikInput
                                                                        inputProps={{ autoComplete: 'off' }}
                                                                        name="remained"
                                                                        inputText="Mahsulot miqdorini kiriting"
                                                                    />
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography>Sotilgan mahsulot miqdori</Typography>
                                                                    <FormikInput
                                                                        inputProps={{ autoComplete: 'off' }}
                                                                        name="sold"
                                                                        inputText="Mahsulot miqdorini kiriting"
                                                                    />
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography>Qaytgan mahsulot miqdori</Typography>
                                                                    <FormikInput
                                                                        inputProps={{ autoComplete: 'off' }}
                                                                        name="returned"
                                                                        inputText="Mahsulot miqdorini kiriting"
                                                                    />
                                                                </Grid>
                                                                <Grid item>
                                                                    <Typography>Buyurtma tavsifi</Typography>
                                                                    <FormikInput name="description" inputText="Tavsifi" />
                                                                </Grid>
                                                                <Grid
                                                                    item
                                                                    sx={{
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'space-between',
                                                                    }}
                                                                >
                                                                    <Button
                                                                        type="submit"
                                                                        variant="contained"
                                                                        color="info"
                                                                        startIcon={<IconCalculator />}
                                                                    >
                                                                        Hisoblash
                                                                    </Button>
                                                                    <Button
                                                                        onClick={handleDialogOpen}
                                                                        variant="contained"
                                                                        color="success"
                                                                        startIcon={<IconPlaylistAdd />}
                                                                    >
                                                                        Qoʻshish
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Form>
                                                    </Formik>
                                                ) : (
                                                    <Grid container direction="column" spacing={2}>
                                                        <Grid item mt={1}>
                                                            <Skeleton variant="rounded" width={'100%'} height={60} animation="wave" />
                                                        </Grid>
                                                        <Grid item>
                                                            <Skeleton variant="rounded" width={'100%'} height={60} animation="wave" />
                                                        </Grid>
                                                        <Grid item>
                                                            <Skeleton variant="rounded" width={'100%'} height={60} animation="wave" />
                                                        </Grid>
                                                        <Grid item>
                                                            <Skeleton variant="rounded" width={'100%'} height={60} animation="wave" />
                                                        </Grid>
                                                        <Grid
                                                            item
                                                            sx={{
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'space-between',
                                                            }}
                                                        >
                                                            <Skeleton variant="rounded" width={'10%'} height={40} animation="wave" />
                                                            <Skeleton variant="rounded" width={'10%'} height={40} animation="wave" />
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </CardContent>
                                        </Card>

                                        <Card
                                            sx={{
                                                bgcolor: '#F9FAFE',
                                                borderStartEndRadius: 0,
                                                borderStartStartRadius: 0,
                                            }}
                                        >
                                            <CardMedia>
                                                <TableContainer component={Paper}>
                                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <TableCell align="right">Narxi</TableCell>
                                                                <TableCell align="right">Qolgan</TableCell>
                                                                <TableCell align="right">Sotilgan </TableCell>
                                                                <TableCell align="right">Qaytgan</TableCell>
                                                                <TableCell align="right">Qarz</TableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {calculateOrder ? (
                                                                <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    <TableCell align="right">${calculateOrder?.price}</TableCell>
                                                                    <TableCell align="right">{calculateOrder?.remainder_amount}</TableCell>
                                                                    <TableCell align="right">{calculateOrder?.sold_amount}</TableCell>
                                                                    <TableCell align="right">{calculateOrder?.returned_amount}</TableCell>
                                                                    <TableCell align="right">${calculateOrder?.debt}</TableCell>
                                                                </TableRow>
                                                            ) : (
                                                                <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                    <TableCell component="th" scope="row">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                    <TableCell align="right">
                                                                        <Skeleton variant="span" animation="wave" />
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>
                                                    </Table>
                                                </TableContainer>
                                            </CardMedia>
                                        </Card>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default MarkPaid;
