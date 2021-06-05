export interface FuseNavigationItem
{
    id: string;
    title: string;
    b_title?:boolean;
    type: 'item' | 'group' | 'collapsable';
    translate?: string;
    icon?: string;
    svgIcon?:string;
    hidden?: boolean;
    url?: string;
    classes?: string;
    redirect?:boolean;
    exactMatch?: boolean;
    externalUrl?: boolean;
    openInNewTab?: boolean;
    function?: any;
    badge?: {
        title?: string;
        translate?: string;
        bg?: string;
        fg?: string;
    };
    children?: FuseNavigationItem[];
}

export interface FuseNavigation extends FuseNavigationItem
{
    children?: FuseNavigationItem[];
}
