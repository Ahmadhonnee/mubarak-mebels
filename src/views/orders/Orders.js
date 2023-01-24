import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import { AlertUser, Order, RouteBtn } from 'custom-components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { axiosInstance } from 'services';
import { GET_ORDERS } from 'store/actions';
import MainCard from 'ui-component/cards/MainCard';
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';
import { useState } from 'react';

// icons
import { IconRefresh, IconChevronLeft } from '@tabler/icons';

const Orders = () => {
    const dispatch = useDispatch();
    const orders = useSelector((state) => state.orders);
    const [isLoading, setLoading] = useState({ open: false, message: '', for: 'loading' });
    const [statusSnackbar, setStatusSnack] = useState({ open: false, message: '', type: 'error' });

    useEffect(() => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const data = await axiosInstance.get('orders');
                data?.data && handleSnackStatusClose();
                dispatch({ type: GET_ORDERS, orders: data.data });
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
            <AlertUser onClose={handleSnackLoadingClose} loading={isLoading} />
            <AlertUser alertInfo={statusSnackbar} onClose={handleSnackStatusClose} />

            <MainCard title="Buyurtmalar roʻyxati" secondary={<SecondaryAction link="https://next.material-ui.com/system/typography/" />}>
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
                                                <TableCell>Buyurtma nomi</TableCell>
                                                <TableCell align="right">Narxi</TableCell>
                                                <TableCell align="right">Buyurtma sanasi</TableCell>
                                                <TableCell align="right">Oxirgi buyurtma</TableCell>
                                                <TableCell align="right">Qolgan miqdor</TableCell>
                                                <TableCell align="right">Sotilgan miqdor</TableCell>
                                                <TableCell align="right">Qaytgan miqdor</TableCell>
                                                <TableCell align="right">Qarz</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {!orders?.data ? (
                                                <Order loading={true} amount={5} />
                                            ) : (
                                                orders?.data?.map((order) => (
                                                    <Order
                                                        key={order?.id}
                                                        order={order}
                                                        to={`/invoices/orders-list/${order?.user_id}&${order?.id}`}
                                                    />
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardMedia>
                        </Card>
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default Orders;
