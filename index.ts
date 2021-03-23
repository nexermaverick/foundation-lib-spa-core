// Core SPA Libray
import * as Core from './Library/Core';
import * as ServerSideRendering from './Library/ServerSideRendering';
import initServer from './InitServer';
import initBrowser from './InitBrowser';
import AppGlobal from './AppGlobal';

// Namespace exports
export * as Core from './Library/Core';
export * as ContentDelivery from './Library/ContentDelivery';
export * as Layout from './Library/Layout';
export * as Routing from './Library/Routing';
export * as Taxonomy from './Library/Taxonomy';
export * as Services from './Library/Services';
export * as Components from './Library/Components';
export * as ComponentTypes from './Library/ComponentTypes';
export * as ServerSideRendering from './Library/ServerSideRendering';
export * as Tracking from './Library/Tracking';
export * as Loaders from './Library/Loaders';
export * as IndexedDB from './Library/IndexedDB';
export * as State from './Library/State';

/**
 * Generic initialization function, usable for both Browser & Server side rendering
 * 
 * @see     InitServer
 * @see     InitBrowser
 * @param   {Core.IConfig}         config              The main configuration object
 * @param   {Core.IServiceContainer}  serviceContainer    The service container to use, if a specific one is desired
 * @param   {string}            containerElementId  The element that should be populated by React-DOM on the Browser
 * @param   {boolean}           ssr                 Marker to hint Server Side rendering
 * @returns {ServerSideRendering.Response|void}  The result of the initialization method invoked
 */
export function init<B extends boolean> (config: Core.IConfig, serviceContainer?: Core.IServiceContainer, containerElementId?: string, ssr?: B) : B extends true ? ServerSideRendering.Response : void
{
    serviceContainer = serviceContainer || new Core.DefaultServiceContainer();
    if (ssr) {
        return initServer(config, serviceContainer) as B extends true ? ServerSideRendering.Response : void;
    } else {
        return initBrowser(config, containerElementId, serviceContainer) as B extends true ? ServerSideRendering.Response : void;
    }
}

/**
 * Export all hooks in the global scope
 */
export * from './Hooks/Context';

/**
 * Helper method to get the global scope at any location within the SPA, this is either
 * the 'window' or 'global' variable, depending on execution context.
 * 
 * @return { Window|any }
 */
export const getGlobalScope: () => any = AppGlobal;

export default init;