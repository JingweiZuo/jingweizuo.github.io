/* ============================================================
   Shared Project Card Data — Single Source of Truth
   Edit entries here; they auto-populate every page via [data-project].
   ============================================================ */
window.PROJECTS = {

  "falcon-h1": {
    title: "Falcon-H1",
    desc: "Hybrid Transformer\u2013SSM architecture redefining efficiency across 0.5B\u201334B scale. SoTA at every size tier with up to 4\u00d7 input and 8\u00d7 output throughput gains.",
    image: "falcon-h1.png",
    imageAlt: "Falcon-H1 logo",
    page: "falcon-h1.html",
    badge: null,
    titleSuffix: "",
    links: [
      { label: "Paper", url: "https://arxiv.org/abs/2507.22448" },
      { label: "Models", url: "https://huggingface.co/collections/tiiuae/falcon-h1-6819f2795bc406da60fab8df" },
      { label: "Blog", url: "https://falcon-lm.github.io/blog/falcon-h1/" },
      { label: "GitHub", url: "https://github.com/tiiuae/Falcon-H1" }
    ],
    hasCite: true
  },

  "falcon-h1-tiny": {
    title: "Falcon-H1-Tiny",
    desc: "Extremely compact yet powerful: 90M English, Coder, Tool Calling, 100M Multilingual, and 0.6B Reasoning models.",
    image: "falcon-h1-tiny.png",
    imageAlt: "Falcon-H1-Tiny architecture specs",
    page: "falcon-h1-tiny.html",
    badge: "NEW",
    titleSuffix: "",
    links: [
      { label: "Models", url: "https://huggingface.co/collections/tiiuae/falcon-h1-tiny" },
      { label: "Blog", url: "https://huggingface.co/spaces/tiiuae/tiny-h1-blogpost" }
    ],
    hasCite: true
  },

  "falcon-edge": {
    title: "Falcon Edge",
    desc: "1.58-bit ternary language models based on BitNet \u2014 powerful, universal, and fine-tunable.",
    image: "falcon-edge.png",
    imageAlt: "Falcon Edge logo",
    page: "falcon-edge.html",
    badge: null,
    titleSuffix: "",
    links: [
      { label: "Models", url: "https://huggingface.co/collections/tiiuae/falcon-edge-series-6804fd13344d6d8a8fa71130" },
      { label: "Blog", url: "https://falcon-lm.github.io/blog/falcon-edge/" }
    ],
    hasCite: false
  },

  "falcon-3": {
    title: "Falcon 3",
    desc: "Five base + instruct models from 1B to 10B, plus Mamba 7B. Pushing the boundaries of open-source LLMs under 10B.",
    image: "falcon-3.png",
    imageAlt: "Falcon 3 model specifications",
    page: "falcon-3.html",
    badge: null,
    titleSuffix: "",
    links: [
      { label: "Models", url: "https://huggingface.co/collections/tiiuae/falcon3-67605ae03578be86e4e87026" },
      { label: "Blog", url: "https://huggingface.co/blog/falcon3" }
    ],
    hasCite: true
  },

  "falcon-mamba": {
    title: "Falcon Mamba",
    desc: "The first competitive attention-free 7B language model, proving SSMs can match Transformers at scale.",
    image: "falcon-mamba.png",
    imageAlt: "Falcon Mamba throughput and memory comparison",
    page: "falcon-mamba.html",
    badge: null,
    titleSuffix: "",
    links: [
      { label: "Paper", url: "https://arxiv.org/abs/2410.05355" },
      { label: "Model", url: "https://huggingface.co/tiiuae/falcon-mamba-7b" },
      { label: "Blog", url: "https://huggingface.co/blog/falconmamba" }
    ],
    hasCite: true
  },

  "learnable-multiplier": {
    title: "Learnable Multiplier",
    desc: "Extends \u00b5-parameterization with learnable per-layer scaling, improving LLM training dynamics.",
    image: "learnable-multiplier.png",
    imageAlt: "Learnable Multiplier scaling experiments",
    page: "learnable-multiplier.html",
    badge: null,
    titleSuffix: "",
    links: [
      { label: "Paper", url: "https://arxiv.org/abs/2601.04890" }
    ],
    hasCite: true
  },

  "e2lm": {
    title: "E2LM Competition",
    desc: "Community competition on early-stage training evaluation of language models. First prize: $6,000.",
    image: "e2lm.png",
    imageAlt: "E2LM Competition training evaluation curves",
    page: "e2lm.html",
    badge: null,
    titleSuffix: " <span style=\"font-family:var(--font-sans);font-size:0.75rem;font-weight:400;color:var(--text-tertiary);\">(NeurIPS 2025)</span>",
    links: [
      { label: "Paper", url: "https://arxiv.org/abs/2506.07731" },
      { label: "Website", url: "https://e2lmc.github.io/" }
    ],
    hasCite: true
  }

};
