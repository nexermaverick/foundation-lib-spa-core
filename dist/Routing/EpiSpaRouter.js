import React, { useEffect } from 'react';
import { StaticRouter, useLocation, Switch, Route } from 'react-router';
import { BrowserRouter } from 'react-router-dom';
import { useEpiserver } from '../Hooks/Context';
export const Router = (props) => {
    const epi = useEpiserver();
    if (epi.isServerSideRendering()) {
        const staticRouterProps = {
            basename: props.basename,
            context: props.context,
            location: props.location
        };
        return React.createElement(StaticRouter, Object.assign({}, staticRouterProps), props.children);
    }
    const browserRouterProps = {
        basename: props.basename,
        forceRefresh: props.forceRefresh,
        getUserConfirmation: props.getUserConfirmation,
        keyLength: props.keyLength
    };
    if (epi.isInEditMode() || epi.isEditable())
        return React.createElement(BrowserRouter, Object.assign({}, browserRouterProps), props.children);
    return React.createElement(BrowserRouter, Object.assign({}, browserRouterProps),
        React.createElement(ScrollToTop, null, props.children));
};
Router.displayName = "Optimizely CMS: Router";
export default Router;
const ScrollToTop = () => {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};
export const RoutedContent = (props) => {
    const ctx = useEpiserver();
    const switchProps = { location: props.location };
    return React.createElement(Switch, Object.assign({}, switchProps),
        props.children,
        (props.config || []).map((item, idx) => createRouteNode(item, props.basePath, `${props.keyPrefix}-route-${idx}`, ctx)));
};
RoutedContent.displayName = "Optimizely CMS: Route container";
function createRouteNode(route, basePath = "", key, ctx) {
    let createdRoute = basePath ? (basePath.substr(-1) === "/" ? basePath.substr(0, -1) : basePath) : "";
    createdRoute = createdRoute + "/" + (route.path ? (route.path.substr(0, 1) === "/" ? route.path.substr(1) : route.path) : "");
    if (ctx === null || ctx === void 0 ? void 0 : ctx.isDebugActive())
        console.log('Generating Route Virtual DOM Node', createdRoute, route, key);
    const newRouteProps = {
        children: route.children,
        exact: route.exact,
        location: route.location,
        path: createdRoute,
        sensitive: route.sensitive,
        strict: route.strict,
        render: route.render ? (props) => { return route.render ? route.render(Object.assign(Object.assign({}, props), { routes: route.routes, path: route.path })) : React.createElement("div", null); } : undefined,
        component: route.component ? (props) => { const RouteComponent = route.component || 'div'; return React.createElement(RouteComponent, Object.assign({}, props, { routes: route.routes, path: route.path })); } : undefined
    };
    return React.createElement(Route, Object.assign({}, newRouteProps, { key: key }));
}
//# sourceMappingURL=EpiSpaRouter.js.map