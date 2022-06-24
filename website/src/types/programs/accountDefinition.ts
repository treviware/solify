import {Layout} from '@solana/buffer-layout';
import {PartialRecordKeys} from 'src/types/general';

export interface ProgramAccountDefinition<RawLayout, FinalLayout = RawLayout> {
    name: string;
    description?: string;
    minSize: number;
    layout: Layout<RawLayout>;
    defaultLayout: () => FinalLayout;
    actualSizeCalculator: (value: RawLayout, program: ProgramAccountDefinition<FinalLayout, RawLayout>) => number;
    toLayout: (value: RawLayout) => FinalLayout;
    toRawLayout: (value: FinalLayout) => RawLayout;
}

export type ProgramAccountDefinitionBuilder<FinalLayout, RawLayout> = PartialRecordKeys<ProgramAccountDefinition<FinalLayout, RawLayout>, 'actualSizeCalculator' | 'toLayout' | 'toRawLayout'>;

export function defineProgramAccount<Layout, RawLayout extends Record<string, unknown> = Record<string, unknown>>(account: ProgramAccountDefinitionBuilder<Layout, RawLayout>): ProgramAccountDefinition<Layout, RawLayout> {
    if (!account.actualSizeCalculator) {
        account.actualSizeCalculator = defaultActualSizeCalculator;
    }

    if (!account.toLayout) {
        account.toLayout = defaultToLayout;
    }

    if (!account.toRawLayout) {
        account.toRawLayout = defaultToLayout;
    }

    return account as any;
}

// ----------------------------------------------------------------------------
// Default methods ------------------------------------------------------------
// ----------------------------------------------------------------------------
export function defaultActualSizeCalculator(value: any, program: ProgramAccountDefinition<any, any>): number {
    return program.minSize;
}

export function defaultToLayout(layout: any): any {
    return layout;
}