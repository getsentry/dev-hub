<script setup lang="ts">
import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import markdownit from "markdown-it";

const markdown = markdownit({
	linkify: true,
	highlight: (str, lang) => {
		if (lang && hljs.getLanguage(lang)) {
			try {
				return (
					'<pre class="border border-gray-300 rounded-md p-4 my-2"><code class="hljs text-sm">' +
					hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
					"</code></pre>"
				);
			} catch (__) {}
		}

		return (
			'<pre class="border border-gray-300 rounded-md p-4 my-2"><code class="hljs text-sm"">' +
			md.utils.escapeHtml(str) +
			"</code></pre>"
		);
	}
});

markdown.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
	tokens[idx].attrPush(["class", "mt-4"]);
	return self.renderToken(tokens, idx, options);
};

markdown.renderer.rules.link_open = function (tokens, idx, options, env, self) {
	tokens[idx].attrPush(["class", "underline"]);
	return self.renderToken(tokens, idx, options);
};

defineProps({
	source: {
		type: String,
		default: ""
	}
});
</script>

<template>
	<div v-html="markdown.render(source)" />
</template>
