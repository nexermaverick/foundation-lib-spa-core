import React, { useEffect } from 'react';
import { StaticRouter, StaticRouterProps, useHistory, useLocation, Switch, SwitchProps, Route, RouteProps, RouteComponentProps } from 'react-router';
import { BrowserRouter, BrowserRouterProps } from 'react-router-dom';
import IRouteConfig, { IRouteConfigItem } from './IRouteConfig';
import IEpiserverContext from '../Core/IEpiserverContext';
import { useEpiserver } from '../Hooks/Context';

export type RouterProps = StaticRouterProps & BrowserRouterProps;
export const Router : React.FunctionComponent<RouterProps> = (props) =>
{
    const epi = useEpiserver();
    
    if (epi.isServerSideRendering()) {
        const staticRouterProps : StaticRouterProps = {
            basename: props.basename,
            context: props.context,
            location: props.location
        };
        return <StaticRouter {...staticRouterProps}>{ props.children }</StaticRouter>
    }
    
    const browserRouterProps : BrowserRouterProps = {
        basename: props.basename,
        forceRefresh: props.forceRefresh,
        getUserConfirmation: props.getUserConfirmation,
        keyLength: props.keyLength
    };
    
    if (epi.isInEditMode() || epi.isEditable())
    return <BrowserRouter {...browserRouterProps}>{ props.children }</BrowserRouter>
    
    return <BrowserRouter {...browserRouterProps}><ScrollToTop>{ props.children }</ScrollToTop></BrowserRouter>
}
Router.displayName = "Optimizely CMS: Router";
export default Router;

const ScrollToTop: React.FC = () => {
    const { pathname } = useLocation();
    
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    
    return null;
}

export type RoutedContentProps = SwitchProps & {
    keyPrefix ?:    string,
    config ?:       IRouteConfig,
    basePath ?:     string
}

export const RoutedContent : React.FunctionComponent<RoutedContentProps> = (props) => {
    const ctx = useEpiserver();
    const switchProps : SwitchProps = { location: props.location }
    return <Switch {...switchProps}>
    { props.children }
    { (props.config || []).map( (item, idx) => createRouteNode(item, props.basePath, `${props.keyPrefix}-route-${idx}`, ctx) ) }
    </Switch>
}
RoutedContent.displayName = "Optimizely CMS: Route container";

function createRouteNode(route: IRouteConfigItem, basePath = "", key ?: string, ctx ?: IEpiserverContext) : React.ReactElement<RouteProps> {
    
    let createdRoute : string = basePath ? (basePath.substr(-1) === "/" ? basePath.substr(0, -1) : basePath) : "";
    createdRoute = createdRoute + "/" + (route.path ? (route.path.substr(0,1) === "/" ? route.path.substr(1) : route.path) : "")
    
    if (ctx?.isDebugActive()) console.log('Generating Route Virtual DOM Node', createdRoute, route, key);
    
    const newRouteProps : RouteProps = {
        children: route.children,
        exact: route.exact,
        location: route.location,
        path: createdRoute,
        sensitive: route.sensitive,
        strict: route.strict,
        render: route.render ? (props: RouteComponentProps) => { return route.render ? route.render({ ...props, routes: route.routes, path: route.path }) : <div/> } : undefined,
        component: route.component ? (props: RouteComponentProps) => { const RouteComponent = route.component || 'div'; return <RouteComponent { ...props } routes={ route.routes } path={ route.path } />} : undefined
    }
    return <Route { ...newRouteProps } key={ key } />
}