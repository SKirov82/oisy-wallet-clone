<script lang="ts">
	export let styleClass: string | undefined = undefined;
	export let testId: string | undefined = undefined;
</script>

<div class={`stretch ${styleClass ?? ''}`} data-tid={testId}>
	<slot />
</div>

<slot name="outer-content" />

<div
	class="sticky bottom-0 left-0 w-full border-t border-secondary bg-surface px-3 pb-4 pt-4 md:px-6 md:pb-6 md:pt-5"
>
	<slot name="toolbar" />
</div>
