// assets
// import { IconTypography, IconPalette, IconShadow, IconWindmill } from '@tabler/icons';
import { IconArmchair2, IconTruckDelivery, IconFileInvoice } from '@tabler/icons';

// constant
const icons = {
    IconArmchair2,
    IconTruckDelivery,
    IconFileInvoice,
    // IconTypography,
    // IconPalette,
    // IconShadow,
    // IconWindmill,
};

// ==============================|| UTILITIES MENU ITEMS ||============================== //

const invoices = {
    id: 'invoices',
    title: 'Hisoblar',
    caption: 'Hisobkitob',
    type: 'group',
    children: [
        {
            id: 'menagement',
            title: 'Boshqarish',
            type: 'collapse',
            icon: icons.IconArmchair2,
            children: [
                {
                    id: 'clients',
                    title: 'Hisoblar',
                    type: 'item',
                    url: '/invoices/clients-list',
                    icon: icons.IconFileInvoice,
                    target: false,
                },
                {
                    id: 'orders',
                    title: 'Buyurtmalar',
                    type: 'item',
                    url: '/invoices/orders-list',
                    icon: icons.IconTruckDelivery,
                    target: false,
                },
            ],
        },
    ],
};

export default invoices;
