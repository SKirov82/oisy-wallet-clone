<script lang="ts">
	// TODO: this component is deprecated and will be replaced with EthFeeDisplay in the new send/convert flow UI

	import { Html } from '@dfinity/gix-components';
	import { isNullish, nonNullish } from '@dfinity/utils';
	import { getContext, onDestroy } from 'svelte';
	import { FEE_CONTEXT_KEY, type FeeContext } from '$eth/stores/fee.store';
	import FeeAmountDisplay from '$icp-eth/components/fee/FeeAmountDisplay.svelte';
	import { i18n } from '$lib/stores/i18n.store';
	import type { Option } from '$lib/types/utils';

	const {
		maxGasFee,
		feeSymbolStore,
		feeTokenIdStore,
		feeDecimalsStore,
		feeExchangeRateStore
	}: FeeContext = getContext<FeeContext>(FEE_CONTEXT_KEY);

	let fee: Option<bigint> = undefined;

	let timer: NodeJS.Timeout | undefined;

	// The time is used to animate the UI - i.e. displays a fade animation each time the fee is updated
	$: $maxGasFee,
		(() => {
			fee = undefined;

			if (isNullish($maxGasFee)) {
				return;
			}

			const calculateFee = () => {
				if (isNullish($maxGasFee)) {
					return;
				}

				fee = $maxGasFee;
			};

			timer = setTimeout(calculateFee, 500);
		})();

	onDestroy(() => {
		if (isNullish(timer)) {
			return;
		}

		clearTimeout(timer);
	});
</script>

<label for="max-fee-eth" class="font-bold">
	<Html text={$i18n.fee.text.max_fee_eth} />
</label>

<div id="max-fee-eth" class="mb-4 min-h-6 break-all font-normal">
	{#if nonNullish(fee) && nonNullish($feeSymbolStore) && nonNullish($feeTokenIdStore) && nonNullish($feeDecimalsStore)}
		<FeeAmountDisplay
			{fee}
			feeSymbol={$feeSymbolStore}
			feeTokenId={$feeTokenIdStore}
			feeDecimals={$feeDecimalsStore}
			feeExchangeRate={$feeExchangeRateStore}
		/>
	{/if}
</div>
