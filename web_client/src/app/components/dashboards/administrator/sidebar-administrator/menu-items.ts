import { RouteInfo } from "../../../../classes/routeInfo.class";

export const ADMINMENU: RouteInfo[] = [
    {
        path: '/dashboard-administrator/home',
        title: 'Home',
        icon: 'fa-solid fa-house',
        class: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/dashboard-administrator/staff',
        title: 'Staff',
        icon: 'fas fa-user-tag',
        class: '',
        extralink: false,
        submenu: []
    },
    {
        path: '/dashboard-admin/orders',
        title: 'Teams',
        icon: 'fas fa-users',
        class: 'has-arrow',
        extralink: false,
        submenu: [{
            path: '/dashboard-admin/band-users',
            title: 'Accounts',
            icon: 'fas fa-address-card'/* 'fas fa-user-plus' */,
            class: 'padding-submenu',
            extralink: false,
            submenu: []
        }, {
            path: '/dashboard-admin/band-users',
            title: 'Movements history',
            icon: 'fas fa-history'/* 'fas fa-user-plus' */,
            class: 'padding-submenu',
            extralink: false,
            submenu: []
        }
        ]
    },
];
