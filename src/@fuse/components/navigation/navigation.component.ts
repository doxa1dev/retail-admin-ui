import { element } from 'protractor';
import { forEach } from 'lodash';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';

import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { isNullOrUndefined } from 'util';
import { environment } from 'environments/environment';

@Component({
    selector: 'fuse-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FuseNavigationComponent implements OnInit {
    @Input()
    layout = 'vertical';

    @Input()
    navigation: any;

    decoded: any;
    weightBasedShipping: any;
    hostGift: any;
    checkAddHostGift: boolean = false;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     *
     * @param {ChangeDetectorRef} _changeDetectorRef
     * @param {FuseNavigationService} _fuseNavigationService
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseNavigationService: FuseNavigationService
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        let token = localStorage.getItem('token');
        if (!isNullOrUndefined(token)) {
            this.decoded = jwt_decode(token);
        }

        // Load the navigation either from the input or from the service
        this.navigation = this.navigation || this._fuseNavigationService.getCurrentNavigation();
        this.weightBasedShipping = [
            {
                id: 'weight-based-shipping',
                title: 'Weight based Shipping',
                type: 'item',
                url: '/direct-sales/products/weight-based-shipping'
            },
        ];
        this.hostGift = [{
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
        }]

        // Subscribe to the current navigation changes
        this._fuseNavigationService.onNavigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Load the navigation
                this.navigation = this._fuseNavigationService.getCurrentNavigation();
                this.checkMenu()
                // Mark for check
                // this._changeDetectorRef.markForCheck();
            });

        // Subscribe to navigation item
        merge(
            this._fuseNavigationService.onNavigationItemAdded,
            this._fuseNavigationService.onNavigationItemUpdated,
            this._fuseNavigationService.onNavigationItemRemoved
        ).pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {

                // Mark for check
                this._changeDetectorRef.markForCheck();
            });


    }

    checkMenu() {
        let arrRemove = [];
        this.navigation[0].children.forEach(item => {
            let isShow: boolean = false;
            if (isNullOrUndefined(this.decoded)) {
                isShow = false;
            } else {
                if (this.decoded.role.length > 0) {
                    // if (this.decoded.role.indexOf("RETAIL_SUPER_ADMIN") !== -1){
                    //     if(item.id !== 'news'){
                    //         isShow = true
                    //     } else {
                    //         if (this.decoded.role.indexOf("MARKETING_ADMIN") !== -1){
                    //             isShow = true
                    //         } else {
                    //             isShow = false
                    //         }
                    //     }
                    // } else if (this.decoded.role.indexOf("MARKETING_ADMIN") !== -1){
                    //     if(item.id === 'news'){
                    //         isShow = true
                    //     } else {
                    //         isShow = false
                    //     }
                    // }
                    this.decoded.role.forEach(eachRole => {
                        switch (eachRole) {
                            case 'RETAIL_SUPER_ADMIN_SETTING':
                                switch (item.id) {
                                    case 'hierarchy-ranking':
                                        isShow = isShow || false;
                                        break;
                                    case 'host-gift':
                                        isShow = isShow || false;
                                        break;
                                    default:
                                        isShow = isShow || true;
                                        break;
                                }
                                break;
                            case 'RETAIL_SUPER_ADMIN':
                                switch (item.id) {
                                    case 'adminconfig':
                                        isShow = isShow || false;
                                        break;
                                    case 'data-transfer-check':
                                        isShow = isShow || false;
                                        break;
                                    default:
                                        this.checkAddHostGift = true;
                                        isShow = isShow || true;
                                        break;
                                }
                                break;
                            case 'RETAIL_ADMIN':
                                switch (item.id) {
                                    case 'customers':
                                        isShow = isShow || false;
                                        break;
                                    case 'recurring-payments':
                                        isShow = isShow || false;
                                        break;
                                    case 'news':
                                        isShow = isShow || false;
                                        break;
                                    case 'configuration':
                                        isShow = isShow || false;
                                        break;
                                    case 'adminconfig':
                                        isShow = isShow || false;
                                        break;
                                    case 'data-transfer-check':
                                        isShow = isShow || false;
                                        break;
                                    case 'hierarchy-ranking':
                                        isShow = isShow || false;
                                        break;
                                    default:
                                        this.checkAddHostGift = true;
                                        isShow = isShow || true;
                                        break;
                                }
                                break;
                            case 'RETAIL_WH_ADMIN':
                                switch (item.id) {
                                    case 'sales-team':
                                        isShow = isShow || false;
                                        break;
                                    case 'customers':
                                        isShow = isShow || false;
                                        break;
                                    case 'recurring-payments':
                                        isShow = isShow || false;
                                        break;
                                    case 'news':
                                        isShow = isShow || false;
                                        break;
                                    case 'products':
                                        isShow = isShow || false;
                                        break;
                                    case 'configuration':
                                        isShow = isShow || false;
                                        break;
                                    case 'adminconfig':
                                        isShow = isShow || false;
                                        break;
                                    case 'data-transfer-check':
                                        isShow = isShow || false;
                                        break;
                                    case 'hierarchy-ranking':
                                        isShow = isShow || false;
                                        break;
                                    case 'host-gift':
                                        isShow = isShow || false;
                                        break;
                                    default:
                                        isShow = isShow || true;
                                        break;
                                }
                                break;
                            case 'RETAIL_CS_ADMIN':
                                switch (item.id) {
                                    case 'orders':
                                        isShow = isShow || true;
                                        break;
                                    case 'customers':
                                        isShow = isShow || true;
                                        break;
                                    case 'hierarchy-ranking':
                                        isShow = isShow || false;
                                        break;
                                    case 'host-gift':
                                        isShow = isShow || false;
                                        break;
                                    default:
                                        isShow = isShow || false;
                                        break;
                                }
                                break;
                            case 'RETAIL_IT_ADMIN':
                                switch (item.id) {
                                    case 'sales-team':
                                        isShow = isShow || true;
                                        break;
                                    case 'customers':
                                        isShow = isShow || true;
                                        break;
                                    case 'recurring-payments':
                                        isShow = isShow || true;
                                        break;
                                    case 'reports':
                                        isShow = isShow || true;
                                        break;
                                    default:
                                        isShow = isShow || false;
                                        break;
                                }
                                break;
                            case 'RETAIL_AC_ADMIN':
                                switch (item.id) {
                                    case 'orders':
                                        isShow = isShow || true;
                                        break;
                                    case 'recurring-payments':
                                        isShow = isShow || true;
                                        break;
                                    case 'reports':
                                        isShow = isShow || true;
                                        break;
                                    case 'host-gift':
                                        this.checkAddHostGift = true;
                                        isShow = isShow || true;
                                        break;
                                    default:
                                        isShow = isShow || false;
                                        break;
                                }
                                break;
                            case 'MARKETING_ADMIN':
                                switch (item.id) {
                                    case 'customers':
                                        isShow = isShow || true;
                                    case 'news':
                                        isShow = isShow || true;
                                    case 'reports':
                                        isShow = isShow || true;
                                        break;
                                    case 'host-gift':
                                        this.checkAddHostGift = true;
                                        isShow = isShow || true;
                                        break;
                                    default:
                                        isShow = isShow || false;
                                        break;
                                }
                                break;
                        }
                    })
                } else {
                    isShow = false;
                }
            }
            if (!isShow) {
                arrRemove.push(item.id);
            }
        });

        if (this.decoded.entity_id === "1") {
            // remove weight based shipping
            const products = this.navigation[0].children.filter(x => x.id === "products");
            const idxProducts = this.navigation[0].children.indexOf(products[0]);
            this.weightBasedShipping = products[0].children.filter(x => x.id === "weight-based-shipping");
            let arrProducts = products[0].children.filter(x => x.id !== "weight-based-shipping");
            this.navigation[0].children[idxProducts].children = arrProducts;

            if (environment.hiddenHostGift === true) {
                // remove host gift
                let navigation = this.navigation[0].children.filter(x => x.id !== "host-gift");
                this.navigation[0].children = navigation;
            }
        } else {
            // add weight based shipping if not exists
            const products = this.navigation[0].children.filter(x => x.id === "products");
            const idxProducts = this.navigation[0].children.indexOf(products[0]);
            const weightBasedShipping1 = products[0].children.filter(x => x.id === "weight-based-shipping");
            if (weightBasedShipping1.length === 0) {
                this.navigation[0].children[idxProducts].children.push(this.weightBasedShipping[0]);
            }

            // add host gift if not exists
            const hostGift = this.navigation[0].children.filter(x => x.id === "host-gift");
            if (hostGift.length === 0 && this.checkAddHostGift === true) {
                // find index of Recurring Payments
                const recurringPayment = this.navigation[0].children.filter(x => x.id === "recurring-payments");
                const idxRecurringPayment = this.navigation[0].children.indexOf(recurringPayment[0]);
                // insert host gift after Recurring Payments
                this.navigation[0].children.splice(idxRecurringPayment + 1, 0, this.hostGift[0]);
            }
        }

        let arr = this.navigation[0].children.filter(function (item) {
            return arrRemove.indexOf(item.id) === -1;
        });
        this.navigation = arr;
        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
}
