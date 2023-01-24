import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';

// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard')));

// invoices routing
const Invoices = Loadable(lazy(() => import('views/invoices/Invoices')));
const InvoiceDetail = Loadable(lazy(() => import('views/invoices/Invoice-detail')));
const InvoiceAddOrder = Loadable(lazy(() => import('views/invoices/Invoice-add-order')));

const Orders = Loadable(lazy(() => import('views/orders/Orders')));
const OrderDetail = Loadable(lazy(() => import('views/orders/Order-detail')));
const OrderEdit = Loadable(lazy(() => import('views/orders/Order-edit')));

const RegisterUser = Loadable(lazy(() => import('views/users/RegisterUser')));
const UserList = Loadable(lazy(() => import('views/users/edit-user/UserList')));
const EditUser = Loadable(lazy(() => import('views/users/edit-user/EditUser')));

// mark paid routing
const MarkPaid = Loadable(lazy(() => import('views/mark-paid/mark-paid')));

// add to order routing
const AddToOrder = Loadable(lazy(() => import('views/add-to-order/add-to-order')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <MainLayout />,
    children: [
        {
            path: '/',
            element: <DashboardDefault />,
        },
        {
            path: 'dashboard',
            element: <DashboardDefault />,
        },
        {
            path: 'invoices',
            children: [
                {
                    path: 'clients-list',
                    children: [
                        {
                            path: '',
                            element: <Invoices />,
                        },
                        {
                            path: ':id',
                            children: [
                                {
                                    path: '',
                                    element: <InvoiceDetail />,
                                },
                                {
                                    path: 'mark-paid/:orderID',
                                    element: <MarkPaid />,
                                },
                                {
                                    path: 'add-order',
                                    element: <InvoiceAddOrder />,
                                },
                                {
                                    path: 'add-to-order/:orderID',
                                    element: <AddToOrder />,
                                },
                            ],
                        },
                    ],
                },
                {
                    path: 'orders-list',
                    children: [
                        {
                            path: '',
                            element: <Orders />,
                        },
                        {
                            path: ':id&:orderID',
                            children: [
                                {
                                    path: '',
                                    element: <OrderDetail />,
                                },
                                {
                                    path: 'edit',
                                    element: <OrderEdit />,
                                },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            path: 'pages',
            children: [
                {
                    path: 'client/register',
                    element: <RegisterUser />,
                },
                {
                    path: 'client/clients',
                    children: [
                        {
                            path: '',
                            element: <UserList />,
                        },
                        {
                            path: ':id/edit',
                            element: <EditUser />,
                        },
                    ],
                },
            ],
        },
    ],
};

export default MainRoutes;
