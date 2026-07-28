#!/bin/bash

# Ensure you are in the correct directory
cd /path/to/your/local/repository || exit

# Fetch the latest changes
git fetch origin

# Checkout main and pull the latest changes
git checkout main
git pull origin main

# Checkout your branch
read -p "Enter your branch name: " branch_name
git checkout "$branch_name"

# Rebase onto main
git rebase origin/main

# Push the updated branch
git push origin "$branch_name" --force-with-lease

echo "Branch $branch_name has been updated and pushed successfully."