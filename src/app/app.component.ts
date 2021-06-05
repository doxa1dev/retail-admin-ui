import { url } from 'inspector';
import { forEach } from 'lodash';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

import { navigation } from 'app/navigation/navigation';
import { navigationModules } from 'app//navigation/navigationModules';
import { locale as navigationEnglish } from 'app/navigation/i18n/en';
import { locale as navigationTurkish } from 'app/navigation/i18n/tr';

import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import * as jwt_decode from 'jwt-decode';
@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;
    navigationModules: any;
    routerList = [
        '/profile',
        '/direct-sales/orders',
        '/direct-sales/warehouse',
        '/direct-sales/sales-team',
        '/direct-sales/customers',
        '/direct-sales/recurring-payments',
        '/direct-sales/news',
        '/direct-sales/reports',
        '/direct-sales/products',
        '/direct-sales/configuration',
        '/direct-sales/adminconfig',
        '/direct-sales/data-transfer-check',
        '/direct-sales/just-host/component-setting',
        '/direct-sales/just-host/redemption-tracker',
        '/direct-sales/just-host/guest-tracker',
        '/direct-sales/just-host/guest-tracker-detail',
    ]

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {DOCUMENT} document
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseNavigationService} _fuseNavigationService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {FuseSplashScreenService} _fuseSplashScreenService
     * @param {FuseTranslationLoaderService} _fuseTranslationLoaderService
     * @param {Platform} _platform
     * @param {TranslateService} _translateService
     */
    constructor(
        @Inject(DOCUMENT) private document: any,
        private _fuseConfigService: FuseConfigService,
        private _fuseNavigationService: FuseNavigationService,
        private _fuseSidebarService: FuseSidebarService,
        private _fuseSplashScreenService: FuseSplashScreenService,
        private _fuseTranslationLoaderService: FuseTranslationLoaderService,
        private _translateService: TranslateService,
        private _platform: Platform,
        private router: Router,


        //SVG Icons
        private _matIconRegistry: MatIconRegistry,
        private _domSanitizer: DomSanitizer,
    ) {
        // Get default navigation
        this.navigation = navigation;
        // console.log(this.navigation)
        this.navigationModules = navigationModules;
        // console.log(this.navigationModules)

        // Register the navigation to the service
        this._fuseNavigationService.register('main', this.navigation);
        this._fuseNavigationService.register('modules', this.navigationModules);

        // Set the main navigation as our current navigation
        this._fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this._translateService.addLangs(['en', 'tr']);

        // Set the default language
        this._translateService.setDefaultLang('en');

        // Set the navigation translations
        this._fuseTranslationLoaderService.loadTranslations(navigationEnglish, navigationTurkish);

        // Use a language
        this._translateService.use('en');

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix Start
         * ----------------------------------------------------------------------------------------------------
         */

        /**
         * If you are using a language other than the default one, i.e. Turkish in this case,
         * you may encounter an issue where some of the components are not actually being
         * translated when your app first initialized.
         *
         * This is related to ngxTranslate module and below there is a temporary fix while we
         * are moving the multi language implementation over to the Angular's core language
         * service.
         **/

        // Set the default language to 'en' and then back to 'tr'.
        // '.use' cannot be used here as ngxTranslate won't switch to a language that's already
        // been selected and there is no way to force it, so we overcome the issue by switching
        // the default language back and forth.
        /**
         setTimeout(() => {
            this._translateService.setDefaultLang('en');
            this._translateService.setDefaultLang('tr');
         });
         */

        /**
         * ----------------------------------------------------------------------------------------------------
         * ngxTranslate Fix End
         * ----------------------------------------------------------------------------------------------------
         */

        // Add is-mobile class to the body if the platform is mobile
        if (this._platform.ANDROID || this._platform.IOS) {
            this.document.body.classList.add('is-mobile');
        }

        // Set the private defaults
        this._unsubscribeAll = new Subject();

        //Create Icon SVG
        this._matIconRegistry.addSvgIcon(
            "group765",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/Group 765.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "yes",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/Yes.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "no",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/No.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "general-setting",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/General Settings.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "order-to-cash",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/Order to cash.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "purchase-to-payment",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/Purchase to Payment.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "menu-navbar",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/Menu-navbar.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "arow_right",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/Chevron Right.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "messages-order",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/Messages-order.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "phone-order",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/Phone-order-summary.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "news",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/news.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "document",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/documents.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "delete",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/deleted.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "reports",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/report.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "customers",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/poll.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "configuration",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/config-icon.svg")
        );
        this._matIconRegistry.addSvgIcon(
            "report",
            this._domSanitizer.bypassSecurityTrustResourceUrl("../assets/icons/doxa-icons/report.svg")
        );
        // router event
        this.router.events.subscribe((event: any) => {
            // console.log(event);
            let token = localStorage.getItem('token');
            let decoded: any
            if (!isNullOrUndefined(token)) {
                decoded = jwt_decode(token);
                if (decoded.role.length > 0 && !isNullOrUndefined(event.url)) {
                    if (event.url.indexOf("unauthorized") !== -1) {
                        return
                    }
                    let validRoute = [];

                    decoded.role.forEach(eachRole => {

                        switch (eachRole) {
                            case 'RETAIL_SUPER_ADMIN_SETTING':
                                validRoute = this.routerList;
                                break;

                            case 'RETAIL_SUPER_ADMIN':
                                //validRoute = this.routerList;
                                validRoute = this.pushRole(validRoute, '/profile')
                                validRoute = this.pushRole(validRoute, '/direct-sales/orders')
                                validRoute = this.pushRole(validRoute, '/direct-sales/warehouse')
                                validRoute = this.pushRole(validRoute, '/direct-sales/sales-team')
                                validRoute = this.pushRole(validRoute, '/direct-sales/customers')
                                validRoute = this.pushRole(validRoute, '/direct-sales/recurring-payments')
                                validRoute = this.pushRole(validRoute, '/direct-sales/news')
                                validRoute = this.pushRole(validRoute, '/direct-sales/reports')
                                validRoute = this.pushRole(validRoute, '/direct-sales/products')
                                validRoute = this.pushRole(validRoute, '/direct-sales/configuration')
                                validRoute = this.pushRole(validRoute, '/direct-sales/active-setting')
                                validRoute = this.pushRole(validRoute, '/direct-sales/setting-host-gift')
                                validRoute = this.pushRole(validRoute, '/direct-sales/redemption-monitor')
                                // validRoute = this.pushRole(validRoute, '/direct-sales/configuration/naep-process')
                                // validRoute = this.pushRole(validRoute, '/direct-sales/configuration/naep-packages')
                                validRoute = this.pushRole(validRoute, '/direct-sales/hierarchy-ranking/sale-monitor')
                                validRoute = this.pushRole(validRoute, '/direct-sales/hierarchy-ranking/advisory-product')
                                validRoute = this.pushRole(validRoute, '/direct-sales/hierarchy-ranking/period-config')
                                validRoute = this.pushRole(validRoute, '/direct-sales/hierarchy-ranking/create-period-config')
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/component-setting');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/redemption-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker-detail');

                                break;
                            case 'RETAIL_ADMIN':
                                validRoute = this.pushRole(validRoute, '/direct-sales/orders');
                                validRoute = this.pushRole(validRoute, '/direct-sales/sales-team');
                                validRoute = this.pushRole(validRoute, '/direct-sales/reports');
                                validRoute = this.pushRole(validRoute, '/direct-sales/products');
                                validRoute = this.pushRole(validRoute, '/direct-sales/warehouse');
                                validRoute = this.pushRole(validRoute, '/direct-sales/active-setting');
                                validRoute = this.pushRole(validRoute, '/direct-sales/setting-host-gift')
                                validRoute = this.pushRole(validRoute, '/direct-sales/redemption-monitor')
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/component-setting');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/redemption-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker-detail');
                                break;
                            case 'RETAIL_WH_ADMIN':
                                validRoute = this.pushRole(validRoute, '/direct-sales/orders');
                                validRoute = this.pushRole(validRoute, '/direct-sales/reports');
                                validRoute = this.pushRole(validRoute, '/direct-sales/warehouse');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/component-setting');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/redemption-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker-detail');
                                break;
                            case 'RETAIL_CS_ADMIN':
                                validRoute = this.pushRole(validRoute, '/direct-sales/orders');
                                validRoute = this.pushRole(validRoute, '/direct-sales/customers');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/component-setting');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/redemption-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker-detail');
                                break;
                            case 'RETAIL_IT_ADMIN':
                                validRoute = this.pushRole(validRoute, '/direct-sales/sales-team');
                                validRoute = this.pushRole(validRoute, '/direct-sales/customers');
                                validRoute = this.pushRole(validRoute, '/direct-sales/recurring-payments');
                                // validRoute = this.pushRole(validRoute,'/direct-sales/products');
                                validRoute = this.pushRole(validRoute, '/direct-sales/reports');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/component-setting');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/redemption-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker-detail');
                                break;
                            case 'RETAIL_AC_ADMIN':
                                validRoute = this.pushRole(validRoute, '/direct-sales/orders');
                                validRoute = this.pushRole(validRoute, '/direct-sales/recurring-payments');
                                validRoute = this.pushRole(validRoute, '/direct-sales/reports');
                                validRoute = this.pushRole(validRoute, '/direct-sales/active-setting');
                                validRoute = this.pushRole(validRoute, '/direct-sales/setting-host-gift');
                                validRoute = this.pushRole(validRoute, '/direct-sales/redemption-monitor');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/component-setting');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/redemption-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker-detail');
                                break;
                            case 'MARKETING_ADMIN':
                                validRoute = this.pushRole(validRoute, '/direct-sales/news');
                                validRoute = this.pushRole(validRoute, '/direct-sales/customers');
                                validRoute = this.pushRole(validRoute, '/direct-sales/reports');
                                validRoute = this.pushRole(validRoute, '/direct-sales/active-setting');
                                validRoute = this.pushRole(validRoute, '/direct-sales/setting-host-gift');
                                validRoute = this.pushRole(validRoute, '/direct-sales/redemption-monitor');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/component-setting');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/redemption-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker');
                                validRoute = this.pushRole(validRoute, '/direct-sales/just-host/guest-tracker-detail');
                                break;
                        }
                    })
                    let is_valid: Boolean = false;
                    if (event.url === '/' && validRoute.indexOf('/direct-sales/orders') > -1) {
                        this.router.navigate(['/direct-sales/orders']);
                    } else if (event.url === '/' && validRoute.indexOf('/direct-sales/reports') > -1) {
                        this.router.navigate(['/direct-sales/reports']);
                    } else {
                        validRoute.forEach(element => {
                            if (event.url.includes(element)) {
                                is_valid = true;
                            }
                        })

                        if (is_valid == false) {
                            this.router.navigate(['/unauthorized'])
                        }
                    }
                }
            }
        })
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                }
                else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for (let i = 0; i < this.document.body.classList.length; i++) {
                    const className = this.document.body.classList[i];

                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });
    }


    pushRole(array, role: string) {
        if (array.length === 0) {
            array.push(role)
        } else {
            let index = array.findIndex(element => {
                return element === role;
            })
            if (index === -1) {
                array.push(role)
            }
        }
        return array
    }



    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
