<script lang="ts">
	import { IconUser, Popover } from '@dfinity/gix-components';
	import { nonNullish } from '@dfinity/utils';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import AboutWhyOisy from '$lib/components/about/AboutWhyOisy.svelte';
	import MenuAddresses from '$lib/components/core/MenuAddresses.svelte';
	import SignOut from '$lib/components/core/SignOut.svelte';
	import IconGitHub from '$lib/components/icons/IconGitHub.svelte';
	import IconVipQr from '$lib/components/icons/IconVipQr.svelte';
	import IconShare from '$lib/components/icons/lucide/IconShare.svelte';
	import LicenseLink from '$lib/components/license-agreement/LicenseLink.svelte';
	import ChangelogLink from '$lib/components/navigation/ChangelogLink.svelte';
	import DocumentationLink from '$lib/components/navigation/DocumentationLink.svelte';
	import SupportLink from '$lib/components/navigation/SupportLink.svelte';
	import ButtonIcon from '$lib/components/ui/ButtonIcon.svelte';
	import ButtonMenu from '$lib/components/ui/ButtonMenu.svelte';
	import Hr from '$lib/components/ui/Hr.svelte';
	import { OISY_REPO_URL } from '$lib/constants/oisy.constants';
	import {
		NAVIGATION_MENU_BUTTON,
		NAVIGATION_MENU,
		NAVIGATION_MENU_VIP_BUTTON,
		NAVIGATION_MENU_REFERRAL_BUTTON
	} from '$lib/constants/test-ids.constants';
	import { authIdentity } from '$lib/derived/auth.derived';
	import { isVipUser } from '$lib/services/reward.services';
	import { i18n } from '$lib/stores/i18n.store';
	import { modalStore } from '$lib/stores/modal.store';
	import {
		isRouteActivity,
		isRouteRewards,
		isRouteDappExplorer,
		isRouteSettings
	} from '$lib/utils/nav.utils';

	let visible = false;
	let button: HTMLButtonElement | undefined;

	let isVip = false;
	onMount(async () => {
		if (nonNullish($authIdentity)) {
			isVip = (
				await isVipUser({
					identity: $authIdentity
				})
			).success;
		}
	});

	const hidePopover = () => (visible = false);

	let settingsRoute = false;
	$: settingsRoute = isRouteSettings($page);

	let dAppExplorerRoute = false;
	$: dAppExplorerRoute = isRouteDappExplorer($page);

	let activityRoute = false;
	$: activityRoute = isRouteActivity($page);

	let rewardsRoute = false;
	$: rewardsRoute = isRouteRewards($page);

	let addressesOption = true;
	$: addressesOption = !settingsRoute && !dAppExplorerRoute && !activityRoute && !rewardsRoute;
</script>

<ButtonIcon
	bind:button
	on:click={() => (visible = true)}
	ariaLabel={$i18n.navigation.alt.menu}
	testId={NAVIGATION_MENU_BUTTON}
	colorStyle="tertiary-alt"
	link={false}
>
	<IconUser size="24" slot="icon" />
	{$i18n.navigation.alt.menu}
</ButtonIcon>

<Popover bind:visible anchor={button} direction="rtl" on:click={hidePopover}>
	<div class="flex flex-col gap-1" data-tid={NAVIGATION_MENU}>
		{#if addressesOption}
			<MenuAddresses on:icMenuClick={hidePopover} />
		{/if}

		<ButtonMenu
			ariaLabel={$i18n.navigation.alt.refer_a_friend}
			testId={NAVIGATION_MENU_REFERRAL_BUTTON}
			on:click={modalStore.openReferralCode}
		>
			<IconShare size="20" />
			{$i18n.navigation.text.refer_a_friend}
		</ButtonMenu>

		{#if isVip}
			<ButtonMenu
				ariaLabel={$i18n.navigation.alt.vip_qr_code}
				testId={NAVIGATION_MENU_VIP_BUTTON}
				on:click={modalStore.openVipQrCode}
			>
				<IconVipQr size="20" />
				{$i18n.navigation.text.vip_qr_code}
			</ButtonMenu>
		{/if}

		<Hr />

		<AboutWhyOisy asMenuItem asMenuItemCondensed on:icOpenAboutModal={hidePopover} />

		<DocumentationLink asMenuItem asMenuItemCondensed />

		<SupportLink asMenuItem asMenuItemCondensed />

		<Hr />

		<a
			href={OISY_REPO_URL}
			rel="external noopener noreferrer"
			target="_blank"
			class="nav-item nav-item-condensed"
			aria-label={$i18n.navigation.text.source_code_on_github}
		>
			<IconGitHub />
			{$i18n.navigation.text.source_code}
		</a>

		<ChangelogLink asMenuItem asMenuItemCondensed />

		<Hr />

		<SignOut on:icLogoutTriggered={hidePopover} />

		<Hr />

		<span class="text-center text-sm text-tertiary">
			<LicenseLink noUnderline />
		</span>
	</div>
</Popover>
