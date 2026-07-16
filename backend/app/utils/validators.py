import re


EMAIL_PATTERN = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")


def is_valid_email(email: str) -> bool:
    return bool(EMAIL_PATTERN.match(email))


def is_positive(value: int | float) -> bool:
    return value > 0
