---
title: Embedding Model
sidebar_position: 1
---

Embeddings lie at the heart of many modern AI applications—semantic search, Retrieval-Augmented Generation (RAG), clustering, classification, even cross-modal retrieval. Yet, with dozens of open-source and proprietary options (E5, GTE, Ada-002, BGE, Cohere Embed, Jina Embeddings 2, NV-Embed, etc.), it’s easy to feel overwhelmed. This post synthesises advice from the Beam blog ("Choosing the Best Embedding Models for RAG and Document Understanding" ([beam.cloud][1])) along with evidence from leading benchmarks (MTEB, BEIR) and recent academic work. By the end, you should have a clear framework for selecting and evaluating an embedding model that fits your use case, budget, and performance requirements.


## Start with Benchmarks, But Don’t Stop There

1. **MTEB (Massive Text Embedding Benchmark)**

   * **What it is**: MTEB evaluates dozens of embedding models across 8 tasks (retrieval, clustering, classification, etc.) and 58+ datasets in 112 languages.
   * **Why it matters**: Embedding models rarely dominate *all* tasks. [MTEB’s leaderboard](https://huggingface.co/spaces/mteb/leaderboard) shows, for instance, that E5 outperforms BM25 on zero-shot retrieval and tops the retrieval average among similarly-sized models. However, no single model “wins” every scenario.
   * **Key takeaway**: Sort by **Retrieval Average** if your primary goal is semantic search/RAG; sort by **Clustering** or **STS** if you need those specific behaviours ([arxiv.org][2], [arxiv.org][2]).

2. **BEIR (Benchmarking IR)**

   * **What it is**: BEIR covers 56 heterogeneous retrieval tasks (news, bio, finance, etc.) to stress-test zero-shot retrieval.
   * **Why it matters**: E5 was the first open-source model to outperform BM25 (a classic lexical baseline) on BEIR—showing strong generalisation without any in-domain fine-tuning ([arxiv.org][3]).

3. **Domain-Specific or Multilingual Leaderboards**

   * If you work in a highly specialised field (legal, biomedical, code), look for models trained or fine-tuned on similar corpora (e.g., BioE5 variants, CodeBERT, etc.).
   * For multilingual applications, E5’s multilingual variants or Google’s BGE-M3 might be more appropriate than strictly English-focused models.

**—but remember**: Benchmarks are typically self-reported, use curated datasets, and may appear in a model’s training data. Always follow up with **evaluation on your own data** (see Section 4).


## Define Your Primary Evaluation Criteria

Whether you consult Beam’s “best embedding models” guide ([beam.cloud][1]) or any other resource, you’ll see the same forms of trade-offs:

| Criterion               | Why It Matters                                                                            | Notes                                                                                                                                                                     |
| ----------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Retrieval Quality**   | How accurately does the model pull out relevant passages?                                 | Measured by Recall\@k, MRR, NDCG\@10 on retrieval benchmarks (BEIR, MTEB).                                                                                                |
| **Downstream Accuracy** | If you build a QA or summarisation pipeline on top, how well do chunks feed into the LLM? | Evaluate exact-match/F1 for QA tasks; ROUGE/BERTScore for summarisation.                                                                                                  |
| **Latency**             | How fast can you generate embeddings?                                                     | Larger models (e.g. E5-Large) often yield higher accuracy but take longer (and cost more) than smaller variants (e.g. E5-Small, E5-Base).                                 |
| **Compute & Memory**    | What GPU/CPU resources do you have?                                                       | Embedding dimension and model size (= memory footprint) directly impact both inference time and the cost of hosting.                                                      |
| **Cost**                | API vs. self-hosted; per-token/inference pricing                                          | Proprietary (OpenAI/Azure, Cohere) charge per 1 k tokens; open-source models only incur hosting/inference costs.                                                          |
| **Context Length**      | Does your data include long documents (≥ 512 tokens)?                                     | Most BERT-based models truncate at 512 tokens. Jina Embeddings 2 can natively handle up to 8 192 tokens, avoiding expensive splitting at inference time ([arxiv.org][4]). |
| **Language & Domain**   | Is your data multilingual or domain-specific (e.g. legal, code)?                          | Choose variants fine-tuned on domain corpora (e.g. BioE5 for biomedical, CodeE5 for code) or multilingual models (E5-Multilingual, BGE-M3).                               |
| **License & Openness**  | Do you need fully open-source (no paywall) or is a commercial API acceptable?             | Some organisations require fully open-source (e.g. Apache 2.0) for compliance; others are fine with proprietary APIs (OpenAI, Cohere).                                    |


## Survey of Leading Models

Below is a **non-exhaustive** list of embedding models frequently recommended for RAG, semantic search, and related tasks, with some advantages and caveats. Where possible, I’ve cited their benchmark performance.

### 3.1. E5 Series (by Microsoft/Bevy Labs)

* **Variants**:

  * **E5-Small** (\~20 M params), **E5-Base** (\~110 M), **E5-Large** (\~335 M), plus **Multilingual** (“mE5”) variants.
* **Training**: Weakly-supervised contrastive pre-training on a large CCPairs dataset, followed by fine-tuning on retrieval tasks ([arxiv.org][3]).
* **Key Strengths**:

  1. **Zero-Shot Retrieval**: Outperforms BM25 on BEIR (56 datasets) without any in-domain fine-tuning ([arxiv.org][3]).
  2. **Top of MTEB**: After fine-tuning, E5-Large tops the MTEB retrieval leaderboard, beating models 40× larger ([arxiv.org][3]).
  3. **Efficiency**: Even E5-Base (\~110 M params) achieves performance on par with larger proprietary embeddings (Ada-002) at a fraction of cost & size.
* **Considerations**:

  * E5’s context length is truncated to \~512 tokens. For very long documents, you must chunk manually or switch to long-document models (e.g. Jina2, NV-Embed).
  * Choose **E5-Multilingual** if you need multi-language support.

### 3.2. GTE (General-purpose Text Embeddings)

* **Variants**: GTE-Base (\~110 M), GTE-Large (\~335 M), etc.
* **Training**:

  1. **Large-scale unsupervised pre-training** on massive corpora.
  2. **Supervised contrastive fine-tuning** across diverse datasets (paraphrase, QA, classification).
* **Key Strengths**:

  * **Zero-Shot & Fine-Tuned**: GTE-Base (110 M) outperforms many black-box API embeddings on several retrieval benchmarks, rivaling models 2–3× its size.
  * **Generalisation**: Broad domain coverage—from encyclopedic text to code—without domain-specific retraining.
* **Considerations**:

  * Limited open-source availability (at the time of writing, best under commercial license).
  * Tuned primarily for English; no official multilingual variant.

> *Note: While GTE’s published results often surpass OpenAI’s Ada-002 and Cohere’s Embed V3 on retrieval tasks, always verify any third-party claims against public BEIR/MTEB results.*

### 3.3. OpenAI Ada-002 (and successor Ada-002+)

* **Vendor**: OpenAI.
* **Key Strengths**:

  * **Ease of Use** via API (no infra maintenance).
  * **Good Baseline**: Historically outperformed earlier open-source models on various semantic benchmarks.
* **Considerations**:

  * **Cost**: At \$0.0004 per 1 k tokens (as of mid-2025). Over millions of queries, costs can escalate.
  * **Opacity**: Proprietary—no fine-tuning or weight inspection.
  * **Finetuning Only via API**: Latency depends on API calls.

### 3.4. Cohere Embed V3

* **Vendor**: Cohere.
* **Key Strengths**:

  * In many public tests, Cohere’s Embed V3 closely rivals Ada-002 or E5 in retrieval tasks.
  * API latency is competitive.
* **Considerations**:

  * Commercial pricing model (per-token).
  * Limited on-premise hosting options (requires Cohere’s managed service).

### 3.5. Jina Embeddings 2

* **Paper**: *Jina Embeddings 2: 8192-Token General-Purpose Text Embeddings* ([arxiv.org][4]).
* **Key Strengths**:

  1. **Long-Document Support**: Can natively process up to 8 192 tokens, avoiding the need to split large texts into multiple embeddings and then reassemble.
  2. **State-of-the-Art**: On MTEB, matches or exceeds performance of Ada-002 on both short and long-document tasks.
* **Considerations**:

  * **Model Size & Complexity**: Requires more GPU memory (≥ 16 GB) compared to typical 512-token models.
  * **Use Case Fit**: Best when your pipeline must embed entire chapters, contracts, or research papers without chunking.

### 3.6. NV-Embed

* **Paper**: *NV-Embed: Improved Techniques for Training LLMs as Generalist Embedding Models* ([arxiv.org][5]).
* **Key Strengths**:

  1. **Unified Generation & Embedding** via “latent attention pooling”—one model can power both RAG and generation in a single pass.
  2. **Leading MTEB Scores** (No. 1 as of late 2024) across 56 tasks, especially on long documents (MTEB Long Doc, AIR QA).
* **Considerations**:

  * Still early: NV-Embed is less battle-tested in large production environments.
  * Training complexity: Two‐stage contrastive instruction tuning can be computationally expensive.


## Evaluating on Your Data: The Definitive Test

Benchmarks are a useful starting point, but **domain mismatch** or **data distribution** shifts can quickly degrade out-of-the-box performance. Follow these steps to evaluate candidates on your own data:

1. **Assemble a Small “Gold” Dataset**

   * **Retrieval/Q\&A**: For each document, write 5–10 queries with known answers (e.g. from a FAQ or support tickets).
   * **Summarisation**: Create (or obtain) 1–2 human-written summaries for a handful of documents.

2. **Embed & Index**

   * Generate embeddings for all documents (or chunks) using each candidate model.
   * Build a vector index (FAISS, Pinecone, Weaviate, etc.).

3. **Run Retrieval & Compute Metrics**

   * For each query, retrieve top-k results (commonly k = 5).
   * Compute **Recall\@k**: Did the human-annotated “answer chunk” appear in the top k?
   * Compute **MRR**: Mean Reciprocal Rank across all queries.
   * (Optional) Run your LLM-based QA prompt over the top k chunks, then measure **Exact Match** or **F1** against the reference answer.

4. **Summarisation Check**

   * If you care about summarising those chunks, feed them into your LLM pipeline (e.g. ChatGPT) and compare the generated summary to the human reference (ROUGE).

5. **Measure Embedding Latency & Cost**

   * Track per-document embedding time (on your hardware or via API).
   * Compute cost per 1 k tokens (for API models) or cost of hosting (for open-source).
   * Factor in how many embeddings you expect per day/week/month.

6. **Inspect Failure Cases**

   * If retrieval failed for a query, examine:

     * Was the ground-truth chunk split awkwardly due to token limits?
     * Did the embedding collapse synonyms or jargon incorrectly?
     * Does the parent chunk lack domain-specific vocabulary?

7. **Adjust Chunking Strategy (if Needed)**

   * If many answers straddle chunk boundaries, either shorten chunk size or increase overlap.
   * For models that truncate at 512 tokens (E5, Ada), consider using sliding windows or Jina2/NV-Embed for long passages.

By following these steps, you’ll avoid the “it scored well on BEIR, so it’ll work perfectly” pitfall. Instead, you’ll identify the model whose **real-world performance** meets your Service Level Objectives.


## Practical Tips & Frequently Asked Questions

1. ### “Should I always pick the ‘top’ model on MTEB?”

   **Not necessarily.**

   * If your documents seldom exceed 512 tokens, E5-Base or E5-Small may suffice.
   * If you only need English, and compute is tight, E5-Base often outperforms (or matches) larger proprietary models like Ada-002.
   * If latency matters more than absolute precision, smaller open-source variants (E5-Small, Cohere-Lite, etc.) can be more cost-effective.

2. ### “How do I handle multi-language or domain-specific data?”

   * For **multilingual**, use mE5 (E5-Multilingual) or open models like Google’s BGE M3.
   * For **domain-specific** (e.g. biomedical, legal), look for publicly released models fine-tuned on that domain (BioE5, LegalBERT, CodeE5).
   * If no specialist model exists, consider **fine-tuning** on a small domain corpus—E5 can be fine-tuned quickly on domain-specific pairs.

:::info Amazon Titan Embedding model
Amazon Titan Text Embeddings V2 (the latest version):
- Supports over 100 languages in pre-training
- Can process input text up to 8,192 tokens or 50,000 characters
- Optimized for English but handles multilingual queries across a wide range of languages

Important considerations:

- While the model supports multilingual input, it's optimized primarily for English
- Cross-language queries (such as having a knowledge base in one language and querying it in another language) may result in sub-optimal performance
- The model generates meaningful vector representations (embeddings) for text in various languages
:::

3. ### “Should I worry about embedding dimension?”

   * **Higher dimension** (e.g. 768 vs. 384) can capture more nuance, but increases index size and search latency.
   * If you index millions of documents, 384-dim models (E5-Small/Base) often offer a good dimension/quality trade-off.

4. ### “What about cost comparisons (API vs. self-hosted)?”

   * **API** (OpenAI, Cohere): \$0.0004–\$0.0012 per 1 k tokens (April 2025).
   * **Self-hosted**:

     * GPU (V-100/A100): \~\$0.35–\$1.50 /hour for inference (depending on cloud vendor).
     * Server cost varies widely—some teams save by quantising (e.g. 8-bit) or using CPU-only inference with ONNX runtime (if throughput is modest).

5. ### “What if I have very long documents (> 4 k tokens)?”

   * **Option A**: **Sliding windows** in 512-token increments, then embed each chunk with E5 or Ada and index all.
   * **Option B**: Use a **long-context embedding** (Jina Embeddings 2 or NV-Embed). This reduces overhead and often yields better retrieval because the model sees more context at once.

6. ### “Can generative LLMs (GPT-4, Claude 3) be used as embedding models?”

   * Some research shows that **decoder-only LLMs** (e.g. Falcon, LLaMA, Mistral) can produce competitive embeddings if you extract the final hidden state or pool the last token.
   * However, these embeddings are often larger (1 024–2 048 dims) and slower. If you need tight integration (e.g. RAG), sticking to specialised contrastive models (E5, NV-Embed) is usually easier.


**Step-by-step**:

1. **Define your use case** (multilingual vs. English, document length, budget).
2. **Filter candidate models** by language support and token limits.
3. If documents exceed 512 tokens, pick a long-context model (Jina Embeddings 2, NV-Embed).
4. Otherwise, start with mid-sized contrastive models (E5-Base, GTE-Base).
5. **Evaluate** each candidate on your own queries/documents.
6. **Balance** retrieval quality vs. latency/cost to make your final choice.


## Example: From Beam’s Advice to Your Pipeline

Below is a simplified outline of how a small analytics team might choose and integrate an embedding model:

1. **Use Case**:

   * **RAG for Customer Support**:  FAQ docs (avg. 300 tokens), 1 000 docs.
   * **Language**: English.
   * **Budget**: Moderate (prefer self-hosted if quality is comparable).

2. **Candidate Shortlist** (from Beam blog + MTEB):

   * **E5-Base** (110 M, 512 token limit).
   * **Cohere Embed V3** (proprietary).
   * **OpenAI Ada-002** (proprietary).
   * **GTE-Base** (110 M, licence TBD).
   * **Jina Embeddings 2** (for future long docs).

3. **Initial Benchmark Check**:

   * MTEB retrieval scores: E5-Base \~ 0.81 NDCG\@10; Ada-002 \~ 0.78; Cohere V3 \~ 0.80; GTE-Base \~ 0.82.
   * Since all are close, put heavier weight on cost/latency.

4. **Local Data Evaluation**:

   * Build a mini-index of 100 sample FAQs.
   * Create 20 test queries with known “ideal answers.”
   * For each model: embed all 100 FAQs → index → retrieve top 5 → measure Recall\@5.

     * **E5-Base**: 0.90 @5, avg embedding time 0.8 sec per doc (on V-100).
     * **GTE-Base**: 0.91 @5, avg embedding time 1.1 sec per doc.
     * **Ada-002**: 0.88 @5, 1.5 sec per doc via API.
     * **Cohere V3**: 0.89 @5, 1.2 sec per doc via API.
   * Cost:

     * **E5-Base** (self-hosted) \~ \$0.20 /hr GPU usage for batch encoding.
     * **GTE-Base**: licensing unknown/variable.
     * **Ada-002**: \~ \$0.04 per run (100 docs ∼ 0.005 tokens per doc, trivial).
     * **Cohere V3**: \~ \$0.03 per 1 k tokens.

5. **Make a Decision**:

   * **E5-Base** has near-top retrieval, fast on-premise inference, and minimal incremental cost once the GPU cluster is live.
   * **GTE-Base** slightly edges recall but would add licensing complexity.
   * **Action**:

     * Adopt **E5-Base** for production RAG.
     * **Plan** to re-evaluate in 6 months if GTE licensing becomes clearer or if queries need multi-lingual support.


## Final Recommendations

1. **Always start with a benchmark checkpoint** (MTEB, BEIR) to narrow down your candidates.
2. **Consider your data’s language & token length** before rushing into a “bigger” model.
3. **Test on a small gold set**: Retrieval metrics on your own queries are far more telling than leaderboard ranks alone.
4. **Balance retrieval accuracy against latency & cost**: Often a small decrease in Recall\@5 is acceptable if it halves your GPU cost or throughput.
5. **Keep an eye on new research**: Models like NV-Embed and Jina Embeddings 2 push the envelope for long documents; E5 variants improve multilingual coverage; GTE continues to refine multi-stage contrastive training.
6. **Document your evaluation results**: Store your Recall\@5, MRR, embedding time, and cost in a simple table (e.g., a CSV or DataFrame) so that future team members understand why you chose “Model X” in 2025—not just because it “won on MTEB last year.”


### References

1. Beam Cloud Blog: **“Choosing the Best Embedding Models for RAG and Document Understanding”** ([beam.cloud][1])
2. Liang Wang et al., **“Text Embeddings by Weakly-Supervised Contrastive Pre-training”** (E5) ([arxiv.org][3])
3. Michael Günther et al., **“Jina Embeddings 2: 8192-Token General-Purpose Text Embeddings for Long Documents”** ([arxiv.org][4])
4. Chankyu Lee et al., **“NV-Embed: Improved Techniques for Training LLMs as Generalist Embedding Models”** ([arxiv.org][5])
5. Niklas Muennighoff et al., **“MTEB: Massive Text Embedding Benchmark”** ([arxiv.org][2], [arxiv.org][2])


[1]: https://www.beam.cloud/blog/best-embedding-models?utm_source=chatgpt.com "Choosing the Best Embedding Models for RAG and Document ..."
[2]: https://arxiv.org/abs/2210.07316?utm_source=chatgpt.com "MTEB: Massive Text Embedding Benchmark"
[3]: https://arxiv.org/abs/2212.03533?utm_source=chatgpt.com "Text Embeddings by Weakly-Supervised Contrastive Pre-training"
[4]: https://arxiv.org/abs/2310.19923?utm_source=chatgpt.com "Jina Embeddings 2: 8192-Token General-Purpose Text Embeddings for Long Documents"
[5]: https://arxiv.org/abs/2405.17428?utm_source=chatgpt.com "NV-Embed: Improved Techniques for Training LLMs as Generalist Embedding Models"
