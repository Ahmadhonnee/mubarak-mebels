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
import { AlertUser, Invoice, RouteBtn } from 'custom-components';

// icons
import { IconChevronLeft } from '@tabler/icons';

// ==============================|| INVOICES ROLL ||============================== //

const Invoices = () => {
    const dispatch = useDispatch();

    const invoices = useSelector((state) => state.invoices);
    const [isLoading, setLoading] = useState({ open: false, message: '', for: 'loading' });
    const [pagination, setPagination] = useState({ currentPage: 1, allPages: 1 });
    const [statusSnackbar, setStatusSnack] = useState({ open: false, message: '', type: 'error' });

    useEffect(() => {
        handleSnackLoadingOpen();
        (async () => {
            try {
                const data = await axiosInstance.get('users');
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

    return (
        <>
            <AlertUser onClose={handleSnackLoadingClose} loading={isLoading} />
            <AlertUser alertInfo={statusSnackbar} onClose={handleSnackStatusClose} />

            <MainCard title="Mijozlar" secondary={<SecondaryAction link="https://next.material-ui.com/system/typography/" />}>
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
                                                <TableCell>ID</TableCell>
                                                <TableCell align="right">Ism</TableCell>
                                                <TableCell align="right">Qarz</TableCell>
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
                                                    />
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardMedia>
                            <CardActions>
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
                    </Grid>
                </Grid>
            </MainCard>
        </>
    );
};

export default Invoices;
