import os

# Directories to always skip regardless of extension filters
SKIP_DIRS = {'.git', '.github', 'node_modules', '__pycache__', '.venv', 'venv', '.idea', '.vscode'}

CODE_EXTENSIONS = {
    '.py', '.js', '.ts', '.html', '.css', '.json', '.md',
    '.sh', '.yml', '.yaml', '.txt', '.csv'
}


def list_code_files_and_folders(root_dir, output_file="repo_structure.txt", extensions=None):
    """
    Recursively lists files and folders in a repository, focusing on
    code files matching `extensions` (defaults to CODE_EXTENSIONS).
    Skips common junk/vendor directories. Writes a sorted, indented
    tree structure to `output_file`.
    """
    extensions = extensions or CODE_EXTENSIONS
    root_dir = os.path.abspath(root_dir)
    lines = []

    for root, dirs, files in os.walk(root_dir):
        # Prune skip dirs in-place so os.walk doesn't descend into them
        dirs[:] = sorted(d for d in dirs if d not in SKIP_DIRS and not d.startswith('.'))
        files = sorted(f for f in files if any(f.endswith(ext) for ext in extensions))

        level = root.replace(root_dir, '').count(os.sep)
        indent = '  ' * level
        lines.append(f"{indent}{os.path.basename(root) or root_dir}/")

        for file in files:
            lines.append(f"{indent}  {file}")

    with open(output_file, 'w') as f:
        f.write('\n'.join(lines) + '\n')

    print(f"Repository structure saved to {output_file} ({len(lines)} lines)")


if __name__ == "__main__":
    # Example usage:
    # list_code_files_and_folders("/path/to/your/repo")
    pass
