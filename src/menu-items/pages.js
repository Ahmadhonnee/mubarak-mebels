// assets
import { IconUsers, IconUserPlus, IconPencil } from '@tabler/icons';

// constant
const icons = {
    IconUserPlus,
    IconUsers,
    IconPencil,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
    id: 'pages',
    title: 'Mijoz',
    caption: 'Mijozni boshqarish',
    type: 'group',
    children: [
        {
            id: 'client',
            title: 'Mijoz',
            type: 'collapse',
            icon: icons.IconUsers,
            children: [
                {
                    id: 'register',
                    title: 'Roʻyxatga qoʻshish',
                    type: 'item',
                    url: '/pages/client/register',
                    icon: icons.IconUserPlus,
                    target: false,
                },
                {
                    id: 'product',
                    title: 'Oʻzgartirish',
                    type: 'item',
                    url: '/pages/client/clients',
                    icon: icons.IconPencil,
                    target: false,
                },
            ],
        },
    ],
};

export default pages;
