import { Button, FormControl, FormHelperText, IconButton, OutlinedInput, Skeleton, TableCell, TableRow } from '@mui/material';
import { IconPencil, IconX } from '@tabler/icons';
import { FormikInput } from 'custom-components/formik-input';
import { useField } from 'formik';
import { getDate } from 'hooks';
import { useState } from 'react';

export const OrderCell = ({ order, loading, handleEditOrderDialogOpen }) => {
    // console.log(order?.customer_id);
    if (loading) {
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
        </TableRow>;
    }
    return (
        <TableRow key={order?.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
                {order?.product_name || (!loading && <IconX />)}
            </TableCell>
            <TableCell align="right">{getDate(order?.ordered_at) || (!loading && <IconX />)}</TableCell>
            <TableCell align="right">{order?.price || (!loading && <IconX />)}</TableCell>
            <TableCell align="right">{order?.sold_amount || (!loading && <IconX />)}</TableCell>
            <TableCell align="right">{order?.remaining_amount || (!loading && <IconX />)}</TableCell>
            <TableCell align="right">{order?.returned_amount || (!loading && <IconX />)}</TableCell>
            <TableCell align="right">{order?.total_debt || (!loading && <IconX />)}</TableCell>
            <TableCell align="right">
                <IconButton
                    onClick={() => {
                        console.log(order);
                        handleEditOrderDialogOpen(order?.id);
                    }}
                    variant="contained"
                    color="info"
                    size="small"
                >
                    <IconPencil />
                </IconButton>
            </TableCell>
        </TableRow>
    );
};
