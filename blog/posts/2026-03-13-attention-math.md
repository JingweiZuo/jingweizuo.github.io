---
title: "The Mathematics of Attention Mechanisms"
date: 2026-03-13
summary: "A walkthrough of the core equations behind Transformer attention, from scaled dot-product to multi-head, with intuition for why each piece matters."
tags: ["Transformers", "Attention", "LLM"]
---

## Scaled Dot-Product Attention

The fundamental building block of the Transformer is **scaled dot-product attention**. Given a set of queries $Q$, keys $K$, and values $V$, attention computes:

$$
\text{Attention}(Q, K, V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right) V
$$

where $d_k$ is the dimension of the key vectors. The scaling factor $\frac{1}{\sqrt{d_k}}$ prevents the dot products from growing too large in magnitude, which would push the softmax into regions with extremely small gradients.

## Why Scale by $\sqrt{d_k}$?

Consider two random vectors $q, k \in \mathbb{R}^{d_k}$ with entries drawn i.i.d. from $\mathcal{N}(0, 1)$. Their dot product $q \cdot k = \sum_{i=1}^{d_k} q_i k_i$ has:

- **Mean**: $\mathbb{E}[q \cdot k] = 0$
- **Variance**: $\text{Var}(q \cdot k) = d_k$

So the standard deviation grows as $\sqrt{d_k}$. Dividing by this factor normalizes the logits to unit variance, keeping the softmax well-behaved regardless of the model dimension.

## Multi-Head Attention

Rather than computing a single attention function, multi-head attention runs $h$ parallel attention heads, each with its own learned projections:

$$
\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h) W^O
$$

where each head is:

$$
\text{head}_i = \text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)
$$

with $W_i^Q \in \mathbb{R}^{d_\text{model} \times d_k}$, $W_i^K \in \mathbb{R}^{d_\text{model} \times d_k}$, $W_i^V \in \mathbb{R}^{d_\text{model} \times d_v}$, and $W^O \in \mathbb{R}^{hd_v \times d_\text{model}}$.

## Code Example

Here is a minimal PyTorch implementation of scaled dot-product attention:

```python
import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V, mask=None):
    d_k = Q.size(-1)
    scores = torch.matmul(Q, K.transpose(-2, -1)) / d_k ** 0.5
    if mask is not None:
        scores = scores.masked_fill(mask == 0, float('-inf'))
    weights = F.softmax(scores, dim=-1)
    return torch.matmul(weights, V)
```

## The Softmax Bottleneck

One limitation of standard attention is the **softmax bottleneck**: the attention matrix $A = \text{softmax}(QK^\top / \sqrt{d_k})$ is constrained to be a row-stochastic matrix of rank at most $d_k$. When the true target distribution requires a higher-rank context mapping, softmax attention may be unable to represent it. This is one motivation for exploring alternative architectures like State Space Models (SSMs).

## Connection to Hybrid Architectures

In hybrid models like Falcon-H1, attention heads and SSM heads operate in parallel. The attention heads compute:

$$
h_\text{attn} = \text{Attention}(QW^Q, KW^K, VW^V)
$$

while the SSM heads process the same hidden state through a state-space recurrence:

$$
x_t = \bar{A} x_{t-1} + \bar{B} u_t, \quad y_t = C x_t
$$

The outputs are combined before the feed-forward layer, allowing the model to leverage both precise in-context retrieval (attention) and efficient sequence compression (SSM) at every layer.
