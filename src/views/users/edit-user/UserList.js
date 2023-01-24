import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { axiosInstance } from 'services';
import { GET_INVOICES } from 'store/actions';

const { Card, CardMedia, TableRow, TableCell, Skeleton, TableContainer, Paper, Table, TableHead, TableBody } = require('@mui/material');
const { default: MainCard } = require('ui-component/cards/MainCard');
// icons
import SecondaryAction from 'ui-component/cards/CardSecondaryAction';

const UserList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const invoices = useSelector((state) => state.invoices);

    useEffect(() => {
        (async () => {
            try {
                const data = await axiosInstance.get('users');
                dispatch({ type: GET_INVOICES, invoices: data.data });
            } catch (err) {
            } finally {
            }
        })();
    }, []);

    const handleRowClick = (id) => {
        navigate(`/pages/client/clients/${id}/edit`);
    };
    console.log(invoices);
    return (
        <MainCard title="Mijozlar roʻyxati" secondary={<SecondaryAction link="https://next.material-ui.com/system/typography/" />}>
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
                                    <TableCell>Mijozni ID</TableCell>
                                    <TableCell align="right">Ismi</TableCell>
                                    <TableCell align="right">Raqami</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!invoices?.data
                                    ? [...Array(5).keys()].map((item) => (
                                          <TableRow key={item} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                              <TableCell component="th" scope="row">
                                                  <Skeleton variant="span" animation="wave" />
                                              </TableCell>
                                              <TableCell align="right">
                                                  <Skeleton variant="span" animation="wave" />
                                              </TableCell>
                                              <TableCell align="right">
                                                  <Skeleton variant="span" animation="wave" />
                                              </TableCell>
                                          </TableRow>
                                      ))
                                    : invoices?.data?.map((invoice) => (
                                          <TableRow
                                              onClick={() => handleRowClick(invoice?.id)}
                                              key={invoice?.id}
                                              hover
                                              sx={{ '&:last-child td, &:last-child th': { binvoice: 0 } }}
                                          >
                                              <TableCell component="th" scope="row">
                                                  #{invoice?.id}
                                              </TableCell>
                                              <TableCell align="right">{invoice?.name}</TableCell>
                                              <TableCell align="right">{invoice?.phone}</TableCell>
                                          </TableRow>
                                      ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardMedia>
            </Card>
        </MainCard>
    );
};

export default UserList;
