<script lang="ts">
	import { ProgressSteps as ProgressStepsCmp, type ProgressStep } from '@dfinity/gix-components';
	import StaticSteps from '$lib/components/ui/StaticSteps.svelte';
	import type { ProgressSteps } from '$lib/types/progress-steps';
	import type { StaticStep } from '$lib/types/steps';

	export let progressStep: string;
	export let steps: [ProgressStep | StaticStep, ...(ProgressStep | StaticStep)[]];
	export let type: 'progress' | 'static' = 'progress';

	let cmp: typeof StaticSteps | typeof ProgressStepsCmp;
	$: cmp = type === 'static' ? StaticSteps : ProgressStepsCmp;

	let dynamicSteps: [ProgressStep, ...ProgressStep[]] = [
		// TODO: have a look if there is a better solution than casting
		...(steps as [ProgressStep, ...ProgressStep[]])
	];

	const updateSteps = () => {
		const progressIndex = dynamicSteps.findIndex(({ step }) => step === progressStep);

		dynamicSteps = dynamicSteps.map((step, index) =>
			step.step === progressStep
				? {
						...step,
						state: 'in_progress'
					}
				: {
						...step,
						state: index < progressIndex || progressStep === 'done' ? 'completed' : 'next'
					}
		) as ProgressSteps;
	};

	$: progressStep, updateSteps();
</script>

<div class="px-2 pb-3">
	<svelte:component this={cmp} steps={dynamicSteps} />
</div>
