<script lang="ts">
	import { nonNullish } from '@dfinity/utils';
	import { getContext } from 'svelte';
	import TokenInput from '$lib/components/tokens/TokenInput.svelte';
	import TokenInputAmountExchange from '$lib/components/tokens/TokenInputAmountExchange.svelte';
	import TokenInputBalance from '$lib/components/tokens/TokenInputBalance.svelte';
	import { CONVERT_CONTEXT_KEY, type ConvertContext } from '$lib/stores/convert.store';
	import type { OptionAmount } from '$lib/types/send';
	import type { DisplayUnit } from '$lib/types/swap';
	import { formatTokenBigintToNumber } from '$lib/utils/format.utils';

	export let sendAmount: OptionAmount = undefined;
	export let receiveAmount: number | undefined = undefined;
	export let destinationTokenFee: bigint | undefined = undefined;
	export let exchangeValueUnit: DisplayUnit = 'usd';
	export let inputUnit: DisplayUnit = 'token';

	const { destinationToken, destinationTokenBalance, destinationTokenExchangeRate } =
		getContext<ConvertContext>(CONVERT_CONTEXT_KEY);

	$: receiveAmount = nonNullish(sendAmount)
		? nonNullish(destinationTokenFee)
			? Math.max(
					Number(sendAmount) -
						formatTokenBigintToNumber({
							value: destinationTokenFee,
							displayDecimals: $destinationToken.decimals,
							unitName: $destinationToken.decimals
						}),
					0
				)
			: Number(sendAmount)
		: undefined;
</script>

<TokenInput
	token={$destinationToken}
	amount={receiveAmount}
	exchangeRate={$destinationTokenExchangeRate}
	disabled={true}
	isSelectable={false}
	displayUnit={inputUnit}
>
	<div slot="amount-info" class="text-tertiary">
		<TokenInputAmountExchange
			amount={receiveAmount}
			exchangeRate={$destinationTokenExchangeRate}
			token={$destinationToken}
			bind:displayUnit={exchangeValueUnit}
		/>
	</div>

	<TokenInputBalance
		slot="balance"
		testId="convert-amount-destination-balance"
		token={$destinationToken}
		balance={$destinationTokenBalance}
	/>
</TokenInput>
