<script lang="ts">
	import { debounce, isNullish } from '@dfinity/utils';
	import { flip } from 'svelte/animate';
	import { fade } from 'svelte/transition';
	import { erc20UserTokensNotInitialized } from '$eth/derived/erc20.derived';
	import Listener from '$lib/components/core/Listener.svelte';
	import ManageTokensModal from '$lib/components/manage/ManageTokensModal.svelte';
	import NoTokensPlaceholder from '$lib/components/tokens/NoTokensPlaceholder.svelte';
	import TokenCardContent from '$lib/components/tokens/TokenCardContent.svelte';
	import TokenCardWithUrl from '$lib/components/tokens/TokenCardWithUrl.svelte';
	import TokenGroupCard from '$lib/components/tokens/TokenGroupCard.svelte';
	import TokensDisplayHandler from '$lib/components/tokens/TokensDisplayHandler.svelte';
	import TokensSkeletons from '$lib/components/tokens/TokensSkeletons.svelte';
	import { modalManageTokens } from '$lib/derived/modal.derived';
	import type { TokenUiOrGroupUi } from '$lib/types/token-group';
	import { isTokenUiGroup } from '$lib/utils/token-group.utils';

	let tokens: TokenUiOrGroupUi[] | undefined;

	let animating = false;

	const handleAnimationStart = () => {
		animating = true;

		// The following is to guarantee that the function is triggered, even if 'animationend' event is not triggered.
		// It may happen if the animation aborts before reaching completion.
		debouncedHandleAnimationEnd();
	};

	const handleAnimationEnd = () => (animating = false);

	const debouncedHandleAnimationEnd = debounce(() => {
		if (animating) {
			handleAnimationEnd();
		}
	}, 250);

	let loading: boolean;
	$: loading = $erc20UserTokensNotInitialized || isNullish(tokens);
</script>

<TokensDisplayHandler bind:tokens>
	<TokensSkeletons {loading}>
		<div class="mb-3 flex flex-col gap-3">
			{#each tokens ?? [] as tokenOrGroup (isTokenUiGroup(tokenOrGroup) ? tokenOrGroup.group.id : tokenOrGroup.token.id)}
				<div
					class="overflow-hidden rounded-xl"
					transition:fade
					animate:flip={{ duration: 250 }}
					on:animationstart={handleAnimationStart}
					on:animationend={handleAnimationEnd}
					class:pointer-events-none={animating}
				>
					{#if isTokenUiGroup(tokenOrGroup)}
						{@const { group: tokenGroup } = tokenOrGroup}

						<TokenGroupCard {tokenGroup} />
					{:else}
						{@const { token } = tokenOrGroup}

						<Listener {token}>
							<TokenCardWithUrl styleClass="rounded-xl px-3 py-2 hover:bg-brand-subtle-10" {token}>
								<TokenCardContent data={token} />
							</TokenCardWithUrl>
						</Listener>
					{/if}
				</div>
			{/each}
		</div>

		{#if tokens?.length === 0}
			<NoTokensPlaceholder />
		{/if}

		{#if $modalManageTokens}
			<ManageTokensModal />
		{/if}
	</TokensSkeletons>
</TokensDisplayHandler>
