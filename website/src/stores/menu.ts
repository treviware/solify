import {defineStore} from 'pinia';
import {TOOL_BUTTONS} from 'src/constants/tools';
import {MAX_PINNED_TOOLS, MAX_RECENT_TOOLS, PINNED_TOOLS_KEY} from 'src/constants';
import {DrawerToolButton, RightDrawerState} from 'src/types/drawer';

export const useMenuStore = defineStore('menu', {
    state: () => {
        const pins = loadPins();
        return {
            ...pins,
        };
    },
    getters: {
        recentMenuTools: (state) => {
            const numTools = Math.max(MAX_RECENT_TOOLS - state.pinnedTools.length);
            const tools = state.recentTools.slice(-numTools).reverse();

            return [...state.pinnedTools, ...tools];
        },
    },
    actions: {
        addRecentTool(newState: RightDrawerState) {
            const index = this.recentTools.findIndex(v => v.rightDrawerOption === newState);

            if (index < 0) {
                return;
            }

            const result = this.recentTools.splice(index, 1);
            this.recentTools.push(...result);
        },
        pin(newState: RightDrawerState) {
            if (this.pinnedTools.length >= MAX_PINNED_TOOLS) {
                return;
            }

            const index = this.recentTools.findIndex(v => v.rightDrawerOption === newState);
            const result = this.recentTools.splice(index, 1);
            this.pinnedTools.push(...result);

            savePins(this.pinnedTools);
        },
        unpin(newState: RightDrawerState) {
            const index = this.pinnedTools.findIndex(v => v.rightDrawerOption === newState);
            if (index < 0) {
                return;
            }

            const result = this.pinnedTools.splice(index, 1);
            this.recentTools.push(...result);

            savePins(this.pinnedTools);
        },
    },
});

function loadPins() {
    const pinnedTools = localStorage.getItem(PINNED_TOOLS_KEY);
    if (pinnedTools) {
        const pinIndexes: number[] = JSON.parse(pinnedTools);

        if (validatePinList(pinIndexes)) {
            const recentTools = TOOL_BUTTONS.slice(0);
            const pinnedTools: DrawerToolButton[] = [];
            pinIndexes.splice(MAX_PINNED_TOOLS, pinIndexes.length);

            for (const pin of pinIndexes) {
                pinnedTools.push(recentTools[pin]);
            }

            const sortedPinIndexes = pinIndexes.sort((a, b) => b - a);
            for (const pin of sortedPinIndexes) {
                recentTools.splice(pin, 1);
            }

            return {
                recentTools,
                pinnedTools,
            };
        }
    }

    return {
        recentTools: TOOL_BUTTONS.slice(1),
        pinnedTools: [TOOL_BUTTONS[0]],
    };
}

function validatePinList(pinList: any): boolean {
    if (!Array.isArray(pinList)) {
        return false;
    }

    for (const pin of pinList) {
        const pinType = typeof pin;
        if (pinType !== 'number') {
            return false;
        }

        if (pin < 0 || pin >= TOOL_BUTTONS.length) {
            return false;
        }
    }

    return true;
}

function savePins(pinnedTools: DrawerToolButton[]) {
    if (pinnedTools.length === 0) {
        localStorage.removeItem(PINNED_TOOLS_KEY);
        return;
    }

    const pins = JSON.stringify(
        pinnedTools.map(v => TOOL_BUTTONS.findIndex(v2 => v.rightDrawerOption === v2.rightDrawerOption)));

    localStorage.setItem(PINNED_TOOLS_KEY, pins);
}