import {
    Box,
    Button,
    Collapse,
    Grid,
    IconButton,
    Skeleton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
} from '@mui/material';
import { IconChevronDown, IconChevronUp, IconUsers } from '@tabler/icons';
import { OrderCell } from 'custom-components/order-cell';
import { Form, Formik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from 'services';

export const Invoice = ({
    invoice,
    loading,
    amount,
    to,
    handleSnackStatusOpen,
    handleSnackLoadingOpen,
    handleSnackLoadingClose,
    handleEditUserDialogOpen,
    handleEditOrderDialogOpen,
    ...props
}) => {
    const navigate = useNavigate();
    const [collapse, setCollapse] = useState(false);
    const [currentInvocieOrders, setInvoiceOrders] = useState(null);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [editingOrderId, setOrderEditing] = useState(false);

    const getInvoiceOrders = (event, id) => {
        if (collapse) {
            return;
        }
        handleSnackLoadingOpen();
        (async () => {
            try {
                const ordersData = await axiosInstance.get(`customers/${id}/orders`);
                setInvoiceOrders(ordersData.data.data);
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

                if (err.response?.data.errors && !Object.keys(err.response.data.errors).length) {
                    handleSnackStatusOpen(err.response.data.message);
                    return;
                }

                if (err.response?.data.errors && Object.keys(err.response.data.errors).length) {
                    const errors = Object.values(err.response.data.errors).map((err, index) => `${index + 1}) ${err} `);
                    handleSnackStatusOpen(errors);
                    return;
                }
            } finally {
                handleSnackLoadingClose();
            }
        })();
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    // Editing order

    if (loading) {
        return (
            <>
                {[...Array(amount).keys()].map((item) => (
                    <TableRow key={item} {...props} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell padding="checkbox">
                            <Skeleton variant="span" animation="wave" />
                        </TableCell>
                        <TableCell component="th">
                            <Skeleton variant="span" animation="wave" />
                        </TableCell>
                        <TableCell align="right">
                            <Skeleton variant="span" animation="wave" />
                        </TableCell>
                        <TableCell align="right">
                            <Skeleton variant="span" animation="wave" />
                        </TableCell>
                    </TableRow>
                ))}
            </>
        );
    }

    return (
        <>
            <Tooltip title={`${invoice.name} da  ${invoice.orders_count} - buyurtma bor `} arrow placement="top-start">
                <TableRow
                    onClick={(evt) => {
                        getInvoiceOrders(evt, invoice?.id);
                        setCollapse(!collapse);
                    }}
                    hover
                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, bgcolor: `${collapse ? '#f5f5f5' : ''}` }}
                >
                    <TableCell padding="checkbox">
                        <IconButton disabled aria-label="expand" size="small">
                            {collapse ? <IconChevronUp /> : <IconChevronDown />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th">{invoice?.name}</TableCell>
                    <TableCell align="right">${invoice?.total_debt}</TableCell>
                    <TableCell align="right">${invoice.total_products_price}</TableCell>
                </TableRow>
            </Tooltip>

            <TableRow bgcolor="#e3f2fd">
                <TableCell scope="row" colSpan={12} sx={{ p: 0 }}>
                    <Collapse in={collapse} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Grid container justifyContent="space-between" alignItems="center" direction="row-reverse" py={2}>
                                <Grid item>
                                    {currentInvocieOrders ? (
                                        <Button
                                            onClick={() => {
                                                handleEditUserDialogOpen(invoice);
                                            }}
                                            variant="text"
                                            color="info"
                                            size="small"
                                            startIcon={<IconUsers />}
                                        >
                                            Oʻzgartirish
                                        </Button>
                                    ) : (
                                        <Skeleton
                                            sx={{ bgcolor: 'grrey.900' }}
                                            variant="contained"
                                            animation="wave"
                                            width={90}
                                            height={20}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                            <TableContainer>
                                <Formik>
                                    <Form>
                                        <Table size="small" aria-label="purchases">
                                            <TableHead>
                                                {currentInvocieOrders ? (
                                                    <TableRow>
                                                        <TableCell>Mahsulotni Ismi</TableCell>
                                                        <TableCell align="right">Sana</TableCell>
                                                        <TableCell align="right">Narxi</TableCell>
                                                        <TableCell align="right">Sotilgan</TableCell>
                                                        <TableCell align="right">Qolgan</TableCell>
                                                        <TableCell align="right">Qaytarilgan</TableCell>
                                                        <TableCell align="right">Qarz</TableCell>
                                                        <TableCell align="right">Oʻzgartirish</TableCell>
                                                    </TableRow>
                                                ) : (
                                                    <TableRow>
                                                        <TableCell>
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
                                            </TableHead>
                                            <TableBody>
                                                {currentInvocieOrders ? (
                                                    currentInvocieOrders?.map((order) => (
                                                        <OrderCell
                                                            key={order?.id}
                                                            order={order}
                                                            handleEditOrderDialogOpen={handleEditOrderDialogOpen}
                                                        />
                                                    ))
                                                ) : (
                                                    <OrderCell loading={true} />
                                                )}
                                            </TableBody>
                                        </Table>
                                    </Form>
                                </Formik>
                            </TableContainer>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25]}
                                component="div"
                                count={-1}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage="Qatorlar miqdori:"
                            />
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};
