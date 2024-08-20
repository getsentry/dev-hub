import { defineAppConfig } from "#imports";

export default defineAppConfig({
	ui: {
		primary: "purple",
		gray: "neutral",
		table: {
			th: { base: "whitespace-nowrap" },
			td: { base: "whitespace-normal" }
		}
	}
});
