import ast
import traceback
import sys
import io
import signal

# 🔒 Allowed built-ins only
SAFE_BUILTINS = {
    "print": print,
    "len": len,
    "range": range,
    "sum": sum,
    "min": min,
    "max": max,
}

# 🔒 Block dangerous modules
FORBIDDEN_IMPORTS = {
    "os", "sys", "subprocess", "socket",
    "shutil", "pathlib", "requests"
}


class TimeoutException(Exception):
    pass


def timeout_handler(signum, frame):
    raise TimeoutException("Execution timed out")


def validate_code(code: str):
    """
    Ensure no dangerous syntax is used
    """
    tree = ast.parse(code)

    for node in ast.walk(tree):

        # ❌ block imports
        if isinstance(node, (ast.Import, ast.ImportFrom)):
            for alias in node.names:
                if alias.name.split('.')[0] in FORBIDDEN_IMPORTS:
                    raise Exception(f"Forbidden import: {alias.name}")

        # ❌ block exec/eval
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id in ["exec", "eval", "__import__"]:
                    raise Exception("Unsafe function detected")

    return True


def execute_code(code: str):
    """
    Safely execute Python code
    """

    try:
        validate_code(code)

        # ⏱ Timeout (2 seconds)
        signal.signal(signal.SIGALRM, timeout_handler)
        signal.alarm(2)

        # 🔹 Capture output
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()

        # 🔒 Restricted globals
        safe_globals = {
            "__builtins__": SAFE_BUILTINS
        }

        exec(code, safe_globals, {})

        output = sys.stdout.getvalue()

        # reset
        sys.stdout = old_stdout
        signal.alarm(0)

        return output or "Execution completed."

    except TimeoutException as e:
        return str(e)

    except Exception:
        return traceback.format_exc()