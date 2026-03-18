---
title: "Unsupervised Learning and Feature Engineering"
description: "A practical guide to feature scaling, clustering, dimensionality reduction, and internal validation for unsupervised machine learning workflows."
keywords:
  - unsupervised learning
  - feature engineering
  - feature scaling
  - clustering
  - k means
  - dbscan
  - gaussian mixture models
  - pca
  - silhouette score
sidebar_position: 2
---

# Unsupervised Learning and Feature Engineering

Unsupervised learning is what I use when the data has structure but no labels. The goal is not to predict a known answer. The goal is to discover useful organization in the data itself.

That sounds vague until the workflow becomes concrete: scale features properly, choose a clustering or latent-structure method that matches the geometry of the data, and validate the result carefully enough that I am not just hallucinating patterns.

## Feature Scaling and Preprocessing

Before I run a distance-based algorithm, feature scaling is usually non-negotiable.

If one feature ranges from $0$ to $1$ and another ranges from $0$ to $500{,}000$, then Euclidean distance will mostly reflect the second feature whether I want it to or not.

Min-max scaling rescales a feature into the $[0,1]$ interval:

$$
x' = \frac{x - x_{\min}}{x_{\max} - x_{\min}}
$$

Standardization is another common choice:

$$
z = \frac{x - \mu}{\sigma}
$$

The point is not mathematical elegance. The point is preventing arbitrary units from deciding the shape of the learning problem.

## Clustering

### K-Means

K-means partitions the data into $K$ clusters by alternating between assignment and centroid update steps.

The optimization target is the within-cluster sum of squares:

$$
\text{WCSS} = \sum_{k=1}^{K} \sum_{x_i \in C_k} \lVert x_i - \mu_k \rVert^2
$$

The algorithm is simple:

1. Initialize $K$ centroids.
2. Assign each point to the nearest centroid.
3. Recompute each centroid as the mean of its assigned points.
4. Repeat until convergence.

K-means is fast and useful, but it assumes clusters are roughly compact and convex. It also depends on initialization, so I should expect local minima and run it multiple times.

### Hierarchical Clustering

Hierarchical clustering builds a dendrogram rather than a single flat partition. That is useful when I care about the nested structure of the data or want to inspect clustering across multiple resolutions.

Agglomerative clustering starts with each point as its own cluster and repeatedly merges the closest pair. The result depends on the linkage rule.

- Single linkage favors chaining behavior.
- Complete linkage favors compact clusters.
- Average linkage balances the two.
- Ward's method minimizes the increase in within-cluster variance.

### DBSCAN

DBSCAN treats clusters as dense regions separated by sparse regions.

That makes it attractive when the cluster shapes are irregular or when I expect substantial noise.

Its main parameters are:

- $\varepsilon$: the neighborhood radius.
- `min_samples`: the number of nearby points needed to define a dense region.

Points become core points, border points, or noise points depending on their local density. That is why DBSCAN can find clusters that K-means simply cannot represent.

### Gaussian Mixture Models

Gaussian Mixture Models replace hard cluster assignment with probabilities. Instead of forcing every point into exactly one cluster, a GMM estimates how strongly each point belongs to each component.

That matters because many real datasets do not have perfectly crisp boundaries. A soft clustering model is often more faithful to how the structure actually looks.

## Dimensionality Reduction

Principal Component Analysis finds a new coordinate system aligned with the directions of greatest variance.

The first principal component captures the direction of maximum variance, the second captures the next largest variance subject to orthogonality, and so on.

This is useful for three reasons:

1. compressing data,
2. speeding up downstream algorithms,
3. visualizing high-dimensional structure.

PCA does not magically discover meaning. It discovers directions of variation. That distinction matters, but those directions are often exactly what I need for denoising or clustering.

## Validating Unsupervised Results

Without labels, validation is harder. I do not get to compare predictions against ground truth.

One of the most practical internal measures is the silhouette score. For a point $i$:

- $a(i)$ is the average distance to other points in the same cluster.
- $b(i)$ is the average distance to points in the nearest different cluster.

The silhouette coefficient is:

$$
s(i) = \frac{b(i) - a(i)}{\max(a(i), b(i))}
$$

A value near $1$ suggests a well-clustered point. A value near $0$ suggests ambiguity. A negative value suggests likely misassignment.

It is not a perfect score, but it is a useful guardrail against fooling myself.

## What This Means in Practice

The practical lesson of unsupervised learning is that representation quality is everything. If I scale poorly, cluster carelessly, or reduce dimensions without understanding the geometry of the data, I can manufacture patterns that are not really there.

But when the preprocessing and validation are handled well, unsupervised methods become powerful tools for segmentation, compression, exploration, and latent-structure discovery.

## What to Read Next

Continue to [Foundations and CNNs](/ai/dl/foundations-and-cnns) if you want to move from classical feature-driven ML into neural representations, or return to [Foundations and Supervised Learning](/ai/ml/foundations-and-supervised-learning) if you want the labeled-data side of the picture first.