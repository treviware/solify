import {defineStore} from 'pinia';
import {LocationQueryRaw, LocationQueryValueRaw, NavigationFailure, RouteLocationRaw} from 'vue-router';
import {Router} from 'src/router';

let lastRouteChangePromise: Promise<any> = Promise.resolve();
export const useRouterStore = defineStore('routerStore', {
    state: () => ({
        query: Router.currentRoute.value.query,
    }),
    actions: {
        async push(location: RouteLocationRaw) {
            if (lastRouteChangePromise) {
                await lastRouteChangePromise;
            }

            let promise;
            if (typeof location === 'string') {
                promise = Router.push({
                    path: location,
                    query: this.query,
                });
            } else {
                promise = Router.push({
                    ...location,
                    query: this.query,
                });
            }

            lastRouteChangePromise = promise;
            return promise;
        },
        setQueryEntry(key: string,
                      value: LocationQueryValueRaw | LocationQueryValueRaw[] | string | null | undefined): Promise<NavigationFailure | void | undefined> {
            if (value === undefined) {
                delete this.query[key];
            } else {
                this.query[key] = value as any;
            }

            return (async () => {
                await lastRouteChangePromise;

                const promise = Router.replace({
                    query: this.query,
                    force: true,
                });

                lastRouteChangePromise = promise;
                return promise;
            })();
        },
        setManyQueryEntries(newQuery: LocationQueryRaw | Record<string, string | null | undefined>): Promise<NavigationFailure | void | undefined> {
            for (const key in newQuery) {
                const value = newQuery[key];

                if (value === undefined) {
                    delete this.query[key];
                } else {
                    this.query[key] = value as any;
                }
            }

            return (async () => {
                await lastRouteChangePromise;

                const promise = Router.replace({
                    name: null as any,
                    query: this.query,
                    force: true,
                });

                lastRouteChangePromise = promise;
                await promise;
            })();
        },
    },
});