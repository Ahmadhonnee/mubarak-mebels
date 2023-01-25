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
    IconArrowForwardUp,
} from '@tabler/icons';
import { LoadingButton } from '@mui/lab';

const InvoiceAddOrder = () => {
    const navigate = useNavigate();
    const { id, orderID } = useParams();
    const [isLoading, setLoading] = useState({ open: false, message: '', for: 'loading' });
    const [statusSnackbar, setStatusSnack] = useState({ open: false, message: '', type: 'error' });
    const [redirectOrder, setRedirectOrder] = useState({ open: false, message: '', type: 'action' });
    const [redirectID, setRedirectID] = useState(null);

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
            .typeError('*Matn kiriging')
            .required("*Bo'sh bo'lishi mumkin emas")
            .min(2, '*2 dan ortiq belgi')
            .max(30, '*30 ta belgidan kam'),
        price: yup.number().typeError('*Raqam kiriting').required("*Bo'sh bo'lishi mumkin emas").moreThan(-1, '*Musbat raqam kiriting'),
        remainder_amount: yup
            .number()
            .typeError('*Raqam kiriting')
            .required("*Bo'sh bo'lishi mumkin emas")
            .lessThan(255, '*255 eng yuqori miqdor')
            .moreThan(-1, '*Musbat raqam kiriting'),
        description: yup
            .string()
            .typeError('*Matn kiriging')
            .required("*Bo'sh bo'lishi mumkin emas")
            .min(2, '*2 dan ortiq belgi')
            .max(100, '*100 ta belgidan kam'),
    });

    const handleNewOrderCreate = ({ product_name, price, remainder_amount, description }) => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                await axiosInstance.post('orders', {
                    product_name,
                    price: +price,
                    user_id: +id,
                    remainder_amount: +remainder_amount,
                    sold_amount: 0,
                    returned_amount: 0,
                    description: description.trim(),
                });
                navigate(-1);
            } catch (err) {
                console.log(err);
                if (err.response.data.errors.unique_product[0] && err.response.data.errors?.unique_product[0]) {
                    handleRedirectOpen(err.response.data.errors.unique_product[0].message);
                    setRedirectID(err.response.data.errors.unique_product[0].order_id);
                    return;
                }

                switch (err.code) {
                    case 'ERR_NETWORK':
                        handleSnackStatusOpen('Tarmoq xatosi');
                        return;
                    case 'ERR_BAD_REQUEST':
                        handleSnackStatusOpen('404 holat kodi bilan so‘rov bajarilmadi');
                        return;
                    case 'ERR_BAD_RESPONSE':
                        handleSnackStatusOpen('500 holat kodi bilan so‘rov bajarilmadi');
                }

                if (err.response.data.errors && !Object.keys(err.response.data.errors).length) {
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

    // Redirect Snack
    const handleRedirectClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setRedirectOrder({ open: false });
    };
    const handleRedirectOpen = (message = 'Such order exists') => {
        setRedirectOrder({ open: true, message, type: 'action' });
    };

    const sendSnackContent = (
        <>
            <Button disabled={isLoading?.open} color="secondary" size="small" onClick={handleRedirectClose}>
                Bekor qilish
            </Button>
            <LoadingButton
                loading={isLoading?.open}
                onClick={() => {
                    navigate(`/invoices/clients-list/${id}/add-to-order/${redirectID}`);
                }}
                size="small"
                aria-label="close"
                color="secondary"
                startIcon={<IconArrowForwardUp />}
            />
        </>
    );

    return (
        <>
            {/* Snackbars */}

            <AlertUser alertInfo={statusSnackbar} onClose={handleSnackStatusClose} />
            <AlertUser onClose={handleSnackLoadingClose} loading={isLoading} />
            <AlertUser alertInfo={redirectOrder} onClose={handleRedirectClose} action={sendSnackContent} />

            <MainCard title="Add order">
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
                                <Formik
                                    initialValues={{
                                        product_name: '',
                                        price: '',
                                        remainder_amount: '',
                                        description: '',
                                    }}
                                    validationSchema={yupValidateShchema}
                                    onSubmit={handleNewOrderCreate}
                                    validateOnChange
                                >
                                    <Form>
                                        <Grid container justifyContent="center">
                                            <Grid item container spacing={4} direction="column" my={5} md={7}>
                                                <Grid item>
                                                    <Typography variant="h2">Buyurtma qoʻshish</Typography>
                                                </Grid>
                                                <Grid item container direction="column" spacing={1} my={5} md={7}>
                                                    <Grid item mt={1}>
                                                        <Typography>Buyurtmani Ismi</Typography>
                                                        <FormikInput name="product_name" inputText="Mahsulot nomini kiriting" />
                                                    </Grid>

                                                    <Grid item>
                                                        <Typography>Buyurtmani Narxi</Typography>
                                                        <FormikInput
                                                            inputProps={{ autoComplete: 'off' }}
                                                            name="price"
                                                            inputText="Mahsulot narxini kiriting"
                                                            sx={{ color: 'red' }}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography>Buyurtma miqdori</Typography>
                                                        <FormikInput
                                                            name="remainder_amount"
                                                            inputText="Buyurtma miqdorini kiriting"
                                                            sx={9}
                                                            md={12}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography>Tavsif</Typography>
                                                        <FormikInput name="description" inputText="Tavsifini kiriting" />
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
                                                            onClick={() => {
                                                                navigate(`/invoices/clients-list/${id}`);
                                                            }}
                                                            variant="contained"
                                                            color="error"
                                                            startIcon={<IconCircleX />}
                                                        >
                                                            Bekor qilish
                                                        </Button>
                                                        <Button
                                                            disabled={isLoading?.open}
                                                            type="submit"
                                                            variant="contained"
                                                            color="info"
                                                            startIcon={<IconFilePlus />}
                                                        >
                                                            Qoʻshish
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

export default InvoiceAddOrder;
