---
name: prompt-evaluation
description: Build or review a prompt-product eval dataset, rubric, thresholds, model matrix, regression policy, and release evidence. Use before selling or updating a prompt product.
---

1. Define the exact task outcome and observable quality dimensions.
2. Create representative, edge, adversarial, incomplete-input, formatting, privacy, and misuse cases.
3. Record model/provider/version, parameters, tools, and environment.
4. Define scoring rubric, critical failures, pass threshold, and regression threshold.
5. Separate prompt regression from model variability.
6. Include examples where the model should ask for clarification or refuse unsafe behavior.
7. Prevent customer secrets, PII, or full paid prompt content from entering public eval artifacts.
8. Produce a result table, failure analysis, and release recommendation.
