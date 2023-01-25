import {
    Alert,
    Box,
    Button,
    Card,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Pagination,
    Paper,
    Skeleton,
    Snackbar,
    SpeedDial,
    SpeedDialAction,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    useTheme,
} from '@mui/material';
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { axiosInstance } from 'services';

// icons
import {
    IconTruckDelivery,
    IconChevronLeft,
    IconTrash,
    IconReceiptRefund,
    IconBrandTelegram,
    IconPencil,
    IconCirclePlus,
    IconPlaylistAdd,
} from '@tabler/icons';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import MainCard from 'ui-component/cards/MainCard';
import { getDate } from 'hooks';
import { AlertUser, RouteBtn } from 'custom-components';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';

const InvoiceDetail = () => {
    const navigate = useNavigate();
    const { id, orderID } = useParams();
    const theme = useTheme();

    const [isLoading, setLoading] = useState({ open: false, message: '', for: 'loading' });
    const [currentInvocie, setInvoice] = useState(null);
    const [currentInvocieOrders, setInvoiceOrders] = useState(null);
    const [statusSnackbar, setStatusSnack] = useState({ open: false, message: '', type: 'error' });
    const [confirmSend, setConfirmSend] = useState({ open: false, message: '', type: 'action' });
    const [pagination, setPagination] = useState({ currentPage: 1, allPages: 1 });

    console.log('lll');
    useEffect(() => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const invoiceData = await axiosInstance.get(`users/${id}`);
                const ordersData = await axiosInstance.get(`users/${id}/orders`);
                setInvoice(invoiceData.data.data);
                setInvoiceOrders(ordersData.data.data);
                setPagination({ ...pagination, allPages: ordersData.data.pagination.last_page });
                invoiceData && handleSnackStatusClose();
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

    const handleOrderRowClick = (invoiceID, rowID) => {
        navigate(`/invoices/clients-list/${invoiceID}/mark-paid/${rowID}`);
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

    const handleSendInvoicesBtn = () => {
        const orders = String(
            `  Assalomu alaykum ${currentInvocie?.name}! Sizga shuni 
            xabar bermoqchimizki singing "Muborak Elegant Mebel" korxonasidan 
            ayni vaqtda barcha buyutmangiz jami $${currentInvocie?.total_debt} ga yetgan ! 
            Yaniy : ${currentInvocieOrders?.map(({ product_name, price, remainder_amount, debt }, index) => {
                return `${index + 1}) $${price} lik '${product_name}'dan - ${remainder_amount}ta ___ jami$${debt} `;
            })}. Shikoyat yoki Maslahat uchun ++998977646890 raqami siz uchun doim xozir ;)`
        );
        const chatID = '874523678';
        const token = '5828280243:AAGe_0ItcammTVlDXdWojxwckwdpkJLpMR0';
        const URL_Telegram = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatID}&text=${orders}`;

        (async () => {
            handleSnackLoadingOpen();
            try {
                await axios.post(URL_Telegram);
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
                handleConfirmSendClose();
                handleSnackLoadingClose();
            }
        })();
    };

    // Confirm Sending Invoice Snackbar
    const handleConfirmSendClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setConfirmSend({ open: false });
    };
    const handleConfirmSendOpen = () => {
        setConfirmSend({ open: true, message: 'Joriy hisobni yubormoqchimisiz?', type: 'action' });
    };

    const sendSnackContent = (
        <>
            <Button color="secondary" size="small" onClick={handleConfirmSendClose}>
                Bekor qilish
            </Button>
            <LoadingButton
                loading={isLoading?.open}
                onClick={handleSendInvoicesBtn}
                size="small"
                aria-label="close"
                color="inherit"
                startIcon={<IconBrandTelegram />}
            />
        </>
    );

    const handlePaginationChange = (event, value) => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const ordersData = await axiosInstance.get(`users/${id}/orders?page=${value}`);
                setInvoiceOrders(ordersData.data.data);
                ordersData?.data && handleSnackStatusClose();
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

    return (
        <>
            {/* Snackbars */}

            <AlertUser alertInfo={statusSnackbar} onClose={handleSnackStatusClose} />
            <AlertUser onClose={handleSnackLoadingClose} loading={isLoading} />
            <AlertUser alertInfo={confirmSend} onClose={handleConfirmSendClose} action={sendSnackContent} />

            <MainCard title="Buyurtmani boshqarish" secondary={<SecondaryAction link="https://next.material-ui.com/system/typography/" />}>
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
                                        {currentInvocie ? (
                                            <RouteBtn
                                                to={`/invoices/clients-list/${id}/add-order`}
                                                variant="contained"
                                                color="primary"
                                                startIcon={<IconTruckDelivery />}
                                            >
                                                Buyurtma qoʻshish
                                            </RouteBtn>
                                        ) : (
                                            <Skeleton
                                                sx={{ bgcolor: 'grrey.900' }}
                                                variant="contained"
                                                animation="wave"
                                                width={150}
                                                height={36}
                                            />
                                        )}

                                        <Grid item>
                                            {currentInvocie ? (
                                                <RouteBtn
                                                    to={`/pages/client/clients/${id}/edit`}
                                                    variant="contained"
                                                    color="primary"
                                                    startIcon={<IconPencil />}
                                                >
                                                    Mijozni oʻzgartirish
                                                </RouteBtn>
                                            ) : (
                                                <Skeleton
                                                    sx={{ bgcolor: 'grrey.900' }}
                                                    variant="contained"
                                                    animation="wave"
                                                    width={150}
                                                    height={36}
                                                />
                                            )}
                                        </Grid>

                                        <Grid item>
                                            {currentInvocie ? (
                                                <Button
                                                    onClick={handleConfirmSendOpen}
                                                    variant="contained"
                                                    color="info"
                                                    startIcon={<IconBrandTelegram />}
                                                >
                                                    Hisobni yuborish
                                                </Button>
                                            ) : (
                                                <Skeleton
                                                    sx={{ bgcolor: 'grrey.900' }}
                                                    variant="contained"
                                                    animation="wave"
                                                    width={150}
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
                        {currentInvocie ? (
                            <Card
                                raised
                                sx={{
                                    bgcolor: '#e3f2fd',
                                    boxShadow: 1,
                                }}
                            >
                                <CardContent>
                                    <Grid container spacing={2} direction="column">
                                        <Grid item>
                                            <Stack spacing={2} direction="row" alignItems="baseline">
                                                <Grid container spacing={1} direction="column">
                                                    <Grid item>
                                                        <Typography component="span" variant="body2">
                                                            Mijozni ID
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
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
                                                            <Typography
                                                                component="span"
                                                                sx={{
                                                                    color: '#888EB0',
                                                                    fontSize: '1.7rem',
                                                                }}
                                                            >
                                                                #
                                                            </Typography>
                                                            {currentInvocie?.id}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container spacing={1} direction="column">
                                                    <Grid item>
                                                        <Typography component="span" variant="body2">
                                                            Mijozni Ismi
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
                                                            {currentInvocie?.name}
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
                                                            Hisob Sanasi
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography
                                                            component="span"
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontSize: '20px',
                                                            }}
                                                        >
                                                            {new Date(currentInvocie?.created_at).toDateString()}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container spacing={1} direction="column">
                                                    <Grid item>
                                                        <Typography component="span" variant="body2">
                                                            Mijoz Raqami
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item>
                                                        <Typography
                                                            component="span"
                                                            variant="subtitle1"
                                                            sx={{
                                                                fontSize: '20px',
                                                            }}
                                                        >
                                                            {currentInvocie?.phone}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Stack>
                                        </Grid>
                                        <Grid item>
                                            <Grid>
                                                {currentInvocieOrders?.length ? (
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
                                                                            <TableCell>Mahsulotni Ismi</TableCell>
                                                                            <TableCell align="right">Sana</TableCell>
                                                                            <TableCell align="right">Narxi</TableCell>
                                                                            <TableCell align="right">Sotilgan</TableCell>
                                                                            <TableCell align="right">Qolgan</TableCell>
                                                                            <TableCell align="right">Qaytarilgan</TableCell>
                                                                            <TableCell align="right">Qarz</TableCell>
                                                                            <TableCell align="right">Qoʻshish</TableCell>
                                                                        </TableRow>
                                                                    </TableHead>
                                                                    <TableBody>
                                                                        {currentInvocieOrders?.map((order) => (
                                                                            <TableRow
                                                                                key={order?.id}
                                                                                onClick={(evt) => {
                                                                                    console.log();
                                                                                    if (
                                                                                        evt.target.className.includes('MuiButtonBase-root')
                                                                                    ) {
                                                                                        navigate(
                                                                                            `/invoices/clients-list/${id}/add-to-order/${order?.id}`
                                                                                        );
                                                                                        return;
                                                                                    }
                                                                                    handleOrderRowClick(order?.user_id, order?.id);
                                                                                }}
                                                                                hover
                                                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                                            >
                                                                                <TableCell component="th" scope="row">
                                                                                    {order.product_name}
                                                                                </TableCell>
                                                                                <TableCell align="right">
                                                                                    {getDate(order?.updated_at)}
                                                                                </TableCell>
                                                                                <TableCell align="right">${order.price}</TableCell>
                                                                                <TableCell align="right">{order.sold_amount}</TableCell>
                                                                                <TableCell align="right">
                                                                                    {order.remainder_amount}
                                                                                </TableCell>
                                                                                <TableCell align="right">{order.returned_amount}</TableCell>
                                                                                <TableCell align="right">${order.debt}</TableCell>
                                                                                <TableCell
                                                                                    align="center"
                                                                                    sx={{
                                                                                        '&:hover > svg': {
                                                                                            fill: '#F9FAFE',
                                                                                            color: '#5e35b1',
                                                                                        },
                                                                                    }}
                                                                                >
                                                                                    <IconButton id={order?.id}>
                                                                                        <IconCirclePlus
                                                                                            color="#5e35b1"
                                                                                            style={{ pointerEvents: 'none' }}
                                                                                        />
                                                                                    </IconButton>
                                                                                </TableCell>
                                                                            </TableRow>
                                                                        ))}
                                                                    </TableBody>
                                                                </Table>
                                                            </TableContainer>
                                                        </CardMedia>
                                                        <CardActions sx={{ padding: 1 }}>
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
                                                        </CardActions>
                                                    </Card>
                                                ) : null}
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
                                                            Umumiy qarz
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
                                                            {currentInvocie?.total_debt}
                                                        </Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
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

export default InvoiceDetail;
