# Module 9 — Git & Version Control

This module covers Git version control operations, commands, branching strategies, merge conflict resolution, and GitHub collaboration.

---

## 1. Core Git Commands & Branching Strategies (Merge vs Rebase)

### 1. Definition
- **Git**: A distributed version control system that tracks changes in source code files.
- **Git Merge**: Combines different commit histories by creating a new merge commit, preserving historical commit sequences.
- **Git Rebase**: Moves the entire branch commit sequence onto the tip of another branch, rewriting commit history to create a linear path.

### 2. Why it Exists
When multiple developers work on the same codebase simultaneously, they risk overwriting each other's changes. Git allows tracking line-by-line modifications, branching work, and merging edits safely.

### 3. Why it is Important
Essential for developer collaboration and team operations.
- Fits in: Source code governance.

### 4. Real World Analogy
- **Git Branching = Parallel Universes**: You duplicate a manuscript (branch) to write an alternative ending. The main story (main branch) remains unchanged. If your new ending is good, you merge it back into the main book.
- **Merge vs Rebase**:
  - **Merge = Group Project Report**: Everyone does their work, and you tape the papers together. It shows exactly who did what and when, with clear tape lines (merge commit).
  - **Rebase = Rewriting history**: You slide your pages smoothly into the middle of the report as if you wrote them sequentially from the start. It looks cleaner, but hides the exact timeline of parallel work.

### 5. Real World Example
- A engineering team uses **Trunk-Based Development**, where developers make short-lived branches from the main branch, run automated tests, and merge back daily to prevent large integration conflicts.

### 6. Architecture Diagram
```
Git Merge:
A ─── B ─── C ─── F (main)
      \         /
       D ─── E (feature)  <-- F is a new merge commit

Git Rebase:
A ─── B ─── C ─── D' ─── E' (feature is reapplied on top of C)
```

### 7. Working Step by Step (GitHub Flow)
1. **Initialize**: Run `git init` locally or `git clone` from GitHub.
2. **Branch**: Create a feature branch: `git checkout -b feature/login`.
3. **Stage & Commit**: Edit code, stage changes: `git add .`, commit to history: `git commit -m "feat: add login screen"`.
4. **Push**: Upload branch: `git push origin feature/login`.
5. **Pull Request**: Open a Pull Request (PR) on GitHub. Reviewers approve, CI pipeline passes.
6. **Merge**: Merge PR into `main` branch.
7. **Sync**: Other devs pull down changes: `git pull origin main`.

### 8. Advantages
- Distributed architecture (every dev has a full copy of the codebase history).
- Easy branching and experimentation.
- Safe rollback to any historical commit point.

### 9. Disadvantages
- Merge conflicts can be difficult for beginners to resolve.
- Git Rebase rewrites history; if misused on public shared branches, it can desynchronize teammates' local repositories.

### 10. Interview Explanation
"Git is a distributed version control tool. Git Merge combines branches by making a new merge commit, keeping the exact chronological history. Git Rebase moves your branch commits onto the head of the target branch, rewriting history for a clean, linear log. In teams, we use branching strategies like GitFlow for release management, or Trunk-Based Development for rapid integration."

### 11. Frequently Asked Interview Questions
1. *What is a merge conflict, and how do you resolve it?*
   - A conflict occurs when two branches modify the same line of a file. Git pauses the merge and inserts markers (`<<<<<<<`, `=======`, `>>>>>>>`). The developer must edit the file to select the correct code and commit it.
2. *Difference between `git pull` and `git fetch`?*
   - `git fetch` downloads metadata and commits from the remote repository but doesn't modify local working code. `git pull` is `git fetch` followed immediately by `git merge`.
3. *What is `git stash` used for?*
   - To temporarily save uncommitted changes (dirty working directory state) to switch branches without committing unfinished code, and restore it later.
4. *What does `git reset --hard` do?*
   - Reverts the working directory and staging index to the specified commit, discarding all uncommitted local modifications.
5. *Difference between `git reset` and `git revert`?*
   - `git reset` moves the branch pointer backward, rewriting history. `git revert` creates a new commit that applies the inverse changes, safely preserving history.
6. *What is a Pull Request (PR)?*
   - A feature in GitHub that lets you notify teammates about changes you've pushed, allowing them to review, comment, and merge the code.
7. *What is GitFlow?*
   - A branching model that uses long-lived branches like `master`, `develop`, `feature`, `release`, and `hotfix` branches to manage enterprise releases.
8. *What is Trunk-Based Development?*
   - A branching strategy where developers merge small, frequent commits into a single branch (usually `main`), avoiding long-lived feature branches.
9. *What does the `.gitignore` file do?*
   - Tells Git to ignore files (e.g. system files, dependencies, build folders) and not track them.
10. *Define commit hash.*
    - A unique SHA-1 identifier assigned to each commit representing the exact state of code changes and metadata.

### 12. Common Mistakes
- Committing large binary files (like database backups or media video files) directly into Git, causing repository sizes to swell.

### 13. Best Practices
- Keep commits small, focused, and write clear, descriptive commit messages (e.g., following Conventional Commits standard like `feat: add payment API`). Never rebase public branches.

### 14. Hands-on Lab
- Initialize a local git repository, commit a file, create a branch, simulate a merge conflict, and resolve it manually.

### 15. Commands
- `git init` (Initialize local repo)
- `git status` (Show working directory changes)
- `git add <file>` (Stage file changes)
- `git commit -m "message"` (Record commit snapshot)
- `git branch` (List and manage branches)
- `git merge <branch>` (Merge target branch into active branch)
- `git checkout -b <branch-name>` (Create and switch to new branch)
- `git stash` (Save dirty state)
- `git log --oneline` (View simplified commit history log)

### 16. Code Examples
```bash
# Workflow to create branch, commit, stash, and merge
git checkout -b feature/auth
echo "const token = '123';" >> auth.js
git add auth.js
git commit -m "feat: add token login authentication"
# Need to swap to main to fix bug, but have uncommitted code changes
echo "temp code" >> auth.js
git stash
git checkout main
# Fix bug... then return
git checkout feature/auth
git stash pop
```

### 17. Visual Memory Tricks
- **Rebase = Re-Base**: Change the base point where your branch started from, to the latest commit.

### 18. MCQs
1. Which command fetches updates from remote but does not merge them?
   - A) git pull
   - B) git fetch (Correct)
   - C) git push
2. How do you safely undo a commit that has already been pushed to public repository?
   - A) git reset --hard
   - B) git revert (Correct)
   - C) git rm

### 19. Practical Scenario Questions
- *Scenario*: A developer runs `git reset --hard HEAD~1` by mistake, deleting their local code work. If they committed the work, how can they recover it?
  - *Answer*: Run `git reflog` to view the history of all branch changes and pointer moves, find the commit hash before the reset, and run `git reset --hard <hash>` to recover it.

### 20. Summary
- **Key Points**: Git tracks history. Merge creates a combined commit. Rebase linearizes history.
- **Cheat Sheet**: `stash` = temp save. `checkout -b` = new branch. `log --oneline` = check history.
