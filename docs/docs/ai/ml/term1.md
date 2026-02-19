---
title: "Core Concepts, Models & Evaluation"
description: "An engineer-friendly machine learning notebook covering model evaluation (bias–variance, metrics, validation), hyperparameter tuning (cross-validation and grid search), supervised learning (linear models, Naive Bayes, SVMs, decision trees and ensembles), and unsupervised learning (scaling, clustering and dimensionality reduction)."
keywords:
  [
    machine learning,
    ml study guide,
    model evaluation,
    bias variance tradeoff,
    training test split,
    cross validation,
    k fold,
    grid search,
    hyperparameter tuning,
    regression metrics,
    classification metrics,
    supervised learning,
    linear regression,
    logistic regression,
    regularisation,
    naive bayes,
    support vector machines,
    decision trees,
    random forest,
    gradient boosting,
    ensemble methods,
    unsupervised learning,
    feature scaling,
    clustering,
    k means,
    hierarchical clustering,
    dbscan,
    gaussian mixture model,
    dimensionality reduction,
    pca
  ]
---

## **Part 1: Model Evaluation & Validation**

Welcome\! This guide is designed for experienced software engineers diving into the world of machine learning. Our goal is to skip the dense academic theory and focus on the practical, intuitive understanding you need to build and evaluate effective ML models. We'll focus on the "why," the practical trade-offs, and how concepts connect.

Let's start with a concrete goal: you're a real estate agent in Boston with access to a dataset of housing information. Your mission is to build a model that can accurately predict the selling price of a new home. This isn't just an academic exercise; it's about building a tool that works in the real world. This brings us to the most fundamental question in machine learning: **How do we know if our model is any good?**

### **The Core Task: Training and Testing**

At its heart, machine learning is about using data to train a model that can make predictions on *new, unseen data*. The process generally looks like this:

1. **Get Data:** We start with a dataset containing features (e.g., number of rooms, crime rate) and a target label (e.g., house price).  
2. **Train a Model:** We feed this data to a learning algorithm, which "learns" the relationship between the features and the target.  
3. **Make Predictions:** We can then give the trained model new data it has never seen before, and it will predict the outcome.

The single most important rule in this process is one we must never, ever break:

:::danger The Golden Rule

**Thou Shalt Not Use Thy Testing Data for Training.**

A model's true performance is judged by its ability to generalize to new data. If the model has seen the "answers" (the test data) during training, its performance score will be artificially inflated and completely useless for predicting its real-world performance. The test set must be kept in a vault, untouched until the very end of our development process.

:::

In practice, we use libraries like scikit-learn to handle this split for us.

```python
from sklearn.model_selection import train_test_split

# X contains our features, y contains our target labels (prices)  
X_train, X_test, y_train, y_test = train_test_split(  
    X,   
    y,   
    test_size=0.25,   
    random_state=42  
)

# We now use X_train and y_train to build our model  
# We will only use X_test and y_test at the very end to get a final score
```

:::info A Note on Reproducibility

The random\_state parameter is crucial for reproducibility. The train-test split is a random process. Setting a random\_state ensures that you get the exact same split every time you run the code. This is vital for debugging and for ensuring that when you share your code with a colleague, they can reproduce your exact results.

:::

### **The Fundamental Trade-Off: Bias vs. Variance**

Imagine trying to solve a problem. You could oversimplify it, or you could overcomplicate it. This is the central challenge in modeling. This trade-off is the perpetual balancing act in machine learning.

![bias-in-different-models](/img/ai/ml/bias-in-different-models.webp)

Resource: [Techniques for handling underfitting and overfitting in Machine Learning](https://towardsdatascience.com/techniques-for-handling-underfitting-and-overfitting-in-machine-learning-348daa2380b9)

* **Oversimplifying (Underfitting):** This is like trying to kill Godzilla with a flyswatter. You've chosen a tool that's too simple for the complexity of the problem. An underfit model fails to capture the underlying patterns in the data because its assumptions are too rigid (e.g., assuming a complex, wavy relationship is a straight line). This leads to **high bias**. The model is "biased" towards its simple assumptions and ignores the data's complexity. It performs poorly on both the training data and the test data.  
* **Overcomplicating (Overfitting):** This is like trying to kill a fly with a bazooka. You've chosen a tool that's far too powerful and complex. An overfit model doesn't learn the general patterns; it memorizes the training data, including all its noise and random quirks. This leads to **high variance**. The model's predictions would vary wildly if you were to train it on a different subset of your data. It performs exceptionally well on the training data but fails miserably on the test data because the noise it memorized doesn't exist in the new data.

| **Model State** | **Description** | **Performance on Training Data** | **Performance on Test Data** |
|---|---|---|---|
| **Underfitting** | Too simple. High bias. | Bad | Bad |
| **Good Fit** | Captures the general trend. Low bias & low variance. | Good | Good |
| **Overfitting** | Too complex. High variance. | Great! (Memorised) | Bad |

Our goal is to find the "Goldilocks" model in the middle—one that is complex enough to capture the real patterns but simple enough to ignore the noise and generalize to new data. This is often called the point of optimal model complexity.

### **How Good Is Good? Metrics for Success**

To find the best model, we need a way to score it. The metric we choose depends entirely on the type of problem we're solving.

#### **Regression Metrics (For Predicting Prices)**

In our Boston housing project, we are predicting a continuous value (the price). This is a **regression** problem. Here are a few common ways to measure error:

1. **Mean Absolute Error (MAE):** This is the simplest metric. It's the average of the absolute differences between the predicted prices and the actual prices. It answers the question: "On average, how far off was our prediction in absolute dollars?" It's easy to understand but less sensitive to large errors.![][image1]  
2. **Mean Squared Error (MSE):** This is the most common metric for regression. It's the average of the *squared* differences between predicted and actual values. Squaring the error has two useful properties: it punishes larger errors more heavily, and it's differentiable, which is handy for optimization algorithms like gradient descent. The downside is that its units are squared (e.g., "dollars squared"), which is not intuitive.![][image2]  
3. **R² Score (Coefficient of Determination):** This is a more intuitive metric. It tells you how much of the variance in the target variable our model can explain. An R² score of 1.0 means the model perfectly predicts the prices. An R² score of 0.0 means our model is no better than a naive model that just predicts the average price for every house. It can even be negative if our model is actively worse than the naive average. Please put the R-squared score formula here

#### **Classification Metrics (For Predicting Categories)**

What if we were solving a different problem, like classifying an email as "Spam" or "Not Spam"? This is a **classification** problem.

**The Confusion Matrix**

The starting point for all classification metrics is the **Confusion Matrix**. It's a simple table that breaks down our predictions against the actual outcomes.

|  | **Predicted: Spam** | **Predicted: Not Spam** |
|---|---|---|
| **Actual: Spam** | True Positive (TP) | False Negative (FN) |
| **Actual: Not Spam** | False Positive (FP) | True Negative (TN) |

* **True Positives (TP):** Spam we correctly identified as spam.  
* **True Negatives (TN):** Normal emails we correctly identified as normal.  
* **False Positives (FP):** Normal emails we accidentally classified as spam. **(Type I Error)**  
* **False Negatives (FN):** Spam emails we missed and allowed into the inbox. **(Type II Error)**

![type-1&2-error](/img/ai/ml/type-1&2-error.webp)

Resource: [Before we can balance false positives and false negatives, we have to publish false negatives.](https://replicationindex.com/category/type-1-error/)


**Accuracy: A Deceptively Simple Metric**

The most basic metric is **accuracy**: what fraction of predictions did we get right?

![][image3]

:::warning
Accuracy can be very misleading, especially with imbalanced datasets. If 99% of emails are not spam, a model that simply predicts "Not Spam" for every email will have 99% accuracy, but it will be completely useless because it never catches any spam\! This is why we need more nuanced metrics.
:::

**Precision vs. Recall: The Critical Trade-Off**

Because accuracy is often flawed, we need more nuanced metrics. The two most important are Precision and Recall. The choice between them depends on the business problem and which type of error is more costly.

* **Precision: How many of our positive predictions were actually correct?**  
  * **Formula:** $\text{Precision} = \frac{TP}{TP + FP}$
  * **Focus:** Minimizing **False Positives**.  
  * **When to use:** When the cost of a false positive is high.  
    * **Spam Detection:** You don't want to send a critical email (e.g., a job offer) to the spam folder. You want to be very *precise* when you predict spam.  
    * **Promotional Mail:** It costs money to send samples. You want to be sure the people you send them to are actually potential clients.  
* **Recall: Of all the actual positives, how many did we find?**  
  * **Formula:** $\text{Recall} = \frac{TP}{TP + FN}$
  * **Focus:** Minimizing **False Negatives**.  
  * **When to use:** When the cost of a false negative is high.  
    * **Medical Diagnosis:** It's catastrophic to tell a sick patient they are healthy. You want to *recall* or find all the sick patients, even if it means some healthy ones get re-tested (a false positive).  
    * **Fraud Detection:** You want to catch as many fraudulent transactions as possible.

**F1-Score: Combining Precision and Recall**

Often, we need a balance between Precision and Recall. The **F1-Score** is the **harmonic mean** of the two. It provides a single score that is high only when both precision and recall are high. It's a great default metric for many classification problems. The harmonic mean is used because it punishes extreme values more than a simple average would. A model with 1.0 precision and 0.1 recall would have a low F1-score, whereas a simple average would still look deceptively high.

![][image4]

:::info The F-beta Score

The F1-Score gives equal weight to precision and recall. The more general **F-beta Score** allows you to give more weight to one or the other.

* $\beta < 1$: Favors Precision (e.g., ![][image5])  
* $\beta > 1$: Favors Recall (e.g., ![][image6])  
* $\beta = 1$: The standard F1-Score  
:::

### **The Process: Finding the Best Model with Validation**

We now have the concepts we need: we understand the bias-variance trade-off, and we have metrics to score our models. So how do we find the best model *without* breaking the Golden Rule and touching our test set?

**The Solution: A Cross-Validation Set**

We split our initial X\_train and y\_train one more time, creating a **validation set**.

The workflow becomes:

1. **Train** the model on the (smaller) training set.  
2. **Evaluate** its performance on the **validation set**.  
3. Tweak the model's settings (its **hyperparameters**) and repeat, trying to find the settings that produce the best score on the validation set.  
4. Once we are satisfied and have chosen our final model, we use the **test set** *once* to get our final, unbiased performance score.

**Model Complexity Graphs & Learning Curves**

By plotting the model's error on the training and validation sets against its complexity (e.g., the degree of a polynomial), we can visually diagnose overfitting and underfitting.

* **High Bias (Underfitting):** Both training and validation error are high and converge. The model is too simple.  
* **High Variance (Overfitting):** The training error is very low, but the validation error is high. There's a large gap between the two curves. The model has memorized the training data and doesn't generalize.  
* **Just Right:** The validation error is at its lowest point, just before it starts to increase. This is the sweet spot.

**K-Fold Cross-Validation**

Instead of a single validation set (which might not be representative), we can use **K-Fold Cross-Validation**. We split the training data into 'K' buckets (e.g., 5 or 10). Then, we iteratively train on K-1 buckets and validate on the remaining bucket, rotating until every bucket has been the validation set once. The final validation score is the average of the scores from all K folds. This gives a much more robust estimate of the model's performance and reduces the chance that our results are just a fluke of one particular validation split.

**Grid Search: Automating the Hunt**

Grid Search is a technique that automates this whole process. We define a "grid" of hyperparameters we want to test (e.g., different kernels for an SVM, different depths for a Decision Tree). GridSearchCV from scikit-learn will then systematically train a model for every combination of these hyperparameters, using K-Fold Cross-Validation to evaluate each one. It then tells us which combination performed the best.

This is the standard, powerful technique for hyperparameter tuning and finding the best possible version of a model for your data.


```python
from sklearn.model_selection import GridSearchCV  
from sklearn.tree import DecisionTreeRegressor

# 1. Define the parameter grid  
# These are the hyperparameters we want to tune.  
param_grid = {  
    'max_depth': [2, 4, 6, 8, 10],  
    'min_samples_leaf': [1, 2, 4, 6]  
}

# 2. Create the Grid Search object  
# We provide the model, the parameter grid, the number of cross-validation folds,  
# and the scoring metric.  
grid_search = GridSearchCV(  
    estimator=DecisionTreeRegressor(random_state=42),  
    param_grid=param_grid,  
    cv=5, # Use 5-fold cross-validation  
    scoring='r2', # Our metric for the housing project  
    n_jobs=-1 # Use all available CPU cores to speed up the process  
)

# 3. Fit it to the training data  
# This will run the entire cross-validation process for every parameter combination.  
grid_search.fit(X_train, y_train)

# 4. Find the best model  
best_model = grid_search.best_estimator_  
print(f"Best parameters found: {grid_search.best_params_}")

# 5. Finally, score on the test set  
# This is the final, unbiased performance evaluation.  
final_score = best_model.score(X_test, y_test)  
print(f"Final R2 score on test data: {final_score}")
```


This concludes our first section. We now have a robust framework for training, evaluating, and selecting a machine learning model. In the next section, we'll dive deeper into the specific algorithms themselves.

## **Part 2: A Tour of Supervised Learning Algorithms**

Now that we have a solid framework for evaluating models, let's explore the models themselves. **Supervised Learning** is the most common paradigm in machine learning. It's defined by the use of labeled data to train a model. Our goal is to predict a target label, given a set of input features.

Let's switch to a new project: you're working for "CharityML," a non-profit that wants to identify potential donors. They have data on the US population, including features like age, education, and occupation, and a label indicating whether an individual earns more or less than $50k/year. The assumption is that higher-income individuals are more likely to donate. This is a classic **classification** problem: for a new person, will we predict \>50k or \<=50k?

### **Linear Models: The Foundation**

Linear models are the simplest and most fundamental family of algorithms. They work by finding a line (or a plane, or hyperplane in higher dimensions) that best separates or fits the data.

#### **Linear & Polynomial Regression**

We've already touched on this. Linear Regression finds the best-fitting line through a set of data points to predict a continuous value.

![][image7]The core idea is to find the weights (![][image8]) and the bias (![][image9]) that minimize an error function, typically the **Mean Squared Error (MSE)**. This is done through an optimization process called **Gradient Descent**, which iteratively adjusts the weights to "walk down" the error curve until it finds the minimum.

What if the relationship isn't linear? We can use **Polynomial Regression**. This is a clever trick where we create new features by taking our existing features to a higher power (e.g., ![][image10], ![][image11]). The model is still a linear combination of these *new* features, but the resulting curve is a polynomial that can capture more complex patterns.

:::warning Be Wary of Outliers

Linear models are highly sensitive to outliers. A single extreme data point can dramatically skew the best-fit line and harm the model's performance. Always explore your data for outliers before training.

:::

#### **Regularization: Taming Complexity**

A high-degree polynomial regression model can easily overfit the data. **Regularization** is a crucial technique for preventing this. It works by adding a penalty to the error function that is proportional to the size of the model's weights. This forces the model to learn smaller, simpler weights, making it less likely to overfit.

![][image12]The hyperparameter ![][image13] (lambda) controls how much we penalize complexity.

* **Large** ![][image13]: Forces the model to be simpler (smaller weights), preventing overfitting but risking underfitting.  
* **Small** ![][image13]: Allows the model to be more complex, risking overfitting.

There are two main types of regularization:

1. **L1 Regularization (Lasso):** The penalty is the sum of the *absolute values* of the weights. A fascinating side-effect is that it tends to push some weights to be exactly zero, effectively performing **feature selection**. This is useful when you suspect many features are irrelevant.  
   Please put the L1 Regularization (Lasso) penalty term formula here  
2. **L2 Regularization (Ridge):** The penalty is the sum of the *squared values* of the weights. It's more computationally efficient and is the most common type of regularization. It forces weights to be small, but not usually exactly zero.  
   Please put the L2 Regularization (Ridge) penalty term formula here

#### **The Perceptron Algorithm: A Simple Classifier**

The Perceptron is the ancestor of modern neural networks. It's a simple linear classifier. For a given data point, it calculates a score:

![][image14]If the score is positive, it predicts class 1\. If it's negative, it predicts class 0\. The training process is intuitive:

1. Start with a random line.  
2. For each misclassified point, "nudge" the line slightly towards it. The size of the nudge is controlled by a **learning rate**.  
3. Repeat until the model performs well.

This simple "Perceptron trick" is the basis for how more complex neural networks learn.

### **Probabilistic Models: Naive Bayes**

The Naive Bayes classifier is a probabilistic model based on the famous **Bayes' Theorem**.

![][image15]

In our CharityML context, this translates to:

* ![][image16]: The probability a person earns \>50k given their features (e.g., age, occupation). This is what we want to predict.

The "naive" part of the name comes from a strong (and almost always false) assumption: **that all features are independent of each other**. For example, it assumes a person's age has no bearing on their occupation. While incorrect, this assumption makes the math dramatically simpler and faster, and the algorithm often works surprisingly well in practice, especially for text classification (like spam filtering).

### **Support Vector Machines (SVMs): The Margin Maximizer**

A Support Vector Machine is another powerful classification algorithm. Like the Perceptron, it finds a line (or hyperplane) to separate the data. But the SVM has a crucial difference: it doesn't just find *any* line; it finds the line that **maximizes the margin** between the two classes.

The margin is the street between the closest points of the two classes. These closest points are called the **support vectors**, as they "support" the margin. By maximizing this margin, the SVM finds the most robust and generalizable boundary.

**The C Parameter:** Real-world data is rarely perfectly separable. The SVM's C hyperparameter controls the trade-off between having a wide margin and correctly classifying all training points.

* **Large C**: A high penalty for misclassification. The model will try hard to classify every point correctly, leading to a narrow margin and potential overfitting.  
* **Small C**: A low penalty for misclassification. The model will prioritize a wide margin, even if it means misclassifying a few training points.

**The Kernel Trick:** What if the data isn't linearly separable at all? The SVM's killer feature is the **kernel trick**. It allows the SVM to create complex, non-linear decision boundaries. It works by mapping the data into a higher dimension where it *is* linearly separable, but it does so in a computationally clever way that avoids actually calculating the new coordinates.

* **Polynomial Kernel:** Creates polynomial-shaped boundaries.  
* **RBF Kernel:** Can create complex, localized boundaries. The gamma hyperparameter controls how "local" or influential a single training point is. A large gamma can lead to overfitting.

### **Tree-Based Models**

#### **Decision Trees**

A Decision Tree is an intuitive model that works like a game of 20 questions. It learns a series of if/else questions about the features to split the data. For example:

1. Is age \> 35?  
2. If yes, is education \== 'Bachelors'?  
3. If no, is hours-per-week \> 40?

The tree is built by finding the feature and split point that gives the highest **Information Gain** at each node. Information Gain is a measure of how much a split reduces the "impurity" or randomness of the labels in the resulting child nodes. This impurity is often measured by **Entropy**. A split that perfectly separates the data into pure nodes (e.g., all \>50k on one side, all \<=50k on the other) has very high information gain.

Please put the formula for Entropy here

Please put the formula for Information Gain here

:::info Hyperparameters for Trees

Decision Trees can easily overfit by growing too deep and memorizing the data. We can control this with hyperparameters:

* max\_depth: The maximum number of splits from the root.  
* min\_samples\_leaf: The minimum number of data points required to be in a leaf node.  
  :::

#### **Ensemble Methods: The Wisdom of the Crowd**

Ensemble methods are meta-algorithms that combine the predictions of several "weak learners" (like shallow decision trees) to create a single, powerful "strong learner." The core idea is that many diverse, simple models can be smarter together than a single, complex model.

1. **Bagging (Bootstrap Aggregating):** This is the technique behind **Random Forests**. It focuses on reducing variance.  
   * Create many different bootstrap samples of the training data (i.e., sample with replacement).  
   * Train a separate decision tree on each sample. For added randomness, each tree is only allowed to consider a random subset of features at each split.  
   * To make a prediction, take a majority vote from all the trees. This averaging process reduces variance and makes the model much more robust against overfitting.  
2. **Boosting (e.g., AdaBoost):** This is a sequential process. It focuses on reducing bias.  
   * Train a simple weak learner (e.g., a "decision stump" \- a tree with only one split).  
   * Identify the points that this first model misclassified and increase their "weight" or importance.  
     Please put the AdaBoost weight update formula here  
   * Train a second weak learner that focuses on correctly classifying these difficult, high-weight points.  
   * Repeat this process, with each new model paying more attention to the mistakes of the previous ones.  
   * The final prediction is a weighted vote of all the weak learners, where the more accurate models get a larger say.

## **Part 3: Unsupervised Learning & Feature Engineering**

So far, we've dealt with problems where we have labeled data. But what if we don't? What if we just have a pile of data and want to find some underlying structure within it? This is the domain of **Unsupervised Learning**.

Our new project: we're working with a wholesale distributor who wants to better understand their customers. They've provided us with a dataset of annual spending on different product categories (e.g., Fresh, Milk, Grocery, etc.) for a few hundred clients. Our goal is to find natural groupings or "segments" within this customer base to help the distributor tailor their services.

### **The Importance of Preprocessing: Feature Scaling**

Before we dive into clustering algorithms, we have to address a critical preprocessing step: **Feature Scaling**.

Imagine a dataset with two features: customer age (ranging from 20 to 70\) and annual spending (ranging from $1,000 to $500,000). If we use an algorithm that relies on distance calculations (like K-Means), the spending feature will completely dominate. A difference of $1,000 in spending will seem vastly more significant than a 50-year age gap simply because of the scale of the numbers.

Feature scaling puts all our features onto a comparable scale. The most common method is **Min-Max Scaling**, which rescales every feature to a range between 0 and 1\.

![][image17]

:::info When to Scale?
Feature scaling is critical for distance-based algorithms like K-Means, SVMs, and PCA. It's generally less important for tree-based models like Decision Trees and Random Forests, which are not sensitive to the scale of the features. Another popular technique is **Standardization**, which rescales features to have a mean of 0 and a standard deviation of 1\. It is generally more robust to outliers than Min-Max scaling.
:::

### **Clustering: Finding Groups in Data**

Clustering algorithms are designed to partition data into groups where the members of a group are more similar to each other than to members of other groups.

#### **K-Means Clustering**

K-Means is the most popular and straightforward clustering algorithm. The "K" is a hyperparameter you choose, representing the number of clusters you want to find.

1. **Initialize:** Randomly place K "centroids" (cluster centers) in your feature space.  
2. **Assign:** Assign each data point to the cluster of the nearest centroid.  
3. **Optimize:** Move each centroid to the center (the mean) of all the data points assigned to it. This step minimizes the within-cluster sum of squares (WCSS), also known as inertia.  
   Please put the Within-Cluster Sum of Squares (WCSS) formula here  
4. **Repeat:** Repeat the Assign and Optimize steps until the centroids stop moving.

:::warning Local Minima

K-Means is a "hill-climbing" algorithm, which means its final result is very sensitive to the random starting positions of the centroids. It can easily get stuck in a "local minimum" and produce a suboptimal clustering. It's standard practice to run the algorithm several times with different random initializations and pick the best result.

:::

#### **Hierarchical Clustering**

Hierarchical clustering builds a tree of clusters (a **dendrogram**). This is great for visualizing how clusters relate to each other, even in high-dimensional data. The most common approach is **agglomerative clustering**:

1. Start with each data point as its own cluster.  
2. Find the two closest clusters and merge them.  
3. Repeat until only one cluster remains.

The key difference between methods is how you define the "distance" between two clusters:

* **Single Linkage:** The distance is the shortest distance between any two points in the two clusters. This can produce long, elongated clusters.  
* **Complete Linkage:** The distance is the *farthest* distance between any two points. This favors compact, spherical clusters.  
* **Average Linkage:** The distance is the average distance between all pairs of points.  
* **Ward's Method:** Merges the two clusters that result in the minimum increase in total within-cluster variance. This is often the default and a good starting point.

#### **Density-Based Clustering (DBSCAN)**

What if your clusters have weird shapes, or your data is very noisy? K-Means and Hierarchical Clustering can struggle. **DBSCAN (Density-Based Spatial Clustering of Applications with Noise)** offers a different approach. It defines clusters as dense regions of points.

It has two key hyperparameters:

* epsilon (![][image18]): A radius.  
* min\_samples: The minimum number of points required to form a dense region.

It classifies points as one of three types:

* **Core Point:** A point that has at least min\_samples points within its epsilon radius.  
* **Border Point:** A point that is within the epsilon radius of a core point, but doesn't have enough neighbors to be a core point itself.  
* **Noise Point:** Any point that is not a core point or a border point.

DBSCAN is powerful because it can find arbitrarily shaped clusters and is robust to outliers, which it simply labels as noise.

#### **Gaussian Mixture Models (GMMs)**

GMM is a probabilistic, "soft" clustering method. Instead of assigning each point to a single cluster, it calculates the probability that a point belongs to each cluster. It assumes the data points are generated from a mixture of a finite number of Gaussian distributions (bell curves) with unknown parameters. The algorithm uses an iterative process called **Expectation-Maximization (EM)** to find the parameters of these Gaussians that best fit the data. This provides a richer understanding of the data's structure, as a point can have partial membership in multiple clusters.

### **Dimensionality Reduction: Finding the Latent Features**

Our customer dataset has several spending categories. It's likely that some of these are highly correlated. For example, customers who spend a lot on 'Grocery' probably also spend a lot on 'Milk'. We might be measuring several features that are all just proxies for an underlying, unmeasured (**latent**) feature like "general household shopping."

**Principal Component Analysis (PCA)** is a powerful technique for dimensionality reduction. It transforms our data into a new coordinate system.

* The first new axis (the first **principal component**) is the direction of the highest variance in the data.  
* The second principal component is the direction of the second-highest variance, orthogonal (perpendicular) to the first.  
* And so on...

Each principal component is a linear combination of the original features. By keeping only the first few principal components (those that capture the most variance), we can reduce the number of features in our dataset while retaining most of the important information. This is incredibly useful for compressing data, speeding up algorithms, and for visualization, as it allows us to project high-dimensional data down to 2D or 3D.

### **Validating Unsupervised Results: The Silhouette Score**

How do we know if our clustering is any good? Unlike supervised learning, we don't have ground truth labels. The **Silhouette Score** is a common **internal validation index**. For each data point, it calculates a score based on two values:

* **a:** The average distance to other points in the *same* cluster (intra-cluster distance). We want this to be small.  
* **b:** The average distance to points in the *nearest neighboring* cluster (inter-cluster distance). We want this to be large.

The silhouette coefficient for a single point is:

![][image19]
* A score near \+1 indicates the point is well-matched to its own cluster and far from others.  
* A score near 0 indicates the point is on or very close to the decision boundary between two neighboring clusters.  
* A score near \-1 indicates the point may have been assigned to the wrong cluster.

The overall Silhouette Score for a clustering is the average of the scores for all points. It's a great tool for comparing the results of different clustering algorithms or for helping to find the optimal number of clusters (K) for an algorithm like K-Means.

### **Conclusion to Part 1 and a Look Ahead**

Congratulations\! You've now covered the complete foundations of classical machine learning. We've journeyed through the three core pillars:

1. **Model Evaluation:** Learning how to rigorously and honestly measure a model's performance and select the best one for the job.  
2. **Supervised Learning:** Building models that learn from labeled data to make predictions, from simple lines to complex ensembles.  
3. **Unsupervised Learning:** Discovering hidden structure, segments, and latent features in unlabeled data.

You now have a powerful toolkit for tackling a huge range of data problems. But this is just the beginning. The classical models we've explored are powerful, but they often struggle with highly complex, unstructured data like images, audio, and raw text.

The next part of our journey will take these foundational concepts and apply them to even more powerful and specialized domains: **Deep Learning** and **Reinforcement Learning**. We will see how the simple Perceptron can be stacked into deep neural networks to solve complex problems like image recognition, and how we can train an agent to learn optimal behavior through trial and error in a complex environment, much like a human would.

[image1]: <data:image/png;base64,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>

[image2]: <data:image/png;base64,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>

[image3]: <data:image/png;base64,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>

[image4]: <data:image/png;base64,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>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAABs0lEQVR4Xu2VO0sDURCFFVEUUcs0STYbAiEpbGIl/gAbbbUWLCy0UgSxUrC2s7CwEkELS0EbH5Windhpo4KF4htE8fGN7g2TIfER1io5cNg7Z87OzM29S2pqqqhoJBKJdc/z3n9D+25o+K4BAy6Te7F6WKiTxjTZswlBOp1uicfjW1YPBTQeDZp3a524UZ7JZLKN/JTOhQYK39qfnHgiGo2mZJ3L5eojkUizzocGe96sM3aY/8LneRejNYYOLtK4NIrFYr1O832/HW1F+ziCJrQzeIm3Q+c0yL/BJe/rHh3Le9aTB4Z7u0sGGkTLaE17ZIBSd8D9anCzlCcPZ7a6BsP04Dl1MetptAXtcfipVh7ZbLZBzBTatTkNPIvwwMX4R4gftcch2MyY1OQTjdt8HnzHs2Lm2WdzGng29ID4h0rtUOusX6Gv8yLKhZCzvoZX8AY+0WCuwBiA3DzcdzG+YeJn7SkGPKvw3Op/AgUGPHPm7H5bewSpVKrVK9y5bPJOe8qCKXpI84Ssg8t4FKRqZTDle8DW7+KyQZMuil3AHX08xJ1wTcWT8gfF8wTfjNOrqFx8AMWVjCI/qE0LAAAAAElFTkSuQmCC>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAYCAYAAAD6S912AAABOUlEQVR4XmNgGAVUBQoKCrvk5eX/E4PR9eIF+DQBLV0FlPuNLo4PMIMMA2o8hS4BAurq6rxycnIH0cVxAqBhJVADPZDFgXwOEK2kpMQPlG9ClsMLgIo/onsXyK+SkZFRAbGNjY1ZxcXFuZHl8QL08AOyNdEtIAWAww8bRldIFAAGdjlIs6ysrB9MTFFRUQ8othpZHTA8LYBif4H4D5DtgCyHAoAKPqO7BmhJKlBME4kvCOQHw/gg9cDw1YXxUQAx3gMaGIesBsj+DsRnkNWAgZaWFhtIIVDDSXQ5fADqiB50cVC4TABJAulwdDlcAGi5FoaPgALL5SFh9x6I3wLxByD+AVQ8HUUhFgBU9wtdjGwAshyJvQ5ZjmQA8hEwaBKAOBHokzwgvxpdDdEAqLkIFG7IGGeyGQVkAQAMO2Y9vjMctwAAAABJRU5ErkJggg==>

[image7]: <data:image/png;base64,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>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAXCAYAAAALHW+jAAABE0lEQVR4XmNgGAWjYBABeXn52QoKCono4kAxBSR2oZycnCCSNHYANOwXkGIG0v+B2AlJ/BlIDMqFyX+CyWMFQAXLgBQzlP0f6AoHJDmQAeuQ+KeB+DOMjxUAFdRC6W4k14AAE4gvIyOjCxMAWqYBFJuKpAak7wMyHw5AmoHhMx2JvwbNApDYCWQ+PgB2DXIEQL37A0kNWAyZjxw8GADqQi1kPhB/QeI7AeVtkPiLgfwZQEMDYGIoABQWQPxcXFycG+Q1IM6ButoeSDsC8U2YWqCYO1QPSJ4DYQoaANqoBMRxyGKKiopuyC5HAuBkhC5INgC6bCXQwCqgZT7ocmQBoGEvQDTQ4I3ocmQDoKFG6GIjEAAAkvlEt5Ys0KAAAAAASUVORK5CYII=>

[image9]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAZCAYAAAAMhW+1AAAAoUlEQVR4XmNgGCRAXl7+BBD/AuL/ioqKZujyYCAnJ9cPUoAuDgdAyceEFPxXUFA4hC4OByAFQOyILg4GQIlkqAmNQPo5hmlAgYdQQQskMRA/AM4B4qNwHQixK3AO0JvtWBS8ADEkQRxRUVEeJHlGqBUTQQGUBuIgSYI0lYLEZGRkVBmAQWuHRQHIykcoAjA20NgOdA0gBYpQR4HwdhTJkQEAIOU5XrLhMj4AAAAASUVORK5CYII=>

[image10]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAYCAYAAAAYl8YPAAABKklEQVR4XmNgGEigoKDQIS8v/x+I36qoqPChyxMNgAbUAikWEFtRUVEdZCiaEuIBUPM9IP6DxP8vJyfng6yGbAAyTFpaWhhdnGQANGgpEJ9DFycZyMrK6gAj4hC6OMlASUmJH2jQQhgfGBF2yPJwAFQ0ERigqUh8UDKoQVLCCORfBYonAOlkIJ4EFGNCkgebLg5UcAnEBhqWC1T0CxbtQPosEPdA2Z9A4sgY2RwwQBYUFRXlAfGBFugDLbAAsYF0BLJ6vACowQjGBrqsDNlwoEEcMDbJAOYVdHGyADQsFqOLEwWA3hAAGQBMO8qw8AJ6VQsmD+RfRVaPFwANmwkyQEZGhhNIn4O6TBEkB4oEoMEr0PXgA6C0AzIA5CJXkAuR+HXoikfBKCADAAATHUrUcjfM0AAAAABJRU5ErkJggg==>

[image11]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAAYCAYAAAAYl8YPAAABNUlEQVR4Xu2TPUsDQRCGEyRBSQqb44T7xu4QhFyT1sLS3j9gaWsKJU2aEG0sBTub/JCUJoKQ0r9gIRKizflMyMqwxXFJijR5YNh3dmfe3btlK5VtEoZhN4qib+ItjuNDe700GJwRE9EYHaFzu6Y0nuf5GHyIDoLgZCMzDUavxMCeXxlM7olP5J69tjbyma7rNuz5UtDc4zY7Ks+JW13zDzf0SPGVyvsU35kcPSdGKs/TNK2bfEGSJC6N76Ixu6bo19wU45h4EJ1lWQ09I56JH2ovtM8C0yg4jtOUnA1O2aAtmvFS1xdCQ8todrvR5hjtG70yGH1ps40QI+LFni+FPFYx4Hkcm//Fp6ZmnXyq6wvB7EkMfN8/YJwsT5bImlwCxkO7p4jq0kBOdC4nVHnXLt6xYw3+AIs4S2KKAga8AAAAAElFTkSuQmCC>

[image12]: <data:image/png;base64,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>

[image13]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAZCAYAAADnstS2AAAAoklEQVR4XmNgGOJAXl7+PxA/ADJZ0OWwAqiG/+jiWIGCgsIEkGIgzYEuhxVAFW9EF8cKSHVKBkixrKysMrocVgB1yi10cQygqKgoTrRTgIquA/FdqGLcYQ5U8ABo/Uogkxlq+jJ0NWAAlHiJ7E6cTgEKfgDi78hiQI2FIMXAUJGCCwIFPmM1gQEeKpfAHGlpaRmoQmZUZRAAlNuDy6BRQDQAAFKnMf2aQVe2AAAAAElFTkSuQmCC>

[image14]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAAA/CAYAAABdEJRVAAAEo0lEQVR4Xu3dXYimUxwA8NWur4jINsy87zyzM3PBFqW94EYUe+UrpbAStRcuNi4U0RIbSsqFGyWhfEZWroiQ2pQbiXykRNK62Yha7crH+J/2nHHmeOdrd6Z9J79fnZ7z/5/zfM7F8+955plZtw4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADWoq7rfo82k9v+Kv9nlZ+p8ncMyq8lcdz70rGPj4/f344BAAyl+YqvBfJ7x8bGem1+LUnn1ev1TmzzAABDaYHCbL78i23uaIljebjNLcWg8wIAGFqDCrOIvx6Un5qa6tfx0TYxMfFIm1tMv9+fivM62OYBgDUkFSlRCNwT7e5ctJxTjT2Rx1+N5YFoz5Sx9Jowz3892k/RXq7WS/nS/sjjP1fj90X7O9pLac6mTZtGythqi/39lvZZ59L+y/HW+Yg/quMjEdu6M+/74MaNG0+O5RfR9kS7t507n5j7WJtbTKzzQ/z8dnWHrve+6F/fzgEAhtiWLVuOHR8f31riuKHv7uYWbPUv4M+0cSw2VPGXUQx8VsU705zNmzcfF8vPy7q5eJjdTikUS9zq9XrTMf7dUlraVrt+K+Z92s09jzfzcqbJf1/6KyG2t7PqpyL1vC5/1FDPW0h3eAVbOq85xXQ9DgAMuSiGzu2q12VR8ExMTk6emvqR/yTaU2VsdHT0jJh/ep53cYwdKGM5d2YqBqIAnExx9C8fVBzkAmJPm6vj1dQdKkrL/tZH/72c/6Xk4zzHov/g7EqLiLkPxflf0OaLGN/WxKV4vbkumBfTHWbB1saxz2vrHAAw5OIG/k26ief2V5Wf6ff7F9Vzixj7NtqHA/Lp9ek7ub9QwfZCFA2X1a2dt1rqJ3qx/LXko/9uysexnBbLj/9dY3H5nGav3UJi+3fF3Ofb/CBx/a+qW6z7RpvLbbRdN4lzfbL9GZRzrHMAwHA7pnTS07NceHyQ4tzfPjuzkgqHrnllOD09fXxe5+kUd4sUbG1+Pnm7jy6lxXFd2a7fSk+X8jHsTtsu+VLcpKeH9fyVFvvYnz4EaPNL0S3zCVvM/zGdU5Xa0MQAwLBri5OIH+/yq870h1ajv7cZ35WWkT+rvfHH/CtywXNCHddzklwszXkalbZXx6sp9nV+Pob2tWz6KCDl/3PMRyquxW2x3edSv91+XK8L63gh3fILtvejfVXi2NcrcSy313MAgCEXN/BL4gb+donj5v5WV/3uViouYs51OUy/71W/QkzFzY1N/FoVb2+Lk6R8kTlR/YmKQfNWy/T09CmD9hfHc3U+rlvbsSOVr822dC3rfce1f7aet5hu+QXbNWV/5avedg4AMOTKBwbpFV0qWNrxJBVYMXZLmy+i6NjaHeYTslj3ppGRkZPa/Grr8mvbWvpPAHGeD7T5lRLbvqH047wvjfjsenwplluwFd2hwnp9mwcAYIVF4bWjzQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADA/8Y/BVtN8DLkg2YAAAAASUVORK5CYII=>

[image15]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAABSCAYAAADpeojRAAAKmUlEQVR4Xu3dbYxcVR3H8bY+BPARsanOzsyZ2V2sNDExNEEUXkAQTYgYhWgUAhpFiIlR8ZVWQkjwIUTBGBQf6iO8kBAVRV6g0gcErMEWoSpVG5WqUUkAUasUSlt//51z1tP/nHt3Z3bKdjvfT3Iyvb9z7rkzs03uP3fuw7JlAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGFMhhD0+G5Tm+IHP6kxPTz8/X242m8evXbv2WXm2WPRZNk1MTBzn8xL/OTqdzlFa/7d5BgAAMEuFws/U7lW7T+0XalvVtqhtbLVaDT/eqG+Xio6VPm+322+J89wfX61ts22oKPlSYfxtPquiOa5XO1DI+7KF0Hznx/ecPsfM+1fbrALxFX58ov51PqtSes/Kzhnk+wAAAGNGxcJlvohQ8XCKZWq35rlRdoPPEvWdaOtp/U9m8XJlfy9s44f5co0V8b30FToqBE9WvtvnC6H3dWrc3vqUqXiditkf87FG2WM+q6K5P1P6HEb5Iz4DAACYUVUMKfuH5ZOTk+08y8d4KqC2l+YycTtXpmWN/VHeXyW9v5p5H1S71ufD0lw7S9tSdrPlKrouzLJ1avfl46po3JvVrinNnajvfp8BAACkgmhvRX4gP0+srtgwaR2fq8g51vJms3l0yrT843xMFRV2nVA4Qpdo7jdU9Q2j6jMoe9JyvZ1XZpktn5yPq5LmtFd/HltS2i4AABhz3W53lRUJ7ifMGbFwmT2ipn+/a66CIs71vYr8Rpfdni+XaMyD8XVj3bbr+gYVP/eWivyg7fjlKirqbkrnwMXv4hQ/xlhfVTEHAADGlAqEB3zRoeV3W6YCY9rl/1T7VZ55qahxrXg1qPKNPsup/9tqJ8R/X2lz+TFJXd+gbK5Go3FMWlax9SZl+/X6+nycli+dz3Y15n1qF2XLVrBdno9J4vd1tc8BAMAYiwWCFRBf1+tX1a7Tvy/w44yNU5Fyi88T9b2wVMAo+1RFvslnmWeq/29pwc4bK82R1PUZ9X9M7+9VPvc05iXp+4jtC8o+6McZ5Z+da7tGY/a7Zfseb8qzxPpC4UIPAAAwxmKBsMvnJXHs53yexCsgi1dMxnXPctnmfDln86j9Um2bipt7QsWFAEldn4nbrx1j9Bm+OJ9xRuO+M4+xdoXsH9TujZ/j5/G97PADjfKH1H7jcwAAMMaseOh2u8HnJRq7RwXNHT5P4lwn+dxY39TUVMtlm/PlzAo7t86HdcVRXd8gbB4VVu/weYnGfXiu7Zb6Y8HWl5vY912fAwCAMaWCo1NVOJSE3o1k/+zzpGqu0Dv3ra8vVBRsyh/2mbE5Vq1a9Ryfm9L8wxhkntC7TUflePVtsvu3FfIDVevFvnnfhBcAgCOSdobn+mwQk5OTL/PZoFQnvdxni6Hdbt9WVTiUaPzFVeOVf6jUp+wJy0tH3kJ/wWY3yL27NI/dWiTO8zrfZ0rrDEpzfHTQearG27lvVX2W1/Vp3WN9DgDA2NDO8FvaGZ7q8xKNvVNj31rIizvaQWiOrXWPOTrUQu9I2b/UHo2ve6tOrPdKnz/07k+2PxUise2L+Xl+fBKygs2+69A7EveI2n/UzsnG2dx530En8VsRZ9vMs0Fo3WvV/h16Nwq278Te97x+lrTt6r2vddlT8b3uVtvn+qyAtW3YOXpP5H2xf+jPAQDAYUk7t/8Gd2f4EG9ToQLktDy3W1TYw8LzrEo8eX7mSkHfV7dD1TZvsf5Go/HilGmbL7JM7df5WDu6pfFX5dlSYJ/RZ8MK/UfYhmLf7+rVq5/n86eDFWt1/ycGYQ+P9/9vAQBY8mJhdtC9sVLud6JafjxfrhN6R0hsjq2Fvsqdc2m7xnbCpbyULQV2JaXPhhFGULDZkcowx+OyDrXgjvgNS/P81WcAACx5VQVPoXCye3oVx3oqro6yE9vjHHt8f908cZ1Hfa4C58zSeqH3U+QVPj/c6X3vHsURrTCCgq30vS6C5fo7XuLDQehznB64/xoA4Eijndt1pZ21iqMPWG4/a2bZn5TdlY+ronFPxVcrvvrmL2WJ9XWy50wa+3k0vp++RxFp7Nvq5juc6fO81meDyh8qP4zSFZiLxR4npc/zAp/Phz1f1d/yBACAI0JdQaW2wWcqMN6TZyUqoLa34xV6dfP7LLE+KyKsxZ/q7orbvtiPTermAwAAWNJSQRX+f6XjzFWKpasvY9F0hs9zdiRMBds9aTnNn49Juc+M5j87budM25YdgQrx+ZcLKdjUv17tBt/0Xr+peb+hf38t9B4ptd6vCwAAsGg68XmPatf7vpI4tuvzXOi//YKt01dMlTITeo8e+r7Plb23ah1T13copM9FWxrN//0AAFgywhzPlfRsrD+3LGcn0K9Zs+bZeaZ17rT1CnlxuzF/RiF/ddU6pq4PAABgyRr06EMcP3sjVk99ewvZl229dv9NUfu2Oz09vbKUGxWKv6vqM3V9JvRuFGs3W52z+XUBAAAWjRU5ar/3eZU4/uM+N8ovU/u8z1VoXRrXuyjPLcuXYzZT3Plcc1xluV5/4vuM+l5aWg8AAGDJCr1H/aRHFPU99qeKCqZ3+sIo9G6Oa48isnbQ/dZC74iV5TPb6WR398/nCb3HGdk8pccy3a72mjS2RP0/Vdvic8yPvrsT9bLc54Not9uTo7inHAAAGIG80FqIUc1jbC57qLnPx1HoFeCp4LWfgdMzPW257+hofBj8zD3zPOUPWV9c9/HQK75n52+1Wm9040f2NwUAAAugnfLNPhvGqHbudiNdzfWkz8dZLKhK5xNavs5l+/z5hTn1n1/6W9n8Ptc8nwiFx5ABAIBF4HfUwxjFHN1ud5Xm2eXzcabv4zz7bjvzeDasxlyi5cfyMZ7699t5iIX87tLfMG77NJ8DAICn2cTExHHaMe/w+SDCPM+bqxM4stZH38kDpULKxILt6ny53W5fno/x4lwrSnlpOyrWtgfOJwQAAKhWU0hd4YtkG1d3oYA909PP1Wg0jgm9i0OsWO67UEEF4IV+HQAAAGSsWMpvf9JqtRrKNpWKqFKWU/+nUwGYt2azebwfm6j/hLnmBQAAGGtWLNktNnzuaVx3rsIqFWiFfJflK1eufK7vM6V1AAAAsGz2aNq8iqVu1+q1+rGxYLu1kF9jfZ1O5yO+z8w1LwAAwNhSofSVQYqlurHqO9f6VdidVOiz+7MdmJqaavm+eOVu5bwAAABjzQqldrt9gc+r2Hi7iMDnJh5d6yu8lO2MfWf5PtPpdN5eWg8AAGCshd5FBX+JhZS9bvBjSmy8/1lTBd8ZynfEuazZ/dY2KL8jLu9vNptH5+vk1L9NbafPAQAAMITQ+wn1YZ8vhBV1pZ9KAQAAMCQrsHw2rHhD5ZHNBwAAALGjYSqy9vh8GBRrAAAAh0i73T7bZ4Oyq0PtyQg+BwAAwIiEEE732SBU9L3fZwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMBS8z+AtffrrYGR1QAAAABJRU5ErkJggg==>

[image16]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJMAAAAYCAYAAAD+ks8OAAAG80lEQVR4Xu1aaWwVVRRuwQV3UGul7Xv3ddGaGnFpjJi4RNQgGOOu/PAHGqO4R01UxERUYowGwa0a+aHGGKKJERCUpUYTFBNQoxa1oBGDW6wsBZdqKdbvm3fuy+l5d9pp7QNb3peczJzvLPfcmfPu3Jm2pKSIIoooYtjDOXep5YYY9rLEngzcz7E4jLB8wYGB56fT6dMsv7tRUVGxf3V19fGWDwFzeNBygpGZTGY67Ddbw3AH5txtuT6BizUXgdsYLNIB2aI5+Lxm4wjYJsO23PIDBXItRM6mVCpVC7WUzYBGXQr+BOsLv9mQTshm28zCR7VrPg4u0EwY80LGV1ZWHia5frI+wxkNDQ37YM7/WD4R4i4+bqgjH2qakP9/AfK97+tQ8krAj40+S+kdqO8R49OatD4XaCbGIueZcr5djzcYSFrb7gRqXAWZbfk+ITfuQ8sTYusxeej3Qj7VHFFVVbVfyQD3IMj3Lm7g7Ti+DLnT2gmsQmfbWjDmoZZjbZaLgzPNVF5efkDS2IGi0PkHCSP7XSdu4BQG4TjR2tgctNmk4j9ecx6wzYe0w36ktfUGxDTjUGp5DSePsADfjUa7SukfhfxCcKaZkGdM0tiBALkfL2T+wYRc13MsHwsEfBk3OfBv0IbGuMjwQX8N+DwN6QrteUKA74qSvpupG7IjxGOcz5W+RteI81O5B2MtXN08L7ZcM/EHArlSxplMaWxs3NvbEVvjssv/ezi/3PMe4G+CNEO+gv1ua1e5c/nr6uoOlthLEHMXjvPKysoOJIeax4G7BXFzIVPJ1dTUHILzaeDnQK7jjxYxz4NPq6GiFTuT3Yeugd9t2kbANhP8RsiL8DkJx8usD/hW+K22fCz85AL8WeSR7AnD8yLk+cfBZR+J7PALrE0D9mWcNHw7ZYIce5r2kVq3a07xHUq3zUQ7ZYO9yU41E2xXQL9PfO+goIZR4scVt0vF8WWlVekbGKf0HqsjmmZfycncufy1tbVH0M66oP9CG87HSI4JkCXi/yg5NEkl7M+J3zKXXek2UfdjSW7q0Y8Tc1gP/W9l766vrz9I6Vvhc4PXFR/dO8vHQgqltDMp5C/RW/g2Y/0x6AP9GkCAuKsl743WRsC+iL8WpY+if1otsxK/xeuG1xdTN1P07OcbirdruASPOdzwFDm/ihA4LxO/6JsMzl+3cVL/w5azfh5YXY6WmKiZPCQmaibDRXlwrcYjZo6YRkgOuwJ3+88ldnzoJ4aaKSNbIMsH4Z0h11hbHBDzUuIBAkDsJBlzhrVZ6Aum9Hbto/jcq6yTZuIjoa9aXYJmgv4FOdyMci3k7E3z8HlwXKB5qTVYE65tRmKSNlPoh/VMXK2Qh1RsVFsqlTrd5vBAOafE1ZoHOK5L7CxAAS/0N0aDvw7E70SeZzWv9yYeftJGzy3Xhv9a6VEzQX7nUf1q8+CSNVNUB1dJK7jgo70fzpfTD8eF6ewjMzoP5dKcBx9htNkngsSEmuljzQn/Q1yt4Kvpw0err8OL36dpoNFOps3yQfhElu8NuDj39DeGQNxEmeT91sbNo9SyRPO2PqtrXjenU485NhLP9SNKw5lmivnU8LPlLKS2Hh/6yGHeiyync+F8sT/3N9nvo5QPYx4LcKs0Jzz3dr3Wyv2bP5cmY668FT8jLwyWD0KSfGP53gD/ixMPUNJjr3SttXmks29JPfZHhMTpTW9TYOxScnplg/6Z9mOOQFwEZ5rJf/XWHOo6l1zGfO4ANxYywe+pnNkuCPcm4qZyjorTtX3iz+E3mjauUIqL9o7OfEAU7gPNEf7HwJXRmEqRazpPYN+qDS7mniZeOOA0g44IuN7a+kKSAVT+86wtBMkZbWYJTlzio7cpD7lQxyq/1c684UH/VteobvZa7Uc400x4DNfTt6Ki4nDNg/vOzlvrUtdSr6dlOwBpQY0z/WME+ts+DvwxkCk+RuyMmaT0tcL1+NELt05zHuAX065XIOht6pwNe5TXpWlWet0DXIsLfJzOAcanIL+57Jsb/w73h+vn32FYDC5Wo+UJl31V7UKxx1lbH+BbCD9K7mB+Sug5Xi1/4oG8gxo24vijtkPf7LL7hu8hbS67evxJP+F+Nf65ZnLZsflIox/9txlf/9mAsqlEfe3HfOucrIAU1NbgV1xIk0rDPNG+BjdxvebFdr4ao0N/OKZg/me47LyYg9KGcW61edikKq5T78OgNyNmgbfD91Ud6yG2vI/ZgwoM8pYLLLHACL45WPL/DBf421wREaLtgyULgl02UIFRbKYwcF1WQJ60fEGAgWbFLY9DCcVmCoJbjp2WLCgw4Eo81sZZfiih2Ez52OWN5JExfz8bauB/ZVpuTwb/OVG/BRZRRBFFDC38C91bw+e8mHnUAAAAAElFTkSuQmCC>

[image17]: <data:image/png;base64,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>

[image18]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAYCAYAAADH2bwQAAAAh0lEQVR4XmNgGAVYgZaWFpuCgoIHELujSMjIyKjKy8v/B+LjQFwiJycXC5cEqo4ASSoqKooj6UEAqM6bQCYLEoYAWVlZU5jRQGN3wDBcAVCiGKQAyGSCCyIDoP0GIAUqKirs6HJwAFTwB4iPIgkxSUtLyyDxGRhA9kLd8h/IPggUYkRRMLwBAB+nHiBkaypFAAAAAElFTkSuQmCC>

[image19]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAmwAAABRCAYAAABv7vp/AAAFvUlEQVR4Xu3dS4hlRxkH8BjxjRiCMKb73nvO6RkzOIIKAz7QKKIbjQvxgbgwYoLoxsdOIqigQkSRRAQRxajJQlwIEhHRhSBRgyZh1AQR4yNBJMjgC0eNDkn8ils1Fp/3djcz3XqJvx8U53xf1anTM6s/574uuggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOBCDcNwTYw/xXg4zwEAsCFms9mlAhsAwAarT9luzX0AADZEebo2m82ekPsAAGyI9nJoHG+O8d48fxgWi8U7Ynwg9wEASCI07ZTANo7jLbW+LupX5HUHKfZ/oD7Ru7jc2/vnAAB2EQHt8zkw5fogxd5nYpzt6o/H+Ea/BgCATn3CdVurx3F83rrAFuHure2J2B7jynxtEf3vlvnUe/jkyZOP6XsAAHRqwHplqyOUfTXq+/o1B6UFutzrawAAkhyYSj2bzbb73kGpge3+Vk/TNLT7j+P4rX+vBADgnBKYIjg9u56fjvHrvOaglFDWBbSxPXErwS3Kd+f1AABUEZoeLMEpQtO1ee6gxX1ur0Htk7X+R4zf5XUAAAAAAAAAAAAAAAAAAIdva2vricMwfKqcj+P4+GmaXpzXAADwPxRh7YHu/HvDLj+eHnM3rxk3LRaLL8Txxhifi/HZfC0AAOdpWH6v2K8icL0qzx2mel+jG/n/CADgnAgLZ4QGAIANVH5uabFYvL7VewW2YfnN/vsZ515mBQDgPM1ms6eXgBaB7T2tt1dgAwDgv6wEtBhXz+fzK+L4xwhv1+c1/y/i3/+b3DsMcZ87t7e3Z7kPAMAuIkQ9mHsXIvb7YNlz3RPLcRw/kXsAAKwRoerGCFC35P6Fms/nR8v7+XK/ibk7cg8AgBXWPQW7UMPy++k+lPtNve+jch8AgE6Epq8Mh/SJ1r2C4DiOP4k1t+U+AMBGKS8LlmBTx2UxTtXzf9b5szHuLL0TJ048Nl1b1n04xpdiPNTP17k2vp57ad1HW92LQHXJsPyKkjvi/MuLxeKbMZ6Z161T9o7134njrf09m5i7alUfAGDjRGj5WwkuEYpu6HolSJ1udcy9JOo/tLqtmabpSJ3/eQ4/JcD1vTi/fzabXdqvqaHqdX2vKXNt/bD8ua2y9mRet0r8PW+p9350qWOf7ahP9Wuifkb+mwEANlKElntzcCl1jJ/mXl/3Yu616+brXt9e9XSszk0r+n+P0PW2ri7vR1u5/yp137OtzuGxWdUDANg4EVp+kYNLqSMw/TD3Uv2ZGoy+H2HsXXm+if5fYzyU+0W9z7iqn+sYZ/rebuq+H2l1/H3vzHsWq3oAABsnQss9ObiUOkLOD3Kvne/s7Cz6Ota+KO/RRP8vNXB9bcVc6b+070XQen7eq9TRv7bv7aauv6Sr/xz1F/s15eXcfB8AgI00rHlJdLcnbHH+yxg3tTrWvrrNx/Hqrv+GcoxA9/J8j6L0YlzT97a2tp6a15b62LFjjys/51Xen1Z6cXxajDf365pV1/d1sSoYAgBsnAhSn66hqYwfj8sPF9zd9T42LN8/drrWp6ZpOr6zs/OUUsf1LyxP28L1df722PbiOP627VHuUz480OoYd8V9nlP6w3Lv/3ipszzdi3Ei5q6M8ftyXVwzDt1XgPT7Z7H0hpj7URzfWNaUvzGvGZaffr0n9wEAHjGOHDnypAhVb4owdHnrHT9+/Mn9mr0cPXp0vi50xd4vKyGtliUEvqafL0pwzL2mhsoX5H5T7lvun/sAACQlOE3T9Nzc348Iddfl3n6tC4oAAKxwPuFpPp9fEde9L/f3I4Le+3MPAIBdlA8UTNP0rNzfTYS1y3JvP+qnQ3+W+wAA7GEcx7fn3mEo38mWewAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwSPYvd9X5DWn6Y+oAAAAASUVORK5CYII=>