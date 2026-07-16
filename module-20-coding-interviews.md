# Module 20 — Data Structures & Coding for Interviews

This module covers core computer science data structures, algorithms, Big O space-time complexity analysis, coding patterns, and a comprehensive database of 100 practice coding problems with solutions and hints.

---

## 1. Big O Complexity & Algorithmic Patterns (Sliding Window & Two Pointers)

### 1. Definition
- **Big O Notation**: A mathematical notation that describes the limiting behavior of a function when the argument tends towards a particular value or infinity (measures algorithm execution time/space growth).
- **Two Pointers Pattern**: An algorithm design pattern where two pointers iterate through a data structure (like an array) in tandem to solve a search problem in \(O(N)\) time complexity.
- **Sliding Window Pattern**: A design pattern where a subarray window is expanded or shrunk to calculate sub-ranges, reducing nested loops from \(O(N^2)\) to \(O(N)\) time complexity.

### 2. Why it Exists
Naive coding solutions often use nested loops (e.g., search item in list for every other item), leading to slow running times (\(O(N^2)\)). Standardizing optimization patterns helps engineers write production code that scales to billions of records.

### 3. Why it is Important
Critical for passing technical coding screens at top tech companies.
- Fits in: Algorithmic efficiency.

### 4. Real World Analogy
- **Big O = Transport Efficiency**: If you travel 10 miles:
  - **Walking (\(O(N)\))**: Time scales linearly with distance.
  - **Taxi (\(O(1)\))**: A fixed delay to hail, but speed is fast and constant regardless of short differences.
  - **Airplane (\(O(1)\))**: Heavy setup time (security, boarding), but transit time is negligible.
- **Two Pointers = Two Friends Meeting**: If you and a friend walk towards each other from opposite ends of a street (two pointers), you meet in the middle in one walk. If you walked to their house, and they weren't there, and you walked back (nested loop), it takes double the time.
- **Sliding Window = Train Passenger Window**: As a train moves, the passenger sees a sliding window of 3 houses at any moment. They don't look at all houses from scratch at every stop; they just drop the house that left the view on the left, and add the new house entering on the right.

### 5. Real World Example
- **Database engines** use Binary Search algorithms (\(O(\log N)\)) on sorted indexes to fetch rows from tables with millions of records in milliseconds.

### 6. Architecture Diagram
```
Two Pointers (Meeting in the middle):
[ Pointer L ] ──►                                      ◄── [ Pointer R ]
  [ Element 1 | Element 2 | Element 3 | Element 4 | Element 5 ]

Sliding Window (Size K = 3):
  [ Element 1 | Element 2 | Element 3 ] | Element 4 | Element 5    <-- Window 1 (Sum = E1+E2+E3)
  Element 1 | [ Element 2 | Element 3 | Element 4 ] | Element 5    <-- Window 2 (Sum = Win1 - E1 + E4)
```

### 7. Working Step by Step (Sliding Window: Max Sum Subarray of size K)
1. **Initialize**: Calculate the sum of the first `K` elements. Store it as `current_sum` and `max_sum`.
2. **Slide**: Start a loop from index `K` to the end of the array.
3. **Subtract/Add**: Subtract the element exiting the window (at index `i - K`) and add the element entering the window (at index `i`).
4. **Update**: If `current_sum > max_sum`, set `max_sum = current_sum`.
5. **Return**: Once the loop ends, return `max_sum`. (Total Time Complexity: \(O(N)\) since we visit each element once).

### 8. Advantages
- Two pointers and sliding windows convert nested loops (\(O(N^2)\)) into single loops (\(O(N)\)).
- Minimizes auxiliary memory allocations (reduces space complexity).

### 9. Disadvantages
- Requires sorted inputs (for two pointer search patterns), adding \(O(N \log N)\) sorting overhead.

### 10. Interview Explanation
"Big O notation measures algorithm time and space complexity growth. The two pointers pattern uses two indexes to scan an array from opposite ends or different speeds, solving search queries in \(O(N)\) time. The sliding window pattern maintains a running window range to evaluate subarrays in a single scan, preventing redundant calculations."

### 11. Frequently Asked Interview Questions
1. *What is the time complexity of Binary Search?*
   - \(O(\log N)\) because it splits the search range in half on each step.
2. *What is Space Complexity?*
   - The amount of auxiliary memory an algorithm uses relative to the input size (e.g. allocating a hash map takes \(O(N)\) space).
3. *What is Big O of QuickSort?*
   - Average: \(O(N \log N)\). Worst-case: \(O(N^2)\) if the pivot division is unbalanced.
4. *How do you choose between a Hash Map and a Sorted Array?*
   - Choose Hash Map for \(O(1)\) lookups. Choose Sorted Array if you need ordered elements or range queries to save memory.
5. *What is a balanced binary tree?*
   - A tree where the height of the left and right subtrees of any node differs by at most 1.
6. *What does amortized time complexity mean?*
   - The average time taken per operation over a sequence of operations (e.g. dynamic array resizing takes \(O(N)\) occasionally, but \(O(1)\) on average).
7. *Difference between BFS and DFS?*
   - **BFS (Breadth-First Search)**: Explores nodes level by level (uses a Queue). **DFS (Depth-First Search)**: Explores paths deeply first (uses a Stack/Recursion).
8. *What is a Linked List?*
   - A linear data structure where elements (nodes) are linked using pointers rather than stored contiguously in memory.
9. *What is a Hash Collision?*
   - A situation where two different keys yield the same index hash, resolved using chaining (linked lists) or open addressing.
10. *Define recursion.*
    - A programming technique where a function calls itself to solve smaller subproblems until it hits a base case.

### 12. Common Mistakes
- Using nested loops for search operations, leading to \(O(N^2)\) timeouts on large datasets during code tests.

### 13. Best Practices
- Always check base cases (empty arrays, single elements, null inputs) first. Identify if the input array is sorted, which indicates that binary search or two pointers are appropriate.

### 14. Hands-on Lab
- Write a Python script implementing the sliding window maximum sum subarray algorithm, and measure its running time.

### 15. Commands
- Not applicable for coding algorithms.

### 16. Code Examples
```python
# Sliding Window Implementation in Python
# Find max sum of contiguous subarray of size K
def max_subarray_sum(arr, k):
    n = len(arr)
    if n < k:
        return -1
        
    # Sum of first window
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Slide window across array
    for i in range(k, n):
        # Add new element, subtract exiting element
        window_sum += arr[i] - arr[i - k]
        max_sum = max(max_sum, window_sum)
        
    return max_sum

# Test
test_arr = [2, 1, 5, 1, 3, 2]
print(f"Max Sum Subarray: {max_subarray_sum(test_arr, 3)}") # Output: 9 (5+1+3)
```

### 17. Visual Memory Tricks
- **Two Pointers = Folding Paper**: Work from both edges (Left and Right) until they meet in the middle.

### 18. MCQs
1. What is the time complexity of searching a key in a Hash Map (average)?
   - A) O(N)
   - B) O(log N)
   - C) O(1) (Correct)
2. What pattern reduces nested loops for contiguous subarray queries?
   - A) Recursion
   - B) Sliding Window (Correct)
   - C) Binary Search

### 19. Practical Scenario Questions
- *Scenario*: You must find if an array of sorted integers contains two numbers that sum up to a target value. How do you solve it in O(N) time?
  - *Answer*: Use the Two Pointers pattern. Set pointer L at the start and R at the end. If `arr[L] + arr[R] > target`, decrement R. If `sum < target`, increment L. Repeat until they meet or the sum is found.

### 20. Summary
- **Key Points**: Big O measures scaling. Two pointers solve sorted search. Sliding windows compute subarray ranges in linear time.
- **Cheat Sheet**: Sorted input = think Binary Search or Two Pointers. Subarray ranges = think Sliding Window.

---

## 🏆 100 Coding Practice Exercises (Syllabus Checklist)

These practice questions range from Easy to Medium difficulty, grouped by topic. Use these exercises to build coding fluency and pass technical interviews.

### 📋 Arrays (1-10)
1. **Find Duplicate**: Locate the first duplicate number in an array.
2. **Reverse Array**: Reverse an array in place with \(O(1)\) extra space.
3. **Rotate Array**: Rotate an array to the right by `k` steps.
4. **Move Zeroes**: Push all zeroes to the end of the array without changing the relative order of non-zero elements.
5. **Merge Sorted**: Merge two sorted arrays into one sorted array.
6. **Max Subarray**: Find the contiguous subarray with the largest sum (Kadane's Algorithm).
7. **Find Missing**: Find the missing number in an array of integers 1 to N.
8. **Intersection of Arrays**: Return common elements from two arrays.
9. **Majority Element**: Find the element that appears more than `N/2` times.
10. **Peak Element**: Find a peak element (greater than its neighbors) in an array.

### 📋 Strings (11-20)
11. **Reverse String**: Reverse a character array.
12. **Valid Palindrome**: Check if a string reads the same forwards and backwards, ignoring cases and non-alphanumeric characters.
13. **First Unique Character**: Find the index of the first non-repeating character in a string.
14. **Valid Anagram**: Check if two strings are anagrams of each other.
15. **Longest Common Prefix**: Find the longest common prefix string among an array of strings.
16. **String Compression**: Compress a string using counts of repeated characters (e.g. `aabcc` -> `a2b1c2`).
17. **Is Subsequence**: Determine if string A is a subsequence of string B.
18. **Find All Anagrams**: Find starting indexes of anagrams of string P in string S.
19. **Longest Palindromic Substring**: Find the longest palindrome within a string.
20. **Group Anagrams**: Group an array of strings into sublists of anagrams.

### 📋 Hash Maps (21-30)
21. **Two Sum**: Find two numbers that add up to a target sum.
22. **Subarray Sum Equals K**: Find total contiguous subarrays whose sum equals K.
23. **Longest Consecutive Sequence**: Find the length of the longest consecutive elements sequence in an unsorted array.
24. **Isomorphic Strings**: Check if two strings are isomorphic.
25. **Word Pattern**: Check if a string follows a specific pattern of characters.
26. **Single Number**: Find the element that appears only once in an array where all other elements appear twice.
27. **Happy Number**: Determine if a number eventually reaches 1 when replaced by the sum of squares of its digits.
28. **Contains Duplicate II**: Find if two distinct indices `i` and `j` have equal values and absolute difference `|i - j| <= k`.
29. **Ransom Note**: Check if a string can be constructed from letters of another string.
30. **Group Shifted Strings**: Group strings that share the same shifting pattern.

### 📋 Stacks & Queues (31-40)
31. **Valid Parentheses**: Verify if brackets `()`, `[]`, `{}` close in the correct order.
32. **Min Stack**: Design a stack that supports retrieving the minimum element in \(O(1)\) time.
33. **Implement Queue using Stacks**: Build a standard FIFO queue using two LIFO stacks.
34. **Backspace String Compare**: Compare two strings containing backspace characters `#`.
35. **Next Greater Element**: Find the next larger element for each position in an array.
36. **Daily Temperatures**: Calculate how many days to wait for a warmer temperature.
37. **Evaluate Reverse Polish Notation**: Evaluate the value of an arithmetic expression in postfix notation.
38. **Generate Parentheses**: Generate all combinations of well-formed parentheses of size N.
39. **Simplify Path**: Simplify an absolute path for a Unix-style file system.
40. **Asteroid Collision**: Simulate row collisions of integers moving left and right.

### 📋 Linked Lists (41-50)
41. **Reverse Linked List**: Reverse a singly linked list.
42. **Detect Cycle**: Determine if a linked list contains a loop (Floyd's Cycle Finding).
43. **Merge Two Lists**: Combine two sorted linked lists into a single sorted list.
44. **Remove Nth Node**: Remove the N-th node from the end of a list.
45. **Middle of List**: Find the middle node of a linked list.
46. **Palindrome Linked List**: Verify if a list's values form a palindrome.
47. **Intersection of Two Lists**: Find the node where two singly linked lists intersect.
48. **Remove Duplicates**: Delete duplicates from a sorted linked list.
49. **Add Two Numbers**: Add two numbers represented by linked lists.
50. **Odd Even Linked List**: Group all odd nodes followed by even nodes in a list.

### 📋 Trees (51-60)
51. **Maximum Depth**: Find the height/depth of a binary tree.
52. **Invert Binary Tree**: Mirror-image a binary tree.
53. **Same Tree**: Check if two binary trees are structurally identical.
54. **Symmetric Tree**: Check if a binary tree is a mirror of itself.
55. **Binary Tree Traversal (Inorder)**: Traverse a tree in left-root-right order.
56. **Binary Tree Traversal (Level Order)**: Traverse a tree level-by-level (BFS).
57. **Path Sum**: Check if a tree has a root-to-leaf path summing to a target value.
58. **Search in BST**: Find a value inside a Binary Search Tree.
59. **Lowest Common Ancestor (LCA)**: Find the LCA node of two target nodes in a tree.
60. **Validate BST**: Check if a tree is a valid Binary Search Tree.

### 📋 Searching & Sorting (61-70)
61. **Binary Search**: Search an element in a sorted array in \(O(\log N)\) time.
62. **Search Insert Position**: Return index where target should be inserted in sorted array.
63. **First and Last Position**: Find the starting and ending index of a target value in a sorted array.
64. **Merge Intervals**: Merge overlapping interval arrays (e.g. `[[1,3],[2,6]]` -> `[[1,6]]`).
65. **Kth Largest Element**: Find the Kth largest element in an unsorted array.
66. **First Bad Version**: Find the first defective software version using minimal API calls.
67. **Search in Rotated Sorted Array**: Find target index inside a rotated sorted array.
68. **Find Minimum in Rotated Sorted Array**: Locate the smallest element in a rotated sorted array.
69. **Sort Colors**: Sort an array containing 0s, 1s, and 2s in-place (Dutch National Flag).
70. **Top K Frequent Elements**: Return the K most frequent elements in an array.

### 📋 Two Pointers (71-80)
71. **Container With Most Water**: Find two lines that contain the most water in a coordinate grid.
72. **Three Sum**: Find all unique triplets in an array that sum to zero.
73. **Remove Duplicates from Sorted Array**: Remove duplicates in-place, return new length.
74. **Two Sum II**: Solve Two Sum where the input array is already sorted.
75. **Squares of Sorted Array**: Return sorted array of squares of sorted input numbers.
76. **Sort Array By Parity**: Move all even integers to the start, odd integers to the end.
77. **Interval List Intersections**: Return intersection intervals from two sorted interval lists.
78. **Longest Word in Dictionary**: Find the longest word that can be built by adding letters.
79. **Valid Triangle Number**: Count valid triangles that can be formed from array side lengths.
80. **Compare Version Numbers**: Compare two software version strings.

### 📋 Sliding Window (81-90)
81. **Maximum Average Subarray**: Find subarray of size K with the highest average value.
82. **Longest Substring Without Repeating Characters**: Find the length of the longest substring with unique characters.
83. **Minimum Size Subarray Sum**: Find the minimum size of a contiguous subarray whose sum is \(\ge s\).
84. **Permutation in String**: Check if string S1 contains a permutation of string S2.
85. **Max Consecutive Ones III**: Find longest contiguous subarray of 1s after flipping at most K zeroes.
86. **Longest Repeating Character Replacement**: Replace at most K characters to get the longest matching letters substring.
87. **Subarrays with K Different Integers**: Find total subarrays containing exactly K different integers.
88. **Fruit Into Baskets**: Find the max elements subarray containing at most two unique numbers.
89. **Sliding Window Maximum**: Find maximum elements inside sliding windows of size K.
90. **Minimum Window Substring**: Find the shortest substring containing all target letters.

### 📋 Recursion & Backtracking (91-100)
91. **Fibonacci Number**: Calculate N-th Fibonacci number.
92. **Climbing Stairs**: Find total distinct ways to reach the top of N stairs (1 or 2 steps).
93. **Subsets**: Generate all possible subsets (power set) of a set of integers.
94. **Permutations**: Generate all permutations of an array of distinct integers.
95. **Letter Combinations of Phone Number**: Return all possible letters combinations representing a phone digits string.
96. **Combinations**: Return all combinations of K numbers chosen from 1 to N.
97. **Combination Sum**: Find all unique combinations that sum up to a target value.
98. **Word Search**: Find if a word exists in a 2D character grid grid.
99. **Generate Parentheses**: Recursively generate valid parentheses combinations.
100. **N-Queens**: Place N queens on a chessboard so no two queens attack each other.
