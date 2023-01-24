// assets
import { IconChartDonut } from '@tabler/icons';

// constant
const icons = { IconChartDonut };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    title: 'Boshqaruv paneli',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Boshqaruv paneli',
            type: 'item',
            url: '/dashboard/',
            icon: icons.IconChartDonut,
            breadcrumbs: false,
        },
    ],
};

export default dashboard;
