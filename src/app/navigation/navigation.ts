import { FuseNavigation } from '@fuse/types';

export const navigation: FuseNavigation[] = [
    {
      id: 'direct-sales',
      title: 'Retail',
      type: 'group',
      icon: '',
      url:'/direct-sales',
      children: [
          {
            id: 'orders',
              title: 'Orders',
              type: 'item',
              icon: 'event_note',
              url: '/direct-sales/orders',
          },
          {
            id: 'warehouse',
              title: 'Warehouse',
              type: 'collapsable',
              icon: 'home',
              children: [
                {
                  id: 'packing',
                  title: 'Print Packing List',
                  type: 'item',
                  url: '/direct-sales/warehouse'
                }
              ]
          },
          {
            id: 'sales-team',
              title: 'Recruitment',
              type: 'collapsable',
              icon: 'supervisor_account',
              children: [
                  // {
                  //     id: 'branch',
                  //     title: 'Branch',
                  //     type: 'item',
                  //     url: '/direct-sales/sales-team/branch'
                  // },
                  {
                    id: 'naep',
                    title: 'New Advisor Earning Program',
                    type: 'item',
                    url: '/direct-sales/sales-team/naep'
                  }
              ]
          },
          {
            id: 'customers',
            title: 'Customers',
            type: 'item',
            svgIcon: 'customers',
            url: '/direct-sales/customers',
          },
          {
            id: 'recurring-payments',
              title: 'Recurring Payments',
              type: 'item',
              icon: 'event_note',
              url: '/direct-sales/recurring-payments',
          },
          {
            id: 'host-gift',
              title: 'Host Gift',
              type: 'collapsable',
              icon: 'home',
              children: [
                {
                  id: 'active-setting',
                  title: 'Active Setting',
                  type: 'item',
                  url: '/direct-sales/active-setting'
                },
                {
                  id: 'setting-host-gift',
                  title: 'Component Setting',
                  type: 'item',
                  url: '/direct-sales/setting-host-gift'
                },
                {
                  id: 'redemption-monitor',
                  title: 'Redemption Tracker',
                  type: 'item',
                  url: '/direct-sales/redemption-monitor'
                }
              ]
        },
          {
            id: 'just-host',
              title: 'Just Host',
              type: 'collapsable',
              icon: 'home',
              children: [
                {
                  id: 'component-setting',
                  title: 'Component Setting',
                  type: 'item',
                  url: '/direct-sales/just-host/component-setting'
                },
                {
                  id: 'redemption-tracker',
                  title: 'Redemption Tracker',
                  type: 'item',
                  url: '/direct-sales/just-host/redemption-tracker'
                },
                {
                  id: 'guest-tracker',
                  title: 'Guest Tracker',
                  type: 'item',
                  url: '/direct-sales/just-host/guest-tracker'
                }
              ]
          },
          {
            id: 'news',
              title: 'News & Information',
              type: 'collapsable',
              svgIcon: 'news',
              children: [
                  {
                      id: 'all_news',
                      title: 'All news',
                      type: 'item',
                      url: '/direct-sales/news/all'
                  },
                  {
                      id: 'new-insight',
                      title: 'News Insight',
                      type: 'item',
                      url: '/direct-sales/news/insight'
                  },
                  {
                    id: 'banner',
                    title: 'Banner',
                    type: 'item',
                    url: '/direct-sales/news/banner'
                  },
              ]
          },
          {
            id: 'products',
              title: 'Products',
              type: 'collapsable',
              icon: 'widgets',
              children: [
                  {
                      id: 'allProducts',
                      title: 'All Products',
                      type: 'item',
                      url: '/direct-sales/products/all'
                  },
                  {
                    id: 'warrantied-products',
                    title: 'Warranty Products',
                    type: 'item',
                    url: '/direct-sales/products/warrantied-products'
                  },
                  {
                      id: 'categories',
                      title: 'Categories',
                      type: 'item',
                      url: '/direct-sales/products/categories'
                  },
                  {
                      id: 'inventory',
                      title: 'Inventory',
                      type: 'item',
                      url: '/direct-sales/products/inventory'
                  },
                  {
                    id: 'stock-history',
                    title: 'Stock history',
                    type: 'item',
                    url: '/direct-sales/products/stock-history'
                  },
                  {
                    id: 'weight-based-shipping',
                    title: 'Weight based Shipping',
                    type: 'item',
                    url: '/direct-sales/products/weight-based-shipping'
                  },
              ]
          },
          {
            id: 'configuration',
              title: 'Configuration',
              type: 'collapsable',
              svgIcon: 'configuration',
              children: [
                {
                  id: 'specialProducts',
                  title: 'New Advisor Earning Program',
                  type: 'collapsable',
                  // url: '/direct-sales/products/special-products'
                  children: [
                    {
                      id: 'naep-types',
                      title: 'NAEP Types',
                      type: 'item',
                      url: '/direct-sales/configuration/naep-types'
                    },
                    {
                      id: 'naep-types',
                      title: 'NAEP Process',
                      type: 'item',
                      url: '/direct-sales/configuration/naep-process'
                    },
                    {
                      id: 'naep-types',
                      title: 'NAEP Packages',
                      type: 'item',
                      url: '/direct-sales/configuration/naep-packages'
                    },
                  ]
                },

              ]
          },
          {
            id: 'hierarchy-ranking',
            title: 'Hierarchy & Ranking',
            type: 'collapsable',
            icon: 'widgets',
            children: [
                {
                    id: 'period-config',
                    title: 'Period Configuration',
                    type: 'item',
                    url: '/direct-sales/hierarchy-ranking/period-config'
                },
                {
                  id: 'advisory-product',
                  title: 'Advisory Product',
                  type: 'item',
                  url: '/direct-sales/hierarchy-ranking/advisory-product'
                },
                {
                  id: 'sale-monitor',
                  title: 'Sales Monitor',
                  type: 'item',
                  url: '/direct-sales/hierarchy-ranking/sale-monitor'
                }
            ]

          },
          {
            id: 'reports',
            title: 'Reports',
            type: 'item',
            svgIcon: 'reports',
            url: '/direct-sales/reports',
          },
          {
            id: 'adminconfig',
            title: 'Admin Config',
            type: 'collapsable',
            svgIcon: 'customers',
            children: [
              {
                id: 'naep-roles',
                title: 'Admin role',
                type: 'item',
                url: '/direct-sales/configuration/naep-roles'
              },
              {
                id: 'import-data',
                title: 'Import data',
                type: 'item',
                url: '/direct-sales/configuration/import-data'
              },
            ]
          },
          {
            id: 'data-transfer-check',
            title: 'Data Transfer Check',
            svgIcon: 'customers',
            type: 'item',
            url: '/direct-sales/data-transfer-check',
          },

      ]
    }
];
