import { Box, ButtonGroup, Card, CardContent, Grid, Skeleton, Stack, Typography } from '@mui/material';
import MainCard from 'ui-component/cards/MainCard';

// icons
import {
    IconTruckDelivery,
    IconFilePencil,
    IconChevronLeft,
    IconTrash,
    IconReceiptRefund,
    IconBrandTelegram,
    IconFilePlus,
    IconUserSearch,
} from '@tabler/icons';
import { AlertUser, RouteBtn } from 'custom-components';
import { useNavigate, useParams } from 'react-router';
import { useTheme } from '@emotion/react';
import { useState } from 'react';
import { useEffect } from 'react';
import { getDate } from 'hooks';
import { axiosInstance } from 'services';

const OrderDetail = () => {
    const navigate = useNavigate();
    const { id, orderID } = useParams();
    const theme = useTheme();

    const [isLoading, setLoading] = useState({ open: false, message: '', for: 'loading' });
    const [currentOrder, setOrder] = useState(null);
    const [statusSnackbar, setStatusSnack] = useState({ open: false, message: '', type: 'error' });
    const [confirmSend, setConfirmSend] = useState({ open: false, message: '', type: 'action' });

    useEffect(() => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const orderData = await axiosInstance.get(`orders/${orderID}`);
                setOrder(orderData.data.data);
                console.log(orderData.data.data);
                orderData && handleSnackStatusClose();
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

    return (
        <>
            <AlertUser alertInfo={statusSnackbar} onClose={handleSnackStatusClose} />
            <AlertUser onClose={handleSnackLoadingClose} loading={isLoading} />

            <MainCard title="Buyurtmani boshqarish">
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
                                            {currentOrder ? (
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
                                            {currentOrder ? (
                                                <ButtonGroup variant="contained">
                                                    <RouteBtn
                                                        to={`/invoices/clients-list/${id}/mark-paid/${orderID}`}
                                                        variant="contained"
                                                        color="success"
                                                        startIcon={<IconReceiptRefund />}
                                                    >
                                                        Toʻlash
                                                    </RouteBtn>
                                                    <RouteBtn
                                                        to={`/invoices/clients-list/${id}/add-to-order/${orderID}`}
                                                        variant="contained"
                                                        color="info"
                                                        startIcon={<IconFilePlus />}
                                                    >
                                                        Qoʻshish
                                                    </RouteBtn>
                                                </ButtonGroup>
                                            ) : (
                                                <Skeleton
                                                    sx={{ bgcolor: 'grrey.900' }}
                                                    variant="contained"
                                                    animation="wave"
                                                    width={120}
                                                    height={36}
                                                />
                                            )}
                                        </Grid>

                                        <Grid item>
                                            {currentOrder ? (
                                                <RouteBtn
                                                    to={`/invoices/clients-list/${id}`}
                                                    variant="contained"
                                                    color="info"
                                                    startIcon={<IconUserSearch />}
                                                >
                                                    Mijozni koʻrish
                                                </RouteBtn>
                                            ) : (
                                                <Skeleton
                                                    sx={{ bgcolor: 'grrey.900' }}
                                                    variant="contained"
                                                    animation="wave"
                                                    width={130}
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
                        {currentOrder ? (
                            <Card
                                raised
                                sx={{
                                    bgcolor: '#e3f2fd',
                                    boxShadow: 1,
                                }}
                            >
                                <CardContent>
                                    <Grid container direction="column">
                                        <Grid item>
                                            <Card
                                                sx={{
                                                    bgcolor: '#e3f2fd',
                                                }}
                                            >
                                                <CardContent>
                                                    <Grid container spacing={2} direction="column">
                                                        <Grid item>
                                                            <Stack spacing={2} direction="row" alignItems="baseline">
                                                                <Grid container spacing={1} direction="column">
                                                                    <Grid item>
                                                                        <Typography component="span" variant="body2">
                                                                            Mahsulot nomi
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: '1.6rem',
                                                                                fontWeight: 600,
                                                                                color: theme.palette.dark[800],
                                                                            }}
                                                                        >
                                                                            {currentOrder?.product_name}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid container spacing={1} direction="column">
                                                                    <Grid item>
                                                                        <Typography component="span" variant="body2">
                                                                            Narxi
                                                                        </Typography>
                                                                        <Typography
                                                                            sx={{
                                                                                fontSize: '1.6rem',
                                                                                fontWeight: 600,
                                                                                color: theme.palette.dark[800],
                                                                                display: 'flex',
                                                                                alignItems: 'center',
                                                                                gap: 1,
                                                                            }}
                                                                        >
                                                                            ${currentOrder?.price}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item>
                                                            <Stack spacing={2} direction="row" alignItems="baseline">
                                                                <Grid item container spacing={1} direction="column">
                                                                    <Grid item>
                                                                        <Typography component="span" variant="body2">
                                                                            Buyurtma sanasi
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography
                                                                            component="span"
                                                                            variant="subtitle1"
                                                                            sx={{
                                                                                fontSize: '1.6rem',
                                                                                fontWeight: 600,
                                                                                color: theme.palette.dark[800],
                                                                            }}
                                                                        >
                                                                            {getDate(currentOrder?.created_at)}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item container spacing={1} direction="column">
                                                                    <Grid item>
                                                                        <Typography component="span" variant="body2">
                                                                            Oxirgi buyurtma
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography
                                                                            component="span"
                                                                            variant="subtitle1"
                                                                            sx={{
                                                                                fontSize: '1.6rem',
                                                                                fontWeight: 600,
                                                                                color: theme.palette.dark[800],
                                                                            }}
                                                                        >
                                                                            {getDate(currentOrder?.updated_at)}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Stack>
                                                        </Grid>
                                                        <Grid item>
                                                            <Stack spacing={2} direction="row" alignItems="baseline">
                                                                <Grid item container spacing={1} direction="column">
                                                                    <Grid item>
                                                                        <Typography component="span" variant="body2">
                                                                            Qolgan miqdor
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography
                                                                            component="span"
                                                                            variant="subtitle1"
                                                                            sx={{
                                                                                fontSize: '1.6rem',
                                                                                fontWeight: 600,
                                                                                color: theme.palette.dark[800],
                                                                            }}
                                                                        >
                                                                            {currentOrder?.remainder_amount}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                                <Grid item container spacing={1} direction="column">
                                                                    <Grid item>
                                                                        <Typography component="span" variant="body2">
                                                                            Sotilgan miqdor
                                                                        </Typography>
                                                                    </Grid>
                                                                    <Grid item>
                                                                        <Typography
                                                                            component="span"
                                                                            variant="subtitle1"
                                                                            sx={{
                                                                                fontSize: '1.6rem',
                                                                                fontWeight: 600,
                                                                                color: theme.palette.dark[800],
                                                                            }}
                                                                        >
                                                                            {currentOrder?.sold_amount}
                                                                        </Typography>
                                                                    </Grid>
                                                                </Grid>
                                                            </Stack>
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                        <Grid item>
                                            <Card sx={{ bgcolor: '#5e35b1', borderTopRightRadius: 0, borderTopLeftRadius: 0 }}>
                                                <CardContent
                                                    sx={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <Typography
                                                        sx={{
                                                            fontSize: '1rem',
                                                            fontWeight: 400,
                                                            color: '#7E88C3',
                                                        }}
                                                    >
                                                        Qarz
                                                    </Typography>
                                                    <Typography
                                                        component="div"
                                                        sx={{
                                                            fontSize: '3rem',
                                                            color: '#FFFFFF',
                                                            display: 'flex',
                                                            alignItems: 'baseline',
                                                        }}
                                                    >
                                                        <Typography
                                                            component="span"
                                                            sx={{
                                                                fontSize: '1.5rem',
                                                            }}
                                                        >
                                                            $
                                                        </Typography>
                                                        {currentOrder?.debt}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card
                                raised
                                sx={{
                                    bgcolor: '#e3f2fd',
                                    boxShadow: 1,
                                }}
                            >
                                <CardContent>
                                    <Skeleton component="p" height={30} animation="wave" variant="rounded" />
                                    <Box width="100%" height="10px" />
                                    <Skeleton component="p" height={30} animation="wave" variant="rounded" />
                                    <Box width="100%" height="30px" />

                                    <Skeleton sx={{ display: 'block', height: 100 }} animation="wave" variant="rounded" />
                                </CardContent>
                            </Card>
                        )}
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default OrderDetail;
