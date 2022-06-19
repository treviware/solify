import {onMounted, onUnmounted} from 'vue';
import {TOOL_DATA_URI_PREFIX} from 'src/constants';
import {useRouterStore} from 'stores/router';

export async function writeToolParamsIntoUri(params: Record<string, any>): Promise<void> {
    const query: Record<string, string | null | undefined> = {};

    for (const key in params) {
        const param = params[key];
        query[`${TOOL_DATA_URI_PREFIX}${key}`] = param ? param.toString() : param;
    }

    const routerStore = useRouterStore();
    await routerStore.setManyQueryEntries(query);
}

export function processUriStoreDataOnMounted(processFn: (query: Record<string, string>) => void | Promise<void>) {
    const routerStore = useRouterStore();

    onMounted(async () => {
        const query: Record<string, string> = {};

        for (const key in routerStore.query) {
            if (key.startsWith(TOOL_DATA_URI_PREFIX)) {
                query[key.slice(TOOL_DATA_URI_PREFIX.length)] = routerStore.query[key]?.toString() ?? '';
            }
        }

        await processFn(query);
    });
}

export function removeStoreDataFromUriOnUnmounted() {
    const routerStore = useRouterStore();

    onUnmounted(async () => {
        const query: Record<string, undefined> = {};

        for (const key in routerStore.query) {
            if (key.startsWith(TOOL_DATA_URI_PREFIX)) {
                query[key] = undefined;
            }
        }

        await routerStore.setManyQueryEntries(query);
    });
}