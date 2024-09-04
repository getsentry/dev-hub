import { defineEventHandler } from "#imports";

export default defineEventHandler((event) => {
	throw new Error("Example Server error");
});
