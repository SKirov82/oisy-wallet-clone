<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import ExchangeTokenValue from '$lib/components/exchange/ExchangeTokenValue.svelte';
	import TokenBalance from '$lib/components/tokens/TokenBalance.svelte';
	import TokenLogo from '$lib/components/tokens/TokenLogo.svelte';
	import LogoButton from '$lib/components/ui/LogoButton.svelte';
	import { i18n } from '$lib/stores/i18n.store';
	import type { LogoSize } from '$lib/types/components';
	import type { CardData } from '$lib/types/token-card';

	export let data: CardData;
	export let logoSize: LogoSize = 'md';

	const { oisyName, oisySymbol, symbol, name, network } = data;
</script>

<LogoButton on:click dividers={true}>
	<svelte:fragment slot="title">
		{nonNullish(oisySymbol) ? oisySymbol.oisySymbol : symbol}
	</svelte:fragment>

	<svelte:fragment slot="subtitle">
		{#if nonNullish(oisyName?.prefix)}
			{$i18n.tokens.text.chain_key}
		{/if}

		{oisyName?.oisyName ?? name}
	</svelte:fragment>

	<svelte:fragment slot="description">
		{network.name}
	</svelte:fragment>

	<TokenLogo
		{data}
		slot="logo"
		color="white"
		badge={{ type: 'network', blackAndWhite: true }}
		{logoSize}
	/>

	<TokenBalance {data} slot="title-end" />

	<ExchangeTokenValue {data} slot="description-end" />
</LogoButton>
