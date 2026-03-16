---
title: Float vs Decimal data type
description: Float versus Decimal data type differences covering IEEE 754 floating-point precision issues and when to use Decimal for exact monetary calculations.
keywords:
  - float vs decimal
  - floating point precision
  - ieee 754
  - decimal data type
  - python decimal
  - numeric precision
  - monetary calculations
---

When working with DynamoDB, converting floating-point numbers (`float`) to `Decimal` can inadvertently cause issues due to DynamoDB's strict **number precision limit**. This blog post explains why the problem occurs and how to handle it effectively.

---

## **Understanding the Problem**

### **1. DynamoDB Number Precision Limits**
- DynamoDB supports numbers with up to **38 significant digits**.
- Numbers exceeding this precision limit will cause an exception when stored.

### **2. Floating-Point Precision**
- A `float` in Python uses **binary floating-point representation** (IEEE 754), which approximates numbers in base-2.
- This approximation can result in hidden extra precision when converting a `float` to a `Decimal`. For example:
  ```python
  float_num = 51.536743099999995
  Decimal(float_num)
  # Outputs: Decimal('51.53674309999999493452178771101284027194976806640625')
  ```
- The conversion retains the full binary precision, creating numbers with more than 38 significant digits.

### **3. Why This Causes Issues in DynamoDB**
When these over-precise numbers are stored as `Decimal`, they exceed DynamoDB's 38-digit limit, leading to errors:
- Example problematic number:
  ```
  Decimal('51.53674309999999493452178771101284027194976806640625')
  ```
- This number has **53 significant digits**, which DynamoDB rejects.

---

## **How to Handle This Issue**

### **Solution 1: Round or Truncate the Decimal**
- Before storing the number, round or truncate it to fit within the 38-digit precision limit.
- Example:
  ```python
  from decimal import Decimal, ROUND_HALF_UP

  float_num = 51.536743099999995
  rounded_num = Decimal(str(float_num)).quantize(Decimal('1.000000'), rounding=ROUND_HALF_UP)
  print(rounded_num)  # Outputs: 51.536743
  ```

### **Solution 2: Store as a String**
- If precision isn’t critical or the number exceeds DynamoDB’s numeric limits, store it as a **string**.
- Example:
  ```python
  float_num = 51.536743099999995
  str_num = str(float_num)
  print(str_num)  # Outputs: '51.536743099999995'
  ```
- You can convert the string back to a number in your application logic as needed.

---

## **Practical Example**
Here’s a Python function to safely prepare numbers for DynamoDB:

```python
from decimal import Decimal, ROUND_HALF_UP

def prepare_number_for_dynamodb(num):
    """
    Converts a float to a Decimal rounded to a safe precision for DynamoDB.
    """
    return Decimal(str(num)).quantize(Decimal('1.000000'), rounding=ROUND_HALF_UP)

# Example usage
num = 51.536743099999995
safe_number = prepare_number_for_dynamodb(num)
print(safe_number)  # Outputs: 51.536743
```

---

## **Key Takeaways**
- **DynamoDB number type** supports a maximum of 38 significant digits.
- Converting `float` to `Decimal` can exceed this limit due to hidden precision in floating-point numbers.
- **Solutions**:
  1. Round or truncate the number to fit within 38 digits.
  2. Store the number as a string if precision isn’t critical.

By following these practices, you can avoid precision-related errors and ensure smooth integration with DynamoDB.

