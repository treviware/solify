import {Layout} from '@solana/buffer-layout';

export interface ProgramAccountDefinition<FinalLayout, RawLayout> {
    name: string;
    description?: string;
    minSize: number;
    layout: Layout<RawLayout>;
    defaultLayout: FinalLayout;
    actualSizeCalculator: (value: RawLayout, program: ProgramAccountDefinition<FinalLayout, RawLayout>) => number;
    toLayout: (value: RawLayout) => FinalLayout;
    toRawLayout: (value: FinalLayout) => RawLayout;
}

export function defineProgramAccount<Layout, RawLayout extends Record<string, unknown> = Record<string, unknown>>(account: ProgramAccountDefinition<Layout, RawLayout>): ProgramAccountDefinition<Layout, RawLayout> {
    return account;
}